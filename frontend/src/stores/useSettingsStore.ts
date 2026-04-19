import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  darkMode: boolean;
  inputMode: "vscode" | "vim";
  setDarkMode: (darkMode: boolean) => void;
  setInputMode: (inputMode: "vscode" | "vim") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      inputMode: "vscode",
      setDarkMode: (darkMode) => set({ darkMode }),
      setInputMode: (inputMode) => set({ inputMode }),
    }),
    { name: "pgview-settings" },
  ),
);
