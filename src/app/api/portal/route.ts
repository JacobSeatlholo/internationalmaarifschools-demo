import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PROOF_STATS } from "@/lib/school-data";

export async function GET(req: NextRequest) {
  const studentName = req.nextUrl.searchParams.get("student") || "Aaliyah Ismail";
  const [first, ...rest] = studentName.split(" ");
  const student = await db.student.findFirst({
    where: { firstName: first, lastName: rest.join(" ") },
  });

  const records = student
    ? await db.academicRecord.findMany({ where: { studentId: student.id } })
    : [];
  const showcase = await db.showcaseProject.findMany({ orderBy: { likes: "desc" } });

  // Group records by term for the progression chart
  const terms = Array.from(new Set(records.map((r) => r.term))).sort();
  const subjects = Array.from(new Set(records.map((r) => r.subject)));
  const progression = terms.map((term) => {
    const point: Record<string, string | number> = { term };
    let avg = 0;
    for (const s of subjects) {
      const rec = records.find((r) => r.term === term && r.subject === s);
      if (rec) {
        point[s] = rec.mark;
        avg += rec.mark;
      }
    }
    point.average = subjects.length ? Math.round((avg / subjects.length) * 10) / 10 : 0;
    return point;
  });

  const comments = records
    .filter((r) => r.term === terms[terms.length - 1])
    .map((r) => ({ subject: r.subject, mark: r.mark, comment: r.comment, curriculum: r.curriculum }));

  return NextResponse.json({
    student,
    progression,
    subjects,
    comments,
    showcase,
    proofStats: PROOF_STATS,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const project = await db.showcaseProject.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    return NextResponse.json({ error: "Failed to like project" }, { status: 500 });
  }
}
