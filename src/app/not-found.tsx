import Link from "next/link";
import { SCHOOL } from "@/lib/site";

/** Brand-aligned 404 (P0 route normalization). */
export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center bg-navy-deep px-4 text-center text-white">
      <div>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-gold to-gold-soft text-3xl font-black text-navy-deep shadow-2xl">
          M
        </span>
        <p className="mt-8 font-mono text-sm font-bold uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">This page is not on our timetable.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
          The page you are looking for may have moved, been renamed, or never existed.
          Let&apos;s get you back to the Claremont campus.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-gold px-7 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-soft"
          >
            Back to homepage
          </Link>
          <Link
            href="/#admissions"
            className="inline-flex h-11 items-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Admissions
          </Link>
        </div>
      </div>
    </main>
  );
}
