import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/useAppStore";
import { fetchEditRow } from "@/lib/api/database";
import { useRef } from "react";

export function RowEditor({
  openRowEditor,
  setOpenRowEditor,
}: {
  openRowEditor: boolean;
  setOpenRowEditor: (v: boolean) => void;
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const db = useAppStore((state) => state.db);
  const table = useAppStore((state) => state.table);
  const row = useAppStore((state) => state.row);
  const page = useAppStore((state) => state.page);

  const setPage = useAppStore((state) => state.setPage);

  async function save() {
    if (!db || !table || !row || !editorRef.current) {
      return;
    }

    await fetchEditRow(
      db,
      table,
      row.id,
      JSON.parse(editorRef.current?.getValue()),
    );
    setPage(page);

    setOpenRowEditor(false);
  }

  return (
    <Dialog open={openRowEditor} onOpenChange={setOpenRowEditor}>
      <DialogContent className="w-150 h-150">
        <DialogHeader>
          <DialogTitle>Edit row</DialogTitle>
        </DialogHeader>
        <Editor
          onMount={(editor) => (editorRef.current = editor)}
          theme="vs-dark"
          defaultLanguage="json"
          defaultValue={JSON.stringify(row, null, 2)}
          options={{
            glyphMargin: false,
            folding: false,
            lineNumbers: "off",
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            minimap: { enabled: false },
            overviewRulerBorder: false,
          }}
        />
        <Button className="mt-4 ml-auto" onClick={() => save()}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
