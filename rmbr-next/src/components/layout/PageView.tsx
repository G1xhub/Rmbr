"use client";

import { useShallow } from "zustand/react/shallow";
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
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "document" | "board";

// ...

export function PageView() {
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const {
    pages,
    boards,
    activePage,
    updatePage,
    updatePageContent,
    createBoard,
    toggleSidebar,
    toggleFavorite,
    deletePage,
    deleteComment,
  } = useWorkspaceStore(
    useShallow((state) => ({
      pages: state.pages,
      boards: state.boards,
      activePage: state.activePage,
      updatePage: state.updatePage,
      updatePageContent: state.updatePageContent,
      createBoard: state.createBoard,
      toggleSidebar: state.toggleSidebar,
      toggleFavorite: state.toggleFavorite,
      deletePage: state.deletePage,
      deleteComment: state.deleteComment,
    }))
  );
  // ... (rest of component)

  // ... (inside return)
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
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">
            No page selected
          </h2>
          <p className="text-muted-foreground">
            Select a page from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{page.icon || "📄"}</span>
            <span className="truncate max-w-[200px] text-foreground font-medium">
              {page.title || "Untitled"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-0.5 mr-2">
            <button
              onClick={() => setViewMode("document")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                viewMode === "document"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
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
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                viewMode === "board"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Kanban className="w-3.5 h-3.5" />
              Board
            </button>
          </div>

          <button
            onClick={() => page && toggleFavorite(page.id)}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <Star
              className={cn(
                "w-4 h-4 transition-colors",
                page.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )}
            />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
            >
              <Clock className="w-4 h-4 text-muted-foreground" />
            </button>

            {showHistory && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-background border border-border rounded-md shadow-lg p-4 z-50">
                <h3 className="text-sm font-medium text-foreground mb-3">Page History</h3>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-foreground">{new Date(page.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="text-foreground">{new Date(page.updatedAt).toLocaleDateString()} {new Date(page.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className={cn(
              "p-1.5 hover:bg-muted rounded-md transition-colors",
              showComments ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    if (confirm("Delete this page?")) {
                      deletePage(page.id);
                      setShowMenu(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Page
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
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
                  className="w-full text-4xl font-bold text-foreground placeholder:text-muted-foreground outline-none bg-transparent"
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
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Board
              </button>
            </div>
          )}
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l border-border bg-background flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Comments</h3>
              <button onClick={() => setShowComments(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {page.comments && Object.values(page.comments).length > 0 ? (
                Object.values(page.comments).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment) => (
                  <div key={comment.id} className="p-3 rounded-lg bg-muted/50 border border-border text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteComment(page.id, comment.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {comment.selectedText && (
                      <div className="mb-2 pl-2 border-l-2 border-accent text-xs text-muted-foreground italic truncate">
                        "{comment.selectedText}"
                      </div>
                    )}
                    <p className="text-foreground">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No comments yet. Select text to add one.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
