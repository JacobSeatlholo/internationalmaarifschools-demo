import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const directives = await db.directive.findMany({
    include: { signOffs: true },
    orderBy: { createdAt: "desc" },
  });
  const staff = await db.staff.findMany({ select: { name: true, role: true } });
  return NextResponse.json({ directives, staff });
}

export async function POST(req: NextRequest) {
  try {
    const { title, body, authorRole, requiresSignOff } = await req.json();
    if (!title || !body) return NextResponse.json({ error: "Title and body required" }, { status: 400 });
    const directive = await db.directive.create({
      data: { title, body, authorRole: authorRole || "EXECUTIVE", requiresSignOff: requiresSignOff !== false },
      include: { signOffs: true },
    });
    return NextResponse.json({ ok: true, directive });
  } catch (e) {
    console.error("directive create failed", e);
    return NextResponse.json({ error: "Failed to publish directive" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { directiveId, staffName, role } = await req.json();
    if (!directiveId || !staffName) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const signOff = await db.directiveSignOff.upsert({
      where: { directiveId_staffName: { directiveId, staffName } },
      update: { signedAt: new Date() },
      create: { directiveId, staffName, role: role || "TEACHER" },
    });
    return NextResponse.json({ ok: true, signOff });
  } catch (e) {
    console.error("sign-off failed", e);
    return NextResponse.json({ error: "Failed to sign off" }, { status: 500 });
  }
}
