import { fetchUpdateRows } from "@/lib/api/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateRows() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dbName,
      tableName,
      rowId,
      data,
    }: {
      dbName: string;
      tableName: string;
      rowId: Record<string, string>;
      data: Record<string, string>;
    }) => fetchUpdateRows(dbName, tableName, rowId, data),
    onSuccess: (_, { dbName }) => {
      queryClient.invalidateQueries({ queryKey: ["rows", dbName] });
      toast.success("Row updated successfully");
    },
  });
}
