import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const accounts = await db.feeAccount.findMany({
    include: { student: true, payments: { orderBy: { createdAt: "desc" }, take: 3 } },
  });
  const rows = accounts.map((a) => ({
    id: a.id,
    studentName: `${a.student.firstName} ${a.student.lastName}`,
    grade: a.student.grade,
    className: a.student.className,
    pathway: a.student.pathway,
    guardianName: a.student.guardianName,
    guardianPhone: a.student.guardianPhone,
    guardianEmail: a.student.guardianEmail,
    annualTuition: a.annualTuition,
    paidToDate: a.paidToDate,
    outstanding: Math.max(0, a.annualTuition - a.paidToDate),
    status: a.status,
    arrearsDays: a.arrearsDays,
    planType: a.planType,
    lastPaymentAt: a.lastPaymentAt,
    recentPayments: a.payments.map((p) => ({ amount: p.amount, method: p.method, reference: p.reference, createdAt: p.createdAt })),
  }));
  const totals = {
    billed: rows.reduce((s, r) => s + r.annualTuition, 0),
    collected: rows.reduce((s, r) => s + r.paidToDate, 0),
    outstanding: rows.reduce((s, r) => s + r.outstanding, 0),
    inArrears: rows.filter((r) => r.status === "IN_ARREARS").length,
  };
  return NextResponse.json({ rows, totals });
}

export async function POST(req: NextRequest) {
  try {
    const { action, accountId, amount, planType } = await req.json();
    if (action === "record-payment") {
      const acct = await db.feeAccount.findUnique({ where: { id: accountId } });
      if (!acct) return NextResponse.json({ error: "Account not found" }, { status: 404 });
      const amt = Number(amount) || 0;
      const paidToDate = acct.paidToDate + amt;
      const status =
        paidToDate >= acct.annualTuition ? "FULLY_PAID" : paidToDate <= 0 ? "IN_ARREARS" : "PARTIALLY_PAID";
      await db.payment.create({
        data: { feeAccountId: accountId, amount: amt, method: "EFT", reference: `EFT-${Date.now().toString().slice(-6)}` },
      });
      await db.feeAccount.update({
        where: { id: accountId },
        data: { paidToDate, status, arrearsDays: status === "IN_ARREARS" ? acct.arrearsDays : 0, lastPaymentAt: new Date() },
      });
      return NextResponse.json({ ok: true, newStatus: status, paidToDate });
    }
    if (action === "apply-plan") {
      await db.feeAccount.update({ where: { id: accountId }, data: { planType } });
      return NextResponse.json({ ok: true });
    }
    if (action === "send-statement") {
      // In production this calls the WhatsApp Business API; here we log the dispatch.
      return NextResponse.json({ ok: true, dispatched: true, channel: "whatsapp" });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error("fee action failed", e);
    return NextResponse.json({ error: "Fee action failed" }, { status: 500 });
  }
}
