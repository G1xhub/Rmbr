"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/types";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface KanbanCardProps {
  card: Card;
  isDragging?: boolean;
}

export function KanbanCard({ card, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer",
        (isDragging || isSortableDragging) && "opacity-50 shadow-lg rotate-2",
        isDragging && "shadow-xl"
      )}
    >
      <div className="flex items-start gap-2 p-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mt-0.5"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* Card Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 font-medium leading-snug">
            {card.title}
          </p>
          
          {/* Properties Preview (if any) */}
          {card.properties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.properties.slice(0, 3).map((prop) => (
                <span
                  key={prop.id}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {String(prop.value)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
