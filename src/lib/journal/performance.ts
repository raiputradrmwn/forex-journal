import type { Trade } from "./types";

export type EquityPoint = {
  label: string;
  value: number;
};

export function buildEquityCurve(trades: Trade[]): EquityPoint[] {
  if (trades.length === 0) return [{ label: "Start", value: 0 }];

  const sortedTrades = trades.toSorted((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  let cumulativePnl = 0;

  return sortedTrades.reduce<EquityPoint[]>(
    (points, trade) => {
      cumulativePnl += trade.profit_loss;
      points.push({
        label: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
        }).format(new Date(trade.created_at)),
        value: cumulativePnl,
      });
      return points;
    },
    [{ label: "Start", value: 0 }],
  );
}
