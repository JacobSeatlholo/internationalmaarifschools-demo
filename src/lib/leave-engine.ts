/**
 * BCEA-Compliant Leave Engine for South African Schools
 *
 * Implements:
 *  - BCEA s21: Annual leave — 21 consecutive days per leave cycle ≈ 15 working days (5-day week)
 *  - BCEA s22: Sick leave — 36-month cycle = workdays in 6 weeks (30 days for 5-day week)
 *  - BCEA s27: Family responsibility — 3 days per annual cycle
 *  - Study leave — per school contract (5 days)
 *
 * Working-day calculation excludes weekends, gazetted SA public holidays
 * (with 2026 Sunday-observance shifts) and gazetted school holiday periods
 * for staff on the school calendar.
 */

// ── 2026 South African public holidays (gazetted) ──────────────
export const SA_PUBLIC_HOLIDAYS_2026 = new Set([
  "2026-01-01", // New Year's Day
  "2026-03-21", // Human Rights Day (Saturday — no shift published)
  "2026-04-03", // Good Friday
  "2026-04-06", // Family Day
  "2026-04-27", // Freedom Day (Monday)
  "2026-05-01", // Workers' Day
  "2026-06-16", // Youth Day
  "2026-08-10", // Women's Day observed (9 Aug falls Sunday)
  "2026-09-24", // Heritage Day
  "2026-12-16", // Day of Reconciliation
  "2026-12-25", // Christmas Day
  "2026-12-26", // Day of Goodwill (Saturday)
]);

// ── 2026 school calendar (WCED / school terms) ─────────────────
export const SCHOOL_TERMS_2026 = [
  { term: 1, start: "2026-01-14", end: "2026-03-27" },
  { term: 2, start: "2026-04-08", end: "2026-06-26" },
  { term: 3, start: "2026-07-21", end: "2026-09-18" },
  { term: 4, start: "2026-10-06", end: "2026-12-09" },
];

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isSchoolDay(dateISO: string): boolean {
  const d = new Date(dateISO + "T00:00:00Z");
  const day = d.getUTCDay();
  if (day === 0 || day === 6) return false;
  if (SA_PUBLIC_HOLIDAYS_2026.has(dateISO)) return false;
  const inTerm = SCHOOL_TERMS_2026.some(
    (t) => dateISO >= t.start && dateISO <= t.end
  );
  return inTerm;
}

export interface LeaveSpan {
  start: string; // ISO
  end: string;   // ISO inclusive
}

/**
 * Counts working school days between two dates inclusive.
 * mode: "SCHOOL" (default) excludes school holidays + public holidays;
 *       "ADMIN" only excludes weekends + public holidays (admin/YoY staff).
 */
export function countWorkingDays(span: LeaveSpan, mode: "SCHOOL" | "ADMIN" = "SCHOOL"): number {
  const start = new Date(span.start + "T00:00:00Z");
  const end = new Date(span.end + "T00:00:00Z");
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const iso = toISODate(cursor);
    const dow = cursor.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const publicHol = SA_PUBLIC_HOLIDAYS_2026.has(iso);
    if (!weekend && !publicHol) {
      if (mode === "ADMIN" || isSchoolDay(iso)) count++;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

export const LEAVE_TYPES = {
  ANNUAL:  { label: "Annual Leave",        note: "BCEA s21 — 21 consecutive days per cycle ≈ 15 working days" },
  SICK:    { label: "Sick Leave",          note: "BCEA s22 — 36-month cycle: 30 working days" },
  FAMILY:  { label: "Family Responsibility", note: "BCEA s27 — 3 days per annual cycle" },
  STUDY:   { label: "Study Leave",         note: "Per school contract — 5 days per annum" },
} as const;

export type LeaveTypeKey = keyof typeof LEAVE_TYPES;

export interface LeaveBalanceView {
  annualEntitlement: number; annualTaken: number; annualRemaining: number;
  sickEntitlement: number;   sickTaken: number;   sickRemaining: number;
  familyEntitlement: number; familyTaken: number; familyRemaining: number;
  studyEntitlement: number;  studyTaken: number;  studyRemaining: number;
  cycleStart: string;
}

export function viewBalance(b: {
  cycleStart: string;
  annualEntitlement: number; annualTaken: number;
  sickEntitlement: number;   sickTaken: number;
  familyEntitlement: number; familyTaken: number;
  studyEntitlement: number;  studyTaken: number;
}): LeaveBalanceView {
  return {
    cycleStart: b.cycleStart,
    annualEntitlement: b.annualEntitlement, annualTaken: b.annualTaken, annualRemaining: b.annualEntitlement - b.annualTaken,
    sickEntitlement: b.sickEntitlement,     sickTaken: b.sickTaken,     sickRemaining: b.sickEntitlement - b.sickTaken,
    familyEntitlement: b.familyEntitlement, familyTaken: b.familyTaken, familyRemaining: b.familyEntitlement - b.familyTaken,
    studyEntitlement: b.studyEntitlement,   studyTaken: b.studyTaken,   studyRemaining: b.studyEntitlement - b.studyTaken,
  };
}

/** Finds free staff for substitute dispatch: not teaching that (day,period) and not on approved leave. */
export function findFreeStaff(
  candidates: { id: string; name: string; department: string; entries: { day: number; period: number }[]; onLeaveDays: Set<string> }[],
  day: number,
  period: number,
  dateISO: string
) {
  return candidates.filter(
    (c) =>
      !c.entries.some((e) => e.day === day && e.period === period) &&
      !c.onLeaveDays.has(dateISO)
  );
}
