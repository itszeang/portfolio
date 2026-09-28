import { Figtree, Newsreader } from "next/font/google";
import type { CSSProperties } from "react";

// Nara's type for the booking and assistant pages: the same editorial serif and
// Figtree as the website (see site-theme.ts), under the older variable names.
export const display = Newsreader({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["opsz"], variable: "--nara-display" });
export const body = Figtree({ subsets: ["latin", "latin-ext"], variable: "--nara-body" });

/** Palette tokens, applied as CSS variables on each Nara page's root. */
export const naraVars = {
  "--nara-bg": "#F7F6F3",
  "--nara-paper": "#FFFFFF",
  "--nara-ink": "#1A1A1A",
  "--nara-muted": "#6B6760",
  "--nara-rose": "#D9486F", // "free now" and the chosen time
  "--nara-sage": "#E8E6E1", // hairlines and quiet tags
  "--nara-butter": "#EFECE6", // time chips
} as CSSProperties;
