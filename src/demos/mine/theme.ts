import { IBM_Plex_Mono, Onest } from "next/font/google";
import type { CSSProperties } from "react";
import type { UnsplashImage } from "@/demos/shared/unsplash";

// A light, friendly grotesk for everything, and a small mono for durations.
export const display = Onest({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], variable: "--mine-display" });
export const body = display;
export const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--mine-mono" });

export const mineVars = {
  "--mine-body": "var(--mine-display)",
  "--mine-bg": "#FBFAF3", // warm off-white
  "--mine-card": "#FFFFFF",
  "--mine-ink": "#1E2A1A",
  "--mine-muted": "#5F6A58",
  "--mine-cobalt": "#47603A", // deep sage: selected, progress
  "--mine-cobalt-soft": "#E4EFD0", // pale sage: soft fills
  "--mine-lime": "#D9EBA6", // highlight and main button
  "--mine-gum": "#F2C4BD",
  "--mine-ok": "#2F7A4A",
  "--mine-warn": "#A35A00",
  "--mine-alarm": "#B3261E",
  "--mine-page": "#EEF4E2", // the tinted frame around the page
} as CSSProperties;

export const images: Record<string, UnsplashImage> = {
  hero: { id: "photo-1777331903190-341a3dd0441b", alt: "Diş hekimi, koltukta oturan hastasıyla konuşuyor", altEn: "A dentist talking with a patient in the chair", by: "Harold Hisona" },
  oda: { id: "photo-1704455306251-b4634215d98f", alt: "Beyaz, aydınlık bir tedavi odası", altEn: "A bright, white treatment room", by: "Kari Bjorn Photography" },
  rontgen: { id: "photo-1777444969135-caf869407707", alt: "Hekim ışıklı panoda röntgen filmlerini inceliyor", altEn: "A dentist looking at X-rays on a light box", by: "Harold Hisona" },
  bekleme: { id: "photo-1762625570087-6d98fca29531", alt: "Sade, beyaz bir bekleme salonu", altEn: "A plain, white waiting room", by: "Amy Vosters" },
  firca: { id: "photo-1617984161716-189c889bd474", alt: "Beyaz zeminde bambu diş fırçaları", altEn: "Bamboo toothbrushes on a white surface", by: "Nataliya Melnychuk" },
};
