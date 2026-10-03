"use client";

import { useMemo, useState } from "react";
import { FEE_STRUCTURE, EXTRAS, APPLICATION_FEE, ADMIN_FEE, type PathwayKey } from "@/lib/school-data";
import { fmtZAR } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Calculator, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck,
  FileCheck2, MailCheck, Route, Send,
} from "lucide-react";

/* ────────────────────────────────────────────────────────
   FEE ESTIMATOR — multi-step → instant tuition breakdown
   ──────────────────────────────────────────────────────── */
export function FeeEstimator() {
  const [grade, setGrade] = useState("Grade 8");
  const [plan, setPlan] = useState<"MONTHLY_11" | "PER_TERM_4" | "ANNUAL">("MONTHLY_11");
  const [extras, setExtras] = useState<Record<string, boolean>>({ robotics: true });

  const row = FEE_STRUCTURE.find((f) => f.grade === grade)!;
  const extrasMonthly = EXTRAS.filter((e) => extras[e.key]).reduce((s, e) => s + e.monthly, 0);

  const breakdown = useMemo(() => {
    const tuitionAnnual = row.annual;
    const extrasAnnual = extrasMonthly * 12;
    const totalAnnual = tuitionAnnual + extrasAnnual;
    let scheduleLabel = "";
    let perInstallment = 0;
    let installments = 1;
    if (plan === "MONTHLY_11") { installments = 11; scheduleLabel = "11 monthly debits (Jan–Nov)"; perInstallment = totalAnnual / 11; }
    if (plan === "PER_TERM_4") { installments = 4; scheduleLabel = "4 term payments"; perInstallment = totalAnnual / 4; }
    if (plan === "ANNUAL") { installments = 1; scheduleLabel = "Single annual payment (5% early-settlement discount applied on tuition)"; perInstallment = totalAnnual - tuitionAnnual * 0.05; }
    return { tuitionAnnual, extrasAnnual, totalAnnual, perInstallment, installments, scheduleLabel, onceOff: APPLICATION_FEE + ADMIN_FEE };
  }, [row, extrasMonthly, plan]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h4 className="flex items-center gap-2 font-serif text-xl font-bold text-navy">
          <Calculator className="h-5 w-5 text-gold" /> Build your fee plan
        </h4>

        <div className="mt-5 space-y-5">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {FEE_STRUCTURE.map((f) => (
                <button
                  key={f.grade}
                  onClick={() => setGrade(f.grade)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
                    grade === f.grade ? "bg-navy text-white shadow" : "bg-muted text-navy hover:bg-navy/10"
                  )}
                >
                  {f.grade}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment plan</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([
                ["MONTHLY_11", "11× Monthly"],
                ["PER_TERM_4", "4× Per term"],
                ["ANNUAL", "1× Annual"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPlan(key)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-xs font-bold transition-all",
                    plan === key ? "border-gold bg-gold/10 text-navy shadow-sm" : "border-border text-muted-foreground hover:border-gold/50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Optional extras</Label>
            <div className="mt-2 space-y-2">
              {EXTRAS.map((e) => (
                <label key={e.key} className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-3.5 py-2.5 transition-colors hover:bg-muted/50">
                  <span className="flex items-center gap-3">
                    <Checkbox
                      checked={!!extras[e.key]}
                      onCheckedChange={(v) => setExtras((p) => ({ ...p, [e.key]: !!v }))}
                      aria-label={e.label}
                    />
                    <span className="text-sm font-medium text-navy">{e.label}</span>
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">+{fmtZAR(e.monthly)}/m</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live breakdown */}
      <div className="rounded-2xl border border-navy/20 bg-navy p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-xl font-bold">Your instant estimate</h4>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-soft">Live</span>
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-white/70">{grade} annual tuition (2026)</span>
            <span className="font-bold">{fmtZAR(breakdown.tuitionAnnual)}</span>
          </div>
          {breakdown.extrasAnnual > 0 && (
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/70">Selected extras (annualised)</span>
              <span className="font-bold text-emerald-brand">{fmtZAR(breakdown.extrasAnnual)}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-white/70">Once-off (application + admin)</span>
            <span className="font-bold">{fmtZAR(breakdown.onceOff)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base">
            <span className="font-semibold">Total annual</span>
            <span className="font-black text-gold">{fmtZAR(breakdown.totalAnnual)}</span>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-white/5 p-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-gold-soft">{breakdown.scheduleLabel}</div>
          <div className="mt-1 font-mono text-2xl font-black">
            {fmtZAR(breakdown.perInstallment)}
            <span className="ml-1 text-xs font-normal text-white/50">/ installment</span>
          </div>
          <div className="mt-1 text-[11px] text-white/50">
            {breakdown.installments} installment{breakdown.installments > 1 ? "s" : ""} · Sibling discounts available on request
          </div>
        </div>
        <p className="mt-4 text-[10px] leading-relaxed text-white/40">
          Indicative pricing based on the published 2026 fee schedule. Final quotation issued by the Bursar&apos;s
          office on application. Includes textbooks on loan at no additional cost.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   APPLICATION WIZARD — 4-step pipeline with tracking
   ──────────────────────────────────────────────────────── */
const STEPS = ["Learner", "Guardian", "Enrolment", "Review"] as const;

export function ApplicationWizard() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);
  const [form, setForm] = useState({
    studentFirst: "", studentLast: "", dob: "", grade: "Grade 8", pathway: "DUAL" as PathwayKey,
    guardianFirst: "", guardianLast: "", email: "", phone: "", startTerm: "January 2027", heardFrom: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const canNext =
    (step === 0 && form.studentFirst && form.studentLast && form.dob) ||
    (step === 1 && form.guardianFirst && form.guardianLast && form.email.includes("@") && form.phone.length >= 9) ||
    step === 2 || step === 3;

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setTracking(json.application.trackingCode);
      toast.success("Application submitted!", { description: `Tracking code: ${json.application.trackingCode}` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (tracking) {
    return (
      <div className="rounded-2xl border border-emerald-brand/30 bg-emerald-brand/5 p-8 text-center shadow-sm">
        <MailCheck className="mx-auto h-12 w-12 text-emerald-brand" />
        <h4 className="mt-4 font-serif text-2xl font-bold text-navy">Application received</h4>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you, {form.guardianFirst}. Our admissions office will contact you within 2 working days
          to schedule the assessment. Keep your tracking code handy:
        </p>
        <div className="mx-auto mt-4 inline-block rounded-xl bg-navy px-6 py-3 font-mono text-lg font-black tracking-wider text-gold">
          {tracking}
        </div>
        <div className="mx-auto mt-6 max-w-lg">
          <PipelineProgress status="SUBMITTED" />
        </div>
        <button onClick={() => { setTracking(null); setStep(0); }} className="mt-6 text-xs font-semibold text-navy underline underline-offset-4">
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black transition-all",
                i < step ? "bg-emerald-brand text-white" : i === step ? "bg-navy text-white ring-4 ring-navy/15" : "bg-muted text-muted-foreground"
              )}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </button>
            <span className={cn("hidden text-xs font-bold sm:block", i === step ? "text-navy" : "text-muted-foreground")}>{s}</span>
            {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1 rounded", i < step ? "bg-emerald-brand" : "bg-muted")} />}
          </div>
        ))}
      </div>
      <Progress value={((step + 1) / 4) * 100} className="mt-3 h-1" />

      <div className="mt-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Learner first name" value={form.studentFirst} onChange={(v) => set("studentFirst", v)} placeholder="e.g. Aaliyah" />
            <Field label="Learner last name" value={form.studentLast} onChange={(v) => set("studentLast", v)} placeholder="e.g. Ismail" />
            <Field label="Date of birth" value={form.dob} onChange={(v) => set("dob", v)} type="date" />
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applying for</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FEE_STRUCTURE.map((f) => (
                  <button key={f.grade} onClick={() => set("grade", f.grade)}
                    className={cn("rounded-full px-3 py-1.5 text-xs font-bold", form.grade === f.grade ? "bg-navy text-white" : "bg-muted text-navy")}>
                    {f.grade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Guardian first name" value={form.guardianFirst} onChange={(v) => set("guardianFirst", v)} placeholder="e.g. Faldela" />
            <Field label="Guardian last name" value={form.guardianLast} onChange={(v) => set("guardianLast", v)} placeholder="e.g. Ismail" />
            <Field label="Email address" value={form.email} onChange={(v) => set("email", v)} type="email" placeholder="you@example.co.za" />
            <Field label="Mobile number" value={form.phone} onChange={(v) => set("phone", v)} type="tel" placeholder="082 123 4567" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Curriculum pathway</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(["CAPS", "CAMBRIDGE", "DUAL"] as PathwayKey[]).map((p) => (
                  <button key={p} onClick={() => set("pathway", p)}
                    className={cn("rounded-xl border px-4 py-3 text-left transition-all", form.pathway === p ? "border-gold bg-gold/10 shadow-sm" : "border-border hover:border-gold/50")}>
                    <div className="text-sm font-bold text-navy">{p === "CAPS" ? "CAPS" : p === "CAMBRIDGE" ? "Cambridge" : "Dual Pathway"}</div>
                    <div className="text-[10px] text-muted-foreground">{p === "CAPS" ? "NSC Matric" : p === "CAMBRIDGE" ? "IGCSE / A-Levels" : "CAPS + Cambridge"}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred start</Label>
                <div className="mt-2 flex gap-2">
                  {["January 2027", "January 2028"].map((t) => (
                    <button key={t} onClick={() => set("startTerm", t)}
                      className={cn("rounded-full px-3.5 py-1.5 text-xs font-bold", form.startTerm === t ? "bg-navy text-white" : "bg-muted text-navy")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="How did you hear about us?" value={form.heardFrom} onChange={(v) => set("heardFrom", v)} placeholder="Friend, Instagram, Google…" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-xl border border-dashed border-navy/25 bg-muted/40 p-5">
            <h5 className="flex items-center gap-2 font-bold text-navy"><ClipboardCheck className="h-4 w-4 text-gold" /> Review & confirm</h5>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Row k="Learner" v={`${form.studentFirst} ${form.studentLast}`} />
              <Row k="Date of birth" v={form.dob} />
              <Row k="Grade" v={form.grade} />
              <Row k="Pathway" v={form.pathway} />
              <Row k="Guardian" v={`${form.guardianFirst} ${form.guardianLast}`} />
              <Row k="Email" v={form.email} />
              <Row k="Phone" v={form.phone} />
              <Row k="Start" v={form.startTerm} />
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              By submitting you consent to the admissions office processing this information in line with our
              privacy policy (POPIA compliant). Application fee of {fmtZAR(APPLICATION_FEE)} is payable on assessment booking.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="bg-navy hover:bg-navy-soft">
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting} className="bg-gold font-bold text-navy-deep hover:bg-gold-soft">
            <Send className="mr-1.5 h-4 w-4" /> {submitting ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Pipeline progress shared by portal & tracker ── */
const PIPELINE = [
  { key: "SUBMITTED", label: "Application submitted", icon: FileCheck2 },
  { key: "ASSESSMENT", label: "Assessment booked", icon: ClipboardCheck },
  { key: "INTERVIEW", label: "Campus interview", icon: Route },
  { key: "REGISTERED", label: "Registration complete", icon: CheckCircle2 },
];

export function PipelineProgress({ status }: { status: string }) {
  const activeIdx = PIPELINE.findIndex((p) => p.key === status);
  return (
    <ol className="space-y-0">
      {PIPELINE.map((p, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <li key={p.key} className="relative flex gap-3 pb-4 last:pb-0">
            {i < PIPELINE.length - 1 && (
              <span className={cn("absolute left-[13px] top-7 h-full w-0.5", done ? "bg-emerald-brand" : "bg-border")} />
            )}
            <span className={cn(
              "z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black",
              done ? "bg-emerald-brand text-white" : active ? "bg-gold text-navy-deep ring-4 ring-gold/20" : "bg-muted text-muted-foreground"
            )}>
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn("pt-1 text-sm font-semibold", active ? "text-navy" : done ? "text-emerald-brand" : "text-muted-foreground")}>
              {p.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2"
      />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-xs font-bold uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium text-navy">{v || "—"}</dd>
    </div>
  );
}
