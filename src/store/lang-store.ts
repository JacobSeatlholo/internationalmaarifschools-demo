"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translate, type Lang, type TKey } from "@/lib/i18n";

/**
 * Western Cape trilingual state (English / Afrikaans / isiXhosa).
 * Persisted so returning visitors keep their language choice.
 */
interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
    }),
    { name: "ims-ct-lang" }
  )
);

/** Translation hook: const t = useT(); t("nav.apply") */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return (key: TKey) => translate(lang, key);
}
