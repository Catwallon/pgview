import { DatabaseTree } from "@/components/DatabaseTree";
import { RowList } from "@/components/RowList";
import { RowPagination } from "@/components/RowPagination";
import { useAppStore } from "@/stores/useAppStore";
import Logo from "@/assets/logo.svg";
import Github from "@/assets/github.svg";
import { Button } from "@/components/shadcn-ui/button";
import { useRows } from "@/hooks/useRows";
import { useUIStore } from "@/stores/useUIStore";
import { Settings } from "lucide-react";
import { Toaster } from "@/components/shadcn-ui/sonner";
import { SettingsDialog } from "@/components/SettingsDialog";
import { RowDialog } from "@/components/RowDialog";
import { useShallow } from "zustand/shallow";
import { Toolbar } from "@/components/Toolbar";

export function AppLayout() {
  const setOpenSettings = useUIStore((state) => state.setOpenSettings);
  const { dbName, tableName, page, limit, query } = useAppStore(
    useShallow((state) => ({
      dbName: state.dbName,
      tableName: state.tableName,
      page: state.page,
      limit: state.limit,
      query: state.query,
    })),
  );
  const rows = useRows(
    dbName,
    tableName,
    page,
    limit,
    query ? query : undefined,
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <nav className="shrink-0 w-64 border-r bg-sidebar flex flex-col">
        <div className="flex items-center p-4 gap-2 mb-4 border-b">
          <img src={Logo} alt="logo" className="w-12 h-12 dark:invert" />
          <h1 className="text-4xl font-semibold italic tracking-tight">
            PGVIEW
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DatabaseTree />
        </div>
        <div className="mt-auto p-4 border-t flex flex-col gap-2 items-center">
          <Button
            className="self-stretch"
            variant="outline"
            onClick={() => setOpenSettings(true)}
          >
            <Settings /> Settings
          </Button>
          <div className="flex items-center gap-1">
            <a
              className="flex items-center gap-1 text-xs text-muted-foreground"
              href="https://github.com/catwallon/pgview"
            >
              <img
                src={Github}
                alt="github"
                className="w-3.5 h-3.5 dark:invert opacity-50"
              />
              {"GitHub  ·  "}
            </a>
            <p className="text-xs text-muted-foreground">
              {import.meta.env.VITE_PGVIEW_VERSION}
            </p>
          </div>
        </div>
      </nav>
      <main className="min-w-0  min-h-0 flex flex-col overflow-hidden flex-1 bg-background">
        {tableName ? (
          <>
            <Toolbar />
            <p className="ml-2 mb-2 text-xs text-muted-foreground">
              Showing {rows.data?.items.length} of {rows.data?.totalItems} rows
            </p>
            <RowList />
            <div className="my-4">
              <RowPagination visiblePageCount={5} />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl text-muted-foreground">
              Select a table to view its data
            </p>
          </div>
        )}
      </main>
      <RowDialog />
      <SettingsDialog />
      <Toaster toastOptions={{ classNames: { toast: "!w-fit" } }} />
    </div>
  );
}
