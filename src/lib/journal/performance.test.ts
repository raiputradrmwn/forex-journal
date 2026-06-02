import { describe, expect, it } from "vitest";

import { buildEquityCurve } from "./performance";
import type { Trade } from "./types";

const trade = (overrides: Partial<Trade>): Trade => ({
  id: "trade-1",
  user_id: "user-1",
  pair: "EURUSD",
  account: "USD",
  direction: "long",
  profit_loss: 0,
  result: "be",
  reason: "Retest valid",
  notes: null,
  created_at: "2026-06-02T00:00:00.000Z",
  ...overrides,
});

describe("buildEquityCurve", () => {
  it("returns one zero point when there are no trades", () => {
    expect(buildEquityCurve([])).toEqual([{ label: "Start", value: 0 }]);
  });

  it("builds cumulative pnl in chronological order", () => {
    const trades = [
      trade({ id: "3", profit_loss: 10, created_at: "2026-06-03T00:00:00.000Z" }),
      trade({ id: "1", profit_loss: 25, created_at: "2026-06-01T00:00:00.000Z" }),
      trade({ id: "2", profit_loss: -5, created_at: "2026-06-02T00:00:00.000Z" }),
    ];

    expect(buildEquityCurve(trades)).toEqual([
      { label: "Start", value: 0 },
      { label: "01 Jun", value: 25 },
      { label: "02 Jun", value: 20 },
      { label: "03 Jun", value: 30 },
    ]);
  });
});
