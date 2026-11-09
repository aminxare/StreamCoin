"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, AlertCircle, BarChart3, Activity, Coins, Trophy } from "lucide-react";
import { useCoinDetail } from "@/hooks/useCoinDetail";
import { formatCurrency, formatNumber } from "@/lib/coingecko";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklineCell } from "@/components/sparkline-cell";

function CoinDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Card>
        <CardHeader><Skeleton className="h-6 w-36" /></CardHeader>
        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-32 mt-2" /></CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CoinDetailClient({ id }: { id: string }) {
  const { coin, isLoading, isFetching, error, refetch } = useCoinDetail(id);

  if (isLoading) {
    return <CoinDetailSkeleton />;
  }

  if (error || !coin) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Coin Not Found</CardTitle>
          </div>
          <CardDescription>
            {error?.message ?? `We could not load details for coin ID "${id}".`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const is24hPositive = coin.price_change_percentage_24h >= 0;
  const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  // Calculate position in 24h price range for the range bar
  const priceRange = coin.high_24h - coin.low_24h;
  const pricePosition =
    priceRange > 0
      ? Math.max(0, Math.min(100, ((coin.current_price - coin.low_24h) / priceRange) * 100))
      : 50;

  const sparklinePrices = coin.sparkline_in_7d?.price ?? [];
  const minSparkline = sparklinePrices.length ? Math.min(...sparklinePrices) : 0;
  const maxSparkline = sparklinePrices.length ? Math.max(...sparklinePrices) : 0;

  // ponytail: simplified stats grid to 4 primary metrics and 24h range bar. Upgrade path: add interactive candlestick chart & order book details if trading features are needed.
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b">
        <div className="flex items-center gap-4">
          <Image src={coin.image} alt={coin.name} width={48} height={48} className="rounded-full" priority />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{coin.name}</h1>
              <Badge variant="secondary" className="uppercase font-mono">{coin.symbol}</Badge>
              {coin.market_cap_rank && <Badge variant="outline">Rank #{coin.market_cap_rank}</Badge>}
            </div>
            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-extrabold tracking-tight">{formatCurrency(coin.current_price)}</span>
              <Badge variant={is24hPositive ? "default" : "destructive"}>
                {is24hPositive ? <TrendingUp className="mr-1 h-3.5 w-3.5" /> : <TrendingDown className="mr-1 h-3.5 w-3.5" />}
                {is24hPositive ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}% (24h)
              </Badge>
              {coin.price_change_percentage_7d_in_currency !== undefined && (
                <Badge variant={is7dPositive ? "default" : "destructive"}>
                  {is7dPositive ? "+" : ""}{coin.price_change_percentage_7d_in_currency.toFixed(2)}% (7d)
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* 24h Price Range */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex justify-between font-medium">
          <span>24h Low: {formatCurrency(coin.low_24h)}</span>
          <span>24h Range</span>
          <span>24h High: {formatCurrency(coin.high_24h)}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pricePosition}%` }} />
        </div>
      </div>

      {/* 7-Day Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">7-Day Price Trajectory</CardTitle>
            <CardDescription>Recent trend based on weekly sparkline data</CardDescription>
          </div>
          {sparklinePrices.length > 0 && (
            <div className="text-right text-xs text-muted-foreground font-mono">
              Min: {formatCurrency(minSparkline)} • Max: {formatCurrency(maxSparkline)}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          {sparklinePrices.length > 0 ? (
            <SparklineCell data={sparklinePrices} width={500} height={120} />
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No sparkline trend data available.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Market Statistics */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Market Statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Market Cap</CardDescription>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{formatCurrency(coin.market_cap, true)}</div>
              <p className="mt-1 text-xs text-muted-foreground font-mono truncate">
                {formatCurrency(coin.market_cap)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">24h Volume</CardDescription>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{formatCurrency(coin.total_volume, true)}</div>
              <p className="mt-1 text-xs text-muted-foreground font-mono truncate">
                {coin.market_cap > 0
                  ? `Vol / MC: ${((coin.total_volume / coin.market_cap) * 100).toFixed(2)}%`
                  : formatCurrency(coin.total_volume)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Circulating Supply</CardDescription>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {formatNumber(coin.circulating_supply, true)} <span className="text-xs font-medium text-muted-foreground">{coin.symbol.toUpperCase()}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-mono truncate">
                {formatNumber(coin.circulating_supply)} coins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">All-Time High</CardDescription>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{formatCurrency(coin.ath)}</div>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                <span className={coin.ath_change_percentage >= 0 ? "text-green-600 font-semibold" : "text-destructive font-semibold"}>
                  {coin.ath_change_percentage >= 0 ? "+" : ""}{coin.ath_change_percentage?.toFixed(2)}%
                </span> from peak
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

