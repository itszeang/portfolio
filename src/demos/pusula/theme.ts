import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import type { CSSProperties } from "react";

// A printed handbook in a serif, the assistant around it in a plain sans.
export const serif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--ps-serif" });
export const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--ps-sans" });
export const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--ps-mono" });

export const psVars = {
  "--ps-bg": "#E6D9BD", // manila folder
  "--ps-paper": "#FFFDF8",
  "--ps-ink": "#1D2433",
  "--ps-muted": "#5F6573",
  "--ps-blue": "#2B4C9B", // fountain-pen ink
  "--ps-cite": "#DCE4FF",
  "--ps-line": "#E4DCCB",
} as CSSProperties;
