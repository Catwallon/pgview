import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor, { type Monaco } from "@monaco-editor/react";
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
  const columns = useAppStore((state) => state.columns);

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

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: "error",
      schemas: [
        {
          uri: "https://schema.json",
          fileMatch: ["*"],
          schema: {
            type: "object",
            properties: Object.fromEntries(
              columns.map((col) => [col.name, { type: "string" }]),
            ),
            required: ["name"],
            additionalProperties: false,
          },
        },
      ],
    });
  }

  return (
    <Dialog open={openRowEditor} onOpenChange={setOpenRowEditor}>
      <DialogContent className="w-130 h-150">
        <DialogHeader>
          <DialogTitle>Edit row</DialogTitle>
        </DialogHeader>
        <div className="border rounded-xl p-4">
          <Editor
            height="100%"
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              handleMount(editor, monaco);
            }}
            theme="vs"
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
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <Button className="mt-4 ml-auto" onClick={() => save()}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
