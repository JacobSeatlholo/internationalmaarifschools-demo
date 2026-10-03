/**
 * Western Cape trilingual dictionary — English, Afrikaans, isiXhosa.
 *
 * The three official languages of the Western Cape Province (Western Cape
 * Provincial School Act / Language Policy). Every user-facing string on the
 * public portal resolves through this dictionary; deep ERP terms stay English.
 */

export type Lang = "en" | "af" | "xh";

export const LANGUAGES: { code: Lang; native: string; short: string; locale: string }[] = [
  { code: "en", native: "English", short: "EN", locale: "en_ZA" },
  { code: "af", native: "Afrikaans", short: "AF", locale: "af_ZA" },
  { code: "xh", native: "isiXhosa", short: "XH", locale: "xh_ZA" },
];

const en = {
  // ── Navigation ──
  "nav.stem": "STEM Lab",
  "nav.pathways": "Pathways",
  "nav.campus": "Campus Life",
  "nav.faculty": "Faculty",
  "nav.admissions": "Admissions",
  "nav.portal": "Portal",
  "nav.erp": "ERP",
  "nav.apply": "Apply Now",
  "nav.mobilePortal": "Parent & Student Portal",
  "nav.mobileErp": "Executive ERP",
  "nav.language": "Language",

  // ── Hero ──
  "hero.kicker": "Claremont · Cape Town · Western Cape",
  "hero.titleLine1": "Where Cape Town's",
  "hero.titleLine2": "brightest futures begin.",
  "hero.body":
    "A secular, co-educational Grade 8–12 high school offering a signature dual pathway — the South African CAPS curriculum alongside Cambridge International — with small classes, STREAM labs and a global network spanning 55 countries.",
  "hero.ctaApply": "Start Application",
  "hero.ctaExplore": "Explore the Campus",
  "hero.trust": "WCED registered · Now enrolling for January 2027",
  "hero.metric1": "Cambridge pass rate",
  "hero.metric2": "CAPS + Cambridge pathways",
  "hero.metric3": "Teacher ratio",
  "hero.metric4": "Countries in network",

  // ── About (real copy from the school) ──
  "about.kicker": "About IMS Cape Town",
  "about.title": "A learning environment like no other",
  "about.pillar1": "Academic Excellence",
  "about.pillar1Sub": "Rigorous curriculum designed to challenge and inspire intellectual growth",
  "about.pillar2": "Global Perspective",
  "about.pillar2Sub": "Cultural diversity celebrated, preparing students for an interconnected world",
  "about.pillar3": "Character Development",
  "about.pillar3Sub": "Values-based education building integrity, resilience, and leadership",
  "about.pillar4": "Enriching Activities",
  "about.pillar4Sub": "Extracurriculars that help learners discover and develop their talents",
  "about.readMore": "Read full message",
  "about.readLess": "Show less",

  // ── 3D STEM ──
  "stem.kicker": "Interactive 3D STEM Lab",
  "stem.title": "See how our learners see science",
  "stem.blurb":
    "A live taste of the STREAM classroom. Rotate, explode and inspect real curriculum constructs — the same models our teachers use to turn abstract concepts into intuition.",

  // ── Pathways ──
  "pathways.kicker": "Dynamic Subject & Pathway Mapper",
  "pathways.title": "Two curricula. Every door open.",
  "pathways.blurb":
    "Select a grade and pathway to map subjects, university entry points and career trajectories — from UCT to the Russell Group.",

  // ── Team & campus ──
  "team.kicker": "Faculty & Campus Life",
  "team.title": "The people behind the promise",
  "team.blurb": "Subject specialists, registered wellness support and a leadership team that answers the phone.",
  "team.galleryTitle": "Life at Claremont",
  "team.educatorsTitle": "Meet our educators",
  "team.educatorsSub":
    "The Cape Town High School teaching team — published directly from the school's official staff register.",

  // ── Admissions ──
  "admissions.kicker": "Admissions & Fees",
  "admissions.title": "Plan fees in a minute. Apply in four steps.",
  "admissions.blurb": "Transparent, instant and pressure-free — exactly how admissions should feel.",
  "admissions.startTitle": "Start your application",
  "apply.title": "Application for Admission",
  "apply.subtitle": "Grade 8–12 · Claremont Campus · January 2027 intake",

  // ── CTA banner ──
  "cta.title": "Now enrolling Grade 8–12 for January 2027",
  "cta.body":
    "Seats are limited to preserve our 1:14 ratio. Book a campus tour, meet the principal, and see the STREAM lab in action.",
  "cta.apply": "Apply Now",
  "cta.whatsapp": "Book a Campus Tour on WhatsApp",

  // ── Footer ──
  "footer.blurb":
    "Part of the Turkish Maarif Foundation's global network — 55 countries, 500+ schools, one standard of excellence. Building futures through education in the Mother City.",
  "footer.visit": "Visit us",
  "footer.links": "Quick links",
  "footer.rights": "All rights reserved.",
  "footer.compliance": "WCED registered · POPIA compliant · Safer recruitment certified",

  // ── Proof ──
  "proof.registrations": "Registrations & quality assurance",
} as const;

export type TKey = keyof typeof en;
type Dict = Record<TKey, string>;

/* ─────────────────────────── AFRIKAANS ─────────────────────────── */
const af: Dict = {
  "nav.stem": "STEM-lab",
  "nav.pathways": "Leerpaaie",
  "nav.campus": "Kampuslewe",
  "nav.faculty": "Personeel",
  "nav.admissions": "Toelatings",
  "nav.portal": "Portaal",
  "nav.erp": "ERP",
  "nav.apply": "Doen Aansoek",
  "nav.mobilePortal": "Ouer- en Leerderportaal",
  "nav.mobileErp": "Uitvoerende ERP",
  "nav.language": "Taal",

  "hero.kicker": "Claremont · Kaapstad · Wes-Kaap",
  "hero.titleLine1": "Waar Kaapstad se",
  "hero.titleLine2": "helderste toekoms begin.",
  "hero.body":
    "’n Sekulêre, gesamentlike hoërskool (Graad 8–12) met ’n kenmerkende dubbele leerpad — die Suid-Afrikaanse KABV-kurrikulum langs Cambridge International — in klein klasse, met STREAM-laboratoriums en ’n wêreldwye netwerk oor 55 lande.",
  "hero.ctaApply": "Begin Aansoek",
  "hero.ctaExplore": "Verken die Kampus",
  "hero.trust": "WCED-geregistreer · Nou inskrywings oop vir Januarie 2027",
  "hero.metric1": "Cambridge-slaagsyfer",
  "hero.metric2": "KABV + Cambridge-leerpaaie",
  "hero.metric3": "Onderwyser-leerderverhouding",
  "hero.metric4": "Lande in netwerk",

  "about.kicker": "Aangaande IMS Kaapstad",
  "about.title": "’n Leeromgewing soos geen ander",
  "about.pillar1": "Akademiese Uitnemendheid",
  "about.pillar1Sub": "’n Streng kurrikulum wat intellektuele groei uitdaan en inspireer",
  "about.pillar2": "Wêreldperspektief",
  "about.pillar2Sub": "Kulturele diversiteit gevier — voorbereiding vir ’n verbonde wêreld",
  "about.pillar3": "Karakterontwikkeling",
  "about.pillar3Sub": "Waardegebaseerde opvoeding wat integriteit, veerkragtigheid en leierskap bou",
  "about.pillar4": "Verrykende Aktiwiteite",
  "about.pillar4Sub": "Buiteaktiwiteite wat leerders help om hulle talente te ontdek en te ontwikkel",
  "about.readMore": "Lees die volledige boodskap",
  "about.readLess": "Verberg",

  "stem.kicker": "Interaktiewe 3D STEM-lab",
  "stem.title": "Sien wetenskap soos ons leerders dit sien",
  "stem.blurb":
    "’n Lewendige voorproe van die STREAM-klaskamer. Roteer, explodeer en ondersoek werklike kurrikulumkonsepte — dieselfde modelle wat ons onderwysers gebruik om abstrakte begrippe intuïtief te maak.",

  "pathways.kicker": "Dinamiese vak- en leerpaaie",
  "pathways.title": "Twee kurrikulums. Elke deur oop.",
  "pathways.blurb":
    "Kies ’n graad en leerpad om vakke, universiteitstoegangspunte en loopbaanpaaie te sien — van UCT tot die Russell-groep.",

  "team.kicker": "Personeel & Kampuslewe",
  "team.title": "Die mense agter die belofte",
  "team.blurb": "Vakspesialiste, geregistreerde welstandsondersteuning en ’n leierskapspan wat die telefoon opneem.",
  "team.galleryTitle": "Lewe in Claremont",
  "team.educatorsTitle": "Ontmoet ons onderwysers",
  "team.educatorsSub":
    "Die Kaapstad Hoërskool-onderwysspan — regstreeks gepubliseer uit die skool se amptelike personeelregister.",

  "admissions.kicker": "Toelatings & Gelde",
  "admissions.title": "Beplan gelde in ’n minuut. Doen in vier stappe aansoek.",
  "admissions.blurb": "Deursigtig, onmiddellik en drukvry — presies soos toelatings behoort te voel.",
  "admissions.startTitle": "Begin jou aansoek",
  "apply.title": "Aansoek om Toelating",
  "apply.subtitle": "Graad 8–12 · Claremont-kampus · Januarie 2027-inname",

  "cta.title": "Nou inskrywings vir Graad 8–12 — Januarie 2027",
  "cta.body":
    "Plekke is beperk om ons 1:14-verhouding te handhaaf. Boek ’n kampusstoer, ontmoet die prinsipaal en sien die STREAM-lab in aksie.",
  "cta.apply": "Doen Nou Aansoek",
  "cta.whatsapp": "Boek ’n Kampusstoer op WhatsApp",

  "footer.blurb":
    "Deel van die Turkse Maarif-stigting se wêreldwye netwerk — 55 lande, 500+ skole, een standaard van uitnemendheid. Ons bou toekoms deur opvoeding in die Moederstad.",
  "footer.visit": "Besoek ons",
  "footer.links": "Vinnige skakels",
  "footer.rights": "Alle regte voorbehou.",
  "footer.compliance": "WCED-geregistreer · POPIA-voldoende · Veilige werwingsgesertifiseer",

  "proof.registrations": "Registrasies & gehalteversekering",
};

/* ─────────────────────────── isiXHOSA ─────────────────────────── */
const xh: Dict = {
  "nav.stem": "I-Lab ye-STEM",
  "nav.pathways": "Iindlela Zemfundo",
  "nav.campus": "Impilo yeKampasi",
  "nav.faculty": "Ootitshala",
  "nav.admissions": "Ukwamkelwa",
  "nav.portal": "I-Portal",
  "nav.erp": "I-ERP",
  "nav.apply": "Faka Isicelo",
  "nav.mobilePortal": "I-Portal Yabazali Nabafundi",
  "nav.mobileErp": "I-ERP yaBaphathi",
  "nav.language": "Ulwimi",

  "hero.kicker": "Claremont · eKapa · iNtshona-Koloni",
  "hero.titleLine1": "Apho iikamva zaseKapa",
  "hero.titleLine2": "ezikhanyayo ziqala khona.",
  "hero.body":
    "Isikolo samabanga aphezulu seBanga 8–12 esivulekile kubo bonke abafundi, esinikezela ngeendlela zemfundo ezimbini — ikhrikhalamu yeKAPS yaseMzantsi Afrika kunye neCambridge International — ngeeklasi ezincinane, iilabhu ze-STREAM kunye nenethiwekhi yehlabathi eya kwiilizwe ezingama-55.",
  "hero.ctaApply": "Qalisa Isicelo",
  "hero.ctaExplore": "Khangela iKampasi",
  "hero.trust": "Ibhukishwe kwi-WCED · Ukubhaliswa kuqala ngoJanuwari 2027",
  "hero.metric1": "Izinga lokuphumelela leCambridge",
  "hero.metric2": "Iindlela zeKAPS neCambridge",
  "hero.metric3": "Umlinganiselo wotitshala kumfundi",
  "hero.metric4": "Amazwe kwinethiwekhi",

  "about.kicker": "Malunga ne-IMS eKapa",
  "about.title": "Indawo yokufunda enjengenye yento",
  "about.pillar1": "Ukugqibelela koMfundo",
  "about.pillar1Sub": "Ikhrayiriyamu eqinileyo ekhuthaza ukhulo lengqondo",
  "about.pillar2": "Imbono yeHlabathi Jikelele",
  "about.pillar2Sub": "Sibhiyozela umahluko ngenkcubeko — ukulungelelanisa ihlabathi elidibeneyo",
  "about.pillar3": "Ukukhula koBuntu",
  "about.pillar3Sub": "Imfundo esekwe kwiixabiso eyakha ukuthembeka, ukuqina nobunkokheli",
  "about.pillar4": "Imisebenzi Engezeleleyo",
  "about.pillar4Sub": "Iimisebenzi yangaphandle exhasa abafundi ukufumana nokuphucula iitalente zabo",
  "about.readMore": "Funda umyalezo ugqibeleleyo",
  "about.readLess": "Cinyusa",

  "stem.kicker": "I-Lab ye-STEM ye-3D Esebenzayo",
  "stem.title": "Bona isayensi njengokuba abafundi bethu bayibona",
  "stem.blurb":
    "Uvavanyo oluphilayo lweklasi ye-STREAM. Jikelisa, yahluhlisa, uze uqwalasele iimodelle zesayensi ezisetyenziswa ngootitshala bethu ukwenza iingqikelelo ezinzima zibe lula.",

  "pathways.kicker": "Imaphu yeeZifundo neeNdlela Zemfundo",
  "pathways.title": "Iikhrikhalamu ezimbini. Onke amanyango avulekile.",
  "pathways.blurb":
    "Khetha ibanga nendlela zemfundo ukubona iifundo kunye neendlela eya kwiyunivesithi — ukusuka kwi-UCT ukuya kwiRussell Group.",

  "team.kicker": "Ootitshala & Impilo yeKampasi",
  "team.title": "Abantu basemva kwesithembiso",
  "team.blurb": "Iingcali zezifundo, inkxaso yempilo yengqiqo ebhalisiweyo, neqela labaholi eliphendula umnxeba.",
  "team.galleryTitle": "Impilo eClaremont",
  "team.educatorsTitle": "Yazi ootitshala bethu",
  "team.educatorsSub":
    "Iqela lootitshala laseCape Town High School — lipapashelwe ngokuthe ngqo kwirejisti yabasebenzi yesikolo.",

  "admissions.kicker": "Ukwamkelwa & Iintlawulo",
  "admissions.title": "Cwangcisa iintlawulo ngomzuzu. Faka isicelo ngeenyathelo ezine.",
  "admissions.blurb": "Kucacile, kwakhawuleza, ingenaxinzelelo — ngendlela ekufuneka ukwamkelwa kube kuyo.",
  "admissions.startTitle": "Qalisa isicelo sakho",
  "apply.title": "Isicelo Sokwamkelwa",
  "apply.subtitle": "Ibanga 8–12 · IKampasi yaseClaremont · Ukufika ngoJanuwari 2027",

  "cta.title": "Kubhaliswa ngoku iBanga 8–12 ngoJanuwari 2027",
  "cta.body":
    "Iindawo zilinganiselwa ukugcina umlinganiselo wee-1:14. Bhukisha uhambo lwekampasi, dibana nomphathi wesikolo, uze ubone i-lab ye-STEM isebenza.",
  "cta.apply": "Faka Isicelo Ngoku",
  "cta.whatsapp": "Bhukisha uHambo lweKampasi kwiWhatsApp",

  "footer.blurb":
    "Siyinxalenye yenethiwekhi yeTurkish Maarif Foundation yehlabathi — iilizwe ezingama-55, iiskolo ezingaphezulu kwe-500, umgangatho omnye. Sakha iikamva ngemfundo eKapa.",
  "footer.visit": "Sifikeleka njani",
  "footer.links": "Iikhonkco ezikhawulezayo",
  "footer.rights": "Onke amalungelo agciniwe.",
  "footer.compliance": "Ibhukishwe kwi-WCED · Idibana ne-POPIA · Ukhuseleko lwabasebenzi luqinisekisiwe",

  "proof.registrations": "Ukubhaliswa kunye nokuqinisekiswa kwemigangatho",
};

export const DICTS: Record<Lang, Dict> = { en, af, xh };

export function translate(lang: Lang, key: TKey): string {
  return DICTS[lang]?.[key] ?? en[key];
}
