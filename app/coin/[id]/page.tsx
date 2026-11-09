import type { Metadata } from "next";
import { CoinDetailClient } from "./CoinDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const capitalized = id.charAt(0).toUpperCase() + id.slice(1);
  return {
    title: `${capitalized} Price & Market Stats | StreamCoin`,
    description: `Real-time price, market cap, 24h volume, and 7-day sparkline charts for ${capitalized} on StreamCoin.`,
  };
}

export default async function CoinDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="container max-w-5xl mx-auto p-4 sm:p-6">
      <CoinDetailClient id={id} />
    </main>
  );
}

