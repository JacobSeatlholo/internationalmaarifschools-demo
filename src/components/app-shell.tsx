"use client";

import { useAppStore, ROLE_PRESETS, type Role } from "@/store/app-store";
import { PublicSite } from "@/components/public/public-site";
import { PortalShell } from "@/components/portal/portal-shell";
import { ErpShell } from "@/components/erp/erp-shell";
import { FinancialHub } from "@/components/erp/financial-hub";
import { OcrModule } from "@/components/erp/ocr-module";
import { LeaveEngine } from "@/components/erp/leave-engine";
import { Substitutes } from "@/components/erp/substitutes";
import { MeetingScheduler } from "@/components/erp/meeting-scheduler";
import { KanbanSla } from "@/components/erp/kanban-sla";
import { CommsChannel } from "@/components/erp/comms-channel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, LineChart, ShieldCheck, Sparkles, Wallet, Stethoscope, Radio, LayoutDashboard, Users2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ERP_ROLES: Role[] = ["BURSAR", "EXECUTIVE", "PRINCIPAL", "TEACHER", "DEPT_HEAD"];

const ROLE_GROUPS: { title: string; roles: (keyof typeof ROLE_PRESETS)[]; icon: React.ElementType; blurb: string }[] = [
  { title: "Families", roles: ["PARENT", "STUDENT"], icon: GraduationCap, blurb: "Progression, showcase, fees & meetings" },
  { title: "Finance Office", roles: ["BURSAR"], icon: Wallet, blurb: "Fee ledger & OCR receipt approvals" },
  { title: "Educators", roles: ["TEACHER", "DEPT_HEAD"], icon: Stethoscope, blurb: "Leave, cover dispatch & tasks" },
  { title: "Executive", roles: ["PRINCIPAL", "EXECUTIVE"], icon: LineChart, blurb: "Full ERP command center access" },
];

export function AppShell() {
  const { view, user, login, setView } = useAppStore();

  /* ── Public site ── */
  if (view === "public") return <PublicSite />;

  /* ── Role gate ── */
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-navy-deep">
        <div className="absolute inset-0 brand-grid-bg opacity-40" aria-hidden />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-brand/10 blur-3xl" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold to-gold-soft text-2xl font-black text-navy-deep shadow-2xl shadow-gold/30">
            M
          </span>
          <h1 className="mt-6 text-center font-serif text-3xl font-bold text-white sm:text-4xl">
            Maarif Cape Town <span className="text-gold-gradient">Digital Ecosystem</span>
          </h1>
          <p className="mt-3 max-w-lg text-center text-sm leading-relaxed text-white/60">
            One platform, three worlds: the public school site, the family portal, and the
            executive ERP. Select a demo identity to enter — roles gate what you can see.
          </p>

          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
            {ROLE_GROUPS.map((g) => (
              <div key={g.title} className="glass-dark rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold">
                    <g.icon className="h-4.5 w-4.5 h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white">{g.title}</div>
                    <div className="text-[10px] text-white/50">{g.blurb}</div>
                  </div>
                </div>
                <div className="mt-3.5 space-y-1.5">
                  {g.roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => { login(r); setView(r === "PARENT" || r === "STUDENT" ? "portal" : "erp"); toast.success(`Signed in as ${ROLE_PRESETS[r].name}`); }}
                      className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left transition-all hover:border-gold/50 hover:bg-gold/10"
                    >
                      <span className="text-xs font-bold text-white/85">{ROLE_PRESETS[r].name}</span>
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gold opacity-0 transition-opacity group-hover:opacity-100">
                        Enter <ArrowRight className="h-3 w-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setView("public")} className="mt-8 text-xs font-semibold text-white/50 underline underline-offset-4 hover:text-gold">
            ← Back to public site
          </button>
        </div>
      </div>
    );
  }

  /* ── Family portal ── */
  if (view === "portal" && (user.role === "PARENT" || user.role === "STUDENT")) {
    return <PortalShell />;
  }

  /* ── ERP ── */
  if (ERP_ROLES.includes(user.role)) {
    return (
      <ErpShell>
        {(section) => {
          switch (section) {
            case "financial": return <FinancialHub />;
            case "ocr": return <OcrModule />;
            case "leave": return <LeaveEngine currentUser={{ name: user.name, role: user.role }} />;
            case "substitutes": return <Substitutes currentUser={{ name: user.name, role: user.role }} />;
            case "meetings": return <MeetingScheduler base="" />;
            case "kanban": return <KanbanSla />;
            case "comms": return <CommsChannel currentUser={{ name: user.name, role: user.role }} />;
            default: return <FinancialHub />;
          }
        }}
      </ErpShell>
    );
  }

  /* Fallback: family role tried to open ERP */
  return <PortalShell />;
}
