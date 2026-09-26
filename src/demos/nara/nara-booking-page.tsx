import { Suspense } from "react";
import { NaraBooking } from "./nara-booking";
import { body, display, naraVars } from "./theme";

/** Nara's booking app: the "online randevu sistemi" demo. */
export function NaraBookingPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--nara-bg)] font-[family-name:var(--nara-body)] text-[var(--nara-ink)] antialiased`}
      style={naraVars}
    >
      {/* useSearchParams needs a Suspense boundary on a statically built page. */}
      <Suspense>
        <NaraBooking />
      </Suspense>
    </div>
  );
}
