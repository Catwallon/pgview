import { create } from "zustand";

interface UIState {
  openRowEditor: boolean;
  openRowCreator: boolean;
  openSettings: boolean;
  setOpenRowEditor: (open: boolean) => void;
  setOpenRowCreator: (open: boolean) => void;
  setOpenSettings: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  openRowEditor: false,
  openRowCreator: false,
  openSettings: false,

  setOpenRowEditor: (open: boolean) => {
    set({ openRowEditor: open });
  },

  setOpenRowCreator: (open: boolean) => {
    set({ openRowCreator: open });
  },

  setOpenSettings: (open: boolean) => {
    set({ openSettings: open });
  },
}));
