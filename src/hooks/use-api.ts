"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Lightweight data-fetch hook with manual refresh + polling support. */
export function useApi<T = unknown>(url: string, pollMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = (await res.json()) as T;
      if (mounted.current) {
        setData(json);
        setError(null);
      }
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    let t: ReturnType<typeof setInterval> | undefined;
    if (pollMs) t = setInterval(refresh, pollMs);
    return () => {
      mounted.current = false;
      if (t) clearInterval(t);
    };
  }, [refresh, pollMs]);

  return { data, loading, error, refresh };
}

export const fmtZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

export const fmtZAR2 = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 }).format(n);
