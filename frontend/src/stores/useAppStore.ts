import { fetchGetColumns, fetchGetRows } from "@/lib/api/database";
import { create } from "zustand";

export interface AppState {
  db: string | null;
  table: string | null;
  columns: { name: string; type: string; nullable: boolean }[];
  rows: Record<string, string>[];
  rowSearchQuery: string;
  page: number;
  totalPages: number;
  totalRows: number;
  row: Record<string, string> | null;
  setTable: (db: string, table: string) => void;
  setPage: (page: number) => void;
  setRow: (row: Record<string, string>) => void;
  setRowSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  db: null,
  table: null,
  columns: [],
  rows: [],
  page: 1,
  totalPages: 1,
  totalRows: 0,
  row: null,
  rowSearchQuery: "",

  setTable: (db: string, table: string) => {
    set({ db, table, page: 1, row: null, rowSearchQuery: "" });

    fetchGetColumns(db, table).then((columns) => set({ columns }));
    fetchGetRows(db, table, 16, 1, "").then((res) =>
      set({
        rows: res.items,
        totalPages: res.totalPages,
        totalRows: res.totalItems,
      }),
    );
  },

  setPage: (page: number) => {
    const { db, table, totalPages, rowSearchQuery } = get();
    if (!db || !table) {
      return;
    }
    if (page < 1 || (page !== 1 && page > totalPages)) {
      return;
    }

    set({ page });

    fetchGetRows(db, table, 16, page, rowSearchQuery).then((res) =>
      set({
        rows: res.items,
        totalPages: res.totalPages,
        totalRows: res.totalItems,
      }),
    );
  },

  setRow: (row: Record<string, string>) => {
    set({ row });
  },

  setRowSearchQuery: (query: string) => {
    set({ rowSearchQuery: query });

    const { db, table, page } = get();
    if (!db || !table) {
      return;
    }

    fetchGetRows(db, table, 16, page, query).then((res) =>
      set({
        rows: res.items,
        totalPages: res.totalPages,
        totalRows: res.totalItems,
      }),
    );
  },
}));
