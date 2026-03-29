import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchGetDatabases } from "@/lib/api/database";

export const useDatabases = () => {
  return useQuery({
    queryKey: ["databases"],
    queryFn: () => fetchGetDatabases(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
  });
};
