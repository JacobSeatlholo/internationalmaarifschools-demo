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
import { countWorkingDays, LEAVE_TYPES } from "@/lib/leave-engine";
import {
  CalendarOff, CheckCircle2, FileScan, Loader2, ShieldAlert, ShieldCheck, Upload, XCircle, Info,
} from "lucide-react";

interface Balance {
  annualEntitlement: number; annualTaken: number;
  sickEntitlement: number; sickTaken: number;
  familyEntitlement: number; familyTaken: number;
  studyEntitlement: number; studyTaken: number; cycleStart: string;
}
interface DoctorNote {
  id: string; fileName: string; doctorName: string | null; practiceNumber: string | null;
  hpcsaValid: boolean; anomaly: string | null; ocrConfidence: number;
}
interface LeaveRequest {
  id: string; staffId: string; type: string; startDate: string; endDate: string;
  workingDays: number; reason: string | null; status: string; doctorNote: DoctorNote | null;
}
interface StaffRow {
  id: string; name: string; role: string; department: string;
  leaveBalances: Balance[]; leaveRequests: LeaveRequest[];
}

export function LeaveEngine({ currentUser }: { currentUser: { name: string; role: string } }) {
  const { data, refresh } = useApi<{ staff: StaffRow[] }>("/api/leave");
  const [noteOpen, setNoteOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const isExec = ["EXECUTIVE", "PRINCIPAL", "DEPT_HEAD"].includes(currentUser.role);

  const review = async (id: string, status: "APPROVED" | "REJECTED") => {
    setProcessing(true);
    try {
      const res = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, reviewedBy: currentUser.name }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Review failed", { duration: 6000 });
        return;
      }
      if (status === "APPROVED") {
        toast.success("Leave approved", {
          description: "Balance updated · substitute coverage auto-dispatched from the master timetable",
        });
      } else {
        toast.info("Leave request declined");
      }
      refresh();
    } finally {
      setProcessing(false);
    }
  };

  const uploadNote = async (file: File, staffId: string) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("staffId", staffId);
      const res = await fetch("/api/doctor-note", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Processing failed");
        return;
      }
      const { note, hpcsa } = json;
      if (hpcsa.valid) {
        toast.success("Certificate verified", {
          description: `${note.doctorName ?? "Doctor"} · ${hpcsa.normalized} passed HPCSA structural validation`,
        });
      } else {
        toast.error("HPCSA anomaly flagged for HR review", {
          description: hpcsa.anomaly,
          duration: 8000,
        });
      }
      setNoteOpen(false);
      refresh();
    } finally {
      setUploading(false);
    }
  };

  const staff = data?.staff ?? [];
  const allRequests = staff.flatMap((s) => s.leaveRequests.map((r) => ({ ...r, staff: s })));
  const pending = allRequests.filter((r) => r.status === "PENDING");

  return (
    <div>
      <ErpHeader
        title="Teacher Leave Engine & Medical Certificate Parser"
        blurb="BCEA-compliant balances with weekends, gazetted public holidays and school holidays excluded. Sick leave requires an HPCSA-verified doctor's note before approval."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-navy">
              <CalendarOff className="h-4 w-4" /> Leave balances (2026 cycle)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[520px] space-y-4 overflow-y-auto scrollbar-thin">
            {staff.slice(0, 8).map((s) => {
              const b = s.leaveBalances[0];
              if (!b) return null;
              return (
                <div key={s.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-navy">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.role.replace("_", " ")} · {s.department}</div>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold">Cycle from {b.cycleStart}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { key: "ANNUAL", taken: b.annualTaken, ent: b.annualEntitlement },
                      { key: "SICK", taken: b.sickTaken, ent: b.sickEntitlement },
                      { key: "FAMILY", taken: b.familyTaken, ent: b.familyEntitlement },
                      { key: "STUDY", taken: b.studyTaken, ent: b.studyEntitlement },
                    ].map((t) => {
                      const pct = Math.min(100, (t.taken / t.ent) * 100);
                      return (
                        <div key={t.key} title={LEAVE_TYPES[t.key as keyof typeof LEAVE_TYPES].note}>
                          <div className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{t.key}</div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("h-full rounded-full", pct > 80 ? "bg-destructive" : pct > 50 ? "bg-gold" : "bg-emerald-brand")}
                              style={{ width: `${Math.max(4, pct)}%` }}
                            />
                          </div>
                          <div className="mt-0.5 text-[10px] font-mono text-muted-foreground">
                            {t.ent - t.taken}/{t.ent} left
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base font-bold text-navy">
              <span className="flex items-center gap-2">
                <FileScan className="h-4 w-4" /> Leave requests
              </span>
              <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-navy hover:bg-navy-soft">
                    <Upload className="mr-1 h-3.5 w-3.5" /> Upload doctor&apos;s note
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Medical certificate upload</DialogTitle>
                  </DialogHeader>
                  <DoctorNoteUpload staff={staff} uploading={uploading} onUpload={uploadNote} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[520px] space-y-3 overflow-y-auto scrollbar-thin">
            {allRequests.map((r) => (
              <div key={r.id} className={cn(
                "rounded-xl border p-4",
                r.status === "PENDING" ? "border-gold/40 bg-gold/[0.04]" : "opacity-80"
              )}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy">{r.staff.name}</span>
                      <Badge variant="outline" className="text-[9px] font-black">{r.type}</Badge>
                      <StatusChip status={r.status} />
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {r.startDate} → {r.endDate} · <span className="font-bold text-navy">{r.workingDays} working day{r.workingDays !== 1 ? "s" : ""}</span> (holidays & weekends excluded)
                      {r.reason && <span className="block">{r.reason}</span>}
                    </div>
                  </div>
                  {r.status === "PENDING" && isExec && (
                    <div className="flex gap-1.5">
                      <Button size="sm" className="h-8 bg-emerald-brand hover:bg-emerald-brand/90" disabled={processing} onClick={() => review(r.id, "APPROVED")}>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8" disabled={processing} onClick={() => review(r.id, "REJECTED")}>
                        <XCircle className="mr-1 h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {r.doctorNote && (
                  <div className={cn(
                    "mt-3 rounded-lg p-3 text-[11px]",
                    r.doctorNote.hpcsaValid ? "bg-emerald-brand/5 border border-emerald-brand/25" : "bg-destructive/5 border border-destructive/30"
                  )}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {r.doctorNote.hpcsaValid ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
                      )}
                      HPCSA {r.doctorNote.hpcsaValid ? "verified" : "flagged"} · {r.doctorNote.practiceNumber ?? "no practice number"}
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {r.doctorNote.doctorName ?? "Unknown practitioner"} · OCR {(r.doctorNote.ocrConfidence * 100).toFixed(0)}%
                      {r.doctorNote.anomaly && <span className="mt-0.5 block font-medium text-destructive">{r.doctorNote.anomaly}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {allRequests.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No leave requests.</p>}
          </CardContent>
        </Card>
      </div>

      {/* BCEA explainer */}
      <div className="mt-6 flex items-start gap-3 rounded-xl bg-navy/5 p-4 text-[11px] leading-relaxed text-navy">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <div>
          <strong>Entitlement engine (BCEA):</strong> Annual — 21 consecutive days per cycle ≈ 15 working days (s21).
          Sick — 30 working days per 36-month cycle (s22). Family responsibility — 3 days per annual cycle (s27).
          Study — 5 days per school contract. Working-day counts exclude weekends, the 12 gazetted 2026 public
          holidays and WCED school holiday periods.
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-gold/15 text-yellow-700 border-gold/40",
    APPROVED: "bg-emerald-brand/15 text-emerald-brand border-emerald-brand/30",
    REJECTED: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={cn("text-[9px] font-black", map[status])}>{status}</Badge>;
}

function DoctorNoteUpload({ staff, uploading, onUpload }: {
  staff: StaffRow[]; uploading: boolean;
  onUpload: (file: File, staffId: string) => void;
}) {
  const [staffId, setStaffId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewDays, setPreviewDays] = useState<number | null>(null);

  const teachers = staff.filter((s) => s.role === "TEACHER" || s.role === "DEPT_HEAD");

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Staff member</Label>
        <Select value={staffId} onValueChange={setStaffId}>
          <SelectTrigger className="mt-2"><SelectValue placeholder="Select teacher…" /></SelectTrigger>
          <SelectContent>
            {teachers.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name} — {t.department}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Certificate (PDF or image)</Label>
        <label
          className={cn(
            "mt-2 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            file ? "border-emerald-brand/50 bg-emerald-brand/5" : "border-border hover:border-gold/50"
          )}
        >
          <input type="file" accept="image/*,.pdf" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="mt-2 text-xs font-semibold text-navy">
                {file ? file.name : "Choose file — OCR extracts doctor, practice number & dates"}
              </span>
            </>
          )}
        </label>
      </div>

      <div className="rounded-lg bg-muted p-3 text-[11px] text-muted-foreground">
        <strong className="text-navy">Live working-day preview:</strong>{" "}
        {previewDays === null
          ? "set a pending sick-leave range to preview"
          : `${previewDays} working days in selected range`}
        {staffId && (() => {
          const req = staff.find((s) => s.id === staffId)?.leaveRequests.find((r) => r.status === "PENDING" && r.type === "SICK");
          if (req) {
            const d = countWorkingDays({ start: req.startDate, end: req.endDate });
            if (previewDays !== d) setPreviewDays(d);
          }
          return null;
        })()}
      </div>

      <Button
        className="w-full bg-navy hover:bg-navy-soft"
        disabled={!file || !staffId || uploading}
        onClick={() => file && staffId && onUpload(file, staffId)}
      >
        {uploading ? "Processing with OCR…" : "Verify & attach certificate"}
      </Button>
    </div>
  );
}
