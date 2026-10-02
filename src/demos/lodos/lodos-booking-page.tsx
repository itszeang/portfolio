import type { CSSProperties } from "react";
import { Suspense } from "react";
import { LodosBooking } from "./lodos-booking";
import { forum, grotesk, siteVars } from "./site-theme";
import type { Lang } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";

/** Lodos's table booking: the restaurant "online randevu sistemi" demo, in the website's evening look. */
export function LodosBookingPage({ lang = "tr" }: { lang?: Lang }) {
  return (
    <div
      className={`${forum.variable} ${grotesk.variable} min-h-[100dvh] bg-[var(--ld-bg)] font-[family-name:var(--ld-body)] text-[var(--ld-text)] antialiased`}
      style={{ ...siteVars, "--lodos-display": "var(--ld-display)" } as CSSProperties}
    >
      {/* useSearchParams needs a Suspense boundary on a statically built page. */}
      <LangProvider lang={lang}>
        <Suspense>
          <LodosBooking />
        </Suspense>
      </LangProvider>
    </div>
  );
}
