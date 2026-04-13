import { fetchDeleteRows } from "@/lib/api/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteRows() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dbName,
      tableName,
      rowId,
    }: {
      dbName: string;
      tableName: string;
      rowId: Record<string, string>;
    }) => fetchDeleteRows(dbName, tableName, rowId),
    onSuccess: (_, { dbName }) => {
      queryClient.invalidateQueries({ queryKey: ["rows", dbName] });
      toast.success("Row deleted successfully");
    },
  });
}
