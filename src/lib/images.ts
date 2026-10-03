/**
 * REAL media assets — downloaded from the official IMS Cape Town CDN
 * (cdn.internationalmaarifschools.co.za) and stored locally for performance.
 *
 * Public team = the school's published head-office team. Roles come from the
 * site payload; portraits load from /images/site with initials fallback.
 */

export const IMAGES = {
  heroSlides: [
    { src: "/images/site/hero-main.jpg", alt: "IMS Cape Town learners and staff on campus — Claremont, Western Cape" },
  ],
  campus: "/images/site/hero-main.jpg",
  ogImage: "/images/site/hero-main.jpg",
} as const;

/**
 * REAL Cape Town High School teaching team — 18 published staff cards from the
 * school site (names printed on the cards; teal classroom photography). Rendered
 * as-is in the "Our Educators" wall: no overlay, no cropping.
 */
export const EDUCATORS = Array.from({ length: 18 }, (_, i) => ({
  src: `/images/site/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Cape Town High School staff member ${i + 1}`,
})) as readonly { src: string; alt: string }[];

export interface PublicTeamMember {
  name: string;
  role: string;
  detail: string;
  initials: string;
  photo?: string;
}

/**
 * Real IMS Cape Town leadership & head-office team (published on the school site).
 * Mrs Allen (Principal) and Mr Ramazan Aydin (School Manager) sign the school's
 * official messages; portraits exist for the head-office team members.
 */
export const PUBLIC_TEAM: PublicTeamMember[] = [
  { name: "Mrs Allen", role: "Principal", detail: "Principal, IMS Cape Town High School", initials: "MA" },
  { name: "Ramazan Aydin", role: "School Manager", detail: "School Manager, IMS Cape Town", initials: "RA" },
  { name: "Abdullah Cevizci", role: "Director", detail: "Director, Turkish Maarif Foundation South Africa", initials: "AC", photo: "/images/site/team-abdullah.jpg" },
  { name: "Hasan Tavukcu", role: "Finance Manager", detail: "Finance Manager · Head Office", initials: "HT", photo: "/images/site/team-hasan.jpg" },
  { name: "Ebrahim Seedat", role: "Education Advisor", detail: "Education Advisor · Head Office", initials: "ES", photo: "/images/site/team-ebrahim.png" },
  { name: "Lebogang Themba", role: "Office Liaison", detail: "Office Liaison · Head Office", initials: "LT", photo: "/images/site/team-lebogang.jpg" },
  { name: "Dimakatso Legoete", role: "Administration", detail: "Head Office Administration", initials: "DL", photo: "/images/site/team-dimakatso.jpg" },
  { name: "Nomvula Thindwa", role: "Administration", detail: "Head Office Administration", initials: "NT", photo: "/images/site/team-nomvula.jpg" },
];
