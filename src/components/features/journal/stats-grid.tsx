import { StatCard } from "@/components/features/journal/stat-card";
import type { JournalStats } from "@/lib/journal/types";

export function StatsGrid({ stats }: { stats: JournalStats }) {
  const pnlTone = stats.totalPnl > 0 ? "green" : stats.totalPnl < 0 ? "red" : "slate";

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      <StatCard label="Total Trades" value={String(stats.totalTrades)} />
      <StatCard label="Win Rate" value={`${stats.winRate}%`} />
      <StatCard label="Total P/L" value={`${stats.totalPnl > 0 ? "+" : ""}${stats.totalPnl}`} tone={pnlTone} />
      <StatCard label="Long / Short" value={`${stats.longCount} / ${stats.shortCount}`} />
      <StatCard label="USD Account" value={`${stats.accounts.USD.totalTrades} / ${stats.accounts.USD.totalPnl > 0 ? "+" : ""}${stats.accounts.USD.totalPnl}`} tone={stats.accounts.USD.totalPnl > 0 ? "green" : stats.accounts.USD.totalPnl < 0 ? "red" : "slate"} />
      <StatCard label="USC Account" value={`${stats.accounts.USC.totalTrades} / ${stats.accounts.USC.totalPnl > 0 ? "+" : ""}${stats.accounts.USC.totalPnl}`} tone={stats.accounts.USC.totalPnl > 0 ? "green" : stats.accounts.USC.totalPnl < 0 ? "red" : "slate"} />
    </section>
  );
}
