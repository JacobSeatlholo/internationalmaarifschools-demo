import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const dispatches = await db.substituteDispatch.findMany({
    include: {
      // substitute + absent teacher names
    },
    orderBy: { createdAt: "desc" },
  });
  const staff = await db.staff.findMany();
  const nameOf = (id: string | null) => (id ? staff.find((s) => s.id === id)?.name ?? "Unassigned" : "Unassigned");
  const rows = dispatches.map((d) => ({
    ...d,
    absentName: nameOf(d.absentStaffId),
    substituteName: nameOf(d.substituteId),
  }));
  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, substituteId } = await req.json();
    if (!["ACCEPTED", "DECLINED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const dispatch = await db.substituteDispatch.update({
      where: { id },
      data: { status, ...(substituteId ? { substituteId } : {}) },
    });
    return NextResponse.json({ ok: true, dispatch });
  } catch (e) {
    console.error("substitute update failed", e);
    return NextResponse.json({ error: "Failed to update dispatch" }, { status: 500 });
  }
}
