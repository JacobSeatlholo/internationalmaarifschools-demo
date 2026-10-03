"use client";

import { useState } from "react";
import { PUBLIC_TEAM, EDUCATORS } from "@/lib/images";
import { useT } from "@/store/lang-store";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap } from "lucide-react";

/**
 * Faculty grid — re-architected per P0 repair:
 * CSS grid `repeat(auto-fill, minmax(280px, 1fr))`, aspect-[4/5] locked cards,
 * initials-avatar fallbacks, overlay typography that can never clip.
 */
export function TeamSection() {
  const t = useT();
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {PUBLIC_TEAM.map((m) => (
          <article
            key={m.name}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border bg-navy shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            {m.photo ? (
              /* Real portrait — object-cover can never distort, only crop safely */
              <img
                src={m.photo}
                alt={`${m.name} — ${m.role}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-soft to-navy-deep" aria-hidden />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-gold/40 bg-navy-deep font-serif text-3xl font-black text-gold shadow-inner transition-transform duration-300 group-hover:scale-105">
                    {m.initials}
                  </div>
                </div>
              </>
            )}

            {/* Bottom overlay — safe area, never overlapping the portrait face */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/85 to-transparent p-5 pt-10">
              <h4 className="font-serif text-lg font-bold leading-tight text-white">{m.name}</h4>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-gold">{m.role}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/65">
                <BookOpen className="h-3 w-3 shrink-0" /> {m.detail}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Real educator wall — the school's published team cards, shown as-is */}
      <div className="mt-16">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <GraduationCap className="h-5 w-5 text-gold" />
          <h4 className="font-serif text-xl font-bold text-navy">{t("team.educatorsTitle")}</h4>
          <Badge variant="outline" className="ml-auto border-navy/20 text-[10px] text-muted-foreground">
            {EDUCATORS.length} staff · Cape Town High School
          </Badge>
        </div>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {t("team.educatorsSub")}
        </p>
        <EducatorsWall />
      </div>
    </div>
  );
}

/**
 * The real team cards from the school's website — names are printed on the
 * photographs themselves, so they render untouched (contain + no overlay).
 */
function EducatorsWall() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {EDUCATORS.map((e, i) => (
          <button
            key={e.src}
            onClick={() => setActive(i)}
            className="group relative aspect-[1414/2000] overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            aria-label={`Open staff card ${i + 1}`}
          >
            <img
              src={e.src}
              alt={e.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-navy-deep/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={EDUCATORS[active].alt}
        >
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={EDUCATORS[active].src}
              alt={EDUCATORS[active].alt}
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
            />
          </figure>
          <button
            className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close photo"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
