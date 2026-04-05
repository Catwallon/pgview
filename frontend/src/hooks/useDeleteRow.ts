import { fetchDeleteRow } from "@/lib/api/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      database,
      table,
      id,
    }: {
      database: string;
      table: string;
      id: string;
    }) => fetchDeleteRow(database, table, id),
    onSuccess: (_, { database }) => {
      queryClient.invalidateQueries({ queryKey: ["rows", database] });
      toast.success("Row deleted successfully");
    },
  });
}
