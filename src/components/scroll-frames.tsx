"use client";

import Image from "next/image";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A site's screenshots, top of the page to the bottom, shown as if the little
 * site were scrolling with the visitor. The frame follows the card's place on
 * screen: below the middle it shows the hero, and as the card rises to the top
 * it scrolls down to the last section. So in a grid only the row being looked
 * at shows heroes, the rows above have reached their footers, and no two rows
 * move at once. A slim scrollbar on the right tells where on the page it is.
 */
export function ScrollFrames({ frames, sizes, priority = false }: { frames: readonly string[]; sizes: string; priority?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  // The later frames load once the card is within a screen of the viewport.
  const near = useInView(ref, { once: true, margin: "100% 0px" });
  // 0 while the frame's centre is at 42% of the screen or lower, 1 once its top reaches the top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["center 42%", "start start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = reduce ? 0 : Math.min(frames.length - 1, Math.max(0, Math.floor(v * frames.length)));
    setIndex((i) => (i === next ? i : next));
  });

  return (
    <span className="relative block aspect-[8/5] overflow-hidden rounded-[15px] bg-white/[0.06]" ref={ref}>
      <motion.span
        animate={{ y: `${-index * 100}%` }}
        className="flex h-full w-full flex-col"
        initial={false}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {frames.map((src, i) => (
          <span className="relative block w-full shrink-0 basis-full" key={src}>
            {(i === 0 || near) && (
              <Image
                alt=""
                className="object-cover object-top"
                fill
                loading={i === 0 && !priority ? "lazy" : "eager"}
                priority={i === 0 && priority}
                sizes={sizes}
                src={src}
              />
            )}
          </span>
        ))}
      </motion.span>
      <span aria-hidden="true" className="absolute inset-0 rounded-[15px] ring-1 ring-white/10 ring-inset" />
      {frames.length > 1 && !reduce && (
        <span aria-hidden="true" className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full bg-black/45 p-[3px] backdrop-blur-sm">
          <span className="relative block h-14 w-1 overflow-hidden rounded-full bg-white/25">
            <motion.span
              animate={{ y: `${index * 100}%` }}
              className="absolute inset-x-0 top-0 rounded-full bg-white"
              initial={false}
              style={{ height: `${100 / frames.length}%` }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </span>
        </span>
      )}
    </span>
  );
}
