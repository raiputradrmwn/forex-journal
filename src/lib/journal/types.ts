export type TradeDirection = "long" | "short";

export type TradeResult = "win" | "loss" | "be";

export type TradeAccount = "USC" | "USD";

export type Trade = {
  id: string;
  user_id: string;
  pair: string;
  account: TradeAccount;
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
  accounts: Record<TradeAccount, AccountStats>;
};

export type AccountStats = {
  totalTrades: number;
  totalPnl: number;
};
