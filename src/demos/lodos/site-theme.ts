import { Forum, Hanken_Grotesk } from "next/font/google";
import type { CSSProperties } from "react";

// The website's evening look: carved Roman capitals for titles, a plain grotesk for text.
export const forum = Forum({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--ld-display" });
export const grotesk = Hanken_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--ld-body" });

export const siteVars = {
  "--ld-bg": "#0B0C0B",
  "--ld-panel": "#131513",
  "--ld-line": "rgba(236, 230, 214, 0.14)",
  "--ld-text": "#ECE6D6",
  "--ld-muted": "#A7A293",
  "--ld-nar": "#C0394B",
  // The meze tray reads the older --lodos-* names; give them their evening values here.
  "--lodos-card": "#161816",
  "--lodos-ink": "#ECE6D6",
  "--lodos-muted": "#A7A293",
  "--lodos-nar": "#C0394B",
  "--lodos-cini": "#8FC3BA",
  "--lodos-bg": "#0B0C0B",
} as CSSProperties;
