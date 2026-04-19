import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetRows } from "@/lib/api/database";

export const useRows = (
  dbName: string | null,
  tableName: string | null,
  page: number,
  limit: number,
  query?: string,
  sort?: { column: string; direction: "asc" | "desc" },
) => {
  return useQuery({
    queryKey: ["rows", dbName, tableName, page, limit, query, sort],
    queryFn: () => fetchGetRows(dbName!, tableName!, page, limit, query, sort),
    enabled: !!dbName && !!tableName,
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: keepPreviousData,
  });
};
