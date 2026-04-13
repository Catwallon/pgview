import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useAppStore } from "@/stores/useAppStore";
import { useTable } from "@/hooks/useTable";
import { useUIStore } from "@/stores/useUIStore";
import { useUpdateRows } from "@/hooks/useUpdateRows";
import { useDeleteRows } from "@/hooks/useDeleteRows";
import { schemaFromColumns } from "@/utils/schemaFromColumns";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { initVimMode } from "monaco-vim";
import { useInsertRow } from "@/hooks/useInsertRow";
import { defaultFromColumns } from "@/utils/defaultFromColumns";
import { useRef, useState } from "react";
import { LoadingButton } from "./LoadingButton";
import { TooltipButton } from "./TooltipButton";
import { capitalize } from "@/utils/capitalize";
import { findRow } from "@/utils/findRow";
import { useRows } from "@/hooks/useRows";

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  folding: false,
  lineNumbers: "off",
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  renderLineHighlight: "none",
  guides: {
    indentation: false,
  },
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  wordWrap: "on",
  wrappingStrategy: "advanced",
  selectionHighlight: false,
  occurrencesHighlight: "off",
  overviewRulerLanes: 0,
};

export function RowDialog() {
  const openRowDialog = useUIStore((state) => state.openRowDialog);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const setOpenRowDialog = useUIStore((state) => state.setOpenRowDialog);
  const dbName = useAppStore((state) => state.dbName);
  const tableName = useAppStore((state) => state.tableName);
  const rowId = useAppStore((state) => state.rowId);
  const page = useAppStore((state) => state.page);
  const query = useAppStore((state) => state.query);
  const { data: table } = useTable(dbName, tableName);
  const { data: rows } = useRows(dbName, tableName, page, query);
  const updateRow = useUpdateRows();
  const deleteRow = useDeleteRows();
  const inputMode = useSettingsStore((state) => state.inputMode);
  const insertRow = useInsertRow();
  const rowDialogMode = useUIStore((state) => state.rowDialogMode);
  const isInsert = rowDialogMode === "insert";
  const row = findRow(rows?.items ?? [], rowId ?? {});

  function resetAll() {
    insertRow.reset();
    updateRow.reset();
    deleteRow.reset();
  }

  function handleInsert() {
    if (!dbName || !tableName || !editorRef.current) {
      return;
    }

    insertRow.mutate(
      {
        dbName,
        tableName,
        data: JSON.parse(editorRef.current.getValue()),
      },
      {
        onSuccess: () => {
          setOpenRowDialog(false);
          resetAll();
        },
      },
    );
  }

  function handleUpdate() {
    if (!dbName || !tableName || !rowId || !editorRef.current) {
      return;
    }

    updateRow.mutate(
      {
        dbName,
        tableName,
        rowId,
        data: JSON.parse(editorRef.current.getValue()),
      },
      {
        onSuccess: () => {
          setOpenRowDialog(false);
          resetAll();
        },
      },
    );
  }

  function handleDelete() {
    if (!dbName || !tableName || !rowId || !editorRef.current) {
      return;
    }

    deleteRow.mutate(
      {
        dbName,
        tableName,
        rowId,
      },
      {
        onSuccess: () => {
          setOpenRowDialog(false);
          resetAll();
        },
      },
    );
  }

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;

    if (inputMode === "vim") {
      initVimMode(editor);
    }

    if (!table?.columns) return;

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: "error",
      schemas: [
        {
          uri: "https://schema.json",
          fileMatch: ["*"],
          schema: schemaFromColumns(table.columns),
        },
      ],
    });

    const markers = monaco.editor.getModelMarkers();
    const errors = markers.filter((m: editor.IMarker) => m.severity === 8);
    setHasValidationErrors(errors.length > 0);
  }

  const pgError = updateRow.error ?? insertRow.error ?? deleteRow.error;

  return (
    <Dialog
      open={!!openRowDialog}
      onOpenChange={(open) => {
        if (!open) {
          setOpenRowDialog(false);
          resetAll();
        }
      }}
    >
      <DialogContent
        onEscapeKeyDown={(e) => {
          // Prevent closing the dialog with escape if in vim input mode, since it's used by vim input
          if (inputMode === "vim") e.preventDefault();
        }}
        className="w-140 flex flex-col h-160 overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>{isInsert ? "Insert" : "Edit"} row</DialogTitle>
        </DialogHeader>
        <div className="border rounded-xl p-4 h-full min-h-0 flex-1">
          <Editor
            key={row ? JSON.stringify(rowId) : "empty"}
            onMount={handleMount}
            onValidate={(markers) => {
              const errors = markers.filter((m) => m.severity === 8);
              setHasValidationErrors(errors.length > 0);
            }}
            theme="vs"
            defaultLanguage="json"
            defaultValue={
              isInsert
                ? defaultFromColumns(table?.columns ?? [])
                : JSON.stringify(row, null, 2)
            }
            options={EDITOR_OPTIONS}
          />
        </div>
        {pgError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{capitalize(pgError.message)}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-between mt-4 ">
          {!isInsert && (
            <LoadingButton
              variant="outline"
              className="w-20"
              onClick={handleDelete}
              loading={deleteRow.isPending}
            >
              Delete
            </LoadingButton>
          )}
          <TooltipButton
            className="w-20"
            tooltip="You have some errors in your JSON"
            disabled={hasValidationErrors}
            onClick={isInsert ? handleInsert : handleUpdate}
          >
            {isInsert ? "Insert" : "Save"}
          </TooltipButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
