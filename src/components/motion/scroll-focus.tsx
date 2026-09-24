"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";

const MAX_BLUR = 8;
const MIN_OPACITY = 0.25;

/**
 * Focus pull tied to scroll position, symmetric in both directions:
 * an element sharpens as its top rises into the lower part of the screen,
 * and softens again as its bottom leaves through the upper part. Scrolling
 * back up plays the same thing in reverse.
 *
 * Measured from the element's edges (not its centre), so it behaves the same
 * for a one-line heading and a section taller than the viewport.
 */
export function useScrollFocus(ref: RefObject<HTMLElement | null>): {
  filter: MotionValue<string>;
  opacity: MotionValue<number>;
} {
  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start 68%"],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ["end 32%", "end start"],
  });
  // 0 = fully in focus, 1 = fully out of focus.
  const amount = useTransform([enter, exit], ([a, b]: number[]) => Math.max(1 - a, b));
  // "none" at rest matters: any filter value, even blur(0px), would stop the
  // glass cards inside from blurring the backdrop behind them.
  const filter = useTransform(amount, (v) => (v < 0.02 ? "none" : `blur(${(v * MAX_BLUR).toFixed(2)}px)`));
  const opacity = useTransform(amount, (v) => 1 - v * (1 - MIN_OPACITY));
  return { filter, opacity };
}

export function ScrollFocus({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { filter, opacity } = useScrollFocus(ref);
  return (
    <motion.div className={className} ref={ref} style={reduce ? undefined : { filter, opacity }}>
      {children}
    </motion.div>
  );
}
