import { Suspense } from "react";
import { NaraBooking } from "./nara-booking";
import { body, display, naraVars } from "./theme";
import type { Lang } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";

/** Nara's booking app: the "online randevu sistemi" demo. */
export function NaraBookingPage({ lang = "tr" }: { lang?: Lang }) {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--nara-bg)] font-[family-name:var(--nara-body)] text-[var(--nara-ink)] antialiased`}
      style={naraVars}
    >
      {/* useSearchParams needs a Suspense boundary on a statically built page. */}
      <LangProvider lang={lang}>
        <Suspense>
          <NaraBooking />
        </Suspense>
      </LangProvider>
    </div>
  );
}
