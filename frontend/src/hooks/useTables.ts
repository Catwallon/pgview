import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetTables } from "@/lib/api/database";

export const useTables = (database: string) => {
  return useQuery({
    queryKey: ["tables", database],
    queryFn: () => fetchGetTables(database!),
    enabled: !!database,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
  });
};
