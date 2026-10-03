"use client";

import { useState } from "react";
import { useApi, fmtZAR } from "@/hooks/use-api";
import { ErpHeader } from "./erp-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MessageCircle, FileText, Wallet, TrendingUp, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeeRow {
  id: string; studentName: string; grade: string; className: string; pathway: string;
  guardianName: string; guardianPhone: string; guardianEmail: string;
  annualTuition: number; paidToDate: number; outstanding: number;
  status: string; arrearsDays: number; planType: string;
  recentPayments: { amount: number; method: string; reference: string; createdAt: string }[];
}

interface FeesData {
  rows: FeeRow[];
  totals: { billed: number; collected: number; outstanding: number; inArrears: number };
}

const STATUS_STYLES: Record<string, string> = {
  FULLY_PAID: "bg-emerald-brand/15 text-emerald-brand border-emerald-brand/30",
  PARTIALLY_PAID: "bg-gold/15 text-yellow-700 border-gold/40",
  IN_ARREARS: "bg-destructive/10 text-destructive border-destructive/30",
};

const EXPENSE_MONTHS = [
  { month: "Apr", income: 61000, expense: 38400 },
  { month: "May", income: 58500, expense: 41200 },
  { month: "Jun", income: 64000, expense: 39800 },
  { month: "Jul", income: 66500, expense: 44900 },
  { month: "Aug", income: 63800, expense: 40100 },
  { month: "Sep", income: 69200, expense: 42600 },
];

export function FinancialHub() {
  const { data, refresh } = useApi<FeesData>("/api/fees");
  const [payDialog, setPayDialog] = useState<FeeRow | null>(null);
  const [payAmount, setPayAmount] = useState("");

  const recordPayment = async () => {
    if (!payDialog || !payAmount) return;
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "record-payment", accountId: payDialog.id, amount: Number(payAmount) }),
    });
    if (res.ok) {
      toast.success(`Payment of ${fmtZAR(Number(payAmount))} recorded for ${payDialog.studentName}`);
      setPayDialog(null);
      setPayAmount("");
      refresh();
    } else {
      toast.error("Payment failed");
    }
  };

  const sendStatement = async (row: FeeRow) => {
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send-statement", accountId: row.id }),
    });
    if (res.ok) {
      toast.success(`WhatsApp statement dispatched to ${row.guardianName}`, {
        description: `${row.studentName} · ${row.guardianPhone} · balance ${fmtZAR(row.outstanding)}`,
      });
    }
  };

  const applyPlan = async (row: FeeRow, plan: string) => {
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "apply-plan", accountId: row.id, planType: plan }),
    });
    if (res.ok) {
      toast.success(`Payment plan switched to ${plan.replace("_", " ").toLowerCase()}`);
      refresh();
    }
  };

  const rows = data?.rows ?? [];
  const totals = data?.totals;

  return (
    <div>
      <ErpHeader
        title="Financial Control Hub"
        blurb="Fee ledger, arrears management and real-time income-vs-expenditure tracking."
        alertCount={totals?.inArrears}
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Wallet} label="Billed (2026)" value={fmtZAR(totals?.billed ?? 0)} tone="navy" />
        <Kpi icon={TrendingUp} label="Collected" value={fmtZAR(totals?.collected ?? 0)} tone="emerald" />
        <Kpi icon={Clock3} label="Outstanding" value={fmtZAR(totals?.outstanding ?? 0)} tone="gold" />
        <Kpi icon={AlertTriangle} label="In arrears" value={`${totals?.inArrears ?? 0} accounts`} tone="red" />
      </div>

      {/* P&L chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base font-bold text-navy">Tuition income vs operational expenditure (monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXPENSE_MONTHS} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde5ec" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5b6b7a" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `R${v / 1000}k`} tick={{ fontSize: 11, fill: "#5b6b7a" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => fmtZAR(Number(v))}
                  contentStyle={{ borderRadius: 12, border: "1px solid #dde5ec", fontSize: 12 }}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#0f2537" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Q3 net margin: <span className="font-bold text-emerald-brand">+R68,600</span> — audit pack currently under executive review.
          </p>
        </CardContent>
      </Card>

      {/* Fee ledger */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base font-bold text-navy">Student fee ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[460px] overflow-auto rounded-lg border scrollbar-thin">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Quick actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className={cn(r.status === "IN_ARREARS" && "bg-destructive/[0.04]")}>
                    <TableCell>
                      <div className="font-semibold text-navy">{r.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {r.grade} {r.className} · {r.pathway} · Guardian: {r.guardianName}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{fmtZAR(r.annualTuition)}</TableCell>
                    <TableCell className="font-mono text-xs text-emerald-brand">{fmtZAR(r.paidToDate)}</TableCell>
                    <TableCell className="font-mono text-xs font-bold">{fmtZAR(r.outstanding)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-bold", STATUS_STYLES[r.status])}>
                        {r.status.replace(/_/g, " ")}
                        {r.arrearsDays > 0 && ` · ${r.arrearsDays}d`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="outline" className="h-8 gap-1 text-[11px]" onClick={() => sendStatement(r)}>
                          <MessageCircle className="h-3 w-3" /> Statement
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 gap-1 text-[11px]"
                          onClick={() => toast.success(`Invoice PDF generated`, { description: `${r.studentName} — ${fmtZAR(r.outstanding)} due · saved to documents` })}>
                          <FileText className="h-3 w-3" /> Invoice
                        </Button>
                        <Dialog open={payDialog?.id === r.id} onOpenChange={(o) => !o && setPayDialog(null)}>
                          <Button size="sm" variant="outline" className="h-8 gap-1 text-[11px]" onClick={() => { setPayDialog(r); setPayAmount(String(Math.round(r.outstanding / 11))); }}>
                            <Wallet className="h-3 w-3" /> Payment
                          </Button>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Record payment — {r.studentName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div className="rounded-lg bg-muted p-3 text-xs">
                                Outstanding: <span className="font-bold">{fmtZAR(r.outstanding)}</span> · Plan: {r.planType.replace("_", " ")}
                              </div>
                              <Input
                                type="number"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                placeholder="Amount in ZAR"
                                aria-label="Payment amount"
                              />
                              <Button onClick={recordPayment} className="w-full bg-emerald-brand hover:bg-emerald-brand/90">
                                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Confirm payment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Payment plan shortcuts for arrears accounts */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="py-1.5 text-xs font-bold text-muted-foreground">Arrears recovery plans:</span>
            {rows.filter((r) => r.status === "IN_ARREARS").map((r) => (
              <div key={r.id} className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]">
                <span className="font-semibold text-navy">{r.studentName.split(" ")[0]}</span>
                <button onClick={() => applyPlan(r, "MONTHLY_11")} className="rounded-full bg-muted px-2 py-0.5 font-medium hover:bg-navy/10">11× month</button>
                <button onClick={() => applyPlan(r, "PER_TERM_4")} className="rounded-full bg-muted px-2 py-0.5 font-medium hover:bg-navy/10">4× term</button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: {
  icon: React.ElementType; label: string; value: string; tone: "navy" | "emerald" | "gold" | "red";
}) {
  const tones = {
    navy: "text-navy bg-navy/5",
    emerald: "text-emerald-brand bg-emerald-brand/10",
    gold: "text-yellow-700 bg-gold/10",
    red: "text-destructive bg-destructive/10",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="truncate font-mono text-lg font-black text-navy">{value}</div>
          <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
