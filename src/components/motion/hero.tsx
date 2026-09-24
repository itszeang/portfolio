"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { MaskedWords } from "./masked-words";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({
  badge,
  headline,
  intro,
  cta,
}: {
  badge: string;
  headline: string;
  intro: string;
  cta: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // As the hero leaves, its copy drifts up, softens and fades, handing the
  // screen to the next section instead of just scrolling away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.75], ["blur(0px)", "blur(8px)"]);

  return (
    <section
      className="flex min-h-[calc(100svh-82px)] scroll-mt-28 flex-col justify-end pb-16 pt-36 sm:pb-20 lg:pb-24"
      data-background-hue="0"
      id="baslangic"
      ref={ref}
    >
      <motion.div
        className="max-w-5xl"
        style={reduce ? undefined : { y, opacity, filter: blur }}
      >
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 text-sm text-white/76"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_18px_var(--portfolio-accent)]"
          />
          {badge}
        </motion.p>
        <MaskedWords
          as="h1"
          className="block text-balance text-[clamp(3.6rem,9.4vw,6.4rem)] leading-[0.93] font-medium tracking-[-0.045em]"
          delay={0.12}
          onLoad
          stagger={0.07}
          text={headline}
        />
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-[62ch] text-lg leading-8 text-pink-50/74 sm:text-xl"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
        >
          {intro}
        </motion.p>
        <motion.a
          animate={{ opacity: 1 }}
          className="group mt-10 inline-flex min-h-11 items-center gap-2 text-sm text-white/58 transition-colors hover:text-white focus-visible:text-white"
          href="#hizmetler"
          initial={reduce ? false : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {cta}
          <ArrowDown
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
          />
        </motion.a>
      </motion.div>
    </section>
  );
}
