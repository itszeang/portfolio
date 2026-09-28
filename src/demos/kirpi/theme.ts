import { Atkinson_Hyperlegible, Caprasimo, Space_Mono } from "next/font/google";
import type { CSSProperties } from "react";

// A potter's bench: a soft, thrown-clay display face used sparingly, a very
// legible face for the letters and a typewriter mono for labels and notes.
export const display = Caprasimo({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--kp-display" });
export const body = Atkinson_Hyperlegible({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--kp-body" });
export const mono = Space_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--kp-mono" });

export const kpVars = {
  "--kp-clay": "#A99F93", // wet stoneware: the bench
  "--kp-clay-dark": "#8C8276", // shelf planks
  "--kp-plaster": "#F1F0EC", // paper, sticky labels
  "--kp-tenmoku": "#241A15", // ink
  "--kp-celadon": "#6E9E8F",
  "--kp-kraft": "#C4A075", // envelopes
  "--kp-tape": "#E6DDC6", // masking tape
  "--kp-stamp": "#B3261E", // rubber stamp
  "--kp-pencil": "#5B5048",
} as CSSProperties;
