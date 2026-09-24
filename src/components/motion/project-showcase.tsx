"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { ScrollFocus } from "./scroll-focus";

const EASE = [0.16, 1, 0.3, 1] as const;

type Project = {
  id: string;
  name: string;
  kind: string;
  status: string;
  headline: string;
  summary: string;
  longSummary: string;
  tags: readonly string[];
  links: readonly { label: string; href: string }[];
};

/**
 * Per-project color. The card is painted with a/b, and while the card is in
 * view the page background is rotated to the same hue (angles computed for
 * the fluid's base pink, #e8227a), so card and backdrop read as one light.
 */
const ART: Record<
  string,
  { a: string; b: string; glowA: string; glowB: string; mark: string; hue: number; saturate: number; brightness: number }
> = {
  // glowA lights the page from the top-left, glowB from the bottom-right,
  // the same corners the card paints a and b in; glowB is pushed brighter.
  reviewms: { a: "oklch(0.62 0.2 285)", b: "oklch(0.55 0.22 330)", glowA: "oklch(0.56 0.21 285)", glowB: "oklch(0.68 0.27 335)", mark: "NFC", hue: -73, saturate: 1.1, brightness: 1.15 },
  boyut: { a: "oklch(0.66 0.13 170)", b: "oklch(0.5 0.15 230)", glowA: "oklch(0.62 0.14 170)", glowB: "oklch(0.62 0.18 232)", mark: "3D", hue: -159, saturate: 1.2, brightness: 1.3 },
};

function Media({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  // The frame opens like a shutter while the content inside drifts slower
  // than the page, so the image seems to sit a layer behind the glass.
  const clip = useTransform(
    progress,
    [0, 0.45],
    ["inset(22% 8% 22% 8% round 28px)", "inset(0% 0% 0% 0% round 20px)"],
  );
  const innerY = useTransform(progress, [0, 1], ["-7%", "7%"]);
  const innerScale = useTransform(progress, [0, 0.5], [1.14, 1]);
  const art = ART[project.id] ?? ART.reviewms;

  return (
    <motion.div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-white/[0.03] sm:aspect-[16/9] lg:aspect-[21/9]"
      style={reduce ? undefined : { clipPath: clip }}
    >
      <motion.div
        className="absolute inset-[-8%]"
        style={reduce ? undefined : { y: innerY, scale: innerScale }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 70% at 25% 30%, ${art.a}, transparent 70%), radial-gradient(55% 65% at 80% 75%, ${art.b}, transparent 70%), oklch(0.12 0.02 280)`,
          }}
        />
        <div className="grain absolute inset-0 opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-start justify-end p-[9%]">
          <span className="text-[clamp(3.5rem,11vw,9rem)] leading-none font-semibold tracking-[-0.06em] text-white/80">
            {art.mark}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The large name slides against the scroll direction for a sense of depth.
  const nameX = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const tone = ART[project.id] ?? ART.reviewms;

  return (
    <article
      className="relative overflow-x-clip py-10 sm:py-14"
      data-background-brightness={tone.brightness}
      data-background-glow-a={tone.glowA}
      data-background-glow-b={tone.glowB}
      data-background-hue={tone.hue}
      data-background-saturate={tone.saturate}
      id={project.id}
      ref={ref}
    >
      <ScrollFocus>
      <div className="mb-6 flex items-baseline justify-between gap-6 text-sm text-pink-100/60">
        <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-right">
          {project.kind} · {project.status}
        </span>
      </div>

      <Media progress={scrollYProgress} project={project} />

      <motion.h3
        className="pointer-events-none relative z-10 -mt-[0.55em] text-[clamp(3rem,11vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] whitespace-nowrap text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        style={reduce ? undefined : { x: nameX }}
      >
        {project.name}
      </motion.h3>

      <motion.div
        className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: EASE }}
        viewport={{ once: true, amount: 0.4 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="text-xl leading-snug font-medium tracking-[-0.02em] text-white sm:text-2xl">
          {project.headline}
        </p>
        <div>
          <p className="max-w-[60ch] text-base leading-7 text-white/74">
            {project.longSummary || project.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-pink-50/58">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((l) => (
              <a
                className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                href={l.href}
                key={l.href}
                rel="noreferrer"
                target="_blank"
              >
                {l.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      </ScrollFocus>
    </article>
  );
}

export function ProjectShowcase({ projects }: { projects: readonly Project[] }) {
  return (
    <div className="divide-y divide-white/12">
      {projects.map((p, i) => (
        <ProjectRow index={i} key={p.id} project={p} />
      ))}
    </div>
  );
}
