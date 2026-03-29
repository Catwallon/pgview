import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/stores/useAppStore";
import { fetchGetColumns } from "@/lib/api/database";

export const useColumns = () => {
  const { database, table } = useAppStore();

  return useQuery({
    queryKey: ["columns", database, table],
    queryFn: () => fetchGetColumns(database!, table!),
    enabled: !!database && !!table,
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: keepPreviousData,
  });
};
