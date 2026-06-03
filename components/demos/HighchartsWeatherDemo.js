"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "next-themes";
import {
  fetchHourlyWeather,
  formatCoordinates,
  getBrowserCoordinates,
  latestValue,
  sliceLastHours,
  toChartTimestamps,
} from "@/lib/openMeteo";
import MaterialIcon from "@/components/MaterialIcon";
import { cn } from "@/lib/utils";

const RANGE_OPTIONS = [
  { id: "24h", label: "24h", hours: 24 },
  { id: "48h", label: "48h", hours: 48 },
  { id: "7d", label: "7 days", hours: 168 },
];

function readThemeColors(isDark) {
  const tooltipText = isDark ? "#f5f5f5" : "#171717";
  const tooltipMuted = isDark ? "#d4d4d4" : "#525252";
  const tooltipBg = isDark ? "#262626" : "#ffffff";
  const tooltipBorder = isDark ? "#404040" : "#e5e5e5";

  if (typeof window === "undefined") {
    return {
      text: tooltipText,
      muted: isDark ? "#a3a3a3" : "#737373",
      grid: isDark ? "rgba(245,245,245,0.08)" : "rgba(23,23,23,0.08)",
      temp: isDark ? "#e5e5e5" : "#404040",
      humidity: isDark ? "#a3a3a3" : "#737373",
      band: isDark ? "rgba(163,163,163,0.12)" : "rgba(115,115,115,0.15)",
      tooltipText,
      tooltipMuted,
      tooltipBg,
      tooltipBorder,
    };
  }

  const style = getComputedStyle(document.documentElement);
  const pick = (name, fallback) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    text: pick("--foreground", tooltipText),
    muted: pick("--muted", isDark ? "#a3a3a3" : "#737373"),
    grid: isDark ? "rgba(245,245,245,0.08)" : "rgba(23,23,23,0.08)",
    temp: pick("--accent-to", isDark ? "#e5e5e5" : "#404040"),
    humidity: pick("--muted", isDark ? "#a3a3a3" : "#737373"),
    band: isDark ? "rgba(163,163,163,0.12)" : "rgba(115,115,115,0.15)",
    tooltipText,
    tooltipMuted,
    tooltipBg,
    tooltipBorder,
  };
}

/**
 * @param {import("@/lib/openMeteo").HourlyWeatherSeries} series
 * @param {number} hours
 * @param {ReturnType<typeof readThemeColors>} colors
 */
function buildChartOptions(series, hours, colors) {
  const sliced = sliceLastHours(series, hours);
  const times = toChartTimestamps(sliced.time);
  const tempData = times.map((t, i) => [t, sliced.temperature[i]]);
  const humidityData = times.map((t, i) => [t, sliced.humidity[i]]);

  return {
    chart: {
      height: 380,
      backgroundColor: "transparent",
      zooming: { type: "x" },
      style: { fontFamily: "var(--font-dm-sans), system-ui, sans-serif" },
    },
    credits: { enabled: false },
    title: { text: undefined },
    time: { useUTC: false },
    xAxis: {
      type: "datetime",
      lineColor: colors.grid,
      tickColor: colors.grid,
      labels: { style: { color: colors.muted } },
      crosshair: true,
    },
    yAxis: [
      {
        title: { text: "Temperature (°C)", style: { color: colors.muted } },
        labels: { style: { color: colors.muted } },
        gridLineColor: colors.grid,
        plotBands: [
          {
            from: 18,
            to: 24,
            color: colors.band,
            label: {
              text: "Comfort band",
              style: { color: colors.muted, fontSize: "10px" },
            },
          },
        ],
      },
      {
        title: { text: "Humidity (%)", style: { color: colors.muted } },
        labels: { style: { color: colors.muted } },
        gridLineColor: colors.grid,
        opposite: true,
        max: 100,
        min: 0,
      },
    ],
    legend: {
      itemStyle: { color: colors.text },
      itemHoverStyle: { color: colors.text },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      shadow: false,
      style: { color: colors.tooltipText },
      formatter() {
        const header = Highcharts.dateFormat("%a %b %e, %H:%M", this.x);
        let html = `<div style="color:${colors.tooltipText};font-size:12px;font-weight:600;margin-bottom:6px">${header}</div>`;

        this.points?.forEach((point) => {
          const suffix =
            point.series.name === "Temperature" ? " °C" : " %";
          const value = Highcharts.numberFormat(point.y, 1);
          html += `<div style="color:${colors.tooltipText};font-size:13px;line-height:1.5;margin-top:4px">` +
            `<span style="color:${point.color}">●</span> ` +
            `${point.series.name}: <span style="color:${colors.tooltipText};font-weight:700">${value}${suffix}</span>` +
            `</div>`;
        });

        return html;
      },
    },
    plotOptions: {
      series: {
        animation: { duration: 600 },
        marker: { enabled: false },
      },
    },
    series: [
      {
        name: "Temperature",
        type: "areaspline",
        data: tempData,
        yAxis: 0,
        color: colors.temp,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${colors.temp}55`],
            [1, `${colors.temp}00`],
          ],
        },
        tooltip: { valueSuffix: " °C" },
      },
      {
        name: "Humidity",
        type: "spline",
        data: humidityData,
        yAxis: 1,
        color: colors.humidity,
        dashStyle: "ShortDot",
        tooltip: { valueSuffix: " %" },
      },
    ],
  };
}

export default function HighchartsWeatherDemo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [rangeId, setRangeId] = useState("48h");
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [locationLabel, setLocationLabel] = useState(null);

  const isDark = (resolvedTheme ?? "light") === "dark";
  const hours =
    RANGE_OPTIONS.find((r) => r.id === rangeId)?.hours ?? 48;

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSeries(null);
    setLocationLabel(null);
    try {
      const coords = await getBrowserCoordinates();
      const data = await fetchHourlyWeather(coords.latitude, coords.longitude);
      setSeries(data);
      setLocationLabel(formatCoordinates(coords));
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load weather data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const colors = useMemo(() => readThemeColors(isDark), [isDark]);

  const chartOptions = useMemo(() => {
    if (!series) return null;
    return buildChartOptions(series, hours, colors);
  }, [series, hours, colors]);

  const stats = useMemo(() => {
    if (!series) return null;
    const sliced = sliceLastHours(series, hours);
    const times = toChartTimestamps(sliced.time);
    const tempData = times.map((t, i) => [t, sliced.temperature[i]]);
    const humidityData = times.map((t, i) => [t, sliced.humidity[i]]);
    const temp = latestValue(tempData);
    const humidity = latestValue(humidityData);
    return { temp, humidity };
  }, [series, hours]);

  return (
    <article className="glass flex flex-col rounded-2xl p-6 md:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-foreground">
              Highcharts.js
            </span>
            <span className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">
              Open-Meteo API
            </span>
            {locationLabel && (
              <span className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">
                {locationLabel}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-display text-xl font-bold text-foreground md:text-2xl">
            Facility weather monitoring
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Live hourly temperature and humidity for your location—patterns
            similar to energy and ops dashboards (e.g. Open Kitchen). Allow
            location access when prompted, then pan/zoom the chart or switch the
            time window.
          </p>
        </div>
        {stats && (
          <dl className="flex shrink-0 gap-4 text-right text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Now (°C)
              </dt>
              <dd className="font-display text-2xl font-bold text-foreground">
                {stats.temp !== null ? stats.temp.toFixed(1) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Humidity
              </dt>
              <dd className="font-display text-2xl font-bold text-foreground">
                {stats.humidity !== null
                  ? `${Math.round(stats.humidity)}%`
                  : "—"}
              </dd>
            </div>
          </dl>
        )}
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div
          className="inline-flex rounded-full border border-card-border bg-background/60 p-1"
          role="group"
          aria-label="Time range"
        >
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRangeId(opt.id)}
              disabled={!series || loading}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                rangeId === opt.id
                  ? "bg-accent-subtle text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted disabled:opacity-50"
        >
          <MaterialIcon
            name="refresh"
            size={16}
            className={loading ? "animate-spin" : undefined}
          />
          Refresh data
        </button>
        {lastUpdated && (
          <span className="text-xs text-muted">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="relative mt-4 min-h-[380px]">
        {loading && !series && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-dashed border-card-border bg-background/40">
            <span className="text-sm text-muted">
              Requesting location and loading forecast…
            </span>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-card-border bg-background/40 px-6 text-center">
            <MaterialIcon name="location_off" size={32} className="text-muted" />
            <p className="max-w-md text-sm text-foreground">{error}</p>
            <button
              type="button"
              onClick={loadData}
              className="text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              Try again
            </button>
          </div>
        )}
        {mounted && chartOptions && !error && !loading && (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        )}
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-card-border pt-4 text-xs text-muted">
        <span>
          Data from{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Open-Meteo
          </a>{" "}
          (no API key). Location is read in your browser only to fetch the
          forecast; coordinates are not stored. Highcharts used under their
          free non-commercial license.
        </span>
      </footer>
    </article>
  );
}
