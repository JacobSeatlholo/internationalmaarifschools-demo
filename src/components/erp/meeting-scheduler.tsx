"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { ErpHeader } from "./erp-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarDays, CalendarPlus, FileUp, MapPin, Video } from "lucide-react";

interface Meeting {
  id: string; type: string; guardianName: string | null; staffName: string | null;
  topic: string; scheduledAt: string; durationMin: number; meetLink: string | null;
  room: string | null; attachment: string | null;
}
interface SlotStaff {
  staffId: string; name: string; department: string; subjects: string[];
  freePeriods: { day: number; period: number }[];
}

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIOD_TIMES: Record<number, string> = {
  1: "07:40", 2: "08:30", 3: "09:20", 4: "10:30", 5: "11:20", 6: "12:10", 7: "13:40", 8: "14:30",
};

export function MeetingScheduler({ base }: { base: string }) {
  const { data, refresh } = useApi<{ meetings: Meeting[]; slots: SlotStaff[] }>("/api/meetings");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"PARENT_TEACHER" | "EXECUTIVE">("PARENT_TEACHER");
  const [staffId, setStaffId] = useState("");
  const [day, setDay] = useState<number>(1);
  const [period, setPeriod] = useState<number>(1);
  const [topic, setTopic] = useState("");
  const [attachment, setAttachment] = useState("");
  const [room, setRoom] = useState("");

  const staff = data?.slots ?? [];
  const selected = staff.find((s) => s.staffId === staffId);
  const slotFree = selected?.freePeriods.some((p) => p.day === day && p.period === period);

  const book = async () => {
    if (!topic.trim()) return toast.error("Please describe the topic");
    if (type === "EXECUTIVE" && !attachment.trim()) {
      return toast.error("Executive meetings require supporting documents", {
        description: "Attach a filename or upload reference before booking.",
      });
    }
    const scheduledAt = nextInstanceOf(day, PERIOD_TIMES[period]);
    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        guardianName: "Guardian (portal demo)",
        staffId: staffId || null,
        staffName: selected?.name ?? "Executive Team",
        topic,
        scheduledAt: scheduledAt.toISOString(),
        durationMin: 10,
        attachment: attachment || null,
        room: room || (type === "EXECUTIVE" ? "Principal's Office" : null),
      }),
    });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Booking failed");
    toast.success("Meeting confirmed", {
      description: json.meeting.meetLink
        ? `24h and 1h reminders scheduled · ${json.meeting.meetLink}`
        : `${json.meeting.room} · 24h and 1h reminders scheduled`,
    });
    setOpen(false);
    setTopic("");
    setAttachment("");
    refresh();
  };

  return (
    <div>
      <ErpHeader
        title="Parent-Teacher & Executive Meeting Scheduler"
        blurb="Guardians book 10-minute slots in teacher free periods. Executive requests carry mandatory topic tags and document attachments. Auto Meet links + 24h/1h reminders."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base font-bold text-navy">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Upcoming meetings</span>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-navy hover:bg-navy-soft">
                    <CalendarPlus className="mr-1 h-3.5 w-3.5" /> Book meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Book a meeting slot</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {(["PARENT_TEACHER", "EXECUTIVE"] as const).map((t) => (
                        <button key={t} onClick={() => setType(t)}
                          className={cn("rounded-xl border px-3 py-2.5 text-xs font-bold transition-all",
                            type === t ? "border-gold bg-gold/10 text-navy" : "border-border text-muted-foreground")}>
                          {t === "PARENT_TEACHER" ? "Parent–Teacher (10 min)" : "Executive (Principal/Bursar)"}
                        </button>
                      ))}
                    </div>

                    {type === "PARENT_TEACHER" && (
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Teacher</Label>
                        <Select value={staffId} onValueChange={(v) => { setStaffId(v); const s = staff.find((x) => x.staffId === v); if (s && !s.freePeriods.some((p) => p.day === day && p.period === period)) { const f = s.freePeriods[0]; setDay(f.day); setPeriod(f.period); } }}>
                          <SelectTrigger className="mt-2"><SelectValue placeholder="Select teacher…" /></SelectTrigger>
                          <SelectContent>
                            {staff.map((s) => (
                              <SelectItem key={s.staffId} value={s.staffId}>
                                {s.name} — {s.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Day</Label>
                        <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
                          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((d) => <SelectItem key={d} value={String(d)}>{DAYS[d]}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Period</Label>
                        <Select value={String(period)} onValueChange={(v) => setPeriod(Number(v))}>
                          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(PERIOD_TIMES).map(([p, t]) => (
                              <SelectItem key={p} value={p}>P{p} · {t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {type === "PARENT_TEACHER" && staffId && (
                      <div className={cn("rounded-lg px-3 py-2 text-[11px] font-semibold",
                        slotFree ? "bg-emerald-brand/10 text-emerald-brand" : "bg-destructive/10 text-destructive")}>
                        {slotFree ? `${selected?.name} is free in this slot ✓` : `${selected?.name} is TEACHING in this slot — pick another`}
                      </div>
                    )}

                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Topic {type === "EXECUTIVE" && <span className="text-destructive">*</span>}
                      </Label>
                      <Input value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-2" placeholder="e.g. Grade 12 university application support" />
                    </div>

                    {type === "EXECUTIVE" && (
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Supporting documents <span className="text-destructive">*</span>
                        </Label>
                        <div className="mt-2 flex gap-2">
                          <Input value={attachment} onChange={(e) => setAttachment(e.target.value)} placeholder="e.g. UCT-prospectus-2027.pdf" />
                          <Button variant="outline" className="shrink-0" onClick={() => setAttachment(`upload-${Date.now().toString().slice(-6)}.pdf`)}>
                            <FileUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {type === "PARENT_TEACHER" && (
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Venue preference</Label>
                        <Select value={room} onValueChange={setRoom}>
                          <SelectTrigger className="mt-2"><SelectValue placeholder="Google Meet (default)" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Google Meet (auto link)</SelectItem>
                            <SelectItem value="Maths Room 12">Maths Room 12</SelectItem>
                            <SelectItem value="Library Corner">Library Corner</SelectItem>
                            <SelectItem value="Principal's Office">Principal&apos;s Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button onClick={book} className="w-full bg-navy hover:bg-navy-soft">
                      Confirm booking · 10 min
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[420px] space-y-2 overflow-y-auto scrollbar-thin">
            {(data?.meetings ?? []).map((m) => (
              <div key={m.id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[9px] font-black",
                      m.type === "EXECUTIVE" ? "border-navy/30 bg-navy/5 text-navy" : "border-gold/40 bg-gold/10 text-yellow-700")}>
                      {m.type.replace("_", "-")}
                    </Badge>
                    <span className="text-sm font-bold text-navy">{m.topic}</span>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {new Date(m.scheduledAt).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })} · {new Date(m.scheduledAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{m.staffName ?? "Executive"} ↔ {m.guardianName}</span>
                  {m.meetLink && <span className="flex items-center gap-1 text-emerald-brand"><Video className="h-3 w-3" /> Meet link ready</span>}
                  {m.room && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.room}</span>}
                  {m.attachment && <span className="flex items-center gap-1"><FileUp className="h-3 w-3" /> {m.attachment}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Free-period heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-navy">Staff availability grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-[10px]">
                <thead>
                  <tr>
                    <th className="p-1 text-left font-bold text-muted-foreground">Teacher</th>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <th key={d} className="p-1 font-bold text-muted-foreground">{DAYS[d].slice(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.slice(0, 9).map((s) => (
                    <tr key={s.staffId}>
                      <td className="whitespace-nowrap p-1 pr-2 font-semibold text-navy">{s.name.split(" ")[0]} {s.name.split(" ")[1]?.[0] ?? ""}.</td>
                      {[1, 2, 3, 4, 5].map((d) => {
                        const freeCount = s.freePeriods.filter((p) => p.day === d).length;
                        return (
                          <td key={d} className="p-0.5">
                            <div className={cn(
                              "grid h-7 place-items-center rounded font-bold",
                              freeCount >= 4 ? "bg-emerald-brand/20 text-emerald-brand" :
                              freeCount >= 2 ? "bg-gold/25 text-yellow-700" :
                              freeCount >= 1 ? "bg-gold/10 text-yellow-600" : "bg-destructive/10 text-destructive"
                            )}>
                              {freeCount}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Free periods per day (of 8). Bookings only confirm in genuinely free slots — the engine
              cross-checks the master timetable in real time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function nextInstanceOf(day: number, time: string): Date {
  const now = new Date();
  const result = new Date(now);
  const [h, m] = time.split(":").map(Number);
  let daysAhead = (day - now.getDay() + 7) % 7;
  if (daysAhead === 0) daysAhead = 7;
  result.setDate(now.getDate() + daysAhead);
  result.setHours(h, m, 0, 0);
  return result;
}
