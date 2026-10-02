"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>("tr");

/** Tells the client components below which language the page is in. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** The page's language, for client components; Turkish outside a provider. */
export const useLang = () => useContext(LangContext);
