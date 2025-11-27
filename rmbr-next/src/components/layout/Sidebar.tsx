"use client";

import { useWorkspaceStore } from "@/stores/workspace";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const {
    pages,
    activePage,
    sidebarOpen,
    createPage,
    deletePage,
    setActivePage,
  } = useWorkspaceStore();

  // Get root pages (no parent)
  const rootPages = Object.values(pages).filter((p) => !p.parentId);

  return (
    <aside
      className={cn(
        "h-screen bg-[#fbfbfa] border-r border-gray-200 flex flex-col transition-all duration-200",
        sidebarOpen ? "w-60" : "w-0 overflow-hidden"
      )}
    >
      {/* Workspace Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
          <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">
            R
          </div>
          <span className="font-medium text-sm text-gray-700">rmbr</span>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Search */}
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
          <Search className="w-4 h-4" />
          <span>Search</span>
          <kbd className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Pages
          </span>
          <button
            onClick={() => createPage()}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {rootPages.length === 0 ? (
          <button
            onClick={() => createPage()}
            className="w-full flex items-center gap-2 px-3 py-8 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors border-2 border-dashed border-gray-200"
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
      <div className="p-2 border-t border-gray-100">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
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
          isActive ? "bg-gray-200" : "hover:bg-gray-100"
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
            "p-0.5 rounded hover:bg-gray-200 transition-colors",
            !hasChildren && "invisible"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {/* Icon */}
        <span className="text-base">{page.icon || "📄"}</span>

        {/* Title */}
        <span className="flex-1 text-sm text-gray-700 truncate">
          {page.title || "Untitled"}
        </span>

        {/* Actions */}
        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild();
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
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
              onSelect={() => {}}
              onDelete={() => {}}
              onAddChild={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
