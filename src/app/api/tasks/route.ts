import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tasks = await db.task.findMany({ orderBy: { createdAt: "desc" } });
  const now = Date.now();
  const enriched = tasks.map((t) => {
    const due = new Date(t.slaDueAt).getTime();
    const overdue = t.column !== "DONE" && due < now;
    const hoursLeft = Math.round(((due - now) / 3600000) * 10) / 10;
    let breachLevel: "ok" | "warning" | "critical" | "breached" = "ok";
    if (overdue) breachLevel = "breached";
    else if (hoursLeft <= 12) breachLevel = "critical";
    else if (hoursLeft <= 48) breachLevel = "warning";
    return { ...t, overdue, hoursLeft, breachLevel };
  });
  // Auto-escalate breaches
  for (const t of enriched) {
    if (t.overdue && !t.escalated) {
      await db.task.update({ where: { id: t.id }, data: { escalated: true } });
      t.escalated = true;
    }
  }
  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, tag, assignee, priority, slaDays } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
    const due = new Date();
    due.setDate(due.getDate() + (Number(slaDays) || 5));
    const task = await db.task.create({
      data: {
        title,
        description: description || null,
        tag: tag || "FACILITIES",
        assignee: assignee || "Unassigned",
        priority: priority || "MEDIUM",
        slaDueAt: due.toISOString(),
      },
    });
    return NextResponse.json({ ok: true, task });
  } catch (e) {
    console.error("task create failed", e);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, column } = await req.json();
    if (!["TODO", "IN_PROGRESS", "EXEC_REVIEW", "DONE"].includes(column)) {
      return NextResponse.json({ error: "Invalid column" }, { status: 400 });
    }
    const task = await db.task.update({
      where: { id },
      data: { column, completedAt: column === "DONE" ? new Date() : null },
    });
    return NextResponse.json({ ok: true, task });
  } catch (e) {
    console.error("task move failed", e);
    return NextResponse.json({ error: "Failed to move task" }, { status: 500 });
  }
}
