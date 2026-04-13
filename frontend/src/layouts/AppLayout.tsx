import { DatabaseTree } from "@/components/DatabaseTree";
import { RowList } from "@/components/RowList";
import { RowPagination } from "@/components/RowPagination";
import { useAppStore } from "@/stores/useAppStore";
import Logo from "@/assets/logo.svg";
import { RowSearch } from "@/components/RowSearch";
import { Button } from "@/components/ui/button";
import { useRows } from "@/hooks/useRows";
import { useUIStore } from "@/stores/useUIStore";
import { Plus, RefreshCw, Settings } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";
import { SettingsDialog } from "@/components/SettingsDialog";
import { RowDialog } from "@/components/RowDialog";
import { LoadingButton } from "@/components/LoadingButton";

export function AppLayout() {
  const setOpenRowDialog = useUIStore((state) => state.setOpenRowDialog);
  const setRowDialogMode = useUIStore((state) => state.setRowDialogMode);
  const setOpenSettings = useUIStore((state) => state.setOpenSettings);
  const dbName = useAppStore((state) => state.dbName);
  const tableName = useAppStore((state) => state.tableName);
  const page = useAppStore((state) => state.page);
  const query = useAppStore((state) => state.query);
  const rows = useRows(dbName, tableName, page, query);
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    if (!dbName || !tableName) {
      return;
    }

    setIsRefreshing(true);
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["rows", dbName, tableName],
      }),
      queryClient.invalidateQueries({
        queryKey: ["columns", dbName, tableName],
      }),
    ]).then(() => {
      setIsRefreshing(false);
      toast.success("Table refreshed");
    });
  }

  return (
    <div className="flex min-h-screen">
      <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-gray-50 flex flex-col">
        <div className="flex items-center ml-4 gap-2 my-4">
          <img src={Logo} alt="logo" className="w-12 h-12" />
          <h1 className="text-4xl font-semibold italic tracking-tight">
            PGVIEW
          </h1>
        </div>
        <div className="mb-4 border-t" />
        <DatabaseTree />
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
      <main className="ml-64 min-w-0 flex-1 bg-white">
        {tableName ? (
          <>
            <div className="p-4 flex gap-2">
              <RowSearch />
              <Button
                onClick={() => {
                  setRowDialogMode("insert");
                  setOpenRowDialog(true);
                }}
              >
                <Plus />
                Insert
              </Button>
              <LoadingButton
                className="w-26"
                variant="outline"
                loading={isRefreshing}
                onClick={handleRefresh}
              >
                <RefreshCw />
                Refresh
              </LoadingButton>
            </div>
            <p className="ml-2 mb-2 text-xs muted-foreground">
              Showing {rows.data?.items.length} of {rows.data?.totalItems} rows
            </p>
            <div className="border-b" />
            <div
              className="border-b flex flex-col"
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
