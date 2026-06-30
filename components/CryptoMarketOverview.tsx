"use client";

import Image from "next/image";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklineCell } from "../components/sparkline-cell";
import { fetchCoins, formatCurrency } from "@/lib/coingecko";
import { Coin } from "@/type";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearch,
  setSortBy,
  setSortDirection,
  toggleSortDirection,
} from "@/store/marketSlice";

const pageSize = 10;

type SortableCoinKey =
  | "current_price"
  | "price_change_percentage_24h"
  | "market_cap"
  | "total_volume";

type HeaderConfig = {
  label: string;
  key: SortableCoinKey | null;
  sortable: boolean;
  align: "left" | "center" | "right";
};

const tableHeaders: HeaderConfig[] = [
  { label: "#", sortable: false, key: null, align: "center" },
  { label: "Coin", sortable: false, key: null, align: "left" },
  { label: "Price", sortable: true, key: "current_price", align: "right" },
  {
    label: "24h Change",
    sortable: true,
    key: "price_change_percentage_24h",
    align: "right",
  },
  { label: "Market Cap", sortable: true, key: "market_cap", align: "right" },
  {
    label: "24h Volume",
    sortable: true,
    key: "total_volume",
    align: "right",
  },
  { label: "Last 7d", sortable: false, key: null, align: "right" },
];

function getAlignmentClass(align: HeaderConfig["align"]) {
  switch (align) {
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    default:
      return "text-right";
  }
}

function useCryptoMarketOverview() {
  const dispatch = useAppDispatch();
  const { search, sortBy, sortDirection } = useAppSelector(
    (state) => state.market,
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<Coin[], Error, InfiniteData<Coin[]>, ["coins"], number>({
    queryKey: ["coins"],
    queryFn: ({ pageParam = 1 }) => fetchCoins(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.length === pageSize ? lastPage.length + 1 : undefined,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (!data) return;
    setLastUpdated(new Date());
  }, [data]);

  const coins = useMemo(() => data?.pages.flat() ?? [], [data]);

  useEffect(() => {
    if (!observerTarget.current || !hasNextPage || isFetchingNextPage || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  const filteredCoins = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    const visibleCoins = normalizedQuery
      ? (coins as Coin[]).filter(
          (coin) =>
            coin.name.toLowerCase().includes(normalizedQuery) ||
            coin.symbol.toLowerCase().includes(normalizedQuery),
        )
      : (coins as Coin[]);

    return [...visibleCoins].sort((a, b) => {
      const aValue = a[sortBy] ?? 0;
      const bValue = b[sortBy] ?? 0;

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [coins, search, sortBy, sortDirection]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearch(event.target.value));
    },
    [dispatch],
  );

  const handleSort = useCallback(
    (key: SortableCoinKey | null) => {
      if (!key) {
        return;
      }

      if (sortBy === key) {
        dispatch(toggleSortDirection());
      } else {
        dispatch(setSortBy(key));
        dispatch(setSortDirection("desc"));
      }
    },
    [dispatch, sortBy],
  );

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    lastUpdated,
    search,
    filteredCoins,
    sortBy,
    sortDirection,
    hasMore: Boolean(hasNextPage),
    observerTarget,
    handleSearchChange,
    handleSort,
    handleRefresh,
  };
}

function TableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-2">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHead
                  key={header.label}
                  className={`${getAlignmentClass(header.align)} font-medium`}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="w-10">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell className="font-medium max-w-[12em] w-1/4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex flex-col gap-1 w-full">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MarketOverviewTable({
  coins,
  sortBy,
  sortDirection,
  onSort,
}: {
  coins: Coin[];
  sortBy: SortableCoinKey;
  sortDirection: "asc" | "desc";
  onSort: (key: SortableCoinKey | null) => void;
}) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header) => (
            <TableHead
              key={header.label}
              className={`${getAlignmentClass(header.align)} text-right font-medium ${
                header.sortable ? "cursor-pointer" : ""
              }`}
              onClick={header.sortable ? () => onSort(header.key) : undefined}
            >
              {header.label}
              {header.sortable && sortBy === header.key && (
                <span className="ml-1 text-xs">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {coins.map((coin) => {
          const isPositive = coin.price_change_percentage_24h >= 0;

          return (
            <TableRow key={coin.id} className="hover:bg-muted/50">
              <TableCell className="w-10">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium max-w-[12em] w-1/4">
                <div className="flex flex-col gap-1">
                  <span className="truncate">{coin.name}</span>
                  <span className="text-xs text-muted-foreground uppercase">
                    {coin.symbol}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium max-w-24 whitespace-nowrap">
                ${coin.current_price.toLocaleString()}
              </TableCell>
              <TableCell className="text-right min-w-20">
                <Badge
                  variant={isPositive ? "default" : "destructive"}
                  className={isPositive ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {isPositive ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground min-w-28">
                {formatCurrency(coin.market_cap, true)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground min-w-28">
                {formatCurrency(coin.total_volume, true)}
              </TableCell>
              <TableCell className="min-w-24">
                <SparklineCell data={coin.sparkline_in_7d?.price} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function CryptoMarketOverview() {
  const {
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    lastUpdated,
    search,
    filteredCoins,
    sortBy,
    sortDirection,
    hasMore,
    observerTarget,
    handleSearchChange,
    handleSort,
    handleRefresh,
  } = useCryptoMarketOverview();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error.message ?? "Failed to load coins"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading && filteredCoins.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {lastUpdated && (
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
            {isFetching && !isLoading && <span>Refreshing...</span>}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Input value={search} placeholder="Search coins" onChange={handleSearchChange} />
            <Button onClick={handleRefresh}>Refresh</Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-2">
          <MarketOverviewTable
            coins={filteredCoins}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </CardContent>
      </Card>

      <div ref={observerTarget} className="h-1 w-full">
        {isFetchingNextPage && <p className="text-center">Loading more coins...</p>}
        {!hasMore && <p className="text-center">No more coins</p>}
      </div>
    </>
  );
}
