import { useAppStore } from "@/stores/useAppStore";
import { RowSearch } from "@/components/RowSearch";
import { Button } from "@/components/shadcn-ui/button";
import { useUIStore } from "@/stores/useUIStore";
import { Plus, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingButton } from "@/components/LoadingButton";
import { useShallow } from "zustand/shallow";

export function Toolbar() {
  const setOpenRowDialog = useUIStore((state) => state.setOpenRowDialog);
  const setRowDialogMode = useUIStore((state) => state.setRowDialogMode);
  const { dbName, tableName } = useAppStore(
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
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    if (!dbName || !tableName) {
      return;
    }

    setIsRefreshing(true);
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["rows", dbName, tableName],
      }),
      queryClient.invalidateQueries({
        queryKey: ["columns", dbName, tableName],
      }),
    ]).then(() => {
      setIsRefreshing(false);
      toast.success("Table refreshed");
    });
  }

  return (
    <div className="p-4 flex gap-2">
      <RowSearch />
      <Button
        onClick={() => {
          setRowDialogMode("insert");
          setOpenRowDialog(true);
        }}
      >
        <Plus />
        Insert
      </Button>
      <LoadingButton
        className="w-26"
        variant="outline"
        loading={isRefreshing}
        onClick={handleRefresh}
      >
        <RefreshCw />
        Refresh
      </LoadingButton>
    </div>
  );
}
