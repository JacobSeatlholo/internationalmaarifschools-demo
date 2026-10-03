/**
 * HPCSA (Health Professions Council of South Africa) Practice Number Validator
 *
 * HPCSA practice numbers follow the pattern: two-letter professional prefix
 * followed by 7 digits, e.g. "MP 0123456".
 *
 * Common professional board prefixes:
 *   MP — Independent Medical Practitioner
 *   MN — Medical Practitioner (public sector registration marker)
 *   MT — Medical Practitioner (intern)
 *   DP — Dental Practitioner
 *   CP — Clinical Psychologist / Psychology board
 *   PT — Physiotherapist
 *   OT — Occupational Therapist
 *   NP — Neuropsychologist
 *
 * Validation layers:
 *   1. Structural regex: ^(prefix)\s?0?\d{6,7}$
 *   2. Prefix must be in the recognised board set
 *   3. Numeric plausibility: not sequential/repeated digits
 */

const KNOWN_PREFIXES = new Set([
  "MP", "MN", "MT", "DP", "CP", "PT", "OT", "NP", "SP", "OP", "AP",
]);

export interface HpcsaResult {
  valid: boolean;
  normalized: string | null;
  prefix: string | null;
  digits: string | null;
  anomaly: string | null;
}

export function validateHpcsa(raw: string | null | undefined): HpcsaResult {
  if (!raw || raw.trim().length === 0) {
    return { valid: false, normalized: null, prefix: null, digits: null,
      anomaly: "No practice number detected on certificate — HPCSA registration cannot be verified." };
  }

  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, "");
  const match = cleaned.match(/^([A-Z]{2})\s?(\d{6,8})$/);

  if (!match) {
    return { valid: false, normalized: null, prefix: null, digits: null,
      anomaly: `Practice number "${raw.trim()}" does not match the HPCSA structural format (e.g. MP 0123456).` };
  }

  const [, prefix, digits] = match;

  if (!KNOWN_PREFIXES.has(prefix)) {
    return { valid: false, normalized: `${prefix} ${digits}`, prefix, digits,
      anomaly: `Prefix "${prefix}" is not a recognised HPCSA professional board code.` };
  }

  if (/^(\d)\1+$/.test(digits)) {
    return { valid: false, normalized: `${prefix} ${digits}`, prefix, digits,
      anomaly: "Practice number consists of repeated digits — likely forged or OCR-misread." };
  }

  if (digits.length < 7) {
    return { valid: false, normalized: `${prefix} ${digits}`, prefix, digits,
      anomaly: "Practice number is too short — HPCSA numbers carry 7 digits." };
  }

  return { valid: true, normalized: `${prefix} ${digits}`, prefix, digits, anomaly: null };
}

/** Extracts structured fields from OCR text of a medical certificate. */
export interface ParsedDoctorNote {
  doctorName: string | null;
  practiceNumber: string | null;
  issuedDate: string | null;
  unfitFrom: string | null;
  unfitTo: string | null;
  diagnosis: string | null;
}

const DATE_PATTERNS = [
  /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/i,
  /\b(\d{4}-\d{2}-\d{2})\b/,
  /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/,
];

function firstDate(text: string): string | null {
  for (const p of DATE_PATTERNS) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return null;
}

export function parseDoctorNoteText(text: string): ParsedDoctorNote {
  const t = text.replace(/\s+/g, " ");

  const nameMatch =
    t.match(/(?:Dr\.?|Doctor)\s+((?:[A-Z][a-zA-Z]*\.?\s+){0,2}[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]+){0,2})/) ||
    t.match(/([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:MBChB|MMed|Pr\s?No)/);
  const practiceMatch = t.match(/\b(?:Pr\s?(?:No|Number)|Practice\s?(?:No|Number)|HPCSA)\s*[:\-]?\s*([A-Z]{2}\s?\d{6,8})\b/i) ||
    t.match(/\b(MP\s?\d{6,8}|MN\s?\d{6,8}|DP\s?\d{6,8}|CP\s?\d{6,8}|PT\s?\d{6,8})\b/);

  const fromMatch = t.match(/(?:unfit\s?for\s?work|not\s?fit|from)\s*[:\-]?\s*(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/i);
  const toMatch = t.match(/(?:to|until|inclusive\s?of)\s*[:\-]?\s*(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/i);

  const diagnosisMatch = t.match(/(?:diagnosis|impression|condition)\s*[:\-]?\s*([^.]{3,80})/i);

  return {
    doctorName: nameMatch ? nameMatch[1].trim() : null,
    practiceNumber: practiceMatch ? practiceMatch[1].replace(/\s+/g, " ").trim() : null,
    issuedDate: firstDate(t),
    unfitFrom: fromMatch ? fromMatch[1] : null,
    unfitTo: toMatch ? toMatch[1] : null,
    diagnosis: diagnosisMatch ? diagnosisMatch[1].trim() : null,
  };
}
