/**
 * AI OCR Engine — receipt/invoice and medical-certificate extraction.
 *
 * Images  → Tesseract.js (server-side worker)
 * PDFs    → pdf-parse text layer extraction
 *
 * Field extraction uses SA-aware regexes: VAT numbers (4xxxxxxxxx),
 * ZAR totals, dates, HPCSA practice numbers. Every result carries a
 * confidence score; low-confidence fields are surfaced for human review.
 */

import { parseDoctorNoteText } from "./hpcsa";

export interface OcrReceipt {
  merchant: string | null;
  vatNumber: string | null;
  category: string;
  amount: number | null;
  documentDate: string | null;
  confidence: number;
  rawText: string;
}

const CATEGORIES: { key: string; keywords: string[] }[] = [
  { key: "FACILITIES", keywords: ["build", "hardware", "plumb", "electr", "paint", "maintenance", "repair", "garden"] },
  { key: "IT",         keywords: ["computer", "laptop", "software", "license", "network", "server", "ink", "toner", "apple", "dell", "hp "] },
  { key: "ACADEMIC",   keywords: ["book", "stationery", "laboratory", "lab", "education", "textbook", "exam"] },
  { key: "TRANSPORT",  keywords: ["fuel", "petrol", "diesel", "taxi", "bus", "transport", "engen", "shell", "sasol", "total "] },
  { key: "CANTEEN",    keywords: ["food", "cater", "canteen", "grocery", "butchery", "restaurant", "cafe"] },
];

function classifyCategory(text: string): string {
  const t = text.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.keywords.some((k) => t.includes(k))) return c.key;
  }
  return "MISC";
}

function extractTotal(text: string): number | null {
  const patterns = [
    /(?:total|amount\s?due|balance\s?due|grand\s?total)\s*[:\-]?\s*(?:R|ZAR)?\s*([\d\s,]+[.,]\d{2})/i,
    /\b(?:R|ZAR)\s*([\d\s,]+[.,]\d{2})\b/g,
  ];
  const m = text.match(patterns[0]);
  if (m) {
    const n = parseFloat(m[1].replace(/[\s,]/g, "").replace(/\.(\d{2})$/, ".$1"));
    if (!isNaN(n)) return n;
  }
  // fallback: largest ZAR amount found
  let max = 0;
  for (const mm of text.matchAll(patterns[1])) {
    const n = parseFloat(mm[1].replace(/[\s,]/g, ""));
    if (!isNaN(n) && n > max) max = n;
  }
  return max > 0 ? max : null;
}

function extractMerchant(text: string): string | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const l of lines.slice(0, 6)) {
    if (l.length >= 3 && l.length <= 42 && /[A-Za-z]{3}/.test(l) &&
        !/tax|vat|invoice|receipt|tel|phone|date|www|http|address/i.test(l)) {
      return l.replace(/[^\w\s&'’.\-()]/g, "").trim() || null;
    }
  }
  return null;
}

function extractVat(text: string): string | null {
  const m = text.match(/vat(?:\s?(?:no|reg(?:\.|istration)?\s?no)?)?\s*[:\-]?\s*(4\d{9})\b/i);
  return m ? m[1] : null;
}

function extractDate(text: string): string | null {
  const m =
    text.match(/\b(\d{4}-\d{2}-\d{2})\b/) ||
    text.match(/\b(\d{1,2}\/\d{1,2}\/(?:20)?\d{2})\b/) ||
    text.match(/\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(?:20)?\d{2})\b/i);
  return m ? m[1] : null;
}

export async function ocrImage(buffer: Buffer): Promise<{ text: string; confidence: number }> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    workerPath: undefined as unknown as string,
  });
  try {
    const { data } = await worker.recognize(buffer);
    return { text: data.text ?? "", confidence: (data.confidence ?? 80) / 100 };
  } finally {
    await worker.terminate();
  }
}

export async function ocrPdf(buffer: Buffer): Promise<{ text: string; confidence: number }> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return { text: result.text ?? "", confidence: 0.98 };
  } finally {
    await parser.destroy();
  }
}

export async function extractFromFile(
  fileName: string,
  buffer: Buffer
): Promise<OcrReceipt | DoctorNoteOcr> {
  const isPdf = fileName.toLowerCase().endsWith(".pdf");
  let text = "";
  let confidence = 0.85;

  if (isPdf) {
    const r = await ocrPdf(buffer);
    text = r.text;
    confidence = r.confidence;
  } else {
    const r = await ocrImage(buffer);
    text = r.text;
    confidence = r.confidence;
  }

  return { text, confidence };
}

export interface DoctorNoteOcr {
  text: string;
  confidence: number;
  parsed: ReturnType<typeof parseDoctorNoteText>;
}

/** Receipt-focused pipeline. */
export async function ocrReceipt(
  fileName: string,
  buffer: Buffer
): Promise<OcrReceipt & { parsedDoctor?: undefined }> {
  const { text, confidence } = await extractFromFile(fileName, buffer);
  return {
    merchant: extractMerchant(text),
    vatNumber: extractVat(text),
    category: classifyCategory(text),
    amount: extractTotal(text),
    documentDate: extractDate(text),
    confidence,
    rawText: text.slice(0, 4000),
  };
}

/** Doctor's-note-focused pipeline. */
export async function ocrDoctorNote(
  fileName: string,
  buffer: Buffer
): Promise<DoctorNoteOcr> {
  const { text, confidence } = await extractFromFile(fileName, buffer);
  return { text, confidence, parsed: parseDoctorNoteText(text) };
}
