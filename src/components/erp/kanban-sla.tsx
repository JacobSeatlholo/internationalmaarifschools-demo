"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { ErpHeader } from "./erp-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowRight, Plus, Timer, TrendingUp, AlertTriangle } from "lucide-react";

interface Task {
  id: string; title: string; description: string | null; tag: string;
  column: string; assignee: string; priority: string; slaDueAt: string;
  escalated: boolean; overdue: boolean; hoursLeft: number; breachLevel: string;
}

const COLUMNS = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "EXEC_REVIEW", label: "Executive Review" },
  { key: "DONE", label: "Done" },
];

const TAGS = ["FACILITIES", "CURRICULUM", "EVENTS", "HR", "FINANCIAL_AUDIT"] as const;

const TAG_COLORS: Record<string, string> = {
  FACILITIES: "bg-navy/10 text-navy",
  CURRICULUM: "bg-gold/15 text-yellow-700",
  EVENTS: "bg-emerald-brand/10 text-emerald-brand",
  HR: "bg-purple-500/10 text-purple-700",
  FINANCIAL_AUDIT: "bg-orange-500/10 text-orange-600",
};

export function KanbanSla() {
  const { data, refresh } = useApi<Task[]>("/api/tasks", 15000);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", tag: "FACILITIES", assignee: "", priority: "MEDIUM", slaDays: 5 });

  const move = async (id: string, column: string) => {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, column }),
    });
    if (res.ok) {
      if (column === "DONE") toast.success("Task completed — SLA timer stopped");
      refresh();
    }
  };

  const create = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Task created and SLA timer started");
      setOpen(false);
      setForm({ title: "", tag: "FACILITIES", assignee: "", priority: "MEDIUM", slaDays: 5 });
      refresh();
    }
  };

  const tasks = data ?? [];
  const breaches = tasks.filter((t) => t.breachLevel === "breached" && t.escalated);

  return (
    <div>
      <ErpHeader
        title="Task & Operational SLA Command Center"
        blurb="Cross-departmental Kanban with live SLA timers. Breached tasks escalate automatically to the Executive Director."
        alertCount={breaches.length}
      />

      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-navy hover:bg-navy-soft">
              <Plus className="mr-1 h-3.5 w-3.5" /> New task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create task</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2" placeholder="e.g. Repair hall PA system" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tag</Label>
                  <Select value={form.tag} onValueChange={(v) => setForm({ ...form, tag: v })}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TAGS.map((t) => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assignee</Label>
                  <Input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} className="mt-2" placeholder="Team or person" />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SLA (days)</Label>
                  <Input type="number" value={form.slaDays} onChange={(e) => setForm({ ...form, slaDays: Number(e.target.value) })} className="mt-2" />
                </div>
              </div>
              <Button onClick={create} className="w-full bg-navy hover:bg-navy-soft">Create task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {breaches.length > 0 && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-destructive">
            <AlertTriangle className="h-4 w-4" /> Escalated to Executive Director
          </div>
          <ul className="mt-2 space-y-1">
            {breaches.map((t) => (
              <li key={t.id} className="text-[11px] text-destructive/90">
                <strong>{t.title}</strong> — breached {Math.abs(t.hoursLeft).toFixed(0)}h ago · {t.tag.replace("_", " ")} · {t.assignee}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.key);
          return (
            <div key={col.key} className="rounded-2xl bg-muted/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-navy">{col.label}</span>
                <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-bold text-navy">{colTasks.length}</span>
              </div>
              <div className="max-h-[480px] space-y-2.5 overflow-y-auto scrollbar-thin pr-1">
                {colTasks.map((t) => (
                  <article
                    key={t.id}
                    className={cn(
                      "rounded-xl border bg-card p-3.5 shadow-sm transition-all hover:shadow-md",
                      t.breachLevel === "breached" && t.column !== "DONE" && "animate-slablink border-destructive",
                      t.breachLevel === "critical" && "border-destructive/40",
                      t.breachLevel === "warning" && "border-gold/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13px] font-bold leading-snug text-navy">{t.title}</h4>
                      {t.priority === "CRITICAL" && (
                        <Badge variant="destructive" className="shrink-0 text-[8px] font-black">CRIT</Badge>
                      )}
                    </div>
                    {t.description && <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{t.description}</p>}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className={cn("text-[9px] font-bold", TAG_COLORS[t.tag])}>{t.tag.replace("_", " ")}</Badge>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold",
                          t.breachLevel === "breached" && t.column !== "DONE" ? "bg-destructive/15 text-destructive"
                            : t.breachLevel === "critical" ? "bg-destructive/10 text-destructive"
                            : t.breachLevel === "warning" ? "bg-gold/15 text-yellow-700"
                            : "bg-emerald-brand/10 text-emerald-brand"
                        )}
                      >
                        <Timer className="h-2.5 w-2.5" />
                        {t.column === "DONE" ? "SLA met" : t.breachLevel === "breached" ? `${Math.abs(t.hoursLeft).toFixed(0)}h over` : `${t.hoursLeft.toFixed(0)}h left`}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                      <span className="text-[10px] font-semibold text-muted-foreground">{t.assignee}</span>
                      {col.key !== "DONE" && (
                        <Button
                          size="sm" variant="ghost"
                          className="h-6 gap-1 px-2 text-[10px] font-bold text-navy hover:bg-navy/10"
                          onClick={() => move(t.id, COLUMNS[Math.min(COLUMNS.length - 1, COLUMNS.findIndex((c) => c.key === col.key) + 1)].key)}
                        >
                          Advance <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
                {colTasks.length === 0 && (
                  <p className="rounded-xl border border-dashed p-4 text-center text-[11px] text-muted-foreground">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-xl bg-navy/5 p-3 text-[11px] text-navy">
        <TrendingUp className="h-4 w-4 shrink-0 text-gold" />
        SLA policy: LOW ≤ 10 days · MEDIUM ≤ 5 · HIGH ≤ 3 · CRITICAL ≤ 1. Warning at 48h, critical at 12h,
        auto-escalation on breach with a live compliance trail.
      </div>
    </div>
  );
}
