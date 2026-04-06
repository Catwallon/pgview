import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useAppStore } from "@/stores/useAppStore";
import { useColumns } from "@/hooks/useColumns";
import { useUIStore } from "@/stores/useUIStore";
import { useUpdateRow } from "@/hooks/useUpdateRow";
import { useDeleteRow } from "@/hooks/useDeleteRow";
import { schemaFromColumns } from "@/utils/schemaFromColumns";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { initVimMode } from "monaco-vim";
import { useInsertRow } from "@/hooks/useInsertRow";
import { defaultFromColumns } from "@/utils/defaultFromColumns";
import { useRef, useState } from "react";
import { LoadingButton } from "./LoadingButton";

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
  const database = useAppStore((state) => state.database);
  const table = useAppStore((state) => state.table);
  const row = useAppStore((state) => state.row);
  const columns = useColumns();
  const updateRow = useUpdateRow();
  const deleteRow = useDeleteRow();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const inputMode = useSettingsStore((state) => state.inputMode);
  const insertRow = useInsertRow();
  const rowDialogMode = useUIStore((state) => state.rowDialogMode);
  const isInsert = rowDialogMode === "insert";

  function resetAll() {
    insertRow.reset();
    updateRow.reset();
    deleteRow.reset();
  }

  function handleInsert() {
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
        onSuccess: () => {
          setOpenRowDialog(false);
          resetAll();
        },
      },
    );
  }

  function handleUpdate() {
    if (!database || !table || !row || !editorRef.current) {
      return;
    }

    updateRow.mutate(
      {
        database,
        table,
        id: row.id,
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

    if (!columns.data) return;

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: "error",
      schemas: [
        {
          uri: "https://schema.json",
          fileMatch: ["*"],
          schema: schemaFromColumns(columns.data),
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
            onMount={handleMount}
            onValidate={(markers) => {
              const errors = markers.filter((m) => m.severity === 8);
              setHasValidationErrors(errors.length > 0);
            }}
            theme="vs"
            defaultLanguage="json"
            defaultValue={
              isInsert
                ? defaultFromColumns(columns.data ?? [])
                : JSON.stringify(row, null, 2)
            }
            options={EDITOR_OPTIONS}
          />
        </div>
        {pgError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {pgError.message.charAt(0).toUpperCase() +
                pgError.message.slice(1)}
            </AlertDescription>
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
          <Tooltip
            open={hasValidationErrors && tooltipOpen}
            onOpenChange={setTooltipOpen}
          >
            <TooltipTrigger asChild>
              <span
                className="inline-block cursor-not-allowed ml-auto"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
              >
                <LoadingButton
                  className="w-20"
                  loading={isInsert ? insertRow.isPending : updateRow.isPending}
                  disabled={hasValidationErrors}
                  onClick={isInsert ? handleInsert : handleUpdate}
                >
                  {isInsert ? "Insert" : "Save"}
                </LoadingButton>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>You have some errors in your JSON</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogContent>
    </Dialog>
  );
}
