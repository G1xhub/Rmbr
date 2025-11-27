"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import { Editor } from "@/components/editor/Editor";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { useState, useCallback } from "react";
import {
  Menu,
  MoreHorizontal,
  Star,
  MessageSquare,
  Clock,
  Kanban,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "document" | "board";

export function PageView() {
  const { pages, boards, activePage, updatePage, updatePageContent, createBoard, toggleSidebar } =
    useWorkspaceStore();
  const [viewMode, setViewMode] = useState<ViewMode>("document");

  const page = activePage ? pages[activePage] : null;

  // Find board for this page
  const pageBoard = Object.values(boards).find((b) => b.pageId === activePage);

  const handleContentChange = useCallback(
    (content: Parameters<typeof updatePageContent>[1]) => {
      if (activePage) {
        updatePageContent(activePage, content);
      }
    },
    [activePage, updatePageContent]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (activePage) {
        updatePage(activePage, { title: e.target.value });
      }
    },
    [activePage, updatePage]
  );

  const handleCreateBoard = () => {
    if (activePage) {
      createBoard(activePage);
      setViewMode("board");
    }
  };

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No page selected
          </h2>
          <p className="text-gray-400">
            Select a page from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>{page.icon || "📄"}</span>
            <span className="truncate max-w-[200px]">{page.title || "Untitled"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 mr-2">
            <button
              onClick={() => setViewMode("document")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                viewMode === "document"
                  ? "bg-white text-gray-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              Document
            </button>
            <button
              onClick={() => {
                if (!pageBoard) {
                  handleCreateBoard();
                } else {
                  setViewMode("board");
                }
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                viewMode === "board"
                  ? "bg-white text-gray-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Kanban className="w-3.5 h-3.5" />
              Board
            </button>
          </div>

          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <Star className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <Clock className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <MessageSquare className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === "document" ? (
          <div className="max-w-3xl mx-auto px-16 py-12">
            {/* Page Title */}
            <div className="mb-4">
              <input
                type="text"
                value={page.title}
                onChange={handleTitleChange}
                placeholder="Untitled"
                className="w-full text-4xl font-bold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent"
              />
            </div>

            {/* Editor */}
            <Editor
              key={page.id}
              initialContent={page.content}
              onChange={handleContentChange}
            />
          </div>
        ) : pageBoard ? (
          <KanbanBoard board={pageBoard} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={handleCreateBoard}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
