"use client";

import Image from "next/image";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function CryptoMarketOverview() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<keyof Coin>("market_cap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  //Intersection Observer for infinite scroll
  // useEffect(() => {
  //   if (!observerTarget.current || !hasMore || loading) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore && !loading) {
  //         setPage((prev) => prev + 1);
  //       }
  //     },
  //     { threshold: 0.5 },
  //   );
  //   if (observerTarget.current) {
  //     observer.observe(observerTarget.current);
  //   }
  //   return () => observer.disconnect();
  // }, [hasMore, loading]);

  const loadCoins = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      try {
        const coinsData = await fetchCoins(page, pageSize);
        console.log("coinsData: ", coinsData);
        setCoins((prev) => {
          if (isRefresh || page === 1) {
            return coinsData;
          }
          const existingIds = new Set(prev.map((c) => c.id));
          const filtered = coinsData.filter((c) => !existingIds.has(c.id));
          return [...prev, ...filtered];
        });
        setLastUpdated(new Date());
        setHasMore(coinsData.length === pageSize);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "Failed to load coins");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, pageSize],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCoins();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCoins]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (page === 1) {
        loadCoins(true);
      } else {
        setPage(1);
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [loadCoins, page]);

  const handleRefresh = () => {
    if (page === 1) {
      loadCoins(true);
    } else {
      setPage(1);
    }
  };

  const filteredCoins = useMemo(() => {
    let filtered = [...coins];
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(q) ||
          coin.symbol.toLowerCase().includes(q),
      );
    }
    filtered.sort((a, b) => {
      const aValue = a[sortBy] ?? 0;
      const bValue = b[sortBy] ?? 0;

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
    return filtered;
  }, [coins, search, sortBy, sortDirection]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (key: keyof Coin | null) => () => {
    if (!key) return;
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("desc");
    }
  };

  return (
    <>
      {error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : coins.length === 0 && loading ? (
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
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="text-left font-medium">Coin</TableHead>
                  <TableHead className="text-right font-medium">Price</TableHead>
                  <TableHead className="text-right font-medium">24h Change</TableHead>
                  <TableHead className="text-right font-medium">Market Cap</TableHead>
                  <TableHead className="text-right font-medium">24h Volume</TableHead>
                  <TableHead className="min-w-24 text-right">Last 7d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
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
      ) : (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {lastUpdated && (
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
              {refreshing && <span>Refreshing...</span>}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Input placeholder="Search coins" onChange={searchHandler} />
              <Button onClick={handleRefresh}>Refresh</Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-2">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {[
                    { label: "#", sortable: false, key: null },
                    { label: "Coin", sortable: false, key: "name" },
                    { label: "Price", sortable: true, key: "current_price" },
                    {
                      label: "24h Change",
                      sortable: true,
                      key: "price_change_percentage_24h",
                    },
                    {
                      label: "Market Cap",
                      sortable: true,
                      key: "market_cap",
                    },
                    {
                      label: "24h Volume",
                      sortable: true,
                      key: "total_volume",
                    },
                    { label: "Last 7d", sortable: false, key: null },
                  ].map((col) => (
                    <TableHead
                      key={col.label}
                      className={`${
                        col.sortable ? "cursor-pointer" : ""
                      } text-right font-medium ${
                        col.key === "name" ? "text-left" : ""
                      }`}
                      onClick={handleSort(col.key as keyof Coin | null)}
                    >
                      {col.label}
                      {col.sortable && sortBy === col.key && (
                        <span className="ml-1 text-xs">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoins.map((coin) => {
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
                      <TableCell className="text-right  min-w-20">
                        <Badge
                          variant={isPositive ? "default" : "destructive"}
                          className={
                            isPositive ? "bg-green-600 hover:bg-green-700" : ""
                          }
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
          </CardContent>
        </Card>
      )}
      <div ref={observerTarget} className="h-1 w-full">
        {loading && <p className="text-center">Loading more coins...</p>}
        {!hasMore && <p className="text-center">No more coins</p>}
      </div>
    </>
  );
}
