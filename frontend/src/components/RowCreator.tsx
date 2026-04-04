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
import { useColumns } from "@/hooks/useColumns";
import { useUIStore } from "@/stores/useUIStore";
import { useInsertRow } from "@/hooks/useInsertRow";
import { Spinner } from "./ui/spinner";
import { schemaFromColumns } from "@/utils/schemaFromColumns";
import { defaultFromColumns } from "@/utils/defaultFromColumns";

export function RowCreator() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [hasErrors, setHasErrors] = useState(false);
  const openRowCreator = useUIStore((state) => state.openRowCreator);
  const setOpenRowCreator = useUIStore((state) => state.setOpenRowCreator);
  const database = useAppStore((state) => state.database);
  const table = useAppStore((state) => state.table);
  const { data: columns } = useColumns();
  const insertRow = useInsertRow();

  function insert() {
    if (!database || !table || !editorRef.current) {
      return;
    }

    insertRow.mutate(
      {
        database,
        table,
        data: JSON.parse(editorRef.current.getValue()),
      },
      {
        onSuccess: () => setOpenRowCreator(false),
      },
    );
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
          schema: schemaFromColumns(columns),
        },
      ],
    });
  }

  return (
    <Dialog
      open={openRowCreator}
      onOpenChange={(open) => {
        if (!open) insertRow.reset();
        setOpenRowCreator(open);
      }}
    >
      <DialogContent className="w-130">
        <DialogHeader>
          <DialogTitle>Insert row</DialogTitle>
        </DialogHeader>
        <div className="border rounded-xl p-4 h-100">
          <Editor
            height="100%"
            onMount={handleMount}
            onValidate={(markers) => {
              const errors = markers.filter((m) => m.severity === 8);
              setHasErrors(errors.length > 0);
            }}
            theme="vs"
            defaultLanguage="json"
            defaultValue={defaultFromColumns(columns)}
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
        {insertRow.error && (
          <p className="text-red-800">{insertRow.error.message}</p>
        )}
        <Button
          className="mt-4 ml-auto w-20"
          onClick={insert}
          disabled={hasErrors || insertRow.isPending}
        >
          {insertRow.isPending ? <Spinner /> : "Insert"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
