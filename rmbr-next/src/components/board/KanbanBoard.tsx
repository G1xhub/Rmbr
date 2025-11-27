"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useWorkspaceStore } from "@/stores/workspace";
import type { Board, Card } from "@/types";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  board: Board;
}

export function KanbanBoard({ board }: KanbanBoardProps) {
  const { cards, moveCard, createCard, addColumn } = useWorkspaceStore();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards[active.id as string];
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle moving between columns
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const card = cards[activeCardId];
    if (!card) return;

    // Check if dropped on a column
    const overColumn = board.columns.find((col) => col.id === over.id);
    if (overColumn && overColumn.id !== card.columnId) {
      moveCard(activeCardId, card.columnId, overColumn.id, overColumn.cardIds.length);
      return;
    }

    // Check if dropped on another card
    const overCard = cards[over.id as string];
    if (overCard && overCard.columnId !== card.columnId) {
      const targetColumn = board.columns.find((col) => col.id === overCard.columnId);
      if (targetColumn) {
        const newIndex = targetColumn.cardIds.indexOf(overCard.id);
        moveCard(activeCardId, card.columnId, overCard.columnId, newIndex);
      }
    } else if (overCard && overCard.columnId === card.columnId) {
      // Reorder within same column
      const column = board.columns.find((col) => col.id === card.columnId);
      if (column) {
        const oldIndex = column.cardIds.indexOf(activeCardId);
        const newIndex = column.cardIds.indexOf(overCard.id);
        if (oldIndex !== newIndex) {
          // Handle reordering - we'd need to add this to the store
        }
      }
    }
  };

  const handleAddCard = (columnId: string) => {
    createCard(board.id, columnId, "New Card");
  };

  const handleAddColumn = () => {
    addColumn(board.id, "New Column");
  };

  return (
    <div className="h-full overflow-x-auto p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 items-start">
          <SortableContext
            items={board.columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={column.cardIds.map((id) => cards[id]).filter(Boolean)}
                onAddCard={() => handleAddCard(column.id)}
              />
            ))}
          </SortableContext>

          {/* Add Column Button */}
          <button
            onClick={handleAddColumn}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-w-[200px] justify-center border-2 border-dashed border-gray-200 hover:border-gray-300"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </button>
        </div>

        <DragOverlay>
          {activeCard ? <KanbanCard card={activeCard} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
