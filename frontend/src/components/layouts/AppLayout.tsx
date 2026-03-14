import { DatabaseTree } from "@/components/features/database/DatabaseTree";
import { RowList } from "../features/database/RowList";
import { RowEditor } from "../features/database/RowEditor";
import { useState } from "react";
import { RowPagination } from "../features/database/RowPagination";
import { useAppStore } from "../../stores/useAppStore";

export function AppLayout() {
  const [openRowEditor, setOpenRowEditor] = useState(false);
  const table = useAppStore((state) => state.table);

  return (
    <div className="flex min-h-screen">
      <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-gray-50">
        <h1 className="my-4 text-center scroll-m-20 text-4xl font-semibold italic tracking-tight text-balance">
          PGVIEW
        </h1>
        <div className="mb-4 border-t" />
        <DatabaseTree />
      </nav>
      <main className="ml-64 flex-1 bg-white">
        {table ? (
          <>
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
