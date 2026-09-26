import { NaraAssistant } from "./nara/nara-assistant";
import { NaraBookingPage } from "./nara/nara-booking-page";
import { NaraSite } from "./nara/nara-site";

/** Demo slugs (content.ts `demos`) that have a component to render. */
export const demoSlugs = new Set(["nara-studio", "nara-randevu", "nara-asistan"]);

/** Renders the demo for a slug; add a case here for every new demo. */
export function DemoView({ slug }: { slug: string }) {
  switch (slug) {
    case "nara-studio":
      return <NaraSite />;
    case "nara-randevu":
      return <NaraBookingPage />;
    case "nara-asistan":
      return <NaraAssistant />;
    default:
      return null;
  }
}
