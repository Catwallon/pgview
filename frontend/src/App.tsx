import NavigationTree from "@/components/navigation-tree";
import { TableList } from "./components/table-list";
import { RowEditor } from "./components/row-editor";
import { useState } from "react";
import { TablePagination } from "./components/table-pagination";
import { useViewerStore } from "./stores/useViewerStore";

function App() {
  const [openRowEditor, setOpenRowEditor] = useState(false);
  const tableName = useViewerStore((state) => state.tableName);

  return (
    <div className="flex min-h-screen">
      <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-white">
        <h1 className="my-4 text-center scroll-m-20 text-4xl font-semibold italic tracking-tight text-balance">
          PGVIEW
        </h1>
        <div className="mb-4 border-t" />
        <NavigationTree />
      </nav>
      <main className="ml-64 flex-1 bg-gray-50">
        {tableName ? (
          <>
            <TableList setOpenRowEditor={setOpenRowEditor} />
            <div className="my-4">
              <TablePagination visiblePageCount={5} />
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

export default App;
