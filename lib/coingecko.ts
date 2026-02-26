import { Coin } from "@/type";

export async function fetchCoins(page = 1, perPage = 50): Promise<Coin[]> {
  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sparkline", "true");
  url.searchParams.set("price_change_percentage", "24h,7d");

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  return res.json();
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (compact && value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (compact && value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;

  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (compact && value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (compact && value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return new Intl.NumberFormat("en-US").format(value);
}
