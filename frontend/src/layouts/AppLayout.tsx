import { DatabaseTree } from "@/components/DatabaseTree";
import { RowList } from "@/components/RowList";
import { RowEditor } from "@/components/RowEditor";
import { RowPagination } from "@/components/RowPagination";
import { useAppStore } from "@/stores/useAppStore";
import Logo from "@/assets/logo.svg";
import { RowSearch } from "@/components/RowSearch";
import { Button } from "@/components/ui/button";
import { RowCreator } from "@/components/RowCreator";
import { useRows } from "@/hooks/useRows";
import { useUIStore } from "@/stores/useUIStore";
import { Plus, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function AppLayout() {
  const setOpenRowCreator = useUIStore((state) => state.setOpenRowCreator);
  const database = useAppStore((state) => state.database);
  const table = useAppStore((state) => state.table);
  const queryClient = useQueryClient();

  const { data: rows } = useRows();

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
        <div className="mt-auto p-4 border-t">
          <a
            className="text-xs text-gray-400"
            href="https://github.com/catwallon/pgview"
          >
            {import.meta.env.VITE_PGVIEW_VERSION} · Made by Catwallon
          </a>
        </div>
      </nav>
      <main className="ml-64 min-w-0 flex-1 bg-white">
        {table ? (
          <>
            <div className="p-4 flex gap-2">
              <RowSearch />
              <Button onClick={() => setOpenRowCreator(true)}>
                <Plus />
                Insert
              </Button>
              <Button
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["rows", database, table],
                  });
                  toast.success("Data refreshed");
                }}
              >
                <RefreshCw />
                Refresh
              </Button>
            </div>
            <p className="ml-2 mb-2 text-xs muted-foreground">
              Showing {rows?.items.length} of {rows?.totalItems} rows
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
      <RowEditor />
      <RowCreator />
      <Toaster toastOptions={{ classNames: { toast: "!w-fit" } }} />
    </div>
  );
}
