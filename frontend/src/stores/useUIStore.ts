import { create } from "zustand";

interface UIState {
  openRowDialog: boolean;
  rowDialogMode: "insert" | "edit";
  openSettings: boolean;
  setOpenRowDialog: (open: boolean) => void;
  setRowDialogMode: (mode: "insert" | "edit") => void;
  setOpenSettings: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  openRowDialog: false,
  rowDialogMode: "insert",
  openSettings: false,

  setOpenRowDialog: (open: boolean) => {
    set({ openRowDialog: open });
  },

  setRowDialogMode: (mode: "insert" | "edit") => {
    set({ rowDialogMode: mode });
  },

  setOpenSettings: (open: boolean) => {
    set({ openSettings: open });
  },
}));
