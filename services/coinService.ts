import { coingeckoAgent } from "@/api/agents/coingeckoAgent";
import { type Coin } from "@/type";

export const coinService = {
  async getMarketCoins(page = 1, perPage = 10): Promise<Coin[]> {
    return coingeckoAgent.fetchMarketCoins(page, perPage);
  },

  async getCoinById(id: string): Promise<Coin | null> {
    const res = await coingeckoAgent.fetchCoinById(id);
    console.log("res", res);
    return res;
  },
};
