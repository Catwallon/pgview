import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetTables } from "@/lib/api/database";

export const useTables = (dbName: string | null) => {
  return useQuery({
    queryKey: ["tables", dbName],
    queryFn: () => fetchGetTables(dbName!),
    enabled: !!dbName,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
  });
};
