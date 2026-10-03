"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LineChart, LockKeyhole, School, Globe2, Check } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLangStore, useT } from "@/store/lang-store";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV_KEYS = [
  { key: "stem", label: "nav.stem" },
  { key: "pathways", label: "nav.pathways" },
  { key: "campus", label: "nav.campus" },
  { key: "team", label: "nav.faculty" },
  { key: "admissions", label: "nav.admissions" },
] as const;

export function LanguageSwitcher({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLangStore();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language / verander taal / tshintsha ulwimi"
        aria-expanded={open}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-bold transition-colors",
          dark
            ? "border-white/25 text-white/85 hover:bg-white/10 hover:text-white"
            : "border-navy/25 text-navy hover:bg-navy/5"
        )}
      >
        <Globe2 className="h-3.5 w-3.5" />
        {current.short}
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Languages"
          className="absolute right-0 top-9 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-navy-deep/95 py-1 shadow-2xl backdrop-blur-md"
        >
          <div className="px-3 pb-1 pt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gold-soft">
            Western Cape · Iintshona-Koloni
          </div>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              onClick={() => {
                setLang(l.code as Lang);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-white/10",
                l.code === lang ? "text-gold" : "text-white/85"
              )}
            >
              <span>{l.native}</span>
              {l.code === lang && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ onApply }: { onApply: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setView } = useAppStore();
  const t = useT();

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
            {NAV_KEYS.map((n) => (
              <button
                key={n.key}
                onClick={() => go(n.key)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              >
                {t(n.label)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("portal")}
              className="hidden sm:inline-flex text-white/85 hover:text-white hover:bg-white/10"
            >
              <LockKeyhole className="mr-1.5 h-3.5 w-3.5" /> {t("nav.portal")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("erp")}
              className="hidden md:inline-flex text-white/85 hover:text-white hover:bg-white/10"
            >
              <LineChart className="mr-1.5 h-3.5 w-3.5" /> {t("nav.erp")}
            </Button>
            <Button
              size="sm"
              onClick={onApply}
              className="bg-gold text-navy-deep hover:bg-gold-soft font-semibold shadow-md shadow-gold/20"
            >
              <School className="mr-1.5 h-3.5 w-3.5" /> {t("nav.apply")}
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
            {NAV_KEYS.map((n) => (
              <button
                key={n.key}
                onClick={() => go(n.key)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                <GraduationCap className="h-4 w-4 text-gold" /> {t(n.label)}
              </button>
            ))}
            <button
              onClick={() => { setOpen(false); setView("portal"); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              <LockKeyhole className="h-4 w-4 text-gold" /> {t("nav.mobilePortal")}
            </button>
            <button
              onClick={() => { setOpen(false); setView("erp"); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              <LineChart className="h-4 w-4 text-gold" /> {t("nav.mobileErp")}
            </button>
            <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Globe2 className="h-4 w-4 text-gold" /> {t("nav.language")}
              </span>
              <div className="flex gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => useLangStore.getState().setLang(l.code)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold transition-colors",
                      l.code === useLangStore.getState().lang
                        ? "bg-gold text-navy-deep"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
