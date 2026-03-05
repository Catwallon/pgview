import { API_URL } from "@/config/api.config";
import { create } from "zustand";

export interface ViewerState {
  dbName: string | null;
  tableName: string | null;
  columns: { name: string }[];
  rows: Record<string, string>[];
  page: number;
  totalPages: number;
  row: Record<string, string> | null;
  setTable: (dbName: string, tableName: string) => void;
  setPage: (page: number) => void;
  setRow: (row: Record<string, string>) => void;
  fetchColumns: () => Promise<void>;
  fetchRows: () => Promise<void>;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  dbName: null,
  tableName: null,
  columns: [],
  rows: [],
  page: 1,
  totalPages: 1,
  row: null,

  setTable: (dbName: string, tableName: string) => {
    set({ dbName, tableName, page: 1, row: null });
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
    const { dbName, tableName } = get();

    if (!dbName || !tableName) {
      return;
    }

    const columns = await fetch(
      `${API_URL}/api/databases/${dbName}/tables/${tableName}/columns`,
    ).then((res) => res.json());

    set({ columns });
  },

  fetchRows: async () => {
    const { dbName, tableName, page } = get();
    if (!dbName || !tableName) {
      return;
    }

    const rows = await fetch(
      `${API_URL}/api/databases/${dbName}/tables/${tableName}/rows?page=${page}&limit=20`,
    ).then((res) => res.json());

    set({ rows: rows.items, totalPages: rows.totalPages });
  },
}));
