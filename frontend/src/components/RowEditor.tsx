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
import { useRef, useState } from "react";
import { getJsonSchemaForPostgresType } from "@/utils/postgresJsonSchema";
import { useColumns } from "@/hooks/useColumns";
import { useUIStore } from "@/stores/useUIStore";
import { useEditRow } from "@/hooks/useEditRow";

export function RowEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [hasErrors, setHasErrors] = useState(false);
  const openRowEditor = useUIStore((state) => state.openRowEditor);
  const setOpenRowEditor = useUIStore((state) => state.setOpenRowEditor);
  const database = useAppStore((state) => state.database);
  const table = useAppStore((state) => state.table);
  const row = useAppStore((state) => state.row);
  const { data: columns } = useColumns();
  const editRow = useEditRow();

  function edit() {
    if (!database || !table || !row || !editorRef.current) {
      return;
    }

    editRow.mutate(
      {
        database,
        table,
        id: row.id,
        data: JSON.parse(editorRef.current.getValue()),
      },
      {
        onSuccess: () => setOpenRowEditor(false),
      },
    );
  }

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;

    if (!columns) return null;

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
              columns.map((col) => [
                col.name,
                getJsonSchemaForPostgresType(col.type, col.nullable),
              ]),
            ),
            required: columns
              .filter((col) => !col.nullable)
              .map((col) => col.name),
            additionalProperties: false,
          },
        },
      ],
    });

    const markers = monaco.editor.getModelMarkers();
    const errors = markers.filter((m: editor.IMarker) => m.severity === 8);
    setHasErrors(errors.length > 0);
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
            onMount={handleMount}
            onValidate={(markers) => {
              const errors = markers.filter((m) => m.severity === 8);
              setHasErrors(errors.length > 0);
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
        <Button className="mt-4 ml-auto" onClick={edit} disabled={hasErrors}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
