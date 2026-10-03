import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl, SCHOOL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

/**
 * P0 SEO REPAIR — all canonical / OpenGraph / JSON-LD URLs now resolve
 * dynamically from NEXT_PUBLIC_SITE_URL. Zero localhost leakage.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SCHOOL.name} | Dual Pathway Cambridge & CAPS High School in Claremont`,
    template: `%s | ${SCHOOL.shortName}`,
  },
  description:
    "A secular, co-educational Grade 8–12 high school in Claremont, Cape Town offering a dual CAPS + Cambridge International pathway with small classes, STREAM education and a global Turkish Maarif Foundation network across 55 countries.",
  keywords: [
    "Cape Town high school",
    "Claremont school",
    "Cambridge International South Africa",
    "CAPS curriculum",
    "private school Cape Town",
    "International Maarif Schools",
    "Grade 8 enrolment",
    "IGCSE A-Levels Cape Town",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: SCHOOL.name,
    title: `${SCHOOL.name} — Dual Pathway High School, Claremont`,
    description:
      "Academic rigour meets character development in the Mother City. CAPS & Cambridge pathways, STREAM labs, global network.",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SCHOOL.name} — Dual Pathway High School, Claremont`,
    description:
      "CAPS & Cambridge pathways, STREAM labs, global network. Enrol for Grade 8–12 in Claremont, Cape Town.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
