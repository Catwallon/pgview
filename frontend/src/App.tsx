import NavigationTree from "@/components/navigation-tree";
import { TableList } from "./components/table-list";
import { RowEditor } from "./components/row-editor";
import { useState } from "react";

function App() {
  const [openRowEditor, setOpenRowEditor] = useState(false);

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
        <TableList setOpenRowEditor={setOpenRowEditor} />
      </main>
      <RowEditor
        openRowEditor={openRowEditor}
        setOpenRowEditor={setOpenRowEditor}
      />
    </div>
  );
}

export default App;
