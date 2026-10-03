"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "GUEST" | "PARENT" | "STUDENT" | "TEACHER" | "DEPT_HEAD" | "BURSAR" | "EXECUTIVE" | "PRINCIPAL";
export type PortalView = "public" | "portal" | "erp";

export interface AuthUser {
  name: string;
  role: Role;
  detail: string;
}

export const ROLE_PRESETS: Record<string, AuthUser> = {
  PARENT: { name: "Faldela Ismail", role: "PARENT", detail: "Guardian of Aaliyah Ismail · Grade 11A" },
  STUDENT: { name: "Aaliyah Ismail", role: "STUDENT", detail: "Grade 11A · Dual Pathway (CAPS + AS-Levels)" },
  TEACHER: { name: "Sarah Petersen", role: "TEACHER", detail: "English Home Language · Loco parentis" },
  DEPT_HEAD: { name: "Thandiwe Mbeki", role: "DEPT_HEAD", detail: "Head of Sciences · Grade 12 PAT lead" },
  BURSAR: { name: "Fatima Vawda", role: "BURSAR", detail: "Finance & Fees Office" },
  EXECUTIVE: { name: "Mehmet Kaya", role: "EXECUTIVE", detail: "Executive Director · Maarif SA" },
  PRINCIPAL: { name: "Dr. Emre Aydın", role: "PRINCIPAL", detail: "Principal · Claremont Campus" },
};

interface AppState {
  view: PortalView;
  user: AuthUser | null;
  erpSection: string;
  portalSection: string;
  setView: (v: PortalView) => void;
  login: (role: keyof typeof ROLE_PRESETS) => void;
  logout: () => void;
  setErpSection: (s: string) => void;
  setPortalSection: (s: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "public",
      user: null,
      erpSection: "financial",
      portalSection: "overview",
      setView: (view) => set({ view }),
      login: (role) => set({ user: ROLE_PRESETS[role] }),
      logout: () => set({ user: null, view: "public" }),
      setErpSection: (erpSection) => set({ erpSection }),
      setPortalSection: (portalSection) => set({ portalSection }),
    }),
    { name: "maarif-session" }
  )
);
