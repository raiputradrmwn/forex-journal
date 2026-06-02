"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TradeDirection, TradeResult } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

type TradeFormValues = {
  pair: string;
  direction: TradeDirection;
  profit_loss: number;
  result: TradeResult;
  reason: string;
  notes: string | null;
};

type TradeFormProps = {
  onCancel: () => void;
  onSave: (values: TradeFormValues) => Promise<void>;
};

export function TradeForm({ onCancel, onSave }: TradeFormProps) {
  const [direction, setDirection] = useState<TradeDirection>("long");
  const [result, setResult] = useState<TradeResult>("win");
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
        direction,
        profit_loss: profitLoss,
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
    <Card className="border-emerald-300/20 bg-white/[0.045] shadow-[0_24px_90px_rgba(55,214,122,0.08)]">
      <CardHeader>
        <CardTitle className="text-slate-50">Tambah Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button className={cn("h-11 rounded-2xl", direction === "long" && "bg-emerald-400 text-slate-950 hover:bg-emerald-300")} onClick={() => setDirection("long")} type="button" variant={direction === "long" ? "default" : "outline"}>
                Long
              </Button>
              <Button className={cn("h-11 rounded-2xl", direction === "short" && "bg-red-400 text-slate-950 hover:bg-red-300")} onClick={() => setDirection("short")} type="button" variant={direction === "short" ? "default" : "outline"}>
                Short
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pair">Pair</Label>
              <Input id="pair" name="pair" placeholder="EURUSD" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profit_loss">Profit / Loss</Label>
              <Input id="profit_loss" name="profit_loss" placeholder="25" step="0.01" type="number" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Result</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button className={cn("h-11 rounded-2xl", result === "win" && "bg-emerald-400 text-slate-950 hover:bg-emerald-300")} onClick={() => setResult("win")} type="button" variant={result === "win" ? "default" : "outline"}>
                Win
              </Button>
              <Button className={cn("h-11 rounded-2xl", result === "loss" && "bg-red-400 text-slate-950 hover:bg-red-300")} onClick={() => setResult("loss")} type="button" variant={result === "loss" ? "default" : "outline"}>
                Loss
              </Button>
              <Button className={cn("h-11 rounded-2xl", result === "be" && "bg-amber-300 text-slate-950 hover:bg-amber-200")} onClick={() => setResult("be")} type="button" variant={result === "be" ? "default" : "outline"}>
                BE
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason Entry</Label>
            <Textarea id="reason" name="reason" placeholder="Breakout valid setelah retest support" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Catatan Emosi</Label>
            <Textarea id="notes" name="notes" placeholder="Opsional" />
          </div>

          {error ? <p className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Button className="h-12 rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save Trade"}
            </Button>
            <Button className="h-12 rounded-2xl" disabled={isSaving} onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
