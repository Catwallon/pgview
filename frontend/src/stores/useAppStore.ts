import { API_URL } from "@/config/api.config";
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
  fetchColumns: () => Promise<void>;
  fetchRows: () => Promise<void>;
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
    get().fetchColumns();
    get().fetchRows();
  },

  setPage: (page: number) => {
    const { totalPages } = get();

    if (page < 1 || page > totalPages) {
      return;
    }

    set({ page });
    get().fetchRows();
  },

  setRow: (row: Record<string, string>) => {
    set({ row });
  },

  fetchColumns: async () => {
    const { db, table } = get();

    if (!db || !table) {
      return;
    }

    const columns = await fetch(
      `${API_URL}/api/databases/${db}/tables/${table}/columns`,
    ).then((res) => res.json());

    set({ columns });
  },

  fetchRows: async () => {
    const { db, table, page } = get();
    if (!db || !table) {
      return;
    }

    const rows = await fetch(
      `${API_URL}/api/databases/${db}/tables/${table}/rows?page=${page}&limit=20`,
    ).then((res) => res.json());

    set({ rows: rows.items, totalPages: rows.totalPages });
  },
}));
