import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { countWorkingDays, SA_PUBLIC_HOLIDAYS_2026, SCHOOL_TERMS_2026 } from "@/lib/leave-engine";

export async function GET() {
  const staff = await db.staff.findMany({
    include: {
      leaveBalances: true,
      leaveRequests: { include: { doctorNote: true }, orderBy: { createdAt: "desc" } },
    },
  });
  const meta = {
    publicHolidays: Array.from(SA_PUBLIC_HOLIDAYS_2026).sort(),
    schoolTerms: SCHOOL_TERMS_2026,
  };
  return NextResponse.json({ staff, meta });
}

export async function POST(req: NextRequest) {
  try {
    const { staffId, type, startDate, endDate, mode, reason } = await req.json();
    if (!staffId || !type || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const workingDays = countWorkingDays({ start: startDate, end: endDate }, mode === "ADMIN" ? "ADMIN" : "SCHOOL");
    const request = await db.leaveRequest.create({
      data: { staffId, type, startDate, endDate, workingDays, reason: reason || null, status: "PENDING" },
    });
    return NextResponse.json({ ok: true, request });
  } catch (e) {
    console.error("leave request failed", e);
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, reviewedBy } = await req.json();
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const request = await db.leaveRequest.findUnique({ where: { id }, include: { doctorNote: true } });
    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Sick leave with an invalid/missing doctor's note blocks approval
    if (status === "APPROVED" && request.type === "SICK" && request.doctorNote) {
      if (!request.doctorNote.hpcsaValid) {
        return NextResponse.json(
          { error: `Cannot approve: doctor's note flagged — ${request.doctorNote.anomaly}` },
          { status: 409 }
        );
      }
    }

    const updated = await db.leaveRequest.update({ where: { id }, data: { status } });

    if (status === "APPROVED") {
      // Deduct from balance
      const balance = await db.leaveBalance.findFirst({ where: { staffId: request.staffId } });
      if (balance) {
        const key = request.type.toLowerCase();
        const takenKey = `${key}Taken` as "annualTaken" | "sickTaken" | "familyTaken" | "studyTaken";
        await db.leaveBalance.update({
          where: { id: balance.id },
          data: { [takenKey]: (balance[takenKey] ?? 0) + request.workingDays },
        });
      }
      // Smart Substitute Coverage Dispatch
      await dispatchSubstitutes(request.staffId, request.startDate, request.endDate, request.id);
    }

    return NextResponse.json({ ok: true, request: updated, reviewedBy: reviewedBy || "HR Executive" });
  } catch (e) {
    console.error("leave review failed", e);
    return NextResponse.json({ error: "Failed to review leave request" }, { status: 500 });
  }
}

/** Scans the master timetable for free-period staff and auto-dispatches relief requests. */
async function dispatchSubstitutes(staffId: string, startISO: string, endISO: string, leaveId: string) {
  const absent = await db.staff.findUnique({ where: { id: staffId } });
  if (!absent) return;

  const absentEntries = await db.timetableEntry.findMany({ where: { staffId } });
  const allStaff = await db.staff.findMany({ include: { timetable: true, leaveRequests: true } });

  // Build set of days the absent teacher is on leave (map leave range to weekdays)
  const start = new Date(startISO + "T00:00:00Z");
  const end = new Date(endISO + "T00:00:00Z");
  const leaveDates: number[] = [];
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    if (dow >= 1 && dow <= 5) leaveDates.push(dow);
  }

  const onLeaveStaffIds = new Set(
    allStaff
      .filter((s) =>
        s.leaveRequests.some(
          (r) => r.status === "APPROVED" && !(r.endDate < startISO || r.startDate > endISO)
        )
      )
      .map((s) => s.id)
  );
  onLeaveStaffIds.add(staffId);

  const candidates = allStaff.filter(
    (s) =>
      s.id !== staffId &&
      !onLeaveStaffIds.has(s.id) &&
      (s.role === "TEACHER" || s.role === "DEPT_HEAD")
  );

  const uniquePeriods = new Map<string, { day: number; period: number; subject: string; gradeClass: string }>();
  for (const e of absentEntries) {
    if (!leaveDates.includes(e.day)) continue;
    const key = `${e.day}-${e.period}`;
    if (!uniquePeriods.has(key)) uniquePeriods.set(key, e);
  }

  for (const entry of uniquePeriods.values()) {
    // find free candidates for this slot
    const free = candidates.filter((c) => !c.timetable.some((t) => t.day === entry.day && t.period === entry.period));
    if (free.length === 0) {
      await db.substituteDispatch.create({
        data: {
          leaveId, absentStaffId: staffId, day: entry.day, period: entry.period,
          subject: entry.subject, gradeClass: entry.gradeClass,
          lessonPlan: `${entry.subject} cover — ${entry.gradeClass}. No free-period staff available; escalation required.`,
          status: "PENDING",
        },
      });
      continue;
    }
    // Prefer same-department staff
    const preferred = free.find((f) => f.department === absent.department) ?? free[0];
    await db.substituteDispatch.create({
      data: {
        leaveId, absentStaffId: staffId, substituteId: preferred.id,
        day: entry.day, period: entry.period,
        subject: entry.subject, gradeClass: entry.gradeClass,
        lessonPlan: `${entry.subject} cover for ${absent.name} — ${entry.gradeClass}. Lesson plan attached from shared drive.`,
        status: "PENDING",
      },
    });
  }
}
