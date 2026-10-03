import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const applications = await db.application.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["studentFirst", "studentLast", "dob", "grade", "guardianFirst", "guardianLast", "email", "phone"];
    for (const f of required) {
      if (!body[f] || String(body[f]).trim() === "") {
        return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
      }
    }
    const year = new Date().getFullYear();
    const count = await db.application.count();
    const trackingCode = `IMS-CT-${year}-${String(count + 1).padStart(4, "0")}`;
    const app = await db.application.create({
      data: {
        trackingCode,
        studentFirst: String(body.studentFirst).trim(),
        studentLast: String(body.studentLast).trim(),
        dob: body.dob,
        grade: body.grade,
        pathway: body.pathway || "DUAL",
        guardianFirst: String(body.guardianFirst).trim(),
        guardianLast: String(body.guardianLast).trim(),
        email: String(body.email).trim(),
        phone: String(body.phone).trim(),
        startTerm: body.startTerm || "January 2027",
        heardFrom: body.heardFrom || null,
      },
    });
    return NextResponse.json({ ok: true, application: app });
  } catch (e) {
    console.error("application create failed", e);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
