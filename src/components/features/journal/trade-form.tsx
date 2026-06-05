"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TradeAccount, TradeDirection, TradeResult } from "@/lib/journal/types";
import { normalizeProfitLoss } from "@/lib/journal/trade-values";
import { cn } from "@/lib/utils";

const forexPairs = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "USDCAD", "AUDUSD", "NZDUSD", "XAUUSD"];

type TradeFormValues = {
  pair: string;
  account: TradeAccount;
  direction: TradeDirection;
  profit_loss: number;
  result: TradeResult;
  reason: string;
  notes: string | null;
};

type TradeFormProps = {
  initialValues?: TradeFormValues;
  onCancel: () => void;
  onSave: (values: TradeFormValues) => Promise<void>;
};

export function TradeForm({ initialValues, onCancel, onSave }: TradeFormProps) {
  const [account, setAccount] = useState<TradeAccount>(initialValues?.account ?? "USD");
  const [direction, setDirection] = useState<TradeDirection>(initialValues?.direction ?? "long");
  const [result, setResult] = useState<TradeResult>(initialValues?.result ?? "win");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const pair = String(formData.get("pair") ?? "").trim().toUpperCase();
    const profitLoss = Number(formData.get("profit_loss"));
    const reason = String(formData.get("reason") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!pair || Number.isNaN(profitLoss) || !reason) {
      setError("Pair, Profit/Loss, dan Reason wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        pair,
        account,
        direction,
        profit_loss: normalizeProfitLoss(profitLoss, result),
        result,
        reason,
        notes: notes || null,
      });
    } catch {
      setError("Gagal menyimpan trade. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>Account</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button className={cn("h-11 rounded-2xl", account === "USD" && "bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200")} onClick={() => setAccount("USD")} type="button" variant={account === "USD" ? "default" : "outline"}>
                USD
              </Button>
              <Button className={cn("h-11 rounded-2xl", account === "USC" && "bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200")} onClick={() => setAccount("USC")} type="button" variant={account === "USC" ? "default" : "outline"}>
                USC
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button className={cn("h-11 rounded-2xl", direction === "long" && "bg-emerald-600 text-white hover:bg-emerald-700")} onClick={() => setDirection("long")} type="button" variant={direction === "long" ? "default" : "outline"}>
                Long
              </Button>
              <Button className={cn("h-11 rounded-2xl", direction === "short" && "bg-red-600 text-white hover:bg-red-700")} onClick={() => setDirection("short")} type="button" variant={direction === "short" ? "default" : "outline"}>
                Short
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pair">Pair</Label>
              <select
                className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                defaultValue={initialValues?.pair ?? ""}
                id="pair"
                name="pair"
              >
                <option value="" disabled>
                  Pilih pair
                </option>
                {forexPairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profit_loss">Profit / Loss</Label>
              <Input defaultValue={initialValues ? Math.abs(initialValues.profit_loss) : undefined} id="profit_loss" name="profit_loss" placeholder="25" step="0.01" type="number" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Result</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button className={cn("h-11 rounded-2xl", result === "win" && "bg-emerald-600 text-white hover:bg-emerald-700")} onClick={() => setResult("win")} type="button" variant={result === "win" ? "default" : "outline"}>
                Win
              </Button>
              <Button className={cn("h-11 rounded-2xl", result === "loss" && "bg-red-600 text-white hover:bg-red-700")} onClick={() => setResult("loss")} type="button" variant={result === "loss" ? "default" : "outline"}>
                Loss
              </Button>
              <Button className={cn("h-11 rounded-2xl", result === "be" && "bg-amber-600 text-white hover:bg-amber-700")} onClick={() => setResult("be")} type="button" variant={result === "be" ? "default" : "outline"}>
                BE
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason Entry</Label>
            <Textarea defaultValue={initialValues?.reason} id="reason" name="reason" placeholder="Breakout valid setelah retest support" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Catatan Emosi</Label>
            <Textarea defaultValue={initialValues?.notes ?? undefined} id="notes" name="notes" placeholder="Opsional" />
          </div>

          {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p> : null}

          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Button className="h-12 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : initialValues ? "Update Trade" : "Save Trade"}
            </Button>
            <Button className="h-12 rounded-2xl" disabled={isSaving} onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
          </div>
    </form>
  );
}
