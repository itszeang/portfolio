import { Host_Grotesk, Instrument_Serif } from "next/font/google";
import type { CSSProperties } from "react";

// A friendly grotesk with one italic serif word per heading.
export const display = Host_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--esik-display" });
export const body = display;
export const serif = Instrument_Serif({ subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"], variable: "--esik-serif" });

export const esikVars = {
  "--esik-body": "var(--esik-display)",
  "--esik-bg": "#F8F8F8",
  "--esik-card": "#FFFFFF",
  "--esik-ink": "#16232B",
  "--esik-muted": "#5C6870",
  "--esik-cream": "#FFEBC6",
  "--esik-sky": "#C9DEE5",
  "--esik-olive": "#16232B",
  "--esik-olive-deep": "#0B1419",
  "--esik-lemon": "#FFEBC6",
  "--esik-line": "rgba(22,35,43,0.1)",
} as CSSProperties;

import type { UnsplashImage } from "@/demos/shared/unsplash";

export const images: Record<string, UnsplashImage> = {
  hero: { id: "photo-1676845720871-493d7d821481", alt: "Körfeze bakan İzmir, balkon korkuluğunun ardından", altEn: "İzmir and its bay seen past a balcony railing", by: "Mert Kahveci" },
  "E-2107": { id: "photo-1702830499141-a0634d87d6af", alt: "Denize bakan balkon", altEn: "A balcony looking out to sea", by: "David Kuvaev" },
  "E-2104": { id: "photo-1789919350060-507ab3ae2d6b", alt: "Güneş alan bej bir apartman cephesi", altEn: "A sunlit beige apartment front", by: "Timur Seyfelmlyukov" },
  "E-2099": { id: "photo-1716727973578-e8d307b17c11", alt: "Yeşillikler içinde bir bahçe ve oturma alanı", altEn: "A garden and seating area among greenery", by: "Christer Lässman" },
  "E-2096": { id: "photo-1788927775194-70e9b280dd79", alt: "Kemerli nişi olan gün ışıklı bir oda", altEn: "A sunlit room with an arched alcove", by: "Vincent Yap" },
  "E-2092": { id: "photo-1560185127-6ed189bf02f4", alt: "Geniş ve aydınlık bir oturma odası", altEn: "A large, bright living room", by: "Francesca Tosolini" },
  "E-2088": { id: "photo-1665249934445-1de680641f50", alt: "Büyük pencereli bir salon", altEn: "A living room with big windows", by: "Danilo Rios" },
  "E-2083": { id: "photo-1785232244548-5cfe6fb60418", alt: "Mavi sandalyeli küçük bir stüdyo daire", altEn: "A small studio flat with blue chairs", by: "Aleksandra Dementeva" },
  "E-2079": { id: "photo-1618246083684-2549687df50b", alt: "Palmiyelerin önünde beyaz bir apartman", altEn: "A white apartment block behind palm trees", by: "Hazel Aksoy" },
  palmiye: { id: "photo-1773081364242-e6cbd640fde1", alt: "Modern bir apartmanın önünde uzun bir palmiye", altEn: "A tall palm in front of a modern apartment block", by: "Alex Batonisashvili" },
  koy: { id: "photo-1782150626772-93098dcb92a4", alt: "Kırmızı çatılar ve körfez", altEn: "Red roofs and the bay", by: "Muhammet Cengiz" },
  salon: { id: "photo-1779903726785-7cf25bed78f7", alt: "Denize bakan aydınlık bir yemek alanı", altEn: "A bright dining area looking out to sea", by: "Caroline Badran" },
};
