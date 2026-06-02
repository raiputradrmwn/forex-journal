import { Button } from "@/components/ui/button";
import { TradeCard } from "@/components/features/journal/trade-card";
import type { Trade } from "@/lib/journal/types";

export function TradeList({ onAddTrade, trades }: { onAddTrade: () => void; trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-700 bg-white/[0.025] p-8 text-center">
        <p className="text-xl font-semibold text-slate-100">Belum ada trade.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Tambahkan trade pertama kamu setelah entry atau close posisi.
        </p>
        <Button className="mt-6 h-12 w-full rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 sm:w-auto" onClick={onAddTrade}>
          + Tambah Trade
        </Button>
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Recent Trades</h2>
        <p className="text-sm text-slate-500">{trades.length} entries</p>
      </div>
      <div className="grid gap-3">
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </div>
    </section>
  );
}
