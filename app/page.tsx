import CryptoMarketOverview from "@/components/CryptoMarketOverview";

export default function Home() {
  return (
    <main className="grid grid-cols-[1fr_3fr] gap-4 p-3">
      <section>
        <CryptoMarketOverview />
      </section>
      <section>
      </section>
    </main>
  );
}
