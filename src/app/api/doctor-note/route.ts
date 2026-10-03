import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const staffId = form.get("staffId") as string | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { ocrDoctorNote } = await import("@/lib/ocr-engine");
    const { validateHpcsa } = await import("@/lib/hpcsa");

    let parsed = {
      doctorName: null as string | null,
      practiceNumber: null as string | null,
      issuedDate: null as string | null,
      unfitFrom: null as string | null,
      unfitTo: null as string | null,
      diagnosis: null as string | null,
    };
    let ocrText = "";
    let confidence = 0.9;

    try {
      const result = await ocrDoctorNote(file.name, buffer);
      parsed = result.parsed;
      ocrText = result.text.slice(0, 4000);
      confidence = result.confidence;
    } catch (err) {
      console.error("doctor-note OCR failed, manual review fallback:", err);
      confidence = 0;
    }

    const hpcsa = validateHpcsa(parsed.practiceNumber);

    const note = await db.doctorNote.create({
      data: {
        fileName: file.name,
        doctorName: parsed.doctorName,
        practiceNumber: hpcsa.normalized,
        issuedDate: parsed.issuedDate,
        unfitFrom: parsed.unfitFrom,
        unfitTo: parsed.unfitTo,
        diagnosis: parsed.diagnosis,
        hpcsaValid: hpcsa.valid,
        anomaly: hpcsa.anomaly,
        ocrText,
        ocrConfidence: confidence,
      },
    });

    // Attach to an existing pending sick-leave request for this staff member if provided
    if (staffId) {
      const pending = await db.leaveRequest.findFirst({
        where: { staffId, type: "SICK", status: "PENDING", doctorNoteId: null },
        orderBy: { createdAt: "desc" },
      });
      if (pending) {
        await db.leaveRequest.update({ where: { id: pending.id }, data: { doctorNoteId: note.id } });
      }
    }

    return NextResponse.json({ ok: true, note, hpcsa });
  } catch (e) {
    console.error("doctor note processing failed", e);
    return NextResponse.json({ error: "Failed to process certificate" }, { status: 500 });
  }
}
