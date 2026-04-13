import { fetchInsertRow } from "@/lib/api/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useInsertRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dbName,
      tableName,
      data,
    }: {
      dbName: string;
      tableName: string;
      data: Record<string, string>;
    }) => fetchInsertRow(dbName, tableName, data),
    onSuccess: (_, { dbName, tableName }) => {
      queryClient.invalidateQueries({
        queryKey: ["rows", dbName, tableName],
      });
      toast.success("Row inserted successfully");
    },
  });
}
