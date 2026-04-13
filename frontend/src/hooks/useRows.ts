import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetRows } from "@/lib/api/database";

export const useRows = (
  dbName: string | null,
  tableName: string | null,
  page: number,
  query: string,
) => {
  return useQuery({
    queryKey: ["rows", dbName, tableName, page, query],
    queryFn: () => fetchGetRows(dbName!, tableName!, 16, page, query),
    enabled: !!dbName && !!tableName,
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: keepPreviousData,
  });
};
