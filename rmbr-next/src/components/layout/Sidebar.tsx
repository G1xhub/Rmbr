"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  Search,
  Settings,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar() {
  const {
    pages,
    activePage,
    sidebarOpen,
    createPage,
    deletePage,
    setActivePage,
  } = useWorkspaceStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get root pages (no parent)
  const rootPages = Object.values(pages).filter((p) => !p.parentId);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
        sidebarOpen ? "w-60" : "w-0 overflow-hidden"
      )}
    >
      {/* Workspace Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
          <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-500 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm">
            R
          </div>
          <span className="font-medium text-sm text-foreground">rmbr</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>
      </div>

      {/* Search */}
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md transition-colors">
          <Search className="w-4 h-4" />
          <span>Search</span>
          <kbd className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1 group">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Pages
          </span>
          <button
            onClick={() => createPage()}
            className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {rootPages.length === 0 ? (
          <button
            onClick={() => createPage()}
            className="w-full flex items-center gap-2 px-3 py-8 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors border-2 border-dashed border-border hover:border-muted-foreground/50"
          >
            <Plus className="w-4 h-4" />
            <span>Create your first page</span>
          </button>
        ) : (
          <div className="space-y-0.5">
            {rootPages.map((page) => (
              <PageItem
                key={page.id}
                page={page}
                depth={0}
                isActive={activePage === page.id}
                onSelect={() => setActivePage(page.id)}
                onDelete={() => deletePage(page.id)}
                onAddChild={() => createPage(page.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md p-6 m-4">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Settings</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">Data Management</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Clear all local data including pages, boards, and settings. This action cannot be undone.
                </p>
                <button
                  onClick={() => {
                    if (confirm("Are you sure? This will delete everything.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded-md hover:opacity-90 transition-opacity"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

interface PageItemProps {
  page: { id: string; title: string; icon?: string; children: string[] };
  depth: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAddChild: () => void;
}

function PageItem({
  page,
  depth,
  isActive,
  onSelect,
  onDelete,
  onAddChild,
}: PageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pages } = useWorkspaceStore();
  const childPages = page.children.map((id) => pages[id]).filter(Boolean);
  const hasChildren = childPages.length > 0;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors",
          isActive ? "bg-muted text-foreground" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={onSelect}
      >
        {/* Expand/Collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            "p-0.5 rounded hover:bg-muted transition-colors",
            !hasChildren && "invisible"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Icon */}
        <span className="text-base">{page.icon || "📄"}</span>

        {/* Title */}
        <span className="flex-1 text-sm truncate">
          {page.title || "Untitled"}
        </span>

        {/* Actions */}
        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild();
            }}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {childPages.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              depth={depth + 1}
              isActive={false}
              onSelect={() => { }}
              onDelete={() => { }}
              onAddChild={() => { }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
