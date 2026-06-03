"use client";

import { useMemo } from "react";
import * as Y from "yjs";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "transactions", label: "Transactions" },
  { id: "metrics", label: "Sync metrics" },
  { id: "state", label: "State vector" },
  { id: "awareness", label: "Awareness" },
];

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function formatBytesHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

/**
 * @param {unknown} origin
 * @returns {string}
 */
function formatOrigin(origin) {
  if (origin === null || origin === undefined) {
    return "local";
  }
  if (typeof origin === "string") {
    return origin;
  }
  if (typeof origin === "object" && origin !== null && "constructor" in origin) {
    const name = /** @type {{ constructor?: { name?: string } }} */ (origin)
      .constructor?.name;
    if (name) {
      return name;
    }
  }
  return "remote";
}

/**
 * @param {{
 *   activeTab: string,
 *   onTabChange: (id: string) => void,
 *   transactions: Array<{ id: string, time: string, origin: string, bytes: number, pane: string }>,
 *   metrics: {
 *     status: string,
 *     updateCount: number,
 *     bytesIn: number,
 *     bytesOut: number,
 *     docSize: number,
 *     clientCount: number,
 *   },
 *   ydoc: import('yjs').Doc | null,
 *   stateTick: number,
 *   awarenessStates: Array<{ clientId: number, name: string, color: string, pane?: string }>,
 * }} props
 */
export function YjsVisualizer({
  activeTab,
  onTabChange,
  transactions,
  metrics,
  ydoc,
  stateTick,
  awarenessStates,
}) {
  const stateVectorHex = useMemo(() => {
    if (!ydoc) {
      return "—";
    }
    void stateTick;
    return formatBytesHex(Y.encodeStateVector(ydoc));
  }, [ydoc, stateTick]);

  const docSizeLabel = useMemo(() => {
    if (!ydoc) {
      return "—";
    }
    void stateTick;
    return `${Y.encodeStateAsUpdate(ydoc).byteLength} B (live)`;
  }, [ydoc, stateTick]);

  return (
    <div className="flex h-[280px] flex-col overflow-hidden rounded-xl border border-card-border bg-background/30">
      <div
        className="flex flex-wrap gap-1 border-b border-card-border p-2"
        role="tablist"
        aria-label="Yjs visualizer panels"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "bg-accent-subtle text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 text-xs">
        {activeTab === "transactions" && (
          <div role="tabpanel" className="min-h-0">
            {transactions.length === 0 ? (
              <p className="text-muted">
                Edit either pane to see Yjs update transactions stream here in
                real time.
              </p>
            ) : (
              <ul className="space-y-2 font-mono">
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="rounded-lg border border-card-border bg-background/50 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-muted">{tx.time}</span>
                      <span className="rounded bg-accent-subtle px-1.5 py-0.5 text-foreground">
                        {tx.pane}
                      </span>
                      <span className="text-foreground">{tx.origin}</span>
                      <span className="text-muted">{tx.bytes} B</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "metrics" && (
          <div role="tabpanel" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Connection" value={metrics.status} />
            <MetricCard label="Updates observed" value={String(metrics.updateCount)} />
            <MetricCard label="Connected clients" value={String(metrics.clientCount)} />
            <MetricCard label="Bytes received" value={String(metrics.bytesIn)} />
            <MetricCard label="Bytes sent" value={String(metrics.bytesOut)} />
            <MetricCard label="Document size (live)" value={docSizeLabel} />
            <MetricCard
              label="State vector bytes"
              value={
                stateVectorHex === "—"
                  ? "—"
                  : `${stateVectorHex.split(" ").length} B`
              }
            />
          </div>
        )}

        {activeTab === "state" && (
          <div role="tabpanel" className="space-y-3">
            <p className="text-muted leading-relaxed">
              The state vector encodes which operations each replica has seen.
              Yjs uses it to compute minimal diffs during sync — only missing
              updates are exchanged.
            </p>
            <div>
              <p className="mb-1.5 font-medium text-foreground">Encoded vector</p>
              <pre className="overflow-x-auto rounded-lg border border-card-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-foreground">
                {stateVectorHex}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "awareness" && (
          <div role="tabpanel">
            {awarenessStates.length === 0 ? (
              <p className="text-muted">
                No remote awareness states yet. Open this page in another tab or
                window to see live cursors and presence.
              </p>
            ) : (
              <ul className="space-y-2">
                {awarenessStates.map((state) => (
                  <li
                    key={state.clientId}
                    className="flex items-center gap-3 rounded-lg border border-card-border bg-background/50 px-3 py-2"
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: state.color }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{state.name}</p>
                      <p className="text-muted">
                        Client {state.clientId}
                        {state.pane ? ` · ${state.pane}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg border border-card-border bg-background/50 px-3 py-2.5">
      <p className="text-muted">{label}</p>
      <p className="mt-0.5 font-display text-lg font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

export { formatOrigin };
