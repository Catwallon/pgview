import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetTable } from "@/lib/api/database";

export const useTable = (dbName: string | null, tableName: string | null) => {
  return useQuery({
    queryKey: ["tables", dbName, tableName],
    queryFn: () => fetchGetTable(dbName!, tableName!),
    enabled: !!dbName && !!tableName,
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: keepPreviousData,
  });
};
