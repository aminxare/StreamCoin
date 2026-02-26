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

export default async function CryptoMarketOverview() {
  let coins: Coin[] = [];
  let error: string | null = null;

  try {
    coins = await fetchCoins();
  } catch (err) {
    console.error("Error fetching coins:", err);
    error = (err as Error).message;
  }

  return (
    <>
      {error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : coins.length === 0 ? (
        <div className="space-y-4">
          <Skeleton className="h-1 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="max-w-2 w-1/4">Coin</TableHead>
                  <TableHead className="text-right max-w-2">Price</TableHead>
                  <TableHead className="text-right hidden sm:table-cell min-w-20">
                    24h Change
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell min-w-28">
                    Market Cap
                  </TableHead>
                  <TableHead className="text-right hidden lg:table-cell min-w-28">
                    24h Volume
                  </TableHead>
                  <TableHead className="text-right hidden xl:table-cell min-w-24">
                    Last 7d
                  </TableHead>
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
                      <TableCell className="text-right hidden sm:table-cell min-w-20">
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
                      <TableCell className="text-right hidden md:table-cell text-muted-foreground min-w-28">
                        {formatCurrency(coin.market_cap, true)}
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell text-muted-foreground min-w-28">
                        {formatCurrency(coin.total_volume, true)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell min-w-24">
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

      <p className="text-xs text-muted-foreground text-center mt-8">
        Data provided by CoinGecko • Not financial advice
      </p>
    </>
  );
}
