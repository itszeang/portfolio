import { Figtree, Young_Serif } from "next/font/google";
import type { CSSProperties } from "react";

// Nara's own type, loaded only on its demo pages.
export const display = Young_Serif({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--nara-display" });
export const body = Figtree({ subsets: ["latin", "latin-ext"], variable: "--nara-body" });

/** Palette tokens, applied as CSS variables on each Nara page's root. */
export const naraVars = {
  "--nara-bg": "#EAEFF1",
  "--nara-paper": "#F7F9FA",
  "--nara-ink": "#2B1830",
  "--nara-muted": "#6E5F72",
  "--nara-rose": "#D9486F",
  "--nara-sage": "#9FB19A",
  "--nara-butter": "#F1E3A6",
} as CSSProperties;
