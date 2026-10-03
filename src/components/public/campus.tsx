"use client";

import { useState } from "react";
import { PUBLIC_TEAM, IMAGES } from "@/lib/images";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, BookOpen, Camera, MapPin } from "lucide-react";

/**
 * Faculty grid — re-architected per P0 repair:
 * CSS grid `repeat(auto-fill, minmax(280px, 1fr))`, aspect-[4/5] locked cards,
 * initials-avatar fallbacks, overlay typography that can never clip.
 */
export function TeamSection() {
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {PUBLIC_TEAM.map((m) => (
          <article
            key={m.name}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border bg-navy shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Gradient avatar card — no photo clipping possible */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-soft to-navy-deep" aria-hidden />
            <div
              className="absolute inset-0 opacity-[0.07] brand-grid-bg"
              aria-hidden
              style={{ backgroundImage: undefined }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-gold/40 bg-navy-deep font-serif text-3xl font-black text-gold shadow-inner transition-transform duration-300 group-hover:scale-105">
                {m.initials}
              </div>
            </div>

            {/* Bottom overlay — safe area, never overlapping initials */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/85 to-transparent p-5 pt-10">
              <h4 className="font-serif text-lg font-bold leading-tight text-white">{m.name}</h4>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-gold">{m.role}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/65">
                <BookOpen className="h-3 w-3 shrink-0" /> {m.subject}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/45">
                <Award className="h-3 w-3 shrink-0" /> {m.tenure}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Campus gallery */}
      <div className="mt-14">
        <div className="mb-5 flex items-center gap-2">
          <Camera className="h-5 w-5 text-gold" />
          <h4 className="font-serif text-xl font-bold text-navy">Life at Claremont</h4>
          <Badge variant="outline" className="ml-2 border-navy/20 text-[10px] text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" /> 44 Imam Haron Road
          </Badge>
        </div>
        <Gallery />
      </div>
    </div>
  );
}

function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {IMAGES.gallery.map((g, i) => (
          <button
            key={g.src}
            onClick={() => setActive(i)}
            className={cn(
              "group relative overflow-hidden rounded-xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
              i % 5 === 0 ? "aspect-[4/3]" : "aspect-[4/3]"
            )}
            aria-label={`Open photo: ${g.alt}`}
          >
            { }
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 to-transparent px-3 py-2 text-left text-[11px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {g.label}
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-navy-deep/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={IMAGES.gallery[active].alt}
        >
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            { }
            <img
              src={IMAGES.gallery[active].src}
              alt={IMAGES.gallery[active].alt}
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm font-semibold text-white/85">
              {IMAGES.gallery[active].label} — {IMAGES.gallery[active].alt}
            </figcaption>
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
