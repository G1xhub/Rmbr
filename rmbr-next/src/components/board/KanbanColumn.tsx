"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import type { Column, Card } from "@/types";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const columnColors: Record<string, string> = {
  gray: "bg-gray-100",
  brown: "bg-amber-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-emerald-100",
  blue: "bg-blue-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  red: "bg-red-100",
};

const columnDotColors: Record<string, string> = {
  gray: "bg-gray-400",
  brown: "bg-amber-600",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  red: "bg-red-500",
};

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onAddCard: () => void;
}

export function KanbanColumn({ column, cards, onAddCard }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={cn(
        "flex flex-col w-[280px] min-w-[280px] rounded-xl transition-colors",
        isOver && "ring-2 ring-blue-400 ring-opacity-50"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              columnDotColors[column.color] || columnDotColors.gray
            )}
          />
          <h3 className="font-medium text-sm text-gray-700">{column.title}</h3>
          <span className="text-xs text-gray-400 ml-1">{cards.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onAddCard}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-2 p-1 min-h-[100px] rounded-lg transition-colors",
          isOver && columnColors[column.color]
        )}
      >
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Add Card Button (at bottom) */}
      <button
        onClick={onAddCard}
        className="flex items-center gap-2 px-3 py-2 mt-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>New</span>
      </button>
    </div>
  );
}
