import { fetchEditRow } from "@/lib/api/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useEditRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      database,
      table,
      id,
      data,
    }: {
      database: string;
      table: string;
      id: string;
      data: Record<string, string>;
    }) => fetchEditRow(database, table, id, data),
    onSuccess: (_, { database }) => {
      queryClient.invalidateQueries({ queryKey: ["rows", database] });
      toast.success("Row updated successfully");
    },
  });
}
