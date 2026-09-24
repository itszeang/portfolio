"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Mail } from "lucide-react";
import { useRef } from "react";

type Social = { label: string; href: string };

/**
 * The closing line grows into place as the section arrives, so the page ends
 * on its largest, calmest moment rather than a footer.
 */
export function Closing({
  heading,
  availability,
  email,
  phone,
  phoneHref,
  socials,
}: {
  heading: string;
  availability: string;
  email: string;
  phone: string;
  phoneHref: string;
  socials: readonly Social[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const line = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  return (
    <section
      className="flex min-h-[90svh] scroll-mt-28 flex-col justify-center py-24"
      data-background-hue="0"
      id="iletisim"
      ref={ref}
    >
      <motion.h2
        className="max-w-6xl origin-bottom-left text-balance text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] font-medium tracking-[-0.05em]"
        style={reduce ? undefined : { scale, opacity, y }}
      >
        {heading}
      </motion.h2>
      <motion.div
        aria-hidden="true"
        className="mt-14 h-px origin-left bg-white/20"
        style={{ scaleX: reduce ? 1 : line }}
      />
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm text-white/56">{availability}</p>
          <a
            className="inline-flex min-h-11 items-center gap-3 text-xl font-medium underline decoration-white/28 underline-offset-8 transition-colors hover:decoration-white sm:text-3xl"
            href={`mailto:${email}`}
          >
            <Mail aria-hidden="true" className="size-6" />
            {email}
          </a>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/66">
          {socials.map((s) => (
            <a
              className="inline-flex min-h-11 items-center transition-colors hover:text-white"
              href={s.href}
              key={s.href}
              rel="noreferrer"
              target="_blank"
            >
              {s.label}
            </a>
          ))}
          <a className="inline-flex min-h-11 items-center transition-colors hover:text-white" href={phoneHref}>
            {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
