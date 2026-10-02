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
import type { Lang } from "@/lib/i18n";

/** Demo slugs (content.ts `demos`) that have a component to render. */
export const demoSlugs = new Set(["nara-studio", "nara-randevu", "nara-asistan", "ferah-ilgaz-hukuk", "etut-mimarlik", "esik-emlak", "lodos-meyhane", "lodos-masa", "mine-dis", "sinekkaydi-berber", "doksan-hali-saha", "mizan-fatura", "pusula-el-kitabi", "kirpi-gelen-kutusu"]);

/** Renders the demo for a slug in a language; add a case here for every new demo. */
export function DemoView({ slug, lang = "tr" }: { slug: string; lang?: Lang }) {
  switch (slug) {
    case "nara-studio":
      return <NaraSite lang={lang} />;
    case "nara-randevu":
      return <NaraBookingPage lang={lang} />;
    case "nara-asistan":
      return <NaraAssistant lang={lang} />;
    case "ferah-ilgaz-hukuk":
      return <LawSite lang={lang} />;
    case "etut-mimarlik":
      return <EtutSite lang={lang} />;
    case "esik-emlak":
      return <EsikSite lang={lang} />;
    case "lodos-meyhane":
      return <LodosSite lang={lang} />;
    case "lodos-masa":
      return <LodosBookingPage lang={lang} />;
    case "mine-dis":
      return <MinePage lang={lang} />;
    case "sinekkaydi-berber":
      return <SinekkaydiPage lang={lang} />;
    case "doksan-hali-saha":
      return <DoksanPage lang={lang} />;
    case "mizan-fatura":
      return <MizanPage lang={lang} />;
    case "pusula-el-kitabi":
      return <PusulaPage lang={lang} />;
    case "kirpi-gelen-kutusu":
      return <KirpiPage lang={lang} />;
    default:
      return null;
  }
}
