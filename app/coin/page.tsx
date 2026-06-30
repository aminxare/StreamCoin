import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoinPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Coin Info</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Coin Detail</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              A dedicated coin page for market details and chart visualization will be available soon.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Market snapshot</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>Symbol: BTC</p>
              <p>Price: $73,000.00</p>
              <p>24h Change: +3.1%</p>
              <p>Market Cap: $1.4T</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Chart area</h2>
            <div className="mt-4 flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300/70 bg-white/80 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400">
              Chart preview coming soon
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
