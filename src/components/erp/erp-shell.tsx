"use client";

import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet, ScanLine, CalendarClock, Users2, CalendarDays, LayoutDashboard,
  Radio, LogOut, School, ShieldAlert, Stethoscope,
} from "lucide-react";

const SECTIONS = [
  { key: "financial", label: "Financial Control Hub", icon: Wallet, roles: ["BURSAR", "EXECUTIVE", "PRINCIPAL"] },
  { key: "ocr", label: "OCR Receipt Processing", icon: ScanLine, roles: ["BURSAR", "EXECUTIVE", "PRINCIPAL"] },
  { key: "leave", label: "Leave & Medical Certificates", icon: Stethoscope, roles: ["EXECUTIVE", "PRINCIPAL", "TEACHER", "DEPT_HEAD"] },
  { key: "substitutes", label: "Substitute Dispatch", icon: Users2, roles: ["EXECUTIVE", "PRINCIPAL", "TEACHER", "DEPT_HEAD"] },
  { key: "meetings", label: "Meeting Scheduler", icon: CalendarDays, roles: ["BURSAR", "EXECUTIVE", "PRINCIPAL", "TEACHER", "DEPT_HEAD"] },
  { key: "kanban", label: "Task & SLA Center", icon: LayoutDashboard, roles: ["BURSAR", "EXECUTIVE", "PRINCIPAL", "TEACHER", "DEPT_HEAD"] },
  { key: "comms", label: "Comms & Directives", icon: Radio, roles: ["BURSAR", "EXECUTIVE", "PRINCIPAL", "TEACHER", "DEPT_HEAD"] },
];

const ROLE_ACCESS = {
  EXECUTIVE: ["financial", "ocr", "leave", "substitutes", "meetings", "kanban", "comms"],
  PRINCIPAL: ["financial", "ocr", "leave", "substitutes", "meetings", "kanban", "comms"],
  BURSAR: ["financial", "ocr", "meetings", "kanban", "comms"],
  TEACHER: ["leave", "substitutes", "meetings", "kanban", "comms"],
  DEPT_HEAD: ["leave", "substitutes", "meetings", "kanban", "comms"],
} as const;

export function ErpShell({ children }: { children: (section: string) => React.ReactNode }) {
  const { user, logout, setView, erpSection, setErpSection } = useAppStore();
  const allowed = (ROLE_ACCESS[user?.role as keyof typeof ROLE_ACCESS] ?? []) as string[];
  const visible = SECTIONS.filter((s) => allowed.includes(s.key));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-navy text-white lg:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-soft font-black text-navy-deep">M</span>
          <div className="leading-tight">
            <div className="text-xs font-bold tracking-wide">MAARIF ERP</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-gold-soft">Claremont Command</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4" aria-label="ERP sections">
          {visible.map((s) => (
            <button
              key={s.key}
              onClick={() => setErpSection(s.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all",
                erpSection === s.key
                  ? "bg-gold text-navy-deep shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              aria-current={erpSection === s.key ? "page" : undefined}
            >
              <s.icon className="h-4 w-4 shrink-0" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <div className="text-[11px] font-bold text-gold">{user?.name}</div>
            <div className="text-[10px] text-white/55">{user?.detail}</div>
            <Badge className="mt-2 border-0 bg-gold/20 text-[9px] font-black uppercase tracking-widest text-gold-soft">
              {user?.role}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setView("public")} className="flex-1 text-white/80 hover:bg-white/10 hover:text-white">
              <School className="mr-1 h-3.5 w-3.5" /> Site
            </Button>
            <Button size="sm" variant="ghost" onClick={logout} className="text-white/80 hover:bg-white/10 hover:text-white" aria-label="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile section nav */}
        <div className="border-b bg-navy px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white">MAARIF ERP · {user?.role}</div>
            <Button size="sm" variant="ghost" onClick={logout} className="text-white/80 hover:bg-white/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {visible.map((s) => (
              <button
                key={s.key}
                onClick={() => setErpSection(s.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold",
                  erpSection === s.key ? "bg-gold text-navy-deep" : "bg-white/10 text-white/80"
                )}
              >
                <s.icon className="h-3 w-3" /> {s.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children(allowed.includes(erpSection) ? erpSection : visible[0]?.key ?? "financial")}</div>
        </main>
      </div>
    </div>
  );
}

export function ErpHeader({ title, blurb, alertCount }: { title: string; blurb: string; alertCount?: number }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
      </div>
      {alertCount !== undefined && alertCount > 0 && (
        <Badge className="animate-slablink border-0 bg-destructive text-white">
          <ShieldAlert className="mr-1 h-3.5 w-3.5" /> {alertCount} SLA breach{alertCount > 1 ? "es" : ""} escalated
        </Badge>
      )}
    </div>
  );
}
