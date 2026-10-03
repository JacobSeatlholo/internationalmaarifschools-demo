"use client";

import { Button } from "@/components/ui/button";

/** Brand-aligned error boundary. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="relative grid min-h-screen place-items-center bg-navy-deep px-4 text-center text-white">
      <div>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-gold to-gold-soft text-3xl font-black text-navy-deep shadow-2xl">
          M
        </span>
        <p className="mt-8 font-mono text-sm font-bold uppercase tracking-[0.3em] text-gold">System hiccup</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Something interrupted the lesson.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
          An unexpected error occurred — our IT team has been notified. Try again, or head back
          to the homepage while we sort it out.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            onClick={reset}
            className="h-11 rounded-full bg-gold px-7 text-sm font-bold text-navy-deep hover:bg-gold-soft"
          >
            Try again
          </Button>
          <a
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to homepage
          </a>
        </div>
      </div>
    </main>
  );
}
