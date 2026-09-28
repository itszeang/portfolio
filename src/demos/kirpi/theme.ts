import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import type { CSSProperties } from "react";

// A workshop's product page: a display face with a hand-cut, ink-trapped edge
// for headlines, a plain sans for reading and a mono for the night log's clock.
export const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], axes: ["opsz", "wdth"], variable: "--kp-display" });
export const body = Instrument_Sans({ subsets: ["latin", "latin-ext"], variable: "--kp-body" });
export const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--kp-mono" });

export const kpVars = {
  "--kp-bg": "#FFFFFF",
  "--kp-panel": "#F5F3EF", // unglazed bisque
  "--kp-line": "#E6E1DA",
  "--kp-ink": "#1A1512",
  "--kp-muted": "#6A615A",
  "--kp-glaze": "#2F6B5E", // celadon glaze: done, safe
  "--kp-stamp": "#B3261E", // rubber stamp: phishing only
  "--kp-night": "#131934",
  "--kp-dawn": "#F1C7AA", // first light over the kiln yard
  "--kp-morning": "#CAD7EA",
} as CSSProperties;
