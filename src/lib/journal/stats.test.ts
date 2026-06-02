import { describe, expect, it } from "vitest";

import { calculateJournalStats } from "./stats";
import type { Trade } from "./types";

const trade = (overrides: Partial<Trade>): Trade => ({
  id: "trade-1",
  user_id: "user-1",
  pair: "EURUSD",
  direction: "long",
  profit_loss: 0,
  result: "be",
  reason: "Retest valid",
  notes: null,
  created_at: "2026-06-02T00:00:00.000Z",
  ...overrides,
});

describe("calculateJournalStats", () => {
  it("returns zero metrics for an empty journal", () => {
    expect(calculateJournalStats([])).toEqual({
      totalTrades: 0,
      winRate: 0,
      totalPnl: 0,
      longCount: 0,
      shortCount: 0,
    });
  });

  it("calculates total trades, win rate, pnl, and direction counts", () => {
    const trades: Trade[] = [
      trade({ id: "1", direction: "long", profit_loss: 25, result: "win" }),
      trade({ id: "2", direction: "short", profit_loss: -10, result: "loss" }),
      trade({ id: "3", direction: "long", profit_loss: 0, result: "be" }),
      trade({ id: "4", direction: "short", profit_loss: 80, result: "win" }),
    ];

    expect(calculateJournalStats(trades)).toEqual({
      totalTrades: 4,
      winRate: 50,
      totalPnl: 95,
      longCount: 2,
      shortCount: 2,
    });
  });
});
