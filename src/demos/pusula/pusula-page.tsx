import { PusulaApp } from "./pusula-app";
import { mono, psVars, sans, serif } from "./theme";

/** Pusula: the handbook assistant that cites its sources, a "yapay zekâ" demo. */
export function PusulaPage() {
  return (
    <div
      className={`${serif.variable} ${sans.variable} ${mono.variable} min-h-[100dvh] bg-[var(--ps-bg)] font-[family-name:var(--ps-sans)] text-[var(--ps-ink)] antialiased`}
      style={psVars}
    >
      <PusulaApp />
    </div>
  );
}
