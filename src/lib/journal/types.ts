export type TradeDirection = "long" | "short";

export type TradeResult = "win" | "loss" | "be";

export type Trade = {
  id: string;
  user_id: string;
  pair: string;
  direction: TradeDirection;
  profit_loss: number;
  result: TradeResult;
  reason: string;
  notes: string | null;
  created_at: string;
};

export type JournalStats = {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  longCount: number;
  shortCount: number;
};
