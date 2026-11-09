"use client";

import { useQuery } from "@tanstack/react-query";
import { coinService } from "@/services/coinService";
import type { Coin } from "@/type";

export function useCoinDetail(id: string) {
  const query = useQuery<Coin | null, Error>({
    queryKey: ["coin", id],
    queryFn: () => coinService.getCoinById(id),
    staleTime: 60_000,
    enabled: Boolean(id),
  });

  return {
    coin: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

