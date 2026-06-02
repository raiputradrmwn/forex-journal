import type { JournalStats, Trade } from "./types";

export function calculateJournalStats(trades: Trade[]): JournalStats {
  const totalTrades = trades.length;

  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalPnl: 0,
      longCount: 0,
      shortCount: 0,
      accounts: {
        USC: { totalTrades: 0, totalPnl: 0 },
        USD: { totalTrades: 0, totalPnl: 0 },
      },
    };
  }

  let wins = 0;
  let totalPnl = 0;
  let longCount = 0;
  let shortCount = 0;
  const accounts = {
    USC: { totalTrades: 0, totalPnl: 0 },
    USD: { totalTrades: 0, totalPnl: 0 },
  };

  for (const item of trades) {
    if (item.result === "win") wins += 1;
    if (item.direction === "long") longCount += 1;
    if (item.direction === "short") shortCount += 1;
    totalPnl += item.profit_loss;
    accounts[item.account].totalTrades += 1;
    accounts[item.account].totalPnl += item.profit_loss;
  }

  return {
    totalTrades,
    winRate: Math.round((wins / totalTrades) * 100),
    totalPnl,
    longCount,
    shortCount,
    accounts,
  };
}
