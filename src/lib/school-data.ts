/**
 * Public domain data — fee structure (matches the school's published 2026 fees),
 * dual-pathway subject maps, and proof/stat content used across the site.
 */

export const FEE_STRUCTURE = [
  { grade: "Grade 8",  phase: "Senior Phase", monthly: 6000, annual: 66000 },
  { grade: "Grade 9",  phase: "Senior Phase", monthly: 6240, annual: 68640 },
  { grade: "Grade 10", phase: "FET Phase",    monthly: 6720, annual: 73920 },
  { grade: "Grade 11", phase: "FET Phase",    monthly: 6820, annual: 75020 },
  { grade: "Grade 12", phase: "Matric",        monthly: 7320, annual: 80520 },
] as const;

export const EXTRAS = [
  { key: "robotics", label: "Robotics & Coding Academy", monthly: 450 },
  { key: "transport", label: "Transport (Southern Suburbs route)", monthly: 950 },
  { key: "aftercare", label: "Supervised Aftercare & Study Hall", monthly: 650 },
  { key: "cambridge", label: "Cambridge International Examination Fees", monthly: 380 },
  { key: "sports", label: "Sports Performance Programme", monthly: 300 },
] as const;

export const APPLICATION_FEE = 250;
export const ADMIN_FEE = 2500;

export type PathwayKey = "CAPS" | "CAMBRIDGE" | "DUAL";

export const PATHWAYS: Record<PathwayKey, {
  label: string; blurb: string; badge: string;
}> = {
  CAPS: {
    label: "South African CAPS",
    blurb: "The national senior certificate pathway — fully aligned with WCED requirements, ideal for local university entry (UFS, UCT, SU, UWC, Wits).",
    badge: "NSC / Matric",
  },
  CAMBRIDGE: {
    label: "Cambridge International",
    blurb: "IGCSE through to A-Levels — globally portable qualifications recognised by 2,300+ universities including Oxbridge and the Ivy League.",
    badge: "IGCSE / A-Level",
  },
  DUAL: {
    label: "Dual Pathway",
    blurb: "The Maarif signature: CAPS core with Cambridge extension subjects, keeping every door — local and global — wide open.",
    badge: "CAPS + Cambridge",
  },
};

export interface SubjectDef {
  name: string;
  code: string;
  type: "core" | "elective";
  streams: string[];
  description: string;
}

export const SUBJECTS_BY_GRADE: Record<string, { core: SubjectDef[]; electives: SubjectDef[]; cambridgeNote: string }> = {
  "Grade 8": {
    core: [
      { name: "Mathematics", code: "MATH8", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Numeracy, algebra foundations, geometry & data handling with STREAM integration." },
      { name: "Natural Sciences", code: "NS8", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Investigative physics, chemistry & biology with weekly lab practicals." },
      { name: "English Home Language", code: "ENG8", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Literature, rhetoric and academic writing." },
      { name: "isiXhosa First Additional", code: "XHO8", type: "core", streams: ["CAPS"], description: "Conversational fluency and cultural studies." },
      { name: "Life Orientation", code: "LO8", type: "core", streams: ["CAPS"], description: "Wellbeing, citizenship and physical education." },
    ],
    electives: [
      { name: "Robotics & Coding", code: "ROB8", type: "elective", streams: ["DUAL"], description: "Arduino, Python and FIRST-style competition prep." },
      { name: "Turkish Language & Culture", code: "TUR8", type: "elective", streams: ["DUAL"], description: "Maarif signature programme building intercultural fluency." },
      { name: "Visual Arts", code: "ART8", type: "elective", streams: ["CAPS", "CAMBRIDGE"], description: "Drawing, design and digital media." },
    ],
    cambridgeNote: "Cambridge Lower Secondary framework runs parallel for Dual Pathway candidates.",
  },
  "Grade 9": {
    core: [
      { name: "Mathematics", code: "MATH9", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Algebraic fluency, trigonometry entry and functional geometry." },
      { name: "Physical Sciences", code: "PHY9", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Mechanics, matter and bonding — the FET gateway subject." },
      { name: "English Home Language", code: "ENG9", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Critical literacy and oral mastery." },
      { name: "isiXhosa First Additional", code: "XHO9", type: "core", streams: ["CAPS"], description: "Advanced communication and literature." },
      { name: "Life Orientation", code: "LO9", type: "core", streams: ["CAPS"], description: "Career guidance and subject-choice counselling." },
    ],
    electives: [
      { name: "Robotics & Coding", code: "ROB9", type: "elective", streams: ["DUAL"], description: "IoT projects and national olympiad track." },
      { name: "Business & Entrepreneurship", code: "BUS9", type: "elective", streams: ["CAPS", "CAMBRIDGE"], description: "Market-day economics to pitch-night ventures." },
      { name: "Music", code: "MUS9", type: "elective", streams: ["CAPS", "CAMBRIDGE"], description: "Theory and ensemble performance." },
    ],
    cambridgeNote: "Checkpoint examinations benchmark learners against 160+ countries.",
  },
  "Grade 10": {
    core: [
      { name: "Mathematics", code: "MATH10", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Functions, calculus readiness and statistics; Cambridge Additional Maths option." },
      { name: "Physical Sciences", code: "PHY10", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Newtonian mechanics and chemical systems." },
      { name: "English Home Language", code: "ENG10", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Comparative literature and research writing." },
      { name: "Life Orientation", code: "LO10", type: "core", streams: ["CAPS"], description: "Leadership, ethics and health." },
    ],
    electives: [
      { name: "Physical Sciences (Cambridge IGCSE)", code: "IGP10", type: "elective", streams: ["CAMBRIDGE", "DUAL"], description: "IGCSE double award track." },
      { name: "Computer Science (IGCSE)", code: "IGC10", type: "elective", streams: ["CAMBRIDGE", "DUAL"], description: "Programming, algorithms and data representation." },
      { name: "Accounting", code: "ACC10", type: "elective", streams: ["CAPS"], description: "Financial literacy to final accounts." },
      { name: "Business Studies", code: "BUS10", type: "elective", streams: ["CAPS"], description: "Entrepreneurship, forms of ownership and ethics." },
      { name: "Life Sciences", code: "LSC10", type: "elective", streams: ["CAPS", "CAMBRIDGE"], description: "Cell biology, physiology and biodiversity." },
      { name: "Geography", code: "GEO10", type: "elective", streams: ["CAPS"], description: "Geomorphology, climate and GIS skills." },
    ],
    cambridgeNote: "IGCSE subject choices lock in at the end of Term 1 — dual credit mapping applies.",
  },
  "Grade 11": {
    core: [
      { name: "Mathematics", code: "MATH11", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Calculus, Euclidean geometry and probability." },
      { name: "Physical Sciences", code: "PHY11", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Electromagnetism, organic chemistry and reaction rates." },
      { name: "English Home Language", code: "ENG11", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Discursive essays and poetry studies." },
      { name: "Life Orientation", code: "LO11", type: "core", streams: ["CAPS"], description: "Democracy, human rights and fitness portfolios." },
    ],
    electives: [
      { name: "AS-Level Mathematics", code: "ASM11", type: "elective", streams: ["CAMBRIDGE", "DUAL"], description: "Pure mathematics and mechanics." },
      { name: "AS-Level Physics", code: "ASP11", type: "elective", streams: ["CAMBRIDGE", "DUAL"], description: "Advanced practical endorsement prep." },
      { name: "Accounting", code: "ACC11", type: "elective", streams: ["CAPS"], description: "Costing, budgets and analysis of statements." },
      { name: "Business Studies", code: "BUS11", type: "elective", streams: ["CAPS"], description: "Strategy, legislation and investment appraisal." },
      { name: "Life Sciences", code: "LSC11", type: "elective", streams: ["CAPS"], description: "Genetics, evolution and human systems." },
      { name: "History", code: "HIS11", type: "elective", streams: ["CAPS"], description: "Source criticism and historiography." },
    ],
    cambridgeNote: "AS-Level candidates sit Paper 1 components in May/June with mock support.",
  },
  "Grade 12": {
    core: [
      { name: "Mathematics", code: "MATH12", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Differential & integral calculus, trial-exam drilling." },
      { name: "Physical Sciences", code: "PHY12", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Full NSC syllabus with past-paper marathons." },
      { name: "English Home Language", code: "ENG12", type: "core", streams: ["CAPS", "CAMBRIDGE"], description: "Matric literary analysis and exam composition." },
      { name: "Life Orientation", code: "LO12", type: "core", streams: ["CAPS"], description: "Career readiness and final LO SBA." },
    ],
    electives: [
      { name: "A-Level Mathematics", code: "ALM12", type: "elective", streams: ["CAMBRIDGE", "DUAL"], description: "Pure, statistics and decision maths." },
      { name: "A-Level Chemistry", code: "ALC12", type: "elective", streams: ["CAMBRIDGE", "DUAL"], description: "University-bridging depth with lab practicals." },
      { name: "Accounting", code: "ACC12", type: "elective", streams: ["CAPS"], description: "Consolidations, ethics and internal controls." },
      { name: "Business Studies", code: "BUS12", type: "elective", streams: ["CAPS"], description: "Leadership, CSR and macro-environment." },
      { name: "Life Sciences", code: "LSC12", type: "elective", streams: ["CAPS"], description: "DNA, meiosis and ecosystem studies." },
    ],
    cambridgeNote: "A-Level final components + NSC trial exams — our teachers run parallel revision calendars.",
  },
};

export const UNIVERSITY_PATHS = [
  { name: "UCT / Stellenbosch / UWC", requirement: "NSC Bachelor's + APS 34+", region: "South Africa", icon: "home" },
  { name: "University of Cape Town Health Sciences", requirement: "APS 40+ & NBT", region: "South Africa", icon: "home" },
  { name: "UK Universities (Russell Group)", requirement: "A-Levels A*–B", region: "Global", icon: "globe" },
  { name: "EU & Türkiye (Maarif Network Routes)", requirement: "A-Levels / IGCSE + portfolio", region: "Global", icon: "globe" },
  { name: "US Liberal Arts Colleges", requirement: "A-Levels + SAT bridge", region: "Global", icon: "globe" },
];

export const PROOF_STATS = [
  { value: "100%", label: "Cambridge pass rate", sub: "2025 IGCSE cohort" },
  { value: "1:14", label: "Teacher-to-learner ratio", sub: "Verified small classes" },
  { value: "2", label: "Curriculum pathways", sub: "CAPS + Cambridge International" },
  { value: "55", label: "Countries in Maarif network", sub: "Turkish Maarif Foundation" },
];

export const TESTIMONIALS = [
  {
    quote: "My son walked into Grade 8 terrified of mathematics and walked out of the year in the top set. The teachers actually phone you when your child is doing well — that says everything.",
    name: "Nomsa M.",
    role: "Parent, Grade 9",
  },
  {
    quote: "The robotics lab sold us, but the discipline and warmth kept us. Coming from a bigger school, the personal attention here is on another level.",
    name: "Yusuf K.",
    role: "Parent, Grade 10",
  },
  {
    quote: "I'm doing CAPS and AS-Level Maths at the same time. When I apply to universities next year I'll have options in Cape Town and abroad.",
    name: "Aaliyah I.",
    role: "Learner, Grade 11",
  },
];

export const ACCREDITATIONS = [
  { name: "WCED Registered", detail: "Western Cape Education Department independent school registration" },
  { name: "CAPS Aligned", detail: "Full South African national curriculum compliance" },
  { name: "Cambridge International", detail: "Registered Cambridge assessment preparation centre pathway" },
  { name: "UMALUSI Candidate", detail: "Quality-assurance accreditation pipeline for NSC certification" },
  { name: "Turkish Maarif Foundation", detail: "Part of a 55-country, 500-school global education network" },
  { name: "HPCSA-Verified Wellness", detail: "School counsellor and medical certificate verification protocols" },
];
