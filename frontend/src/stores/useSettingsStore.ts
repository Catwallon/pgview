import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  inputMode: "vscode" | "vim";
  setInputMode: (inputMode: "vscode" | "vim") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      inputMode: "vscode",
      setInputMode: (inputMode) => set({ inputMode }),
    }),
    { name: "pgview-settings" },
  ),
);
