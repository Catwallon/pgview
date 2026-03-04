import { create } from "zustand";

export interface RowState {
  row: Record<string, any>;
  setRow: (row: Record<string, any>) => Promise<void>;
}

export const useRowStore = create<RowState>((set) => ({
  row: {},

  setRow: async (row: Record<string, any>) => {
    set({ row });
  },
}));
