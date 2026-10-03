"use client";

import { useState } from "react";
import { ABOUT_TEXT, LEADERSHIP_MESSAGES, SCHOOL_TERMS_2026, PAYMENT_POLICY } from "@/lib/school-data";
import { useT } from "@/store/lang-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck, Globe2, HeartHandshake, Palette, Quote, CalendarRange, Landmark, ChevronDown, Wallet, ReceiptText, PenLine,
} from "lucide-react";

const PILLARS = [
  { icon: BookOpenCheck, title: "about.pillar1", sub: "about.pillar1Sub" },
  { icon: Globe2, title: "about.pillar2", sub: "about.pillar2Sub" },
  { icon: HeartHandshake, title: "about.pillar3", sub: "about.pillar3Sub" },
  { icon: Palette, title: "about.pillar4", sub: "about.pillar4Sub" },
] as const;

function MessageCard({ m, idx }: { m: (typeof LEADERSHIP_MESSAGES)[number]; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const t = useT();
  return (
    <figure className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-navy to-navy-deep font-serif text-sm font-black text-gold">
          {m.initials}
        </span>
        <div>
          <div className="text-sm font-bold text-navy">{m.name}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gold">{m.role}</div>
        </div>
        <Quote className="ml-auto h-5 w-5 shrink-0 text-navy/15" aria-hidden />
      </div>
      <blockquote
        className={cn(
          "mt-4 text-[13px] leading-relaxed text-muted-foreground",
          !expanded && "line-clamp-4"
        )}
      >
        {m.text}
      </blockquote>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 inline-flex items-center gap-1 self-start text-[11px] font-bold uppercase tracking-wider text-navy hover:text-gold"
        aria-expanded={expanded}
      >
        {expanded ? t("about.readLess") : t("about.readMore")}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
      </button>
      <figcaption className="sr-only">Message {idx + 1} from school leadership</figcaption>
    </figure>
  );
}

export function AboutSection() {
  const t = useT();
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-navy">
            <Landmark className="h-3.5 w-3.5 text-gold" /> {t("about.kicker")}
          </div>
          <h2 className="mt-4 font-serif text-3xl font-bold text-navy sm:text-4xl">{t("about.title")}</h2>
        </div>

        {/* Real school copy */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {ABOUT_TEXT.map((p, i) => (
            <p key={i} className={cn("leading-relaxed text-muted-foreground", i === 0 && "text-base font-medium text-navy/90 sm:text-lg")}>
              {p}
            </p>
          ))}
        </div>

        {/* Pillars (from the school's "learning environment" pillars) */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <p.icon className="h-6 w-6 text-gold" aria-hidden />
              <h3 className="mt-3 text-sm font-bold text-navy">{t(p.title)}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t(p.sub)}</p>
            </div>
          ))}
        </div>

        {/* Leadership messages — real, signed */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {LEADERSHIP_MESSAGES.map((m, i) => (
            <MessageCard key={m.key} m={m} idx={i} />
          ))}
        </div>

        {/* 2026 terms + payment policy (real published data) */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border bg-navy-deep p-6 text-white shadow-md">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-gold" />
              <h3 className="font-serif text-lg font-bold">2026 School Terms</h3>
              <Badge className="ml-auto border-0 bg-gold/20 text-[9px] font-black uppercase tracking-wider text-gold-soft">
                Official
              </Badge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {SCHOOL_TERMS_2026.map((s) => (
                <div key={s.term} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-soft">{s.term}</dt>
                  <dd className="mt-0.5 text-sm font-semibold">{s.dates}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-gold" />
              <h3 className="font-serif text-lg font-bold text-navy">Payment Policy</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border px-4 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <ReceiptText className="h-3 w-3" /> Application Fee
                </div>
                <div className="mt-0.5 text-lg font-black text-navy">{PAYMENT_POLICY.applicationFee}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Landmark className="h-3 w-3" /> Administration
                </div>
                <div className="mt-0.5 text-lg font-black text-navy">{PAYMENT_POLICY.administrationFee}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAYMENT_POLICY.paymentOptions.map((o) => (
                <Badge key={o} variant="outline" className="border-navy/15 text-[11px] font-semibold text-navy">
                  {o}
                </Badge>
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
              <li className="flex gap-2">
                <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span><strong className="text-navy">Early payment:</strong> {PAYMENT_POLICY.earlyDiscount}</span>
              </li>
              <li className="flex gap-2">
                <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span><strong className="text-navy">Textbooks:</strong> {PAYMENT_POLICY.textbooks}</span>
              </li>
              <li className="flex gap-2">
                <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span><strong className="text-navy">Stationery:</strong> {PAYMENT_POLICY.stationery}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
