"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { useScrollFocus } from "./scroll-focus";

type Item = {
  date: string;
  place: string;
  company: string;
  role: string;
  description: string;
};

function Entry({ item }: { item: Item }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // The dot and slide still key off the entry reaching the reading line.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 52%"] });
  // Same focus pull as every other section: sharpen on the way in, soften
  // on the way out, in either scroll direction.
  const { filter: blur, opacity } = useScrollFocus(ref);
  const x = useTransform(scrollYProgress, [0, 1], [-18, 0]);
  const dot = useTransform(scrollYProgress, [0.6, 1], [0.4, 1]);

  return (
    <li className="relative pl-10 sm:pl-14" ref={ref}>
      <motion.span
        aria-hidden="true"
        className="absolute left-[-5px] top-2 size-[11px] rounded-full bg-[var(--portfolio-accent)] shadow-[0_0_16px_var(--portfolio-accent)]"
        style={reduce ? undefined : { scale: dot, opacity: dot }}
      />
      <motion.div
        className="grid gap-3 pb-12 md:grid-cols-[10rem_minmax(12rem,0.8fr)_minmax(0,1.2fr)] md:gap-8"
        style={reduce ? undefined : { opacity, filter: blur, x }}
      >
        <p className="text-sm leading-6 text-pink-100/56">
          {item.date}
          <br />
          {item.place}
        </p>
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{item.company}</h3>
          <p className="mt-1 text-sm text-white/58">{item.role}</p>
        </div>
        <p className="max-w-[62ch] text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
          {item.description}
        </p>
      </motion.div>
    </li>
  );
}

export function ExperienceTimeline({ items }: { items: readonly Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <ol className="relative" ref={ref}>
      <span aria-hidden="true" className="absolute left-0 top-2 bottom-12 w-px bg-white/14" />
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-12 w-px origin-top bg-gradient-to-b from-[var(--portfolio-accent)] to-white/60"
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
      />
      {items.map((item) => (
        <Entry item={item} key={`${item.company}-${item.date}`} />
      ))}
    </ol>
  );
}
