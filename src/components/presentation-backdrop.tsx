"use client";

import { PixelLiquidBg } from "@/components/pixel-liquid-bg";
import { useEffect, useState } from "react";

const BACKDROP_BLUR = 24;
// While a two-colour glow is showing, the fluid steps back so the corner
// light reads as the card's own colours rather than a mix with the pink.
const FLUID_DIM_UNDER_GLOW = 0.5;

type Tone = {
  hue: number;
  saturate: number;
  brightness: number;
  glowA: string | null;
  glowB: string | null;
  off: boolean;
};

export function PresentationBackdrop() {
  // Each section can tint the fluid: hue rotation plus optional saturation
  // and brightness, since hue-rotate alone keeps luminance and can go muddy.
  // Project cards also pass two colours: one glows from the top-left corner,
  // the other from the bottom-right, mirroring the card's own gradient.
  const [tone, setTone] = useState<Tone>({
    hue: 0,
    saturate: 1.06,
    brightness: 1,
    glowA: null,
    glowB: null,
    off: false,
  });
  // Last glow colours are kept while fading out, so the light dims in its own
  // colour instead of snapping to transparent black.
  const [lastGlow, setLastGlow] = useState({ a: "transparent", b: "transparent" });

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      "[data-background-hue]"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const d = (entry.target as HTMLElement).dataset;
          const glowA = d.backgroundGlowA ?? null;
          const glowB = d.backgroundGlowB ?? null;
          setTone({
            hue: Number(d.backgroundHue ?? 0),
            saturate: Number(d.backgroundSaturate ?? 1.06),
            brightness: Number(d.backgroundBrightness ?? 1),
            glowA,
            glowB,
            off: d.backgroundOff === "true",
          });
          if (glowA && glowB) setLastGlow({ a: glowA, b: glowB });
        }
      },
      {
        rootMargin: "-38% 0px -38% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const glowing = Boolean(tone.glowA && tone.glowB);
  const brightness = tone.brightness * (glowing ? FLUID_DIM_UNDER_GLOW : 1);

  return (
    <>
      <PixelLiquidBg
        aria-hidden="true"
        className="presentation-backdrop fixed inset-0 h-[100dvh] w-full"
        pixelSize={16}
        resolution={0.34}
        style={{
          background: "#000",
          // The blur matches the glass cards' frost, so the fluid reads as the
          // same soft light everywhere instead of hard pixels between the cards.
          filter: `hue-rotate(${tone.hue}deg) saturate(${tone.saturate}) brightness(${brightness}) blur(${BACKDROP_BLUR}px)`,
          // Sections can switch the fluid off entirely (the services index
          // reads best on plain black).
          opacity: tone.off ? 0 : 1,
        }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 h-[100dvh] w-full">
        <div
          className="backdrop-glow backdrop-glow-a absolute inset-0"
          style={{ backgroundColor: lastGlow.a, opacity: glowing ? 1 : 0 }}
        />
        <div
          className="backdrop-glow backdrop-glow-b absolute inset-0"
          style={{ backgroundColor: lastGlow.b, opacity: glowing ? 1 : 0 }}
        />
      </div>
    </>
  );
}
