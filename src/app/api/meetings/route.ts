import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SCHOOL } from "@/lib/site";

export async function GET() {
  const meetings = await db.meeting.findMany({ orderBy: { scheduledAt: "asc" } });
  const staff = await db.staff.findMany({
    select: { id: true, name: true, role: true, department: true, subjects: true, timetable: true },
  });
  // Availability = free periods of teaching staff for the next 10 school days
  const teachers = staff.filter((s) => s.role === "TEACHER" || s.role === "DEPT_HEAD");
  const busy = new Map<string, Set<number>>();
  for (const t of teachers) {
    for (const e of t.timetable) {
      const key = `${t.id}`;
      if (!busy.has(key)) busy.set(key, new Set());
      busy.get(key)!.add(e.day * 100 + e.period);
    }
  }
  const slots = teachers.map((t) => {
    const freePeriods: { day: number; period: number }[] = [];
    for (let day = 1; day <= 5; day++) {
      for (let period = 1; period <= 8; period++) {
        if (!busy.get(t.id)?.has(day * 100 + period)) freePeriods.push({ day, period });
      }
    }
    return {
      staffId: t.id,
      name: t.name,
      department: t.department,
      subjects: JSON.parse(t.subjects || "[]") as string[],
      freePeriods,
    };
  });
  return NextResponse.json({ meetings, slots, phone: SCHOOL.phone });
}

export async function POST(req: NextRequest) {
  try {
    const { type, guardianName, staffId, staffName, topic, scheduledAt, durationMin, attachment, room } = await req.json();
    if (!topic || !scheduledAt) {
      return NextResponse.json({ error: "Topic and time are required" }, { status: 400 });
    }
    if (type === "EXECUTIVE" && (!attachment || !topic)) {
      return NextResponse.json({ error: "Executive meetings require a topic and attached documents" }, { status: 400 });
    }
    const meeting = await db.meeting.create({
      data: {
        type: type === "EXECUTIVE" ? "EXECUTIVE" : "PARENT_TEACHER",
        guardianName: guardianName || "Guardian",
        staffId: staffId || null,
        staffName: staffName || null,
        topic,
        scheduledAt,
        durationMin: durationMin || 10,
        meetLink: room ? null : `https://meet.google.com/maarif-${Math.random().toString(36).slice(2, 8)}`,
        room: room || null,
        attachment: attachment || null,
      },
    });
    return NextResponse.json({ ok: true, meeting });
  } catch (e) {
    console.error("meeting booking failed", e);
    return NextResponse.json({ error: "Failed to book meeting" }, { status: 500 });
  }
}
