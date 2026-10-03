"use client";

import { SCHOOL } from "@/lib/site";
import { useT } from "@/store/lang-store";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear(); // P0 repair: copyright always current
  const t = useT();
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-soft font-black text-navy-deep">M</span>
              <div className="leading-tight">
                <div className="text-sm font-bold">INTERNATIONAL MAARIF SCHOOLS</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">Cape Town · Claremont</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {t("footer.blurb")}
            </p>
            <div className="mt-5 flex gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
                  aria-label={["Facebook", "Instagram", "Twitter / X"][i]}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">{t("footer.visit")}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{SCHOOL.street}, {SCHOOL.suburb}<br />{SCHOOL.city} {SCHOOL.postalCode}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`} className="hover:text-gold">{SCHOOL.phoneDisplay}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${SCHOOL.email}`} className="break-all hover:text-gold">{SCHOOL.email}</a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{SCHOOL.openingHours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">{t("footer.links")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li><a href="#stem" className="hover:text-gold">3D STEM Lab</a></li>
              <li><a href="#pathways" className="hover:text-gold">CAPS & Cambridge Pathways</a></li>
              <li><a href="#admissions" className="hover:text-gold">Admissions & Fee Estimator</a></li>
              <li><a href="#team" className="hover:text-gold">Faculty & Campus</a></li>
              <li><a href="#" className="hover:text-gold">Privacy Policy (POPIA)</a></li>
              <li><a href="#" className="hover:text-gold">Safeguarding Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/45 sm:flex-row">
          <span>© {year} {SCHOOL.name}. {t("footer.rights")}</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
            {t("footer.compliance")}
          </span>
        </div>
      </div>
    </footer>
  );
}
