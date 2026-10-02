import { Anton, Inter } from "next/font/google";
import type { CSSProperties } from "react";
import type { UnsplashImage } from "@/demos/shared/unsplash";

// Poster-condensed capitals for headlines, Inter for everything you read.
export const anton = Anton({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--dk-display" });
export const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--dk-font" });

export const dkVars = {
  "--dk-bg": "#E9E9E7",
  "--dk-card": "#FFFFFF",
  "--dk-ink": "#041514", // night pitch
  "--dk-muted": "#4E5856",
  "--dk-turf": "#2FA85A",
  "--dk-turf-dark": "#15703A",
  "--dk-bib": "#F63038", // the red sticker
  "--dk-line": "#F4F4EF",
} as CSSProperties;

export const images: Record<string, UnsplashImage> = {
  gece: { id: "photo-1487466365202-1afdb86c764e", alt: "Işıklandırılmış yeşil bir futbol sahası, gece", altEn: "A floodlit green football pitch at night", by: "Jonathan Petersson" },
  kale: { id: "photo-1652190416554-c46af8a0ff50", alt: "Gece sahada bir kale", altEn: "A goal on the pitch at night", by: "Ambitious Studio* | Rick Barrett" },
  tel: { id: "photo-1664272851763-791dc79ede75", alt: "Tel örgünün ardından gece maçı", altEn: "A night match seen through a wire fence", by: "Mantis Saywhat" },
  cizgi: { id: "photo-1638868699118-73af322e79c9", alt: "Sentetik çimde beyaz saha çizgileri", altEn: "White pitch lines on artificial turf", by: "Darwin Vegher" },
  top: { id: "photo-1511886929837-354d827aae26", alt: "Çimde top ve krampon", altEn: "A ball and boots on the grass", by: "Alex" },
  vurus: { id: "photo-1612607700962-424524700884", alt: "Gece sahasında topa vuran bir oyuncu", altEn: "A player striking the ball on a pitch at night", by: "Michal Balog" },
};
