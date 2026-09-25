"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";

const noopSubscribe = () => () => {};

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
export function useScrollFocus(
  ref: RefObject<HTMLElement | null>,
  { enter: withEnter = true }: { enter?: boolean } = {},
): {
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
  const amount = useTransform([enter, exit], ([a, b]: number[]) =>
    withEnter ? Math.max(1 - a, b) : b,
  );
  // "none" at rest matters: any filter value, even blur(0px), would stop the
  // glass cards inside from blurring the backdrop behind them.
  const filter = useTransform(amount, (v) => (v < 0.02 ? "none" : `blur(${(v * MAX_BLUR).toFixed(2)}px)`));
  const opacity = useTransform(amount, (v) => 1 - v * (1 - MIN_OPACITY));
  return { filter, opacity };
}

export function ScrollFocus({
  children,
  className,
  enter = true,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Set to false for content that is already on screen when the page opens
   * (the hero): it then only softens on the way out, never on load.
   */
  enter?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { filter, opacity } = useScrollFocus(ref, { enter });
  // Scroll progress only exists in the browser. Before the first client
  // measurement the values read 0 progress, which means "fully blurred", and
  // that state would be baked into the server HTML: the whole page, hero
  // included, arrived blurred and faded until JavaScript caught up (and
  // stayed that way where it was slow or failed). So the effect is only
  // attached after mount; until then everything renders sharp.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return (
    <motion.div
      className={className}
      ref={ref}
      style={reduce || !mounted ? undefined : { filter, opacity }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Same focus pull, but published as CSS variables (--focus-filter,
 * --focus-opacity) instead of being applied to the wrapper itself, so the
 * children pick which layers blur and fade.
 *
 * Needed for the hero: filter + opacity on the whole hero put its WebGL
 * canvas inside a filtered, translucent layer. Safari composites that badly:
 * the blur could stay stuck after scrolling back up, and the translucent
 * hero let the pink backdrop behind it wash the black background pink.
 * With variables the hero stays opaque and the canvas is never filtered.
 */
export function ScrollFocusVars({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { filter, opacity } = useScrollFocus(ref, { enter: false });
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return (
    <motion.div
      className={className}
      ref={ref}
      style={
        reduce || !mounted
          ? undefined
          : ({ "--focus-filter": filter, "--focus-opacity": opacity } as Record<string, MotionValue>)
      }
    >
      {children}
    </motion.div>
  );
}
