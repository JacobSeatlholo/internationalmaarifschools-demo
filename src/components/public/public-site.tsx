"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import { Proof } from "./proof";
import { PathwayMapper } from "./pathway-mapper";
import { FeeEstimator, ApplicationWizard } from "./admissions";
import { TeamSection } from "./campus";
import { SiteFooter } from "./site-footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Atom, Sparkles, Building2, Users, GraduationCap } from "lucide-react";

const StemLab = dynamic(() => import("./stem-lab").then((m) => ({ default: m.StemLab })), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-2xl border bg-navy-deep sm:h-[520px]">
      <div className="text-center">
        <Atom className="mx-auto h-10 w-10 animate-spin text-gold" style={{ animationDuration: "3s" }} />
        <p className="mt-3 text-sm font-medium text-white/70">Initialising 3D STEM Lab…</p>
      </div>
    </div>
  ),
});

function SectionHeader({ kicker, title, blurb, icon: Icon }: {
  kicker: string; title: string; blurb: string; icon: React.ElementType;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-navy">
        <Icon className="h-3.5 w-3.5 text-gold" /> {kicker}
      </div>
      <h2 className="mt-4 font-serif text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{blurb}</p>
    </div>
  );
}

export function PublicSite() {
  const [applyOpen, setApplyOpen] = useState(false);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onApply={() => setApplyOpen(true)} />

      <main>
        <Hero onApply={() => setApplyOpen(true)} onExplore={() => scrollTo("stem")} />

        {/* ── 3D STEM LAB ── */}
        <section id="stem" className="brand-grid-bg py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker="Interactive 3D STEM Lab"
              title="See how our learners see science"
              blurb="A live taste of the STREAM classroom. Rotate, explode and inspect real curriculum constructs — the same models our teachers use to turn abstract concepts into intuition."
              icon={Atom}
            />
            <StemLab />
          </div>
        </section>

        {/* ── PATHWAYS ── */}
        <section id="pathways" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker="Dynamic Subject & Pathway Mapper"
              title="Two curricula. Every door open."
              blurb="Select a grade and pathway to map subjects, university entry points and career trajectories — from UCT to the Russell Group."
              icon={GraduationCap}
            />
            <PathwayMapper />
          </div>
        </section>

        {/* ── PROOF ── */}
        <Proof />

        {/* ── CAMPUS + TEAM ── */}
        <section id="campus" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div id="team">
              <SectionHeader
                kicker="Faculty & Campus Life"
                title="The people behind the promise"
                blurb="HPCSA-registered wellness support, subject specialists and a leadership team that answers the phone."
                icon={Users}
              />
            </div>
            <TeamSection />
          </div>
        </section>

        {/* ── ADMISSIONS ── */}
        <section id="admissions" className="bg-muted/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker="Admissions & Fees"
              title="Plan fees in a minute. Apply in four steps."
              blurb="Transparent, instant and pressure-free — exactly how admissions should feel."
              icon={Sparkles}
            />
            <FeeEstimator />
            <div className="mt-12">
              <h3 className="mb-5 text-center font-serif text-2xl font-bold text-navy">
                Start your application
              </h3>
              <ApplicationWizard />
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="relative overflow-hidden py-16">
          { }
          <img src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e701f82e39f9.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
          <div className="absolute inset-0 bg-navy-deep/85" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <Building2 className="mx-auto h-8 w-8 text-gold" />
            <h3 className="mt-3 font-serif text-3xl font-bold text-white">
              Now enrolling Grade 8–12 for January 2027
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              Seats are limited to preserve our 1:14 ratio. Book a campus tour, meet the principal,
              and see the STREAM lab in action.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setApplyOpen(true)}
                className="inline-flex h-12 items-center rounded-full bg-gold px-8 text-sm font-bold text-navy-deep shadow-xl transition-transform hover:-translate-y-0.5"
              >
                Apply Now
              </button>
              <a
                href={`https://wa.me/27213007527?text=${encodeURIComponent("Hello! I'd like to book a campus tour for International Maarif Schools Cape Town.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full border border-white/25 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Book a Campus Tour on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Apply dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-navy">Application for Admission</DialogTitle>
            <DialogDescription>
              Grade 8–12 · Claremont Campus · January 2027 intake
            </DialogDescription>
          </DialogHeader>
          <ApplicationWizard />
        </DialogContent>
      </Dialog>
    </div>
  );
}
