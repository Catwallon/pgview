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
import { useEditRow } from "@/hooks/useEditRow";
import { useDeleteRow } from "@/hooks/useDeleteRow";
import { Spinner } from "./ui/spinner";
import { schemaFromColumns } from "@/utils/schemaFromColumns";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert } from "lucide-react";

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
  const deleteRow = useDeleteRow();

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
        onSuccess: () => {
          setOpenRowEditor(false);
          deleteRow.reset();
        },
      },
    );
  }

  function delete_() {
    if (!database || !table || !row || !editorRef.current) {
      return;
    }

    deleteRow.mutate(
      {
        database,
        table,
        id: row.id,
      },
      {
        onSuccess: () => {
          setOpenRowEditor(false);
          editRow.reset();
        },
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
          schema: schemaFromColumns(columns),
        },
      ],
    });

    const markers = monaco.editor.getModelMarkers();
    const errors = markers.filter((m: editor.IMarker) => m.severity === 8);
    setHasErrors(errors.length > 0);
  }

  return (
    <Dialog
      open={openRowEditor}
      onOpenChange={(open) => {
        if (!open) {
          editRow.reset();
          deleteRow.reset();
        }
        setOpenRowEditor(open);
      }}
    >
      <DialogContent className="w-130">
        <DialogHeader>
          <DialogTitle>Edit row</DialogTitle>
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
        {editRow.error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {editRow.error.message.charAt(0).toUpperCase() +
                editRow.error.message.slice(1)}
            </AlertDescription>
          </Alert>
        )}
        {deleteRow.error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {deleteRow.error.message.charAt(0).toUpperCase() +
                deleteRow.error.message.slice(1)}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-between mt-4 ">
          <Button
            variant="secondary"
            className="w-20"
            onClick={delete_}
            disabled={deleteRow.isPending}
          >
            Delete
          </Button>
          <Button
            className="w-20"
            onClick={edit}
            disabled={hasErrors || editRow.isPending}
          >
            {editRow.isPending ? <Spinner /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
