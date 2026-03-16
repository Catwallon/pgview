import { DatabaseTree } from "@/components/features/database/DatabaseTree";
import { RowList } from "../features/database/RowList";
import { RowEditor } from "../features/database/RowEditor";
import { useState } from "react";
import { RowPagination } from "../features/database/RowPagination";
import { useAppStore } from "../../stores/useAppStore";
import Logo from "../../../public/icon.svg";
import { RowSearch } from "../features/database/RowSearch";

export function AppLayout() {
  const [openRowEditor, setOpenRowEditor] = useState(false);
  const table = useAppStore((state) => state.table);
  const rows = useAppStore((state) => state.rows);
  const totalRows = useAppStore((state) => state.totalRows);

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
            <div className="p-4">
              <RowSearch />
            </div>
            <p className="ml-2 mb-2 text-xs muted-foreground">
              Showing {rows.length} of {totalRows} rows
            </p>
            <div className="border-b" />
            <RowList setOpenRowEditor={setOpenRowEditor} />
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
      <RowEditor
        openRowEditor={openRowEditor}
        setOpenRowEditor={setOpenRowEditor}
      />
    </div>
  );
}
