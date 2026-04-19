import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-ui/dialog";
import { useUIStore } from "@/stores/useUIStore";
import { RadioGroup, RadioGroupItem } from "./shadcn-ui/radio-group";
import { Label } from "./shadcn-ui/label";
import { Button } from "./shadcn-ui/button";
import { useSettingsStore } from "@/stores/useSettingsStore";
export function SettingsDialog() {
  const openSettings = useUIStore((state) => state.openSettings);
  const setOpenSettings = useUIStore((state) => state.setOpenSettings);
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const inputMode = useSettingsStore((state) => state.inputMode);
  const setInputMode = useSettingsStore((state) => state.setInputMode);

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setTheme(value);
  };

  const handleInputModeChange = (value: "vscode" | "vim") => {
    setInputMode(value);
  };

  return (
    <Dialog
      open={openSettings}
      onOpenChange={(open) => {
        setOpenSettings(open);
      }}
    >
      <DialogContent className="w-100 flex flex-col h-100 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Theme
          </p>
          <RadioGroup
            onValueChange={handleThemeChange}
            defaultValue={theme}
            className="w-fit"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="system" id="r1" />
              <Label htmlFor="r1">System (default)</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="light" id="r2" />
              <Label htmlFor="r2">Light</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="dark" id="r3" />
              <Label htmlFor="r3">Dark</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Input mode
          </p>
          <RadioGroup
            onValueChange={handleInputModeChange}
            defaultValue={inputMode}
            className="w-fit"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="vscode" id="r1" />
              <Label htmlFor="r1">VS Code (default)</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="vim" id="r2" />
              <Label htmlFor="r2">Vim</Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          variant="outline"
          className="mt-auto self-end"
          onClick={() => setOpenSettings(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
