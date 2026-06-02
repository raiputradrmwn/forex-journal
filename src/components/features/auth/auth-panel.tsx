"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthPanelProps = {
  disabled?: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<{ message?: string } | void>;
};

export function AuthPanel({ disabled = false, onLogin, onSignUp }: AuthPanelProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const mode = submitter?.value === "signup" ? "signup" : "login";
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
        const result = await onSignUp(email, password);
        if (result?.message) setSuccess(result.message);
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Auth gagal. Cek email/password atau konfigurasi Supabase.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-slate-200 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-950 dark:text-slate-50">Masuk ke Forex Journal</CardTitle>
        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Data trade tersimpan di Supabase dan hanya tampil untuk akun kamu.</p>
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
          {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p> : null}
          {success ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{success}</p> : null}
          {disabled ? <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">Supabase env belum diset. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.</p> : null}
          <div className="grid gap-2 sm:grid-cols-2">
            <Button className="h-12 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200" disabled={disabled || isSubmitting} name="auth-mode" type="submit" value="login">
              {isSubmitting ? "Loading..." : "Login"}
            </Button>
            <Button className="h-12 rounded-2xl" disabled={disabled || isSubmitting} name="auth-mode" type="submit" value="signup" variant="outline">
              Sign Up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
