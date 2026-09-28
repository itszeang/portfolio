import { Public_Sans, Spectral } from "next/font/google";
import type { CSSProperties } from "react";

// Ferah & Ilgaz's type: a light Spectral for headings, Public Sans for everything else.
export const display = Spectral({ subsets: ["latin", "latin-ext"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--law-display" });
export const body = Public_Sans({ subsets: ["latin", "latin-ext"], variable: "--law-body" });

export const lawVars = {
  "--law-paper": "#FBFAF7",
  "--law-panel": "#F1EEE8",
  "--law-ink": "#1F1B1A",
  "--law-slate": "#6A625C",
  "--law-oxblood": "#5E2630",
  "--law-line": "#DED9D0",
} as CSSProperties;

export const images = {
  hero: { id: "photo-1687092025766-a05a4862e0a5", alt: "Kitap raflarının arasında, pencereden ışık alan bir çalışma köşesi", by: "Amy W." },
  alanlar: { id: "photo-1473186505569-9c61870c11f9", alt: "El yazısı bir mektubun üzerinde dolma kalem", by: "Álvaro Serrano" },
  avukatlar: { id: "photo-1574258495973-f010dfbb5371", alt: "Beyaz bir kitabın üzerinde okuma gözlüğü", by: "Sincerely Media" },
  kaynak: { id: "photo-1444427169197-de497742b62d", alt: "Basılı bir metnin üzerinde siyah çerçeveli gözlük", by: "Mari Helin" },
};
