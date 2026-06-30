import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <main className="container mx-auto p-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Account</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Profile</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Manage your account settings and personal preferences for the StreamCoin dashboard.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/settings">Open Settings</Link>
          </Button>
        </div>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">User Info</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Username: <span className="font-medium text-slate-900 dark:text-slate-100">guest</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Email: <span className="font-medium text-slate-900 dark:text-slate-100">guest@streamcoin.app</span>
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Activity</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Your portfolio overview and recent watchlist activity will appear here soon.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
