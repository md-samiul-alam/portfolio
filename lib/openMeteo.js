/**
 * @typedef {{ latitude: number, longitude: number }} Coordinates
 * @typedef {{ time: string[], temperature: number[], humidity: number[] }} HourlyWeatherSeries
 */

/**
 * @returns {Promise<Coordinates>}
 */
export function getBrowserCoordinates() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(
            new Error(
              "Location access was denied. Allow location for this site to load weather near you.",
            ),
          );
          return;
        }
        if (err.code === err.POSITION_UNAVAILABLE) {
          reject(new Error("Your location could not be determined."));
          return;
        }
        if (err.code === err.TIMEOUT) {
          reject(new Error("Location request timed out. Please try again."));
          return;
        }
        reject(new Error("Unable to read your location."));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
}

/**
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<HourlyWeatherSeries>}
 */
export async function fetchHourlyWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "temperature_2m,relative_humidity_2m",
    past_days: "7",
    forecast_days: "1",
    timezone: "auto",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const data = await response.json();
  const hourly = data?.hourly;

  if (
    !hourly?.time?.length ||
    !hourly?.temperature_2m?.length ||
    !hourly?.relative_humidity_2m?.length
  ) {
    throw new Error("Unexpected weather API response shape");
  }

  return {
    time: hourly.time,
    temperature: hourly.temperature_2m,
    humidity: hourly.relative_humidity_2m,
  };
}

/**
 * @param {Coordinates} coords
 * @returns {string}
 */
export function formatCoordinates(coords) {
  const latDir = coords.latitude >= 0 ? "N" : "S";
  const lonDir = coords.longitude >= 0 ? "E" : "W";
  return `${Math.abs(coords.latitude).toFixed(2)}° ${latDir}, ${Math.abs(coords.longitude).toFixed(2)}° ${lonDir}`;
}

/**
 * @param {HourlyWeatherSeries} series
 * @param {number} hours
 */
export function sliceLastHours(series, hours) {
  const count = Math.min(hours, series.time.length);
  const start = series.time.length - count;

  return {
    time: series.time.slice(start),
    temperature: series.temperature.slice(start),
    humidity: series.humidity.slice(start),
  };
}

/**
 * @param {string[]} isoTimes
 * @returns {number[]}
 */
export function toChartTimestamps(isoTimes) {
  return isoTimes.map((t) => Date.parse(t));
}

/**
 * @param {number[][]} pairs [timestamp, value]
 * @returns {number | null}
 */
export function latestValue(pairs) {
  if (pairs.length === 0) return null;
  const last = pairs[pairs.length - 1];
  return last[1] ?? null;
}
