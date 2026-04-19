import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useAppStore } from "@/stores/useAppStore";
import { useShallow } from "zustand/shallow";
import { useTable } from "@/hooks/useTable";
import { useUIStore } from "@/stores/useUIStore";
import { useUpdateRows } from "@/hooks/useUpdateRows";
import { useDeleteRows } from "@/hooks/useDeleteRows";
import { schemaFromColumns } from "@/utils/schemaFromColumns";
import { Alert, AlertDescription, AlertTitle } from "./shadcn-ui/alert";
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
  stickyScroll: {
    enabled: false,
  },
  scrollbar: {
    useShadows: false,
    alwaysConsumeMouseWheel: false,
    vertical: "hidden",
    horizontal: "hidden",
  },
};

export function RowDialog() {
  const openRowDialog = useUIStore((state) => state.openRowDialog);
  const setOpenRowDialog = useUIStore((state) => state.setOpenRowDialog);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const { dbName, tableName, rowId, page, limit, query, sort } = useAppStore(
    useShallow((state) => ({
      dbName: state.dbName,
      tableName: state.tableName,
      rowId: state.rowId,
      page: state.page,
      limit: state.limit,
      query: state.query,
      sort: state.sort,
    })),
  );
  const { data: table } = useTable(dbName, tableName);
  const { data: rows } = useRows(
    dbName,
    tableName,
    page,
    limit,
    query,
    sort ? sort : undefined,
  );
  const insertRow = useInsertRow();
  const updateRow = useUpdateRows();
  const deleteRow = useDeleteRows();
  const inputMode = useSettingsStore((state) => state.inputMode);
  const rowDialogMode = useUIStore((state) => state.rowDialogMode);
  const isInsert = rowDialogMode === "insert";
  const row = findRow(rows?.items ?? [], rowId ?? {});
  const darkMode = useSettingsStore((state) => state.darkMode);

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

    monaco.editor.defineTheme("custom", {
      base: darkMode ? "vs-dark" : "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": darkMode ? "#0a0a0a" : "#ffffff",
      },
    });

    monaco.editor.setTheme("custom");

    const updateHeight = () => {
      const contentHeight = editor.getContentHeight();
      if (containerRef.current) {
        containerRef.current.style.height = `${contentHeight}px`;
        editor.layout();
      }
    };

    editor.onDidContentSizeChange(updateHeight);
    updateHeight();

    if (inputMode === "vim") {
      initVimMode(editor);
    }

    editorRef.current?.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
      () => {},
    );

    editorRef.current?.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH,
      () => {},
    );

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
        className="w-140 flex flex-col h-160"
      >
        <DialogHeader>
          <DialogTitle>{isInsert ? "Insert" : "Edit"} row</DialogTitle>
        </DialogHeader>
        <div className="border rounded-xl p-4 flex-1 min-h-0">
          <div className="overflow-y-auto overflow-x-hidden h-full">
            <div ref={containerRef}>
              <Editor
                key={row ? JSON.stringify(rowId) : "empty"}
                onMount={handleMount}
                onValidate={(markers) => {
                  const errors = markers.filter((m) => m.severity === 8);
                  setHasValidationErrors(errors.length > 0);
                }}
                defaultLanguage="json"
                defaultValue={
                  isInsert
                    ? defaultFromColumns(table?.columns ?? [])
                    : JSON.stringify(row, null, 2)
                }
                options={EDITOR_OPTIONS}
              />
            </div>
          </div>
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
