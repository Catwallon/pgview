import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetRows } from "@/lib/api/database";

export const useRows = (
  dbName: string | null,
  tableName: string | null,
  page: number,
  limit: number,
  query: string,
) => {
  return useQuery({
    queryKey: ["rows", dbName, tableName, page, limit, query],
    queryFn: () => fetchGetRows(dbName!, tableName!, page, limit, query),
    enabled: !!dbName && !!tableName,
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: keepPreviousData,
  });
};
