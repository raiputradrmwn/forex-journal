import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  tone?: "green" | "red" | "slate";
};

export function StatCard({ label, value, tone = "slate" }: StatCardProps) {
  return (
    <Card className="border-white/8 bg-white/[0.035] shadow-none">
      <CardContent className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <p
          className={cn(
            "mt-3 text-2xl font-semibold tabular-nums",
            tone === "green" && "text-emerald-300",
            tone === "red" && "text-red-300",
            tone === "slate" && "text-slate-50",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
