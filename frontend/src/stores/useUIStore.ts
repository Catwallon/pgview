import { create } from "zustand";

interface UIState {
  openRowEditor: boolean;
  openRowCreator: boolean;
  setOpenRowEditor: (open: boolean) => void;
  setOpenRowCreator: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  openRowEditor: false,
  openRowCreator: false,

  setOpenRowEditor: (open: boolean) => {
    set({ openRowEditor: open });
  },

  setOpenRowCreator: (open: boolean) => {
    set({ openRowCreator: open });
  },
}));
