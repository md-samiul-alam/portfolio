import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { yCursorPlugin } from "@tiptap/y-tiptap";

const awarenessStatesToArray = (states) =>
  Array.from(states.entries()).map(([clientId, value]) => {
    if (value && value.user) {
      return { clientId, ...value.user };
    }
    return { clientId };
  });

/**
 * Collaboration caret that shows remote users plus the shared local awareness
 * cursor in this pane when the editor is not focused — so split-screen panes
 * can display who is typing in the other view.
 */
export const PaneCollaborationCaret = CollaborationCaret.extend({
  addProseMirrorPlugins() {
    const extension = this;
    const { provider, render, selectionRender } = this.options;
    const storage = this.storage;

    const awarenessListenerPlugin = new Plugin({
      key: new PluginKey("collaborationCaretAwarenessListener"),
      view: () => {
        const onAwarenessUpdate = () => {
          storage.users = awarenessStatesToArray(provider.awareness.states);
        };

        storage.users = awarenessStatesToArray(provider.awareness.states);
        provider.awareness.on("update", onAwarenessUpdate);

        return {
          destroy: () => {
            provider.awareness.off("update", onAwarenessUpdate);
            storage.users = [];
          },
        };
      },
    });

    return [
      awarenessListenerPlugin,
      yCursorPlugin(provider.awareness, {
        cursorBuilder: render,
        selectionBuilder: selectionRender,
        awarenessStateFilter: (currentClientId, userClientId, aw) => {
          if (userClientId !== currentClientId) {
            return Boolean(aw?.cursor);
          }

          if (extension.editor?.isFocused) {
            return false;
          }

          return Boolean(aw?.cursor);
        },
      }),
    ];
  },
});
