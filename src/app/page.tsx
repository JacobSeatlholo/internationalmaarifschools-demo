import { AppShell } from "@/components/app-shell";
import { SCHOOL, absoluteUrl } from "@/lib/site";

/**
 * JSON-LD structured data — EducationalOrganization with localized
 * HighSchool sub-schema (P0 SEO repair: URLs resolved from env, never localhost).
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SCHOOL.name,
      alternateName: "Maarif Cape Town",
      url: absoluteUrl("/"),
      telephone: SCHOOL.phone,
      email: SCHOOL.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.street,
        addressLocality: `${SCHOOL.suburb}, ${SCHOOL.city}`,
        addressRegion: SCHOOL.province,
        postalCode: SCHOOL.postalCode,
        addressCountry: SCHOOL.countryISO,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SCHOOL.geo.lat,
        longitude: SCHOOL.geo.lng,
      },
      openingHours: "Mo-Fr 07:40-15:15",
      parentOrganization: {
        "@type": "Organization",
        name: "Turkish Maarif Foundation",
      },
    },
    {
      "@type": "HighSchool",
      "@id": `${absoluteUrl("/schools/capetown-high-school")}#school`,
      name: `${SCHOOL.name} — ${SCHOOL.campus}`,
      url: absoluteUrl("/schools/capetown-high-school"),
      telephone: SCHOOL.phone,
      email: SCHOOL.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.street,
        addressLocality: SCHOOL.city,
        addressRegion: SCHOOL.province,
        postalCode: SCHOOL.postalCode,
        addressCountry: SCHOOL.countryISO,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SCHOOL.geo.lat,
        longitude: SCHOOL.geo.lng,
      },
      openingHours: "Mo-Fr 07:40-15:15",
      slogan: "Where Cape Town's brightest futures begin",
      knowsAbout: ["CAPS Curriculum", "Cambridge IGCSE", "A-Levels", "STREAM Education"],
      numberOfStudents: 210,
      foundingDate: "2024",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppShell />
    </>
  );
}
