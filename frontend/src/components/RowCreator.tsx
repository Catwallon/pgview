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
import { fetchCreateRow } from "@/lib/api/database";
import { useRef, useState } from "react";
import { getJsonSchemaForPostgresType } from "@/utils/postgresJsonSchema";
import { generateDefaultValueJsonFromColumns } from "@/utils/rowDefaultJson";
import { useColumns } from "@/hooks/useColumns";
import { useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/stores/useUIStore";

export function RowCreator() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [hasErrors, setHasErrors] = useState(false);

  const openRowCreator = useUIStore((state) => state.openRowCreator);
  const setOpenRowCreator = useUIStore((state) => state.setOpenRowCreator);

  const database = useAppStore((state) => state.database);
  const table = useAppStore((state) => state.table);
  const { data: columns } = useColumns();
  const queryClient = useQueryClient();

  async function insert() {
    if (!database || !table || !editorRef.current) {
      return;
    }

    await fetchCreateRow(
      database,
      table,
      JSON.parse(editorRef.current.getValue()),
    );

    queryClient.invalidateQueries({ queryKey: ["rows", database, table] });
    setOpenRowCreator(false);
  }

  if (!columns) return null;

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
  }

  return (
    <Dialog open={openRowCreator} onOpenChange={setOpenRowCreator}>
      <DialogContent className="w-130 h-150">
        <DialogHeader>
          <DialogTitle>Insert row</DialogTitle>
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
            defaultValue={generateDefaultValueJsonFromColumns(columns)}
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
        <Button className="mt-4 ml-auto" onClick={insert} disabled={hasErrors}>
          Insert
        </Button>
      </DialogContent>
    </Dialog>
  );
}
