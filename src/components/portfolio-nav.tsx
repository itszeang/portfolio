"use client";

import GlassCard from "@/components/smoothui/glass-card";
import { ArrowUpRight, Menu } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { ui as uiEn } from "@/content.en";
import { useLang } from "@/lib/lang-context";

const navItemsTr = [
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
  const lang = useLang();
  const en = lang === "en";
  const navItems = en ? uiEn.nav : navItemsTr;
  const hasScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerSnapshot
  );
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const compact = hasScrolled && !manuallyExpanded;

  const closeExpandedNav = () => setManuallyExpanded(false);

  // The band this sits in spans the page width above the content; only the
  // visible bar or button may take the pointer, or it blocks what scrolls under it.
  return (
    <div className="pointer-events-none relative mx-auto h-[66px] w-full max-w-[54rem]">
      <div
        aria-hidden={compact}
        className={`absolute inset-x-0 top-0 ${transition} ${
          compact
            ? "pointer-events-none -translate-y-2 scale-[0.96] opacity-0 blur-[3px]"
            : "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
        }`}
        inert={compact ? true : undefined}
      >
        <GlassCard {...glassProps} className="portfolio-glass" radius={16}>
          <nav aria-label={en ? "Main menu" : "Ana menü"} className="flex items-center justify-between gap-5">
            <a
              className="-my-3 inline-flex min-h-11 items-center text-sm font-semibold tracking-[-0.02em]"
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
            <div className="flex items-center gap-4 sm:gap-5">
              <a
                aria-label={en ? "Türkçe sürüm" : "English version"}
                className="-my-3 inline-flex min-h-11 items-center font-mono text-xs tracking-[0.08em] text-white/60 transition-colors hover:text-white"
                href={en ? "/" : "/en"}
                hrefLang={en ? "tr" : "en"}
                lang={en ? "tr" : "en"}
              >
                {en ? "TR" : "EN"}
              </a>
              <a
                className="-my-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white"
                href="#iletisim"
                onClick={closeExpandedNav}
              >
                {en ? "Let's work together" : "Birlikte çalışalım"}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </nav>
        </GlassCard>
      </div>

      <div
        aria-hidden={!compact}
        className={`absolute left-1/2 top-0 -translate-x-1/2 ${transition} ${
          compact
            ? "pointer-events-auto opacity-100 blur-0"
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
            aria-label={en ? uiEn.menuOpen : "Menüyü aç"}
            className="-m-3 flex size-11 items-center justify-center text-white/88 transition-colors hover:text-white focus-visible:text-white"
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
