import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { buildEquityCurve } from "@/lib/journal/performance";
import type { Trade } from "@/lib/journal/types";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Cumulative P/L",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartPreview({ trades }: { trades: Trade[] }) {
  const points = buildEquityCurve(trades);
  const latestValue = points.at(-1)?.value ?? 0;

  return (
    <Card className="border-slate-200 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base text-slate-950 dark:text-slate-50">Performance Chart</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Equity curve dari cumulative P/L. Tetap tampil walau baru 1 trade.
            </p>
          </div>
          <p className="text-right text-sm font-semibold tabular-nums text-slate-950 dark:text-slate-50">
            {latestValue > 0 ? "+" : ""}{latestValue}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" config={chartConfig}>
          <LineChart accessibilityLayer data={points} margin={{ left: 8, right: 8, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={8} />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} width={42} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="value"
              dot={{ r: 3 }}
              isAnimationActive={false}
              name="value"
              stroke="var(--color-value)"
              strokeWidth={2.5}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
