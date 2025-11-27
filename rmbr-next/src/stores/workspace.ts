import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Page, Board, Card, Column } from "@/types";
import type { Block } from "@blocknote/core";

interface WorkspaceState {
  // Data
  pages: Record<string, Page>;
  boards: Record<string, Board>;
  cards: Record<string, Card>;
  
  // UI State
  activePage: string | null;
  sidebarOpen: boolean;
  
  // Page Actions
  createPage: (parentId?: string | null) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  updatePageContent: (id: string, content: Block[]) => void;
  
  // Board Actions
  createBoard: (pageId: string) => string;
  addColumn: (boardId: string, title: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  
  // Card Actions
  createCard: (boardId: string, columnId: string, title: string) => string;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  
  // UI Actions
  setActivePage: (id: string | null) => void;
  toggleSidebar: () => void;
}

const generateId = () => crypto.randomUUID();

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      // Initial State
      pages: {},
      boards: {},
      cards: {},
      activePage: null,
      sidebarOpen: true,

      // Page Actions
      createPage: (parentId = null) => {
        const id = generateId();
        const newPage: Page = {
          id,
          title: "Untitled",
          content: [],
          parentId,
          children: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => {
          const pages = { ...state.pages, [id]: newPage };
          
          // Add to parent's children if has parent
          if (parentId && state.pages[parentId]) {
            pages[parentId] = {
              ...state.pages[parentId],
              children: [...state.pages[parentId].children, id],
            };
          }
          
          return { pages, activePage: id };
        });

        return id;
      },

      updatePage: (id, updates) => {
        set((state) => ({
          pages: {
            ...state.pages,
            [id]: {
              ...state.pages[id],
              ...updates,
              updatedAt: new Date(),
            },
          },
        }));
      },

      updatePageContent: (id, content) => {
        set((state) => ({
          pages: {
            ...state.pages,
            [id]: {
              ...state.pages[id],
              content,
              updatedAt: new Date(),
            },
          },
        }));
      },

      deletePage: (id) => {
        set((state) => {
          const page = state.pages[id];
          if (!page) return state;

          const newPages = { ...state.pages };
          
          // Remove from parent's children
          if (page.parentId && newPages[page.parentId]) {
            newPages[page.parentId] = {
              ...newPages[page.parentId],
              children: newPages[page.parentId].children.filter((c) => c !== id),
            };
          }

          // Delete page and all children recursively
          const deleteRecursive = (pageId: string) => {
            const p = newPages[pageId];
            if (p) {
              p.children.forEach(deleteRecursive);
              delete newPages[pageId];
            }
          };
          deleteRecursive(id);

          return {
            pages: newPages,
            activePage: state.activePage === id ? null : state.activePage,
          };
        });
      },

      // Board Actions
      createBoard: (pageId) => {
        const id = generateId();
        const defaultColumns: Column[] = [
          { id: generateId(), title: "To Do", color: "gray", cardIds: [] },
          { id: generateId(), title: "In Progress", color: "blue", cardIds: [] },
          { id: generateId(), title: "Done", color: "green", cardIds: [] },
        ];

        const newBoard: Board = {
          id,
          title: "Kanban Board",
          columns: defaultColumns,
          pageId,
        };

        set((state) => ({
          boards: { ...state.boards, [id]: newBoard },
        }));

        return id;
      },

      addColumn: (boardId, title) => {
        set((state) => {
          const board = state.boards[boardId];
          if (!board) return state;

          return {
            boards: {
              ...state.boards,
              [boardId]: {
                ...board,
                columns: [
                  ...board.columns,
                  { id: generateId(), title, color: "gray", cardIds: [] },
                ],
              },
            },
          };
        });
      },

      moveCard: (cardId, fromColumnId, toColumnId, newIndex) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;

          const board = state.boards[card.boardId];
          if (!board) return state;

          const newColumns = board.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                cardIds: col.cardIds.filter((id) => id !== cardId),
              };
            }
            if (col.id === toColumnId) {
              const newCardIds = [...col.cardIds];
              newCardIds.splice(newIndex, 0, cardId);
              return { ...col, cardIds: newCardIds };
            }
            return col;
          });

          return {
            boards: {
              ...state.boards,
              [card.boardId]: { ...board, columns: newColumns },
            },
            cards: {
              ...state.cards,
              [cardId]: { ...card, columnId: toColumnId },
            },
          };
        });
      },

      // Card Actions
      createCard: (boardId, columnId, title) => {
        const id = generateId();
        const newCard: Card = {
          id,
          title,
          content: [],
          columnId,
          boardId,
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => {
          const board = state.boards[boardId];
          if (!board) return state;

          const newColumns = board.columns.map((col) =>
            col.id === columnId
              ? { ...col, cardIds: [...col.cardIds, id] }
              : col
          );

          return {
            cards: { ...state.cards, [id]: newCard },
            boards: {
              ...state.boards,
              [boardId]: { ...board, columns: newColumns },
            },
          };
        });

        return id;
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: {
            ...state.cards,
            [id]: {
              ...state.cards[id],
              ...updates,
              updatedAt: new Date(),
            },
          },
        }));
      },

      deleteCard: (id) => {
        set((state) => {
          const card = state.cards[id];
          if (!card) return state;

          const board = state.boards[card.boardId];
          if (!board) return state;

          const newColumns = board.columns.map((col) => ({
            ...col,
            cardIds: col.cardIds.filter((cardId) => cardId !== id),
          }));

          const newCards = { ...state.cards };
          delete newCards[id];

          return {
            cards: newCards,
            boards: {
              ...state.boards,
              [card.boardId]: { ...board, columns: newColumns },
            },
          };
        });
      },

      // UI Actions
      setActivePage: (id) => set({ activePage: id }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "rmbr-workspace",
    }
  )
);
