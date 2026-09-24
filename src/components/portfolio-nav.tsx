"use client";

import GlassCard from "@/components/smoothui/glass-card";
import { ArrowUpRight, Menu } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const navItems = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#projeler", label: "Projeler" },
  { href: "#deneyim", label: "Deneyim" },
  { href: "#hakkimda", label: "Hakkımda" },
];

const subscribeToScroll = (onStoreChange: () => void) => {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
};

const getScrollSnapshot = () => window.scrollY > 72;
const getServerSnapshot = () => false;

const glassProps = {
  blur: 24,
  interactive: false,
  refraction: 0,
  rimWidth: 1,
  shadow: true,
  specular: false,
  tint: "oklch(1 0 0 / 0.03)",
} as const;

const transition =
  "transition-[transform,opacity,filter] duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none motion-reduce:duration-150 motion-reduce:blur-none";

export function PortfolioNav() {
  const hasScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerSnapshot
  );
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const compact = hasScrolled && !manuallyExpanded;

  const closeExpandedNav = () => setManuallyExpanded(false);

  return (
    <div className="relative mx-auto h-[66px] w-full max-w-[54rem]">
      <div
        aria-hidden={compact}
        className={`absolute inset-x-0 top-0 ${transition} ${
          compact
            ? "pointer-events-none -translate-y-2 scale-[0.96] opacity-0 blur-[3px]"
            : "translate-y-0 scale-100 opacity-100 blur-0"
        }`}
        inert={compact ? true : undefined}
      >
        <GlassCard {...glassProps} className="portfolio-glass" radius={16}>
          <nav aria-label="Ana menü" className="flex items-center justify-between gap-5">
            <a
              className="text-sm font-semibold tracking-[-0.02em]"
              href="#baslangic"
              onClick={closeExpandedNav}
            >
              Burak Alp Yahşi
            </a>
            <div className="hidden items-center gap-6 text-sm text-white/68 md:flex">
              {navItems.map((item) => (
                <a
                  className="transition-colors hover:text-white focus-visible:text-white"
                  href={item.href}
                  key={item.href}
                  onClick={closeExpandedNav}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-white"
              href="#iletisim"
              onClick={closeExpandedNav}
            >
              Birlikte çalışalım
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </nav>
        </GlassCard>
      </div>

      <div
        aria-hidden={!compact}
        className={`absolute left-1/2 top-0 -translate-x-1/2 ${transition} ${
          compact
            ? "opacity-100 blur-0"
            : "pointer-events-none -translate-y-2 scale-[0.78] opacity-0 blur-[3px]"
        }`}
        inert={!compact ? true : undefined}
      >
        <GlassCard
          {...glassProps}
          className="portfolio-glass"
          contentPadding={13}
          radius={16}
        >
          <button
            aria-label="Menüyü aç"
            className="flex size-5 items-center justify-center text-white/88 transition-colors hover:text-white focus-visible:text-white"
            onClick={() => setManuallyExpanded(true)}
            type="button"
          >
            <Menu aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
