import { DatabaseTree } from "@/components/DatabaseTree";
import { RowList } from "@/components/RowList";
import { RowPagination } from "@/components/RowPagination";
import { useAppStore } from "@/stores/useAppStore";
import Logo from "@/assets/logo.svg";
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
      rowId: state.rowId,
      page: state.page,
      limit: state.limit,
      query: state.query,
      sort: state.sort,
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
    <div className="flex h-screen">
      <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar flex flex-col">
        <div className="flex items-center ml-4 gap-2 my-4">
          <img src={Logo} alt="logo" className="w-12 h-12 dark:invert" />
          <h1 className="text-4xl font-semibold italic tracking-tight">
            PGVIEW
          </h1>
        </div>
        <div className="mb-4 border-t" />
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
          <a
            className="text-xs text-gray-400"
            href="https://github.com/catwallon/pgview"
          >
            {import.meta.env.VITE_PGVIEW_VERSION} · Made by Catwallon
          </a>
        </div>
      </nav>
      <main className="ml-64 min-w-0 flex-1 bg-background">
        {tableName ? (
          <>
            <Toolbar />
            <p className="ml-2 mb-2 text-xs muted-foreground">
              Showing {rows.data?.items.length} of {rows.data?.totalItems} rows
            </p>
            <div className="border-b" />
            <div
              className="flex flex-col"
              style={{ height: "calc(100vh - 160px)" }}
            >
              <RowList />
            </div>
            <div className="my-4">
              <RowPagination visiblePageCount={5} />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl text-gray-500">
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
