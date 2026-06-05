import { describe, expect, it } from "vitest";

import { normalizeProfitLoss } from "./trade-values";

describe("normalizeProfitLoss", () => {
  it("stores loss profit/loss values as negative numbers", () => {
    expect(normalizeProfitLoss(25, "loss")).toBe(-25);
  });

  it("stores win profit/loss values as positive numbers", () => {
    expect(normalizeProfitLoss(-25, "win")).toBe(25);
  });

  it("stores breakeven profit/loss values as zero", () => {
    expect(normalizeProfitLoss(25, "be")).toBe(0);
  });
});
