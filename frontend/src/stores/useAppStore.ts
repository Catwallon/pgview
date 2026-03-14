import { fetchGetColumns, fetchGetRows } from "@/lib/api/database";
import { create } from "zustand";

export interface AppState {
  db: string | null;
  table: string | null;
  columns: { name: string }[];
  rows: Record<string, string>[];
  page: number;
  totalPages: number;
  row: Record<string, string> | null;
  setTable: (db: string, table: string) => void;
  setPage: (page: number) => void;
  setRow: (row: Record<string, string>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  db: null,
  table: null,
  columns: [],
  rows: [],
  page: 1,
  totalPages: 1,
  row: null,

  setTable: (db: string, table: string) => {
    set({ db, table, page: 1, row: null });

    fetchGetColumns(db, table).then((columns) => set({ columns }));
    fetchGetRows(db, table, 20, 1).then((res) =>
      set({ rows: res.items, totalPages: res.totalPages }),
    );
  },

  setPage: (page: number) => {
    const { db, table, totalPages } = get();
    if (!db || !table) {
      return;
    }
    if (page < 1 || page > totalPages) {
      return;
    }

    set({ page });

    fetchGetRows(db, table, 20, page).then((res) =>
      set({ rows: res.items, totalPages: res.totalPages }),
    );
  },

  setRow: (row: Record<string, string>) => {
    set({ row });
  },
}));
