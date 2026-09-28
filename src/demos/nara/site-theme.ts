import { Figtree, Newsreader } from "next/font/google";
import type { CSSProperties } from "react";

// An editorial serif (light, with italics) over Nara's existing Figtree.
export const newsreader = Newsreader({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["opsz"], variable: "--nr-serif" });
export const figtree = Figtree({ subsets: ["latin", "latin-ext"], variable: "--nr-sans" });

export const nrVars = {
  "--nr-bg": "#FFFFFF",
  "--nr-alt": "#F7F6F3",
  "--nr-ink": "#1A1A1A",
  "--nr-muted": "#6B6760",
  "--nr-quiet": "#8F8A80", // the large grey paragraph
  "--nr-line": "#E8E6E1",
  "--nr-rose": "#D9486F", // only for "free now"
} as CSSProperties;

export const images = {
  hero: { id: "photo-1581182800629-7d90925ad072", alt: "Gözleri kapalı, gün ışığında dinlenen bir yüz", by: "Fleur Kaan" },
  imza: { id: "photo-1683408640631-2c99fff964d7", alt: "Havluya sarılı saçla cilt bakımında uzanan bir kadın", by: "Masum Rahimi" },
  analiz: { id: "photo-1683579808784-6faf6af67a40", alt: "Damlalıkla cilde serum uygulanıyor", by: "Masum Rahimi" },
  bakim: { id: "photo-1570172619644-dfd03ed5d881", alt: "Yüze fırçayla maske sürülüyor", by: "Rosa Rafael" },
  sonra: { id: "photo-1608068811588-3a67006b7489", alt: "Beyaz zemin üzerinde krem dokusu", by: "Jocelyn Morales" },
  kas: { id: "photo-1718720410649-7524fcb0f0a5", alt: "Kaş şekillendirme sırasında yakın çekim", by: "nastiia nikitenko" },
  tirnak: { id: "photo-1630843599725-32ead7671867", alt: "Beyaz ojeli, sade bir manikür", by: "Ellie Eshaghi" },
  studyo: { id: "photo-1706464287882-18cf0f772f79", alt: "Beyaz, ferah bir bekleme alanı", by: "Martin Lysek" },
  havlu: { id: "photo-1728034261564-18930dcb2c8e", alt: "Katlanmış havlular", by: "Antonio Araujo" },
  alet: { id: "photo-1775500835259-d3b3f6d6e2f2", alt: "Keten üzerinde manikür aletleri", by: "Ksenia Pixelesse" },
  serum: { id: "photo-1576426863848-c21f53c60b19", alt: "Beyaz zeminde damlalıklı şişe", by: "Content Pixie" },
  koltuk: { id: "photo-1776482127816-98d2245d22a6", alt: "Beyaz bakım koltuğu ve gümüş tepsi", by: "Franco Debartolo" },
};
