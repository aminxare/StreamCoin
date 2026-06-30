import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Preferences</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Settings</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Configure StreamCoin display options, data refresh preferences, and notification settings.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Display</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Choose your preferred theme and table display options. More customization is coming soon.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Data</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Set automatic refresh intervals and market data preferences for the coin table.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
