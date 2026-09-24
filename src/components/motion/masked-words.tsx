"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Text that rises word by word out of a clipping mask. Each word sits in its
 * own overflow-hidden slot, so the line keeps its layout while the glyphs
 * travel. Screen readers get the plain sentence once.
 */
export function MaskedWords({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.045,
  onLoad = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  onLoad?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const trigger = onLoad
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, amount: 0.6 } };

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial={reduce ? false : "hidden"}
        transition={{ delayChildren: delay, staggerChildren: stagger }}
        {...trigger}
      >
        {words.map((word, i) => (
          <span
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
            key={`${word}-${i}`}
          >
            <motion.span
              className="inline-block will-change-transform"
              transition={{ duration: 0.9, ease: EASE }}
              variants={{
                hidden: { y: "108%" },
                shown: { y: "0%" },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
