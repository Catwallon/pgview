import { useEffect } from "react";
import { TooltipProvider } from "./components/shadcn-ui/tooltip";
import { AppLayout } from "./layouts/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSettingsStore } from "./stores/useSettingsStore";

const queryClient = new QueryClient();

function App() {
  const setDarkMode = useSettingsStore((state) => state.setDarkMode);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyDark = (isDark: boolean) => {
      setDarkMode(isDark);
      const favicon =
        document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (favicon) favicon.href = isDark ? "/logo-dark.svg" : "/logo.svg";
    };

    applyDark(media.matches);

    const handler = (e: MediaQueryListEvent) => applyDark(e.matches);
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, [setDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
