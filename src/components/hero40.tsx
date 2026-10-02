import DitherReveal from "@/components/originkit/dither-reveal";
import { ArrowUpRight } from "lucide-react";
import { archive, contact, hero as heroTr } from "@/content";
import { hero as heroEn } from "@/content.en";
import type { Lang } from "@/lib/i18n";
import "@/app/hero40.css";

/**
 * Opening section: Originkit "Hero 40" (installed with the Originkit CLI),
 * filled with the portfolio's own copy. Its own header is removed; the
 * site-wide PortfolioNav floats above it instead. It sits above the fixed pixel
 * backdrop, so that background only shows once the hero has scrolled away.
 */
export function Hero40({ lang = "tr" }: { lang?: Lang }) {
  const en = lang === "en";
  const hero = en ? heroEn : heroTr;
  const mail = `mailto:${contact.email}`;
  return (
    <div className="hero40 relative z-20">
      <section className="hero" id="baslangic">
        <div className="noise" aria-hidden="true" />

        <div className="dither-layer" aria-hidden="true">
          <DitherReveal image={{ src: "/hands-cutout.webp", alt: "" }} />
        </div>

        <section className="hero-content" aria-labelledby="hero-title">
          <h1 id="hero-title">
            <span className="headline-line headline-line-muted">{hero.lines[0]}</span>
            <span className="headline-line">{hero.lines[1]}</span>
          </h1>
          <p className="hero-copy">
            {hero.copy}
            <br className="desktop-break" /> {hero.copySecondLine}
          </p>
          <a className="primary-cta" href={mail}>
            {hero.cta}
            <ArrowUpRight aria-hidden="true" className="cta-arrow" strokeWidth={2} />
          </a>
        </section>

        <footer className="hero-footer">
          <p>{en ? "Thinks through the design. Builds the system. Ships the product." : archive.signoff}</p>
          <a className="scroll-cue" href="#hizmetler">
            {en ? "scroll" : "kaydır"} <span aria-hidden="true">↓</span>
          </a>
          <p>
            {en ? "Product development, AI, web & mobile" : "Ürün geliştirme, yapay zekâ ve web & mobil"}
            <br /> {en ? "Based in Türkiye, open to the world." : "Türkiye'den dünyaya açık."}
          </p>
        </footer>
      </section>
    </div>
  );
}
