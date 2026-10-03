"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LineChart, LockKeyhole, School } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "stem", label: "STEM Lab" },
  { key: "pathways", label: "Pathways" },
  { key: "campus", label: "Campus Life" },
  { key: "team", label: "Faculty" },
  { key: "admissions", label: "Admissions" },
];

export function SiteHeader({ onApply }: { onApply: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setView } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (key: string) => {
    setOpen(false);
    document.getElementById(key)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass-dark shadow-lg shadow-navy/20" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left"
            aria-label="Maarif Cape Town home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-soft text-navy-deep font-black text-sm shadow-md">
              M
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-bold tracking-wide text-white">MAARIF CAPE TOWN</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-gold-soft">Claremont Campus</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => go(n.key)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("portal")}
              className="hidden sm:inline-flex text-white/85 hover:text-white hover:bg-white/10"
            >
              <LockKeyhole className="mr-1.5 h-3.5 w-3.5" /> Portal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("erp")}
              className="hidden md:inline-flex text-white/85 hover:text-white hover:bg-white/10"
            >
              <LineChart className="mr-1.5 h-3.5 w-3.5" /> ERP
            </Button>
            <Button
              size="sm"
              onClick={onApply}
              className="bg-gold text-navy-deep hover:bg-gold-soft font-semibold shadow-md shadow-gold/20"
            >
              <School className="mr-1.5 h-3.5 w-3.5" /> Apply Now
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="lg:hidden text-white hover:bg-white/10"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass-dark border-t border-white/10">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col" aria-label="Mobile navigation">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => go(n.key)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                <GraduationCap className="h-4 w-4 text-gold" /> {n.label}
              </button>
            ))}
            <button
              onClick={() => { setOpen(false); setView("portal"); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              <LockKeyhole className="h-4 w-4 text-gold" /> Parent & Student Portal
            </button>
            <button
              onClick={() => { setOpen(false); setView("erp"); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              <LineChart className="h-4 w-4 text-gold" /> Executive ERP
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
