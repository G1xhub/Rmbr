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

export function Editor({ initialContent, onChange, editable = true }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent?.length ? initialContent : undefined,
  });

  return (
    <div className="w-full min-h-[200px]">
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={() => {
          onChange?.(editor.document);
        }}
        theme="light"
        data-theming-css-variables-demo
      />
    </div>
  );
}
