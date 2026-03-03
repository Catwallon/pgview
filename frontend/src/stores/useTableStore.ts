import { create } from "zustand";

export interface TableState {
  dbName: string;
  tableName: string;
  columns: any[];
  rows: any[];
  setTable: (dbName: string, tableName: string) => Promise<void>;
}

export const useTableStore = create<TableState>((set) => ({
  dbName: "",
  tableName: "",
  columns: [],
  rows: [],

  setTable: async (dbName: string, tableName: string) => {
    set({ dbName, tableName });

    const API_URL =
      import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

    const columnsRes = await fetch(
      `${API_URL}/api/databases/${dbName}/tables/${tableName}/columns`,
    );
    const columns = await columnsRes.json();

    const rowResponse = await fetch(
      `${API_URL}/api/databases/${dbName}/tables/${tableName}/rows`,
    );
    const rows = await rowResponse.json();

    set({ columns, rows });
  },
}));
