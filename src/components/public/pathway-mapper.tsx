"use client";

import { useMemo, useState } from "react";
import { SUBJECTS_BY_GRADE, PATHWAYS, UNIVERSITY_PATHS, type PathwayKey } from "@/lib/school-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, Globe2, MapPin, ArrowRight } from "lucide-react";

const GRADES = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export function PathwayMapper() {
  const [grade, setGrade] = useState("Grade 10");
  const [pathway, setPathway] = useState<PathwayKey>("DUAL");

  const gradeData = SUBJECTS_BY_GRADE[grade];
  const subjects = useMemo(() => {
    // Dual Pathway learners take the full CAPS core plus Cambridge/DUAL electives — show everything.
    const filter = (list: typeof gradeData.core) =>
      pathway === "DUAL" ? list : list.filter((s) => s.streams.includes(pathway));
    return { core: filter(gradeData.core), electives: filter(gradeData.electives) };
  }, [gradeData, pathway]);

  const universities = pathway === "CAMBRIDGE" ? UNIVERSITY_PATHS.filter((u) => u.region === "Global") : UNIVERSITY_PATHS;

  return (
    <div>
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Step 1 · Select grade</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  grade === g ? "bg-navy text-white shadow-md" : "bg-muted text-navy hover:bg-navy/10"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Step 2 · Choose pathway</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(PATHWAYS) as PathwayKey[]).map((p) => (
              <button
                key={p}
                onClick={() => setPathway(p)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  pathway === p ? "bg-gold text-navy-deep shadow-md" : "bg-muted text-navy hover:bg-gold/20"
                )}
              >
                {PATHWAYS[p].badge}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{PATHWAYS[pathway].blurb}</p>
        </div>
      </div>

      {/* Subject map */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xl font-bold text-navy">{grade} Subject Map</h4>
            <Badge variant="outline" className="border-gold/50 bg-gold/10 text-navy">
              {PATHWAYS[pathway].badge}
            </Badge>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-brand">
              <BookOpen className="h-3.5 w-3.5" /> Core subjects
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {subjects.core.map((s) => (
                <div key={s.code} className="group rounded-xl border border-border bg-muted/40 p-3 transition-all hover:border-navy/30 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-navy">{s.name}</span>
                    {s.streams.length > 1 && <span className="shrink-0 rounded-full bg-navy/5 px-1.5 py-0.5 text-[9px] font-bold text-navy">DUAL</span>}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
              <GraduationCap className="h-3.5 w-3.5" /> Electives
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {subjects.electives.map((s) => (
                <div key={s.code} className="group rounded-xl border border-border bg-muted/40 p-3 transition-all hover:border-gold/40 hover:shadow-sm">
                  <span className="text-sm font-bold text-navy">{s.name}</span>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-navy/5 px-3 py-2 text-xs italic text-navy">{gradeData.cambridgeNote}</p>
        </div>

        {/* University timeline */}
        <div className="rounded-2xl border bg-navy p-6 text-white shadow-sm">
          <h4 className="font-serif text-xl font-bold flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-gold" /> Where this leads
          </h4>
          <p className="mt-1 text-xs text-white/60">University entry points unlocked by the {PATHWAYS[pathway].label} pathway.</p>
          <div className="mt-5 space-y-0">
            {universities.map((u, i) => (
              <div key={u.name} className="relative flex gap-4 pb-5 last:pb-0">
                {i < universities.length - 1 && (
                  <span className="absolute left-[13px] top-8 h-full w-px bg-gradient-to-b from-gold/60 to-transparent" aria-hidden />
                )}
                <span className="relative mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/15">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                </span>
                <div>
                  <div className="text-sm font-bold leading-tight">{u.name}</div>
                  <div className="mt-0.5 text-[11px] text-gold-soft">{u.requirement}</div>
                  <Badge className="mt-1.5 border-0 bg-white/10 text-[10px] text-white/80">{u.region}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed text-white/70">
            <ArrowRight className="mb-0.5 mr-1 inline h-3 w-3 text-gold" />
            Grade 9 subject-choice counselling maps every learner&apos;s dreams onto one of these routes before Grade 10 locks in.
          </div>
        </div>
      </div>
    </div>
  );
}
