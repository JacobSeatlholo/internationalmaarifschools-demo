"use client";

import { PROOF_STATS, TESTIMONIALS, ACCREDITATIONS } from "@/lib/school-data";
import { Badge } from "@/components/ui/badge";
import { Quote, ShieldCheck, Star } from "lucide-react";

export function Proof() {
  return (
    <section className="relative bg-navy-deep py-20 text-white" id="proof">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Proof stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="font-serif text-4xl font-black text-gold">{s.value}</div>
              <div className="mt-1 text-sm font-bold">{s.label}</div>
              <div className="text-xs text-white/50">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl glass-dark p-6">
              <Quote className="h-6 w-6 text-gold" aria-hidden />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-white/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-[11px] text-gold-soft">{t.role}</div>
                </div>
                <div className="flex gap-0.5" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Accreditations */}
        <div className="mt-14">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">
            <ShieldCheck className="h-4 w-4" /> Registrations & quality assurance
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ACCREDITATIONS.map((a) => (
              <div key={a.name} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <Badge className="mt-0.5 shrink-0 border-0 bg-gold/20 text-[9px] font-black uppercase tracking-wider text-gold-soft">
                  Verified
                </Badge>
                <div>
                  <div className="text-sm font-bold">{a.name}</div>
                  <div className="text-[11px] leading-snug text-white/55">{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
