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
  { value: "55", label: "Countries in Maarif network", sub: "68,778+ students · 500+ schools" },
  { value: "2024", label: "Opened in Claremont", sub: "Established 2023 · First Matric class Dec 2026" },
  { value: "1:14", label: "Teacher-to-learner ratio", sub: "Small-class guarantee" },
  { value: "100%", label: "Cambridge pass rate", sub: "2025 IGCSE cohort" },
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

/* ═══════════════ REAL CONTENT — internationalmaarifschools.co.za ═══════════════
 * Copy below is the school's own published text (About Us, Principal's Message,
 * Manager's Message, 2026 School Terms, Payment Policy, Foundation stats).
 * Only the stale early-payment year was corrected (2025 → 2026).            */

export const FOUNDATION_STATS = {
  countries: 55,
  students: "68,778+",
  schools: "500+",
  blurb:
    "The Turkish Maarif Foundation stands as one of the world's most remarkable educational movements — a global network serving over 68,778 students through more than 500 educational institutions in 55 countries.",
} as const;

export const ABOUT_TEXT = [
  "Welcome to International Maarif School Cape Town High School — where academic excellence meets character development in one of South Africa's most beautiful settings. Established in 2023 as part of the prestigious Turkish Maarif Foundation's global network, our school brings world-class educational standards to the Mother City.",
  "Education at IMS Cape Town extends far beyond textbooks and examinations. While we maintain an unwavering commitment to academic rigour, we understand that true education shapes the whole person. Our learners don't just memorise facts — they develop critical thinking abilities, cultivate intellectual curiosity, and build the character traits that will serve them throughout their lives.",
  "At IMS Cape Town, we believe that every student carries within them the potential for greatness. Our role is to nurture that potential through rigorous academics, meaningful experiences, and a supportive community that celebrates both achievement and growth.",
] as const;

export const LEADERSHIP_MESSAGES = [
  {
    key: "principal",
    name: "Mrs Allen",
    role: "Principal, IMS Cape Town High School",
    initials: "MA",
    short:
      "It fills me with immense pride to welcome you to IMS Cape Town — a secular, co-educational school that has rapidly established itself as one of the most exciting independent schools in the Mother City. Since our official opening in January 2024, we have been on an extraordinary journey.",
    text:
      "It fills me with immense pride to welcome you to IMS Cape Town — a secular, co-educational school that has rapidly established itself as one of the most exciting independent schools in the Mother City. Since our official opening in January 2024, we have been on an extraordinary journey, and I am thrilled to share that journey with you. We offer Grades 8–12, and we are eagerly counting down to December when we will proudly produce our very first class of Grade 12 Matriculants — a milestone that will mark the culmination of our founding vision and the beginning of countless success stories. Nestled in the leafy suburb of Claremont, with breathtaking views of the mountains that inspire us daily, our campus offers the perfect setting for academic excellence. Our fully equipped, modern classrooms create an environment where learning comes alive, and our commitment to small class sizes ensures that every student receives the individualised attention, affection, and advancement opportunities they deserve. Our educational programme is fully aligned with the South African CAPS Curriculum, and we are proudly registered with the Western Cape Education Department. Our comprehensive Wellness Programme ensures that every learner has the support they need to thrive. Our school is a happy place where students flourish, where challenges are embraced as opportunities, and where every achievement — big or small — is celebrated.",
  },
  {
    key: "manager",
    name: "Ramazan Aydin",
    role: "School Manager, IMS Cape Town",
    initials: "RA",
    short:
      "On behalf of the Turkish Maarif Foundation, I extend our warmest greetings to you. From Asia to the Americas, from Europe to Africa — we are honoured and deeply proud to be here in Cape Town, making a meaningful contribution to the future of our students.",
    text:
      "On behalf of the Turkish Maarif Foundation, I extend our warmest greetings to you. Just as we are present in many parts of the world — from Asia to the Americas, from Europe to Africa — we are honoured and deeply proud to be here in Cape Town, making a meaningful contribution to the future of our students and serving as a bridge in their relationships with Türkiye. Our Foundation is built on a profound commitment: to raise individuals equipped with the knowledge and skills demanded by our modern age, who can think critically and analytically, and who have internalised the moral, cultural, and human values that make for good global citizens. As part of the Turkish Maarif Foundation's worldwide network, IMS Cape Town combines international educational standards with a deep respect for South African culture and values. We believe that the best education honours both local heritage and global perspective. I warmly invite you to join us on this meaningful journey — to move forward together, and to shape the future of our children. The partnership between families, educators, and our Foundation is what makes extraordinary education possible. Together, we can achieve great things.",
  },
] as const;

export const SCHOOL_TERMS_2026 = [
  { term: "Term 1", dates: "14 January – 27 March" },
  { term: "Term 2", dates: "8 April – 26 June" },
  { term: "Term 3", dates: "21 July – 18 September" },
  { term: "Term 4", dates: "6 October – 9 December" },
] as const;

export const PAYMENT_POLICY = {
  applicationFee: "R250",
  administrationFee: "R2,500",
  paymentOptions: ["1× Annual", "11× Monthly", "4× Per Term"],
  earlyDiscount: "5% off annual tuition when paid in full before 31 January 2026.",
  textbooks: "Provided on loan at no additional cost. Lost or defaced books will be billed.",
  stationery: "Issued towards year-end. Parents will be billed based on supplier pricing.",
} as const;
