import { PusulaApp } from "./pusula-app";
import { mono, psVars, sans, serif } from "./theme";
import type { Lang } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";

/** Pusula: the handbook assistant that cites its sources, a "yapay zekâ" demo. */
export function PusulaPage({ lang = "tr" }: { lang?: Lang }) {
  return (
    <div
      className={`${serif.variable} ${sans.variable} ${mono.variable} min-h-[100dvh] bg-[var(--ps-bg)] font-[family-name:var(--ps-sans)] text-[var(--ps-ink)] antialiased`}
      style={psVars}
    >
      <LangProvider lang={lang}>
        <PusulaApp />
      </LangProvider>
    </div>
  );
}
