import { coingeckoAgent } from "@/api/agents/coingeckoAgent";
import { type Coin } from "@/type";

export const coinService = {
  async getMarketCoins(page = 1, perPage = 10): Promise<Coin[]> {
    return coingeckoAgent.fetchMarketCoins(page, perPage);
  },
};
