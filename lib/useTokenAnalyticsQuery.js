import { useQuery } from "@tanstack/react-query";
import { fetchTokenAnalytics } from "./tokenAnalytics";

export function useTokenAnalyticsQuery(address) {
  return useQuery({
    queryKey: ["token-analytics", address?.toLowerCase()],
    queryFn: () => fetchTokenAnalytics(address),
    enabled: Boolean(address),
  });
}

