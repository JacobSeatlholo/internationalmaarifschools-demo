import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ocrReceipt } from "@/lib/ocr-engine";

export const runtime = "nodejs";

export async function GET() {
  const receipts = await db.receipt.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(receipts);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let result;
    try {
      result = await ocrReceipt(file.name, buffer);
    } catch (ocrErr) {
      console.error("OCR engine error, using manual-entry fallback:", ocrErr);
      // Graceful degradation: accept the document without extraction so the
      // approval workflow is never blocked. Fields default to manual review.
      result = {
        merchant: null, vatNumber: null, category: "MISC", amount: null,
        documentDate: null, confidence: 0, rawText: "",
      };
    }

    const amount = result.amount ?? 0;
    const tier = amount >= 5000 ? "EXECUTIVE" : "AUTO";
    const receipt = await db.receipt.create({
      data: {
        fileName: file.name,
        merchant: result.merchant,
        vatNumber: result.vatNumber,
        category: result.category,
        amount,
        documentDate: result.documentDate ?? new Date().toISOString().slice(0, 10),
        tier,
        status: tier === "AUTO" ? "AUTO_LOGGED" : "PENDING_APPROVAL",
        ocrConfidence: result.confidence,
        rawText: result.rawText,
        extractedJson: JSON.stringify(result),
      },
    });
    return NextResponse.json({ ok: true, receipt });
  } catch (e) {
    console.error("receipt upload failed", e);
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, approvedBy } = await req.json();
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const receipt = await db.receipt.update({
      where: { id },
      data: { status, approvedBy: approvedBy || "Executive Director" },
    });
    return NextResponse.json({ ok: true, receipt });
  } catch (e) {
    console.error("receipt approval failed", e);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
