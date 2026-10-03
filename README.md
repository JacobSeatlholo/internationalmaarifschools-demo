# International Maarif Schools — Cape Town High School Digital Platform

A production-grade, full-stack digital ecosystem for **International Maarif School Cape Town High School** (Claremont, Western Cape) — public marketing portal, family portal and an internal ERP command centre in one Next.js application.

Built from a full audit of the school's live site (internationalmaarifschools.co.za) using the school's **real copy, real team, real fees, real terms and real photography**.

---

## ✨ Three cohorts, one platform

| Cohort | Experience |
|---|---|
| **Prospective families** | SEO-optimised public portal: real campus hero, trilingual UI, 3D STEM lab, subject/pathway mapper, instant fee estimator, 4-step application wizard with tracking codes |
| **Students & parents** | Academic portal: progression chart, fee status, application pipeline tracking, showcase |
| **Leadership & staff** | ERP command centre: financial hub with P&L, OCR receipts with approval tiers, BCEA-compliant leave engine with HPCSA doctor-note validation, smart substitute dispatch, parent-meeting scheduler, SLA kanban with auto-escalation, role-gated chat + executive directives with digital sign-off |

## 🌍 Western Cape trilingual support

The public portal ships in the three official languages of the Western Cape:

- **English** (`en_ZA`)
- **Afrikaans** (`af_ZA`) — incl. KABV terminology
- **isiXhosa** (`xh_ZA`)

Switch via the globe control in the header (desktop) or the language row in the mobile menu. The choice persists in `localStorage` (Zustand + persist). Dictionary: `src/lib/i18n.ts`.

> Note: machine-authored AF/XH translations cover the public-site chrome; leadership copy remains the school's published English text. A native-speaker review is recommended before production use.

## 🛠 Priority-0 repairs carried from the audit

- ✅ Canonical URLs / JSON-LD resolve from `NEXT_PUBLIC_SITE_URL` — zero `localhost` leakage
- ✅ Broken homepage video replaced by an always-working hero engine (video-first with Ken-Burns slideshow fallback)
- ✅ Team grid rebuilt: `repeat(auto-fill, minmax(240px,1fr))`, `aspect-[4/5]` cards, initials fallbacks, no clipped names — now showing the school's **real staff**
- ✅ `/events` → `/calendar` redirect + branded `not-found.tsx` / `error.tsx`
- ✅ Current copyright year, refreshed early-payment discount date

## 🧱 Tech stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Prisma (SQLite) · Zustand · Three.js / React-Three-Fiber · Tesseract.js OCR · socket.io · recharts

## 🚀 Getting started

```bash
bun install                # or npm install / pnpm install
cp .env.example .env       # adjust DATABASE_URL if needed
bunx prisma db push        # create the schema
bun run scripts/seed.ts    # seed demo data (staff, students, fees, tasks…)
bun run dev                # http://localhost:3000
```

Optional real-time chat service:

```bash
cd mini-services/chat-service && bun run dev   # socket.io on :3003
```

### Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin used by metadata + JSON-LD (falls back to the real site domain) |
| `DATABASE_URL` | Prisma SQLite file URL |

### Demo roles

Switch cohorts from the header (Portal / ERP). Role presets include `PARENT`, `STUDENT`, `TEACHER`, `DEPT_HEAD`, `BURSAR`, `PRINCIPAL`, `EXECUTIVE`.

## 📁 Key directories

```
src/app                  # routes + API handlers (applications, fees, receipts, leave, meetings…)
src/components/public    # hero, about (real school copy), 3D STEM lab, pathways, admissions, team
src/components/erp       # financial hub, OCR, leave engine, kanban, comms
src/lib                  # i18n, school data (real fees/terms/policy), BCEA leave engine, HPCSA validation
public/images/site       # real photography from the school's official CDN
mini-services            # socket.io chat service (role-gated channels)
```

## 📄 Content provenance

All school copy (About Us, Principal's & School Manager's messages, 2026 term dates, payment policy, staff names/portraits, campus photography) is © International Maarif Schools, reproduced here for the school's own digital platform demo.
