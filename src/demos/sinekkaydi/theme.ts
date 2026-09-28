import { Jost, Marcellus } from "next/font/google";
import type { CSSProperties } from "react";

// Engraved-sign capitals over a clean geometric sans, like a gilded shop window.
export const display = Marcellus({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--sk-display" });
export const body = Jost({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], variable: "--sk-body" });

export const skVars = {
  "--sk-bg": "#141414",
  "--sk-panel": "#1C1917",
  "--sk-card": "#1C1917",
  "--sk-line": "rgba(230, 176, 142, 0.18)",
  "--sk-ink": "#F3EDE7",
  "--sk-muted": "#A39C96",
  "--sk-copper": "#B17553",
  "--sk-copper-light": "#E6B08E",
} as CSSProperties;

export const images = {
  hero: { id: "photo-1771489465791-00ee339a9c92", alt: "Kalabalık bir berber dükkânında saç kesimi, siyah beyaz", by: "Georgi Kalaydzhiev" },
  usta: { id: "photo-1779595912196-f5f3fcc3970b", alt: "Yaşlı bir berber genç bir müşterinin saçını kesiyor", by: "Pranav Rasal" },
  sakal: { id: "photo-1532710093739-9470acff878f", alt: "Fırçayla köpük sürülen bir sakal", by: "Arthur Humeau" },
  makas: { id: "photo-1517832606299-7ae9b720a186", alt: "Makasla sakal düzeltme", by: "Nathon Oski" },
  ustura: { id: "photo-1524230616393-d6229fcd2eff", alt: "Ustura ve tıraş fırçası", by: "Josh Sorenson" },
  koltuk: { id: "photo-1769034260387-39fa07f0c0fa", alt: "Eski usul bir dükkânda yan yana berber koltukları", by: "Sebastian Ciepiela" },
  cocuk: { id: "photo-1733995471047-62a3bb52b657", alt: "Makasla ense düzeltme", by: "Victor Sirbu" },
};
