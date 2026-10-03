"use client";

import { useApi } from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PipelineProgress } from "@/components/public/admissions";
import { fmtZAR } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck, GraduationCap, Heart, LineChart as LineChartIcon, LogOut,
  School, Sparkles, Trophy, Wallet,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

interface PortalData {
  student: { firstName: string; lastName: string; grade: string; className: string; pathway: string; guardianName: string } | null;
  progression: Record<string, string | number>[];
  subjects: string[];
  comments: { subject: string; mark: number; comment: string | null; curriculum: string }[];
  showcase: { id: string; studentName: string; grade: string; title: string; subject: string; description: string; likes: number }[];
}

const SECTIONS = [
  { key: "overview", label: "Progression", icon: LineChartIcon },
  { key: "showcase", label: "Showcase", icon: Sparkles },
  { key: "pipeline", label: "Admissions", icon: GraduationCap },
  { key: "fees", label: "Fees", icon: Wallet },
];

export function PortalShell() {
  const { user, logout, setView, portalSection, setPortalSection } = useAppStore();
  const { data, refresh } = useApi<PortalData>("/api/portal", 30000);

  const like = async (id: string) => {
    await fetch("/api/portal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    toast.success("Thanks for the support!");
    refresh();
  };

  const progression = data?.progression ?? [];
  const average = progression.length ? (progression[progression.length - 1] as Record<string, number>).average : 0;
  const first = progression.length ? (progression[0] as Record<string, number>).average : 0;
  const delta = average - first;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-soft font-black text-navy-deep">M</span>
            <div className="leading-tight">
              <div className="text-xs font-bold tracking-wide text-navy">FAMILY PORTAL</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-gold">Maarif Cape Town</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-bold text-navy">{user?.name}</div>
              <div className="text-[10px] text-muted-foreground">{user?.detail}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setView("public")} className="text-navy hover:bg-navy/10">
              <School className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={logout} className="text-navy hover:bg-navy/10" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 pb-2.5 sm:px-6">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setPortalSection(s.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                portalSection === s.key ? "bg-navy text-white shadow" : "bg-muted text-muted-foreground hover:bg-navy/10"
              )}
            >
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {portalSection === "overview" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy">
                  {data?.student ? `${data.student.firstName}'s progression` : "Academic progression"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {data?.student ? `${data.student.grade} ${data.student.className} · ${data.student.pathway} pathway` : "Term-by-term academic trajectory"}
                </p>
              </div>
              <Badge className={cn("border-0 text-xs font-bold", delta >= 0 ? "bg-emerald-brand/15 text-emerald-brand" : "bg-destructive/10 text-destructive")}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% since T1
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-navy">Mark trajectory by subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progression}>
                      <defs>
                        <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d4af37" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#d4af37" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dde5ec" vertical={false} />
                      <XAxis dataKey="term" tick={{ fontSize: 12, fill: "#5b6b7a" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5b6b7a" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dde5ec", fontSize: 12 }} />
                      <Area type="monotone" dataKey="average" stroke="#d4af37" strokeWidth={3} fill="url(#goldFill)" name="Average" />
                      <Area type="monotone" dataKey="Mathematics" stroke="#0f2537" strokeWidth={1.5} fillOpacity={0} name="Mathematics" />
                      <Area type="monotone" dataKey="Physical Sciences" stroke="#10b981" strokeWidth={1.5} fillOpacity={0} name="Physical Sciences" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {data?.comments.map((c) => (
                <Card key={c.subject}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpenCheck className="h-4 w-4 text-gold" />
                        <span className="text-sm font-bold text-navy">{c.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-black">{c.curriculum}</Badge>
                        <span className={cn("font-mono text-lg font-black", c.mark >= 80 ? "text-emerald-brand" : c.mark >= 70 ? "text-yellow-700" : "text-destructive")}>
                          {c.mark}%
                        </span>
                      </div>
                    </div>
                    <Progress value={c.mark} className="mt-3 h-1.5" />
                    <p className="mt-2 text-[11px] italic leading-relaxed text-muted-foreground">{c.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {portalSection === "showcase" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-navy">Project showcase</h1>
              <p className="text-sm text-muted-foreground">Learner work the whole school is proud of — celebrate it.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data?.showcase.map((p) => (
                <Card key={p.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-gold/40 bg-gold/10 text-[9px] font-black text-yellow-700">{p.subject}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => like(p.id)} className="gap-1.5 text-destructive hover:text-destructive">
                        <Heart className="h-4 w-4" /> {p.likes}
                      </Button>
                    </div>
                    <h3 className="mt-2.5 font-serif text-lg font-bold leading-snug text-navy">{p.title}</h3>
                    <p className="mt-1 text-[11px] font-semibold text-gold">{p.studentName} · Grade {p.grade}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {portalSection === "pipeline" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-navy">Admissions pipeline tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <PipelineProgress status="REGISTERED" />
                <p className="mt-4 rounded-lg bg-emerald-brand/10 p-3 text-[11px] font-semibold text-emerald-brand">
                  Fully registered for 2026 — reimission documents for 2027 open in October.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold text-navy">
                  <Trophy className="h-4 w-4 text-gold" /> Upcoming milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                {[
                  ["Grade 11 AS-Level registration", "Oct 14"],
                  ["Trial examinations begin", "Oct 20"],
                  ["Valedictory service", "Nov 6"],
                  ["2027 subject-choice lock-in", "Nov 20"],
                ].map(([label, date]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
                    <span className="font-semibold text-navy">{label}</span>
                    <Badge variant="outline" className="text-[10px] font-bold">{date}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {portalSection === "fees" && (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl font-bold text-navy">Fee account</h1>
            <Card className="overflow-hidden">
              <div className="bg-navy p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gold-soft">2026 account status</div>
                    <div className="mt-1 font-serif text-3xl font-black">
                      {fmtZAR(75020)} <span className="text-sm font-normal text-white/60">annual tuition</span>
                    </div>
                  </div>
                  <Badge className="border-0 bg-emerald-brand text-sm font-bold text-white">FULLY PAID ✓</Badge>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-full rounded-full bg-emerald-brand" />
                </div>
                <div className="mt-2 text-[11px] text-white/60">Thank you — your account is in excellent standing.</div>
              </div>
              <CardContent className="p-5">
                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <Detail label="Plan" value="4× per term" />
                  <Detail label="Method" value="EFT debit order" />
                  <Detail label="Next statement" value="1 Nov 2026" />
                </div>
                <Button
                  className="mt-4 w-full bg-emerald-brand hover:bg-emerald-brand/90 sm:w-auto"
                  onClick={() => toast.success("Statement sent to WhatsApp", { description: "Check +27 82 *** 4471 for your PDF statement" })}
                >
                  <Wallet className="mr-1.5 h-4 w-4" /> Send me my statement on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-navy">{value}</div>
    </div>
  );
}
