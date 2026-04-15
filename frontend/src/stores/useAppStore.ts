import { getQueryParams, updateQueryParams } from "@/utils/queryParams";
import { create } from "zustand";

interface AppState {
  dbName: string | null;
  tableName: string | null;
  rowId: Record<string, string> | null;
  page: number;
  limit: number;
  query: string;
  setDatabase: (dbName: string) => void;
  setTable: (tableName: string) => void;
  setRow: (rowId: Record<string, string>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setQuery: (query: string) => void;
}

const initFromUrl = () => {
  const params = getQueryParams();

  return {
    dbName: params.get("database") ?? "",
    tableName: params.get("table") ?? "",
  };
};

export const useAppStore = create<AppState>((set) => ({
  ...initFromUrl(),
  rowId: null,
  page: 1,
  limit: 1,
  query: "",

  setDatabase: (dbName: string) => {
    updateQueryParams({ database: dbName });
    set({ dbName, tableName: null, page: 1, rowId: null, query: "" });
  },

  setTable: (tableName: string) => {
    updateQueryParams({ table: tableName });
    set({ tableName, page: 1, rowId: null, query: "" });
  },

  setRow: (rowId: Record<string, string>) => {
    set({ rowId });
  },

  setPage: (page: number) => {
    if (page < 1) {
      return;
    }
    set({ page });
  },

  setLimit: (limit: number) => {
    if (limit < 1) {
      return;
    }
    set({ limit });
  },

  setQuery: (query: string) => {
    set({ query, page: 1 });
  },
}));
