import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#070A0D] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,214,122,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,92,102,0.12),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
