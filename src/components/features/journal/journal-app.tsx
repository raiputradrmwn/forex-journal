"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { User } from "@supabase/supabase-js";

import { AuthPanel } from "@/components/features/auth/auth-panel";
import { ChartPreview } from "@/components/features/journal/chart-preview";
import { StatsGrid } from "@/components/features/journal/stats-grid";
import { TradeForm } from "@/components/features/journal/trade-form";
import { TradeList } from "@/components/features/journal/trade-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateJournalStats } from "@/lib/journal/stats";
import type { Trade, TradeAccount } from "@/lib/journal/types";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { toast } from "sonner";

type TradeInsert = Pick<Trade, "pair" | "account" | "direction" | "profit_loss" | "result" | "reason" | "notes">;

type SupabaseTrade = Omit<Trade, "account"> & {
  account: TradeAccount | null;
};

export function JournalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const supabase = hasSupabaseConfig ? createBrowserSupabaseClient() : null;
  const stats = calculateJournalStats(trades);

  const loadTrades = useCallback(async () => {
    if (!supabase) return;
    setError("");
    const { data, error: loadError } = await supabase
      .from("trades")
      .select("id,user_id,pair,account,direction,profit_loss,result,reason,notes,created_at")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError("Gagal memuat jurnal. Cek konfigurasi Supabase dan RLS.");
      return;
    }

    setTrades(
      ((data ?? []) as SupabaseTrade[]).map((trade) => ({
        ...trade,
        account: trade.account ?? "USD",
      })),
    );
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setTrades([]);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) return;

    startTransition(() => {
      void loadTrades();
    });
  }, [loadTrades, supabase, user]);

  async function login(email: string, password: string) {
    if (!supabase) return;
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) throw loginError;
  }

  async function signUp(email: string, password: string) {
    if (!supabase) return;
    const { data, error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) throw signupError;

    if (data.user && !data.session) {
      return { message: "Signup berhasil. Cek email kamu untuk konfirmasi akun sebelum login." };
    }
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function saveTrade(values: TradeInsert) {
    if (!supabase || !user) return;
    const { error: saveError } = await supabase.from("trades").insert({
      ...values,
      user_id: user.id,
    });

    if (saveError) throw saveError;
    setIsFormOpen(false);
    await loadTrades();
  }

  async function deleteTrade(tradeId: string) {
    if (!supabase || !user) return;
    setError("");

    const { error: deleteError } = await supabase
      .from("trades")
      .delete()
      .eq("id", tradeId)
      .eq("user_id", user.id);

    if (deleteError) {
      setError("Gagal menghapus trade. Coba lagi.");
      toast.error("Gagal menghapus trade.");
      return;
    }

    setTrades((currentTrades) => currentTrades.filter((trade) => trade.id !== tradeId));
    toast.success("Trade berhasil dihapus.");
  }

  if (isLoading) {
    return <p className="m-auto text-sm text-slate-500">Memuat jurnal...</p>;
  }

  if (!user) {
    return (
      <div className="grid flex-1 place-items-center py-12">
        <AuthPanel disabled={!hasSupabaseConfig} onLogin={login} onSignUp={signUp} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 py-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Private trading log</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">Forex Journal</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
        <Button className="h-11 rounded-2xl" onClick={logout} variant="outline">
          Logout
        </Button>
      </header>

      <Button className="h-14 rounded-2xl bg-slate-950 text-base font-semibold text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200" onClick={() => setIsFormOpen(true)}>
        + Tambah Trade
      </Button>

      <StatsGrid stats={stats} />

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p> : null}
      {isPending ? <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data terbaru...</p> : null}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Trade</DialogTitle>
            <DialogDescription>
              Isi jurnal cepat seperti baris baru di spreadsheet trading kamu.
            </DialogDescription>
          </DialogHeader>
          <TradeForm onCancel={() => setIsFormOpen(false)} onSave={saveTrade} />
        </DialogContent>
      </Dialog>

      <ChartPreview trades={trades} />

      <TradeList onAddTrade={() => setIsFormOpen(true)} onDeleteTrade={deleteTrade} trades={trades} />

      <a className="justify-self-center text-xs text-slate-400 transition hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400" href="https://rhnworks.vercel.app/" rel="noreferrer" target="_blank">
        Created By RHN
      </a>
    </div>
  );
}
