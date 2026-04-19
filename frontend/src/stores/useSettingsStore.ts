import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  darkMode: boolean;
  theme: "light" | "dark" | "system";
  inputMode: "vscode" | "vim";
  setDarkMode: (darkMode: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setInputMode: (inputMode: "vscode" | "vim") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      theme: "system",
      inputMode: "vscode",
      setDarkMode: (darkMode) => set({ darkMode }),
      setTheme: (theme) => set({ theme }),
      setInputMode: (inputMode) => set({ inputMode }),
    }),
    { name: "pgview-settings" },
  ),
);
