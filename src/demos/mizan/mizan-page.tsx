import { MizanApp } from "./mizan-app";
import { hand, mzVars, print, receipt } from "./theme";
import type { Lang } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";

// Felt grain for the desk blotter.
const felt =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E\")";

/** Mizan: the invoice-reading "yapay zekâ otomasyonu" demo. */
export function MizanPage({ lang = "tr" }: { lang?: Lang }) {
  return (
    <div
      className={`${print.variable} ${hand.variable} ${receipt.variable} min-h-[100dvh] bg-[var(--mz-blotter)] font-[family-name:var(--mz-print)] text-[var(--mz-light)] antialiased`}
      style={{ ...mzVars, backgroundImage: felt }}
    >
      <LangProvider lang={lang}>
        <MizanApp />
      </LangProvider>
    </div>
  );
}
