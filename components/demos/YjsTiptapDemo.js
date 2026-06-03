"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useTheme } from "next-themes";
import MaterialIcon from "@/components/MaterialIcon";
import { cn } from "@/lib/utils";
import {
  buildShareUrl,
  generateRoomId,
  getRoomIdFromUrl,
} from "@/lib/yjsRoom";
import { resolveProviderStatus } from "@/lib/yjsProviderStatus";
import { CollaborativeEditorPane } from "@/components/demos/yjs/CollaborativeEditorPane";
import { YjsVisualizer, formatOrigin } from "@/components/demos/yjs/YjsVisualizer";
import { Tooltip } from "@/components/demos/yjs/Tooltip";

const WS_URL = "wss://demos.yjs.dev/ws";
const MAX_TRANSACTIONS = 40;

const USERS = [
  {
    name: "User A",
    color: "#6366f1",
    title: "Editor A",
    subtitle: "Left pane · indigo caret",
    pane: "Pane A",
  },
  {
    name: "User B",
    color: "#22c55e",
    title: "Editor B",
    subtitle: "Right pane · green caret",
    pane: "Pane B",
  },
];

/**
 * @typedef {{
 *   id: string,
 *   time: string,
 *   origin: string,
 *   bytes: number,
 *   pane: string,
 * }} TransactionEntry
 */

export default function YjsTiptapDemo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [visualizerTab, setVisualizerTab] = useState("transactions");
  const [copyState, setCopyState] = useState("idle");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [transactions, setTransactions] = useState(
    /** @type {TransactionEntry[]} */ ([]),
  );
  const [metrics, setMetrics] = useState({
    status: "connecting",
    updateCount: 0,
    bytesIn: 0,
    bytesOut: 0,
    docSize: 0,
    clientCount: 0,
  });
  const [awarenessStates, setAwarenessStates] = useState(
    /** @type {Array<{ clientId: number, name: string, color: string, pane?: string }>} */ ([]),
  );

  const activePaneRef = useRef(USERS[0].pane);
  const [session, setSession] = useState(
    /** @type {{ ydoc: Y.Doc, provider: WebsocketProvider } | null} */ (null),
  );
  const ydocRef = useRef(/** @type {Y.Doc | null} */ (null));
  const providerRef = useRef(/** @type {WebsocketProvider | null} */ (null));
  const metricsRef = useRef({
    updateCount: 0,
    bytesIn: 0,
    bytesOut: 0,
  });
  const txCounterRef = useRef(0);

  const isDark = (resolvedTheme ?? "light") === "dark";

  useEffect(() => {
    setMounted(true);
    const initialRoom = getRoomIdFromUrl();
    setRoomId(initialRoom);
    setRoomInput(initialRoom);
  }, []);

  const refreshAwareness = useCallback(() => {
    const provider = providerRef.current;
    if (!provider) {
      return;
    }

    const states = [];
    provider.awareness.getStates().forEach((state, clientId) => {
      const user = state.user;
      if (!user || typeof user !== "object") {
        return;
      }
      states.push({
        clientId,
        name: typeof user.name === "string" ? user.name : "Anonymous",
        color: typeof user.color === "string" ? user.color : "#a3a3a3",
      });
    });

    setAwarenessStates(states);
    setMetrics((prev) => ({
      ...prev,
      clientCount: states.length,
      status: resolveProviderStatus(provider),
    }));
  }, []);

  const syncConnectionStatus = useCallback(() => {
    const provider = providerRef.current;
    if (!provider) {
      return;
    }

    const status = resolveProviderStatus(provider);
    setConnectionStatus(status);
    setMetrics((prev) => ({ ...prev, status }));
  }, []);

  const recordTransaction = useCallback((update, origin) => {
    const bytes = update.byteLength;
    const isRemote =
      origin instanceof WebsocketProvider ||
      (typeof origin === "object" &&
        origin !== null &&
        "constructor" in origin &&
        /** @type {{ constructor?: { name?: string } }} */ (origin).constructor
          ?.name === "WebsocketProvider");

    metricsRef.current.updateCount += 1;
    if (isRemote) {
      metricsRef.current.bytesIn += bytes;
    } else {
      metricsRef.current.bytesOut += bytes;
    }

    txCounterRef.current += 1;
    const entry = {
      id: `${Date.now()}-${txCounterRef.current}`,
      time: new Date().toLocaleTimeString(),
      origin: formatOrigin(origin),
      bytes,
      pane: activePaneRef.current,
    };

    setTransactions((prev) => [entry, ...prev].slice(0, MAX_TRANSACTIONS));
    setMetrics((prev) => ({
      ...prev,
      updateCount: metricsRef.current.updateCount,
      bytesIn: metricsRef.current.bytesIn,
      bytesOut: metricsRef.current.bytesOut,
      docSize: ydocRef.current
        ? Y.encodeStateAsUpdate(ydocRef.current).byteLength
        : prev.docSize,
    }));
  }, []);

  useEffect(() => {
    if (!mounted || !roomId) {
      return;
    }

    metricsRef.current = { updateCount: 0, bytesIn: 0, bytesOut: 0 };
    setTransactions([]);
    setConnectionStatus("connecting");
    setMetrics((prev) => ({
      ...prev,
      status: "connecting",
      updateCount: 0,
      bytesIn: 0,
      bytesOut: 0,
      docSize: 0,
      clientCount: 0,
    }));

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(WS_URL, roomId, ydoc, {
      connect: true,
    });
    providerRef.current = provider;

    provider.awareness.setLocalStateField("user", {
      name: USERS[0].name,
      color: USERS[0].color,
    });

    const onUpdate = (update, origin) => {
      recordTransaction(update, origin);
    };

    ydoc.on("update", onUpdate);

    provider.on("status", syncConnectionStatus);
    provider.on("sync", syncConnectionStatus);
    provider.awareness.on("change", refreshAwareness);

    syncConnectionStatus();
    refreshAwareness();

    setSession({ ydoc, provider });

    return () => {
      ydoc.off("update", onUpdate);
      provider.off("status", syncConnectionStatus);
      provider.off("sync", syncConnectionStatus);
      provider.awareness.off("change", refreshAwareness);
      provider.destroy();
      ydoc.destroy();
      ydocRef.current = null;
      providerRef.current = null;
      setSession(null);
    };
  }, [mounted, roomId, recordTransaction, refreshAwareness, syncConnectionStatus]);

  const applyRoom = useCallback(() => {
    const trimmed = roomInput.trim().slice(0, 64);
    if (!trimmed) {
      return;
    }

    const url = buildShareUrl(trimmed);
    if (url && typeof window !== "undefined") {
      window.history.replaceState({}, "", url);
    }
    setRoomId(trimmed);
  }, [roomInput]);

  const handleCopyLink = useCallback(async () => {
    const url = buildShareUrl(roomId);
    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [roomId]);

  const handleNewRoom = useCallback(() => {
    const nextRoom = generateRoomId();
    setRoomInput(nextRoom);
    const url = buildShareUrl(nextRoom);
    if (url && typeof window !== "undefined") {
      window.history.replaceState({}, "", url);
    }
    setRoomId(nextRoom);
  }, []);

  const focusPaneA = useCallback(() => {
    activePaneRef.current = USERS[0].pane;
  }, []);

  const focusPaneB = useCallback(() => {
    activePaneRef.current = USERS[1].pane;
  }, []);

  const statusColor =
    connectionStatus.startsWith("connected") || connectionStatus === "synced"
      ? "bg-emerald-500"
      : connectionStatus === "connecting"
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <article className="glass flex flex-col rounded-2xl p-6 md:p-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-foreground">
              Yjs + Tiptap
            </span>
            <span className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">
              CRDT collaboration
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-card-border px-3 py-1 text-xs text-muted">
              <span
                className={cn("h-1.5 w-1.5 rounded-full", statusColor)}
                aria-hidden
              />
              {connectionStatus}
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-bold text-foreground md:text-2xl">
            Real-time collaborative editor playground
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Both editors bind to the same Yjs document — type in either pane
            and see changes instantly. Sync with other tabs via{" "}
            <code className="rounded bg-background/80 px-1 py-0.5 text-xs text-foreground">
              wss://demos.yjs.dev/ws
            </code>
            . Copy the sync link to collaborate across tabs and devices.
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              Room ID
              <Tooltip label="All tabs and windows with the same room ID share one document. Copy the link to collaborate across devices.">
                <button
                  type="button"
                  className="text-muted hover:text-foreground"
                  aria-label="Room ID help"
                >
                  <MaterialIcon name="info" size={14} />
                </button>
              </Tooltip>
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomInput}
                maxLength={64}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyRoom();
                  }
                }}
                className="min-w-0 flex-1 rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30"
                placeholder="portfolio-yjs-playground"
              />
              <button
                type="button"
                onClick={applyRoom}
                className="shrink-0 rounded-lg border border-card-border bg-accent-subtle px-3 py-2 text-xs font-medium text-foreground transition-colors hover:text-muted"
              >
                Join room
              </button>
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            <Tooltip label="Generate a fresh room so you get a private document.">
              <button
                type="button"
                onClick={handleNewRoom}
                className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted"
              >
                <MaterialIcon name="add" size={16} />
                New room
              </button>
            </Tooltip>
            <Tooltip label="Copy a URL with ?room=… — open it in another tab to see instant multi-tab sync.">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted"
              >
                <MaterialIcon
                  name={copyState === "copied" ? "check" : "link"}
                  size={16}
                />
                {copyState === "copied"
                  ? "Copied!"
                  : copyState === "error"
                    ? "Copy failed"
                    : "Copy sync link"}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {mounted && session ? (
        <>
          <div className="mt-6 grid min-h-[320px] gap-4 lg:grid-cols-2">
            <CollaborativeEditorPane
              ydoc={session.ydoc}
              provider={session.provider}
              user={{ name: USERS[0].name, color: USERS[0].color }}
              title={USERS[0].title}
              subtitle={USERS[0].subtitle}
              seedOnEmpty
              isDark={isDark}
              onFocusPane={focusPaneA}
            />
            <CollaborativeEditorPane
              ydoc={session.ydoc}
              provider={session.provider}
              user={{ name: USERS[1].name, color: USERS[1].color }}
              title={USERS[1].title}
              subtitle={USERS[1].subtitle}
              isDark={isDark}
              onFocusPane={focusPaneB}
            />
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <MaterialIcon name="monitoring" size={18} className="text-muted" />
              <h4 className="font-display text-sm font-bold text-foreground">
                Under the hood
              </h4>
              <Tooltip label="Live CRDT telemetry from the shared Yjs document — transactions, sync counters, encoded state vector, and awareness presence.">
                <button
                  type="button"
                  className="text-muted hover:text-foreground"
                  aria-label="Visualizer help"
                >
                  <MaterialIcon name="info" size={14} />
                </button>
              </Tooltip>
            </div>
            <YjsVisualizer
              activeTab={visualizerTab}
              onTabChange={setVisualizerTab}
              transactions={transactions}
              metrics={metrics}
              ydoc={session.ydoc}
              stateTick={metrics.updateCount}
              awarenessStates={awarenessStates}
            />
          </div>
        </>
      ) : (
        <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-card-border bg-background/40">
          <span className="text-sm text-muted">Connecting to Yjs…</span>
        </div>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-card-border pt-4 text-xs text-muted">
        <span>
          Synced via{" "}
          <a
            href="https://github.com/yjs/y-websocket"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            y-websocket
          </a>{" "}
          on the public{" "}
          <a
            href="https://github.com/yjs/y-websocket-server"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            demos.yjs.dev
          </a>{" "}
          server. Rich text powered by{" "}
          <a
            href="https://tiptap.dev/docs/editor/extensions/functionality/collaboration"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Tiptap Collaboration
          </a>
          .
        </span>
      </footer>
    </article>
  );
}
