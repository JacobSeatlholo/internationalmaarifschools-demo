"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ShieldCheck, GraduationCap, FlaskConical, Users, Globe2 } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Video-First Hero Engine
 * - Plays a muted, auto-playing looping <video> when a source is configured.
 * - Falls back gracefully to a poster Ken-Burns slideshow when video is
 *   unavailable (P0 repair for the broken black-box embed).
 * - Floating proof-metric overlays give immediate trust signals.
 */

const HERO_VIDEO_SOURCES: string[] = []; // drop WebM/MP4 URLs here when footage is ready

const METRICS = [
  { icon: GraduationCap, value: "100%", label: "Cambridge pass rate" },
  { icon: FlaskConical, value: "Dual", label: "CAPS + Cambridge pathways" },
  { icon: Users, value: "1:14", label: "Teacher ratio" },
  { icon: Globe2, value: "55", label: "Countries in network" },
];

export function Hero({ onApply, onExplore }: { onApply: () => void; onExplore: () => void }) {
  const [slide, setSlide] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % IMAGES.heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-navy-deep">
      {/* ── Background layer: video with slideshow fallback ── */}
      <div className="absolute inset-0">
        {HERO_VIDEO_SOURCES.length > 0 && !videoFailed ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={IMAGES.heroSlides[0].src}
            onError={() => setVideoFailed(true)}
          >
            {HERO_VIDEO_SOURCES.map((src) => (
              <source key={src} src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
            ))}
          </video>
        ) : (
          <div className="relative h-full w-full">
            {IMAGES.heroSlides.map((s, i) => (
              <div
                key={s.src}
                className={cn(
                  "absolute inset-0 transition-opacity duration-[1600ms] ease-in-out",
                  i === slide ? "opacity-100" : "opacity-0"
                )}
                aria-hidden={i !== slide}
              >
                { }
                <img
                  src={s.src}
                  alt={i === slide ? s.alt : ""}
                  className={cn("h-full w-full object-cover", i === slide && "animate-kenburns")}
                />
              </div>
            ))}
          </div>
        )}
        {/* Navy scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy/75 to-navy-deep/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/60" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wide text-gold-soft">
              Claremont · Cape Town · Western Cape
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl font-bold text-white">
            Where Cape Town&apos;s
            <span className="block text-gold-gradient">brightest futures begin.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/80">
            A secular, co-educational Grade 8–12 high school offering a signature dual pathway —
            the South African CAPS curriculum alongside Cambridge International — with small classes,
            STREAM labs and a global network spanning 55 countries.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onApply}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-bold text-navy-deep shadow-xl shadow-gold/25 transition-all hover:bg-gold-soft hover:-translate-y-0.5"
            >
              Start Application <span aria-hidden>→</span>
            </button>
            <button
              onClick={onExplore}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
            >
              Explore the Campus
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
              WCED registered · Now enrolling for January 2027
            </span>
          </div>
        </div>

        {/* Floating proof metrics */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 max-w-3xl">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="glass-dark rounded-2xl px-4 py-4 transition-transform hover:-translate-y-1"
            >
              <m.icon className="mb-2 h-5 w-5 text-gold" aria-hidden />
              <div className="text-2xl font-black text-white">{m.value}</div>
              <div className="text-[11px] leading-snug text-white/65">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 right-6 z-10 hidden sm:flex gap-2">
        {IMAGES.heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Show slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === slide ? "w-7 bg-gold" : "w-3 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
