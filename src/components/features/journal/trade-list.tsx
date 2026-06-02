import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Trade } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

const resultLabel = {
  win: "Win",
  loss: "Loss",
  be: "BE",
};

const directionLabel = {
  long: "Long",
  short: "Short",
};

export function TradeList({
  onAddTrade,
  onDeleteTrade,
  trades,
}: {
  onAddTrade: () => void;
  onDeleteTrade: (tradeId: string) => Promise<void>;
  trades: Trade[];
}) {
  if (trades.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <p className="text-xl font-semibold text-slate-950 dark:text-slate-50">Belum ada trade.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          Tambahkan trade pertama kamu setelah entry atau close posisi.
        </p>
        <Button className="mt-6 h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 sm:w-auto" onClick={onAddTrade}>
          + Tambah Trade
        </Button>
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Trade Journal</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{trades.length} entries</p>
      </div>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1120px]">
              <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
                <TableRow>
                  <TableHead className="min-w-28">Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                   <TableHead className="min-w-96">Reason</TableHead>
                   <TableHead className="min-w-72">Notes</TableHead>
                   <TableHead className="min-w-24 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => {
                  const createdAt = new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(trade.created_at));

                  return (
                    <TableRow key={trade.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <TableCell className="whitespace-nowrap text-slate-500 dark:text-slate-400">{createdAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{trade.account}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-950 dark:text-slate-50">{trade.pair}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(trade.direction === "long" ? "border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400" : "border-red-200 text-red-700 dark:border-red-900 dark:text-red-400")}>
                          {directionLabel[trade.direction]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{resultLabel[trade.result]}</Badge>
                      </TableCell>
                      <TableCell className={cn("text-right font-semibold tabular-nums", trade.profit_loss > 0 && "text-emerald-700 dark:text-emerald-400", trade.profit_loss < 0 && "text-red-700 dark:text-red-400", trade.profit_loss === 0 && "text-slate-500 dark:text-slate-300")}>
                        {trade.profit_loss > 0 ? "+" : ""}{trade.profit_loss}
                      </TableCell>
                      <TableCell className="max-w-80 whitespace-normal text-slate-700 dark:text-slate-300">{trade.reason}</TableCell>
                      <TableCell className="max-w-64 whitespace-normal text-slate-500 dark:text-slate-400">{trade.notes || "-"}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="h-8 rounded-xl px-3 text-xs" type="button" variant="destructive">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete trade?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Trade {trade.pair} akan dihapus permanen dari jurnal kamu.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => void onDeleteTrade(trade.id)} variant="destructive">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
