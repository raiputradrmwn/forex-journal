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
    <Card className="relative overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className={cn("absolute inset-y-0 left-0 w-1", isLong ? "bg-emerald-600" : "bg-red-600")} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-wide text-slate-950 dark:text-slate-50">{trade.pair}</h3>
              <Badge variant="outline" className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                {trade.account}
              </Badge>
              <Badge variant="outline" className={cn(isLong ? "border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400" : "border-red-200 text-red-700 dark:border-red-900 dark:text-red-400")}>
                {directionLabel[trade.direction]}
              </Badge>
              <Badge variant="secondary">{resultLabel[trade.result]}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{trade.reason}</p>
          </div>
          <p
            className={cn(
              "text-lg font-semibold tabular-nums",
              trade.profit_loss > 0 && "text-emerald-700 dark:text-emerald-400",
              trade.profit_loss < 0 && "text-red-700 dark:text-red-400",
              trade.profit_loss === 0 && "text-slate-500 dark:text-slate-300",
            )}
          >
            {trade.profit_loss > 0 ? "+" : ""}{trade.profit_loss}
          </p>
        </div>
        {trade.notes ? <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-400">{trade.notes}</p> : null}
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{createdAt}</p>
      </CardContent>
    </Card>
  );
}
