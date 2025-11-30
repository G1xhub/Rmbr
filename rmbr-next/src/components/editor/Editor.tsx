"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface EditorProps {
  initialContent?: Block[];
  onChange?: (content: Block[]) => void;
  editable?: boolean;
}

import { useTheme } from "next-themes";

// ...

import { createReactStyleSpec } from "@blocknote/react";
import { BlockNoteSchema, defaultStyleSpecs } from "@blocknote/core";
import { useWorkspaceStore } from "@/stores/workspace";
import { useShallow } from "zustand/react/shallow";
import { useState, useEffect } from "react";
import { MessageSquarePlus } from "lucide-react";

// Define custom comment style
const CommentStyle = createReactStyleSpec(
  {
    type: "comment",
    propSchema: "string",
    content: "styled",
  },
  {
    render: (props) => (
      <span className="comment" data-comment-id={props.value} ref={props.contentRef} />
    ),
  }
);

// Define custom schema with comment style
const schema = BlockNoteSchema.create({
  styleSpecs: {
    ...defaultStyleSpecs,
    comment: CommentStyle,
  },
});

export function Editor({ initialContent, onChange, editable = true }: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { activePage, addComment } = useWorkspaceStore(
    useShallow((state) => ({
      activePage: state.activePage,
      addComment: state.addComment,
    }))
  );

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent?.length ? initialContent : undefined,
  });

  const [selection, setSelection] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!editor) return;

    const cleanup = editor.onSelectionChange(() => {
      const text = editor.getSelectedText();
      setSelection(text || null);

      if (text) {
        const domSelection = window.getSelection();
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setMenuPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10 // 10px above selection
          });
        }
      } else if (!isCommenting) {
        setSelection(null);
        setMenuPosition(null);
      }
    });

    return cleanup;
  }, [editor, isCommenting]);

  const startCommenting = () => {
    setIsCommenting(true);
    // Ideally we should save the selection range here if needed, 
    // but let's see if editor.focus() restores it enough.
  };

  const cancelCommenting = () => {
    setIsCommenting(false);
    setCommentText("");
    editor.focus();
  };

  const saveComment = () => {
    if (!activePage || !selection || !commentText.trim()) return;

    const commentId = addComment(activePage, commentText, selection);

    // Restore focus and apply style
    editor.focus();
    editor.addStyles({
      comment: commentId
    });

    setIsCommenting(false);
    setCommentText("");
  };

  return (
    <div className="w-full min-h-[200px] bn-container relative group">
      {selection && editable && menuPosition && (
        <div
          className="fixed z-50 transform -translate-x-1/2"
          style={{
            left: menuPosition.x,
            top: menuPosition.y
          }}
        >
          {!isCommenting ? (
            <button
              onClick={startCommenting}
              className="bg-background border border-border shadow-lg p-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Add Comment
            </button>
          ) : (
            <div className="bg-background border border-border shadow-xl p-3 rounded-lg flex flex-col gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full text-sm p-2 rounded-md border border-input bg-transparent outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelCommenting}
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveComment}
                  className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={() => {
          onChange?.(editor.document);
        }}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        data-theming-css-variables-demo
      />

      {/* Custom CSS for comments */}
      <style jsx global>{`
        span[data-comment-id] {
          background-color: rgba(250, 204, 21, 0.3); /* Yellow highlight */
          border-bottom: 2px solid #eab308;
          cursor: pointer;
        }
        .dark span[data-comment-id] {
          background-color: rgba(250, 204, 21, 0.2);
        }
      `}</style>
    </div>
  );
}
