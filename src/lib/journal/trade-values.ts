import type { TradeResult } from "./types";

export function normalizeProfitLoss(value: number, result: TradeResult) {
  if (result === "be") return 0;

  const absoluteValue = Math.abs(value);
  return result === "loss" ? -absoluteValue : absoluteValue;
}
