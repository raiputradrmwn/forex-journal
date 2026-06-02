"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthPanelProps = {
  disabled?: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
};

export function AuthPanel({ disabled = false, onLogin, onSignUp }: AuthPanelProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || password.length < 6) {
      setError("Isi email dan password minimal 6 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch {
      setError("Auth gagal. Cek email/password atau konfigurasi Supabase.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-white/8 bg-white/[0.045] shadow-[0_28px_110px_rgba(0,0,0,0.35)]">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-50">Masuk ke Forex Journal</CardTitle>
        <p className="text-sm leading-6 text-slate-500">Data trade tersimpan di Supabase dan hanya tampil untuk akun kamu.</p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input autoComplete="email" disabled={disabled || isSubmitting} id="email" name="email" placeholder="kamu@email.com" type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input autoComplete="current-password" disabled={disabled || isSubmitting} id="password" name="password" placeholder="Minimal 6 karakter" type="password" />
          </div>
          {error ? <p className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
          {disabled ? <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">Supabase env belum diset. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.</p> : null}
          <div className="grid gap-2 sm:grid-cols-2">
            <Button className="h-12 rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300" disabled={disabled || isSubmitting} onClick={() => setMode("login")} type="submit">
              {isSubmitting ? "Loading..." : "Login"}
            </Button>
            <Button className="h-12 rounded-2xl" disabled={disabled || isSubmitting} onClick={() => setMode("signup")} type="submit" variant="outline">
              Sign Up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
