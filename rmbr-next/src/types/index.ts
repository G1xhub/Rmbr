import type { Block } from "@blocknote/core";

// Core types for rmbr

export interface Page {
  id: string;
  title: string;
  icon?: string;
  coverImage?: string;
  content: Block[];
  parentId: string | null;
  children: string[]; // child page IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  pageId: string; // parent page
}

export interface Column {
  id: string;
  title: string;
  color: ColumnColor;
  cardIds: string[];
}

export interface Card {
  id: string;
  title: string;
  content: Block[];
  columnId: string;
  boardId: string;
  properties: CardProperty[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CardProperty {
  id: string;
  name: string;
  type: PropertyType;
  value: unknown;
}

export type PropertyType = 
  | "text"
  | "number"
  | "select"
  | "multi-select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "person";

export type ColumnColor = 
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

// Workspace
export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  pages: string[]; // root page IDs
}
