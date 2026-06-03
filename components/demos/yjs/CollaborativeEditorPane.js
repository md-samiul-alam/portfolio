"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { yCursorPluginKey } from "@tiptap/y-tiptap";
import { cn } from "@/lib/utils";
import { PaneCollaborationCaret } from "@/components/demos/yjs/PaneCollaborationCaret";

const SEED_CONTENT =
  "<p>Welcome to the Yjs playground. Type here — changes sync instantly across both panes, other browser tabs, and anyone on the same room ID.</p>";

/**
 * @param {{
 *   ydoc: import('yjs').Doc,
 *   provider: import('y-websocket').WebsocketProvider,
 *   user: { name: string, color: string },
 *   title: string,
 *   subtitle: string,
 *   seedOnEmpty?: boolean,
 *   isDark: boolean,
 *   onFocusPane?: () => void,
 * }} props
 */
export function CollaborativeEditorPane({
  ydoc,
  provider,
  user,
  title,
  subtitle,
  seedOnEmpty = false,
  isDark,
  onFocusPane,
}) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Collaboration.configure({ document: ydoc }),
        PaneCollaborationCaret.configure({ provider, user }),
      ],
      editorProps: {
        attributes: {
          class: cn(
            "tiptap-editor min-h-[220px] px-4 py-3 text-sm leading-relaxed outline-none",
            isDark ? "text-foreground" : "text-foreground",
          ),
        },
      },
      onFocus: ({ editor: activeEditor }) => {
        provider.awareness.setLocalStateField("user", user);
        onFocusPane?.();
        activeEditor.view.dispatch(
          activeEditor.state.tr.setMeta(yCursorPluginKey, {
            awarenessUpdated: true,
          }),
        );
      },
      onBlur: ({ editor: activeEditor }) => {
        activeEditor.view.dispatch(
          activeEditor.state.tr.setMeta(yCursorPluginKey, {
            awarenessUpdated: true,
          }),
        );
      },
    },
    [ydoc, provider, user.name, user.color, isDark, onFocusPane],
  );

  useEffect(() => {
    if (!editor || !provider || !seedOnEmpty) {
      return;
    }

    const seedIfEmpty = () => {
      const fragment = ydoc.getXmlFragment("default");
      if (fragment.length === 0 && editor.isEmpty) {
        editor.commands.setContent(SEED_CONTENT);
      }
    };

    if (provider.synced) {
      seedIfEmpty();
      return;
    }

    provider.on("sync", seedIfEmpty);
    return () => {
      provider.off("sync", seedIfEmpty);
    };
  }, [editor, provider, seedOnEmpty, ydoc]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-card-border bg-background/40">
      <div className="flex items-center gap-3 border-b border-card-border px-4 py-2.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: user.color }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="truncate text-xs text-muted">{subtitle}</p>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="tiptap min-h-0 flex-1 overflow-y-auto pt-5"
      />
    </div>
  );
}
