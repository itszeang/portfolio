import { PortfolioNav } from "@/components/portfolio-nav";
import { PresentationBackdrop } from "@/components/presentation-backdrop";
import { Hero40 } from "@/components/hero40";
import { MaskedWords } from "@/components/motion/masked-words";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ProjectShowcase } from "@/components/motion/project-showcase";
import { ScrollFocus } from "@/components/motion/scroll-focus";
import { ServicesIndex } from "@/components/motion/services-index";
import { AboutSection } from "@/components/rbp/about-section";
import { ContactCard } from "@/components/rbp/contact-card";
import {
  otherWork,
  projects,
  projectsIntro,
  services,
  servicesIntro,
} from "@/content";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <MotionProvider>
      <div className="min-h-[100dvh] bg-black text-white">
        <div className="fixed inset-x-0 top-4 z-50 px-4 sm:px-7 lg:px-10">
          <PortfolioNav />
        </div>
        <ScrollFocus className="relative z-20" enter={false}>
          <Hero40 />
        </ScrollFocus>
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
                <p className="mx-auto mt-5 max-w-[64ch] font-mono text-xs leading-6 tracking-[0.04em] text-white/50 sm:text-[13px]">
                  {servicesIntro.lead}
                </p>
              </div>
              <div className="mt-14 sm:mt-20">
                <ServicesIndex services={services} />
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
              <p className="mt-5 max-w-[54ch] text-base leading-7 text-pink-50/70 sm:text-lg">
                {projectsIntro.lead}
              </p>
            </div>
            </ScrollFocus>
            <div className="mt-10">
              <ProjectShowcase projects={projects} />
            </div>
            <ScrollFocus className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/12 pt-6 text-sm text-white/60">
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

          <AboutSection />

          <ScrollFocus>
            <ContactCard />
          </ScrollFocus>

          <footer className="flex items-center justify-end px-2 py-9 text-xs text-white/46">
            <a className="transition-colors hover:text-white" href="#baslangic">
              Başa dön
            </a>
          </footer>
        </main>
      </div>
    </MotionProvider>
  );
}
