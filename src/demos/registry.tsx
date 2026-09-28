import { DoksanPage } from "./doksan/doksan-page";
import { EsikSite } from "./esik/esik-site";
import { EtutSite } from "./etut/etut-site";
import { LawSite } from "./hukuk/law-site";
import { KirpiPage } from "./kirpi/kirpi-page";
import { LodosBookingPage } from "./lodos/lodos-booking-page";
import { LodosSite } from "./lodos/lodos-site";
import { MinePage } from "./mine/mine-page";
import { MizanPage } from "./mizan/mizan-page";
import { PusulaPage } from "./pusula/pusula-page";
import { SinekkaydiPage } from "./sinekkaydi/sinekkaydi-page";
import { NaraAssistant } from "./nara/nara-assistant";
import { NaraBookingPage } from "./nara/nara-booking-page";
import { NaraSite } from "./nara/nara-site";

/** Demo slugs (content.ts `demos`) that have a component to render. */
export const demoSlugs = new Set(["nara-studio", "nara-randevu", "nara-asistan", "ferah-ilgaz-hukuk", "etut-mimarlik", "esik-emlak", "lodos-meyhane", "lodos-masa", "mine-dis", "sinekkaydi-berber", "doksan-hali-saha", "mizan-fatura", "pusula-el-kitabi", "kirpi-gelen-kutusu"]);

/** Renders the demo for a slug; add a case here for every new demo. */
export function DemoView({ slug }: { slug: string }) {
  switch (slug) {
    case "nara-studio":
      return <NaraSite />;
    case "nara-randevu":
      return <NaraBookingPage />;
    case "nara-asistan":
      return <NaraAssistant />;
    case "ferah-ilgaz-hukuk":
      return <LawSite />;
    case "etut-mimarlik":
      return <EtutSite />;
    case "esik-emlak":
      return <EsikSite />;
    case "lodos-meyhane":
      return <LodosSite />;
    case "lodos-masa":
      return <LodosBookingPage />;
    case "mine-dis":
      return <MinePage />;
    case "sinekkaydi-berber":
      return <SinekkaydiPage />;
    case "doksan-hali-saha":
      return <DoksanPage />;
    case "mizan-fatura":
      return <MizanPage />;
    case "pusula-el-kitabi":
      return <PusulaPage />;
    case "kirpi-gelen-kutusu":
      return <KirpiPage />;
    default:
      return null;
  }
}
