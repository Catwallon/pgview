import { fetchInsertRow } from "@/lib/api/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useInsertRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      database,
      table,
      data,
    }: {
      database: string;
      table: string;
      data: Record<string, string>;
    }) => fetchInsertRow(database, table, data),
    onSuccess: (_, { database, table }) => {
      queryClient.invalidateQueries({ queryKey: ["rows", database, table] });
      toast.success("Row inserted successfully");
    },
  });
}
