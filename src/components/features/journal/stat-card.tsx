import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  tone?: "green" | "red" | "slate";
};

export function StatCard({ label, value, tone = "slate" }: StatCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <CardContent className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p
          className={cn(
            "mt-3 text-2xl font-semibold tabular-nums",
            tone === "green" && "text-emerald-700 dark:text-emerald-400",
            tone === "red" && "text-red-700 dark:text-red-400",
            tone === "slate" && "text-slate-950 dark:text-slate-50",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
