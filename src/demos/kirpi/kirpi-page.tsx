import { KirpiApp } from "./kirpi-app";
import { body, display, kpVars, mono } from "./theme";

// Fine grain over the clay colour, so the bench reads as a surface and not a flat fill.
const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .14 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")";

/** Kirpi Seramik's inbox assistant: a "yapay zekâ otomasyonu" demo. */
export function KirpiPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-[100dvh] bg-[var(--kp-clay)] font-[family-name:var(--kp-body)] text-[var(--kp-tenmoku)] antialiased`}
      style={{ ...kpVars, backgroundImage: grain }}
    >
      <KirpiApp />
    </div>
  );
}
