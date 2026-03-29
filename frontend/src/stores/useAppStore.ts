import { create } from "zustand";

export interface AppState {
  database: string | null;
  table: string | null;
  page: number;
  query: string;
  row: Record<string, string> | null;
  setDatabase: (database: string) => void;
  setTable: (table: string) => void;
  setPage: (page: number) => void;
  setRow: (row: Record<string, string>) => void;
  setQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  database: null,
  table: null,
  page: 1,
  row: null,
  query: "",

  setDatabase: (database: string) => {
    set({ database, table: null, page: 1, row: null, query: "" });
  },

  setTable: (table: string) => {
    set({ table, page: 1, row: null, query: "" });
  },

  setPage: (page: number) => {
    if (page < 1) {
      return;
    }

    set({ page });
  },

  setRow: (row: Record<string, string>) => {
    set({ row });
  },

  setQuery: (query: string) => {
    set({ query });
  },
}));
