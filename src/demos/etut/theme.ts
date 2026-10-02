import { Inter_Tight, Martian_Mono } from "next/font/google";
import type { CSSProperties } from "react";
import type { UnsplashImage } from "@/demos/shared/unsplash";

// Swiss grid: one tight grotesk at two sizes, and a drafting mono for measurements.
export const display = Inter_Tight({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700"], variable: "--etut-display" });
export const body = display;
export const mono = Martian_Mono({ subsets: ["latin", "latin-ext"], weight: ["300", "400"], variable: "--etut-mono" });

export const etutVars = {
  "--etut-paper": "#FFFFFF",
  "--etut-card": "#F4F4F2",
  "--etut-ink": "#0A0A0A",
  "--etut-muted": "#6B6B6B",
  "--etut-red": "#E4572E", // the architect's red revision pen: plans only
  "--etut-body": "var(--etut-display)",
} as CSSProperties;

export const images: Record<string, UnsplashImage> = {
  kapak: { id: "photo-1551686496-a8887d245d7b", alt: "Brüt beton bir yapının kavisli cephesi", altEn: "The curved front of a bare-concrete building", by: "Pavel Nekoranec" },
  yalikavak: { id: "photo-1785185502654-4931766c7a8a", alt: "Yeşil panjurlu eski bir taş ev", altEn: "An old stone house with green shutters", by: "Miljan Mijatović" },
  moda: { id: "photo-1737805232236-57b2911747e5", alt: "Yüksek apartmanlarla çevrili dar bir İstanbul sokağı", altEn: "A narrow Istanbul street between tall apartment blocks", by: "Tolga Ahmetler" },
  eskisehir: { id: "photo-1787088988806-7ec503692b85", alt: "Taş duvarlı, bahçeye açılan tek katlı modern bir ev", altEn: "A single-storey modern house with stone walls, opening onto a garden", by: "João Emanuel" },
  karakoy: { id: "photo-1785917835430-f1617b7d68ff", alt: "Tuğla duvarlı, gün ışığı alan boş bir endüstriyel mekân", altEn: "An empty, sunlit industrial space with brick walls", by: "Szcze hoo" },
  cizim: { id: "photo-1503387762-592deb58ef4e", alt: "Paftanın üzerinde kalemle çizim yapan bir el", altEn: "A hand drawing in pencil on a drawing sheet", by: "Daniel McCullough" },
  maket: { id: "photo-1653164494885-a8526f62678c", alt: "Beyaz bir konut maketi", altEn: "A white model of a house", by: "Fernando Andrade" },
  merdiven: { id: "photo-1787511043667-391d786afaf4", alt: "Beton merdivene düşen zikzak gölge", altEn: "A zigzag shadow falling on a concrete stair", by: "Roman D" },
};
