import { Barlow_Semi_Condensed, Courier_Prime, Kalam } from "next/font/google";
import type { CSSProperties } from "react";

// A pre-printed accounting form: condensed print for the form itself, a neat
// hand for everything written on it, and a typewriter face for till receipts.
export const print = Barlow_Semi_Condensed({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--mz-print" });
export const hand = Kalam({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--mz-hand" });
export const receipt = Courier_Prime({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--mz-receipt" });

export const mzVars = {
  "--mz-blotter": "#2C4234", // desk blotter felt
  "--mz-voucher": "#E9F0E3", // green voucher paper
  "--mz-form": "#5E8C6A", // printed form rules and labels
  "--mz-ink": "#1F3A93", // ballpoint
  "--mz-pencil": "#77736D", // graphite
  "--mz-red": "#C23B2E", // double rules, errors
  "--mz-stamp": "#5B3E96", // office stamp ink
  "--mz-page": "#F6F6F1", // journal book
  "--mz-light": "#F3F4EE", // text on the blotter
} as CSSProperties;
