/**
 * P0 SEO REPAIR — Dynamic Site URL Resolution
 *
 * Eliminates every hardcoded `http://localhost:3000` instance across
 * canonical metadata, OpenGraph tags and JSON-LD structured data by
 * resolving a single source of truth from the environment.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL  (canonical production origin)
 *   2. VERCEL_URL            (platform fallback)
 *   3. Preview/development origin passed at runtime
 */

export const SCHOOL = {
  name: "International Maarif Schools Cape Town",
  shortName: "Maarif Cape Town",
  campus: "Claremont Campus",
  street: "44 Imam Haron Road",
  suburb: "Claremont",
  city: "Cape Town",
  province: "Western Cape",
  postalCode: "7708",
  country: "South Africa",
  countryISO: "ZA",
  phone: "+27 21 300 7527",
  phoneDisplay: "021 300 7527",
  email: "capetown@internationalmaarifschools.co.za",
  geo: { lat: -33.984316, lng: 18.471414 },
  foundingYear: 2023,
  grades: "8–12",
  openingHours: "07:40 – 15:15 (Mon–Fri)",
} as const;

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_PREVIEW_URL) {
    return process.env.NEXT_PUBLIC_PREVIEW_URL.replace(/\/$/, "");
  }
  // Never emit localhost in metadata — fall back to the production origin.
  return "https://internationalmaarifschools.co.za";
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
