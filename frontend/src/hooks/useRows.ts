import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/stores/useAppStore";
import { fetchGetRows } from "@/lib/api/database";

export const useRows = () => {
  const { database, table, page, query } = useAppStore();

  return useQuery({
    queryKey: ["rows", database, table, page, query],
    queryFn: () => fetchGetRows(database!, table!, 16, page, query),
    enabled: !!database && !!table,
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: keepPreviousData,
  });
};
