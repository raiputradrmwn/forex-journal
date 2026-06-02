import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Trade } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

const resultLabel = {
  win: "Win",
  loss: "Loss",
  be: "BE",
};

const directionLabel = {
  long: "Long",
  short: "Short",
};

export function TradeCard({ trade }: { trade: Trade }) {
  const isLong = trade.direction === "long";
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(trade.created_at));

  return (
    <Card className="relative overflow-hidden border-white/8 bg-white/[0.04] shadow-[0_18px_70px_rgba(0,0,0,0.22)]">
      <div className={cn("absolute inset-y-0 left-0 w-1", isLong ? "bg-emerald-400" : "bg-red-400")} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-wide text-slate-50">{trade.pair}</h3>
              <Badge variant="outline" className={cn(isLong ? "border-emerald-300/35 text-emerald-200" : "border-red-300/35 text-red-200")}>
                {directionLabel[trade.direction]}
              </Badge>
              <Badge variant="secondary">{resultLabel[trade.result]}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{trade.reason}</p>
          </div>
          <p
            className={cn(
              "text-lg font-semibold tabular-nums",
              trade.profit_loss > 0 && "text-emerald-300",
              trade.profit_loss < 0 && "text-red-300",
              trade.profit_loss === 0 && "text-slate-300",
            )}
          >
            {trade.profit_loss > 0 ? "+" : ""}{trade.profit_loss}
          </p>
        </div>
        {trade.notes ? <p className="mt-3 rounded-2xl bg-slate-950/70 px-3 py-2 text-sm text-slate-400">{trade.notes}</p> : null}
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">{createdAt}</p>
      </CardContent>
    </Card>
  );
}
