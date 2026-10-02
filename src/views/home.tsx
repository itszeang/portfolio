import { CookiePreferencesButton } from "@/components/analytics";
import { PortfolioNav } from "@/components/portfolio-nav";
import { PresentationBackdrop } from "@/components/presentation-backdrop";
import { Hero40 } from "@/components/hero40";
import { MaskedWords } from "@/components/motion/masked-words";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ScrollFocus, ScrollFocusVars } from "@/components/motion/scroll-focus";
import { ServicesIndex } from "@/components/motion/services-index";
import { WorkGrid } from "@/components/work-grid";
import { AboutSection } from "@/components/rbp/about-section";
import { ContactCard } from "@/components/rbp/contact-card";
import * as tr from "@/content";
import * as en from "@/content.en";
import { getServices, servicePagePath } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";
import { ArrowUpRight } from "lucide-react";

/** The one-page portfolio, in Turkish at / and in English at /en. */
export function HomePage({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const servicesIntro = isEn ? en.servicesIntro : tr.servicesIntro;
  const projectsIntro = isEn ? en.projectsIntro : tr.projectsIntro;
  const otherWork = { title: isEn ? en.otherWork.title : tr.otherWork.title, links: tr.otherWork.links.map((l, i) => ({ ...l, label: isEn ? en.otherWork.links[i] : l.label })) };

  return (
    <LangProvider lang={lang}>
      <MotionProvider>
        <div className="min-h-[100dvh] bg-black text-white" lang={lang}>
          <div className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4 sm:px-7 lg:px-10">
            <PortfolioNav />
          </div>
          <ScrollFocusVars className="relative z-20">
            <Hero40 lang={lang} />
          </ScrollFocusVars>
          <PresentationBackdrop />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.58)_100%)]"
          />

          <main className="relative z-10 mx-auto w-full max-w-[88rem] px-4 pb-5 sm:px-7 sm:pb-8 lg:px-10">
            <section
              className="flex min-h-[100svh] scroll-mt-0 flex-col justify-center py-20 sm:py-24 md:py-28"
              data-background-hue="0"
              data-background-off="true"
              id="hizmetler"
            >
              <ScrollFocus className="w-full">
                <div className="mx-auto max-w-4xl text-center">
                  <MaskedWords
                    as="h2"
                    className="block text-balance text-[clamp(2.25rem,4.6vw,4.2rem)] leading-[1] font-medium tracking-[-0.035em]"
                    text={`${servicesIntro.title} ${servicesIntro.subtitle}`}
                  />
                </div>
                <div className="mt-14 sm:mt-20">
                  <ServicesIndex services={getServices(lang).map((s) => ({ ...s, href: servicePagePath(lang, s.id) }))} />
                </div>
              </ScrollFocus>
            </section>

            <section className="scroll-mt-28 py-20 sm:py-28" id="projeler">
              <ScrollFocus className="max-w-3xl">
                <div data-background-hue="0">
                  <MaskedWords
                    as="h2"
                    className="block text-balance text-4xl font-medium tracking-[-0.035em] sm:text-6xl"
                    text={`${projectsIntro.title} ${projectsIntro.subtitle}`}
                  />
                  <p className="mt-5 max-w-[58ch] text-base leading-7 text-pink-50/70 sm:text-lg">{projectsIntro.examples.lead}</p>
                </div>
              </ScrollFocus>
              <ScrollFocus className="mt-10 sm:mt-12">
                <div id="ornekler">
                  <WorkGrid />
                </div>
              </ScrollFocus>
              <ScrollFocus className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/12 pt-6 text-sm text-white/60">
                <span className="text-white/80">{otherWork.title}</span>
                {otherWork.links.map((l) => (
                  <a
                    className="inline-flex min-h-11 items-center gap-1 transition-colors hover:text-white"
                    href={l.href}
                    key={l.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {l.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                ))}
              </ScrollFocus>
            </section>

            <AboutSection lang={lang} />

            <ScrollFocus>
              <ContactCard lang={lang} />
            </ScrollFocus>

            <footer className="flex items-center justify-end gap-6 px-2 py-9 text-xs text-white/46">
              <CookiePreferencesButton className="min-h-11 transition-colors hover:text-white" />
              <a className="inline-flex min-h-11 items-center transition-colors hover:text-white" href="#baslangic">
                {isEn ? en.ui.backToTop : "Başa dön"}
              </a>
            </footer>
          </main>
        </div>
      </MotionProvider>
    </LangProvider>
  );
}
