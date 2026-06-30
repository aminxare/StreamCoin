import { Coin } from "@/type";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const coingeckoAgent = {
  async fetchMarketCoins(page = 1, perPage = 10): Promise<Coin[]> {
    const url = new URL(`${BASE_URL}/coins/markets`);
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
  },
};
