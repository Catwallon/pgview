import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useViewerStore } from "@/stores/useViewerStore";

export function RowEditor({
  openRowEditor,
  setOpenRowEditor,
}: {
  openRowEditor: boolean;
  setOpenRowEditor: (v: boolean) => void;
}) {
  const row = useViewerStore((state) => state.row);

  return (
    <Dialog open={openRowEditor} onOpenChange={setOpenRowEditor}>
      <DialogContent className="w-150 h-150">
        <DialogHeader>
          <DialogTitle>Edit row</DialogTitle>
        </DialogHeader>
        <Editor
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
        <Button
          className="mt-4 ml-auto"
          onClick={() => setOpenRowEditor(false)}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
