"use client";

import { useApi } from "@/hooks/use-api";
import { ErpHeader } from "./erp-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarCheck2, CheckCircle2, Clock, UserCheck, XCircle } from "lucide-react";

interface Dispatch {
  id: string; day: number; period: number; subject: string; gradeClass: string;
  lessonPlan: string | null; status: string; absentName: string; substituteName: string;
}

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function Substitutes({ currentUser }: { currentUser: { name: string; role: string } }) {
  const { data, refresh } = useApi<Dispatch[]>("/api/substitutes");

  const respond = async (id: string, status: "ACCEPTED" | "DECLINED") => {
    const res = await fetch("/api/substitutes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success(status === "ACCEPTED" ? "Cover accepted — lesson plan attached in your portal" : "Dispatch declined — rerouting to next free-period teacher");
      refresh();
    }
  };

  const dispatches = data ?? [];
  const mine = dispatches.filter(
    (d) => d.status === "PENDING" && (currentUser.role === "EXECUTIVE" || currentUser.role === "PRINCIPAL" || d.substituteName === currentUser.name)
  );

  return (
    <div>
      <ErpHeader
        title="Smart Substitute Coverage Dispatch"
        blurb="When leave is approved, the engine scans the master timetable for free-period staff and auto-dispatches relief requests with lesson plans attached."
      />

      {mine.length > 0 && (
        <Card className="mb-6 border-gold/40">
          <CardHeader>
            <CardTitle className="text-base font-bold text-navy">Action required — relief requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mine.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/5 p-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-navy">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    {DAYS[d.day]} · Period {d.period}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {d.subject} · {d.gradeClass} — covering <strong>{d.absentName}</strong>
                  </div>
                  {d.lessonPlan && <p className="mt-1 max-w-md text-[11px] italic text-muted-foreground">{d.lessonPlan}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-brand hover:bg-emerald-brand/90" onClick={() => respond(d.id, "ACCEPTED")}>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Accept cover
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => respond(d.id, "DECLINED")}>
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-navy">
            <CalendarCheck2 className="h-4 w-4" /> Dispatch log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[420px] space-y-2 overflow-y-auto scrollbar-thin">
            {dispatches.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-navy">
                    {DAYS[d.day]} P{d.period} · {d.subject} · {d.gradeClass}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Absent: {d.absentName} → Assigned: {d.substituteName}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold",
                    d.status === "ACCEPTED" && "border-emerald-brand/30 bg-emerald-brand/10 text-emerald-brand",
                    d.status === "PENDING" && "border-gold/40 bg-gold/10 text-yellow-700",
                    d.status === "DECLINED" && "border-destructive/30 bg-destructive/10 text-destructive"
                  )}
                >
                  {d.status === "ACCEPTED" && <UserCheck className="mr-1 h-3 w-3" />}
                  {d.status}
                </Badge>
              </div>
            ))}
            {dispatches.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No dispatches yet — approve a leave request to trigger automatic coverage.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
