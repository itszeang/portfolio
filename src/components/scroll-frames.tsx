"use client";

import Image from "next/image";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
/** A pause longer than this between wheel events starts a new scroll gesture. */
const GESTURE_GAP = 400;

/**
 * A site's screenshots, top of the page to the bottom, shown as if the little
 * site were scrolling with the visitor. The frame follows the card's place on
 * screen: below the middle it shows the hero, and as the card rises to the top
 * it scrolls down to the last section. So in a grid only the row being looked
 * at shows heroes, the rows above have reached their footers, and no two rows
 * move at once. A slim scrollbar on the right tells where on the page it is.
 *
 * With the mouse over a preview, the wheel scrolls that site instead of the
 * page, like a nested scroll area. Once the site's top or bottom is reached, a
 * new wheel gesture scrolls the page again, so the visitor is never stuck.
 * After the mouse leaves, the next page scroll hands the frame back to the
 * page.
 */
export function ScrollFrames({ frames, sizes, priority = false }: { frames: readonly string[]; sizes: string; priority?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Where the visitor has scrolled the site by hand, in frames (0 = top); null while the page drives it.
  const [own, setOwn] = useState<number | null>(null);
  const hovered = useRef(false);
  const gesture = useRef({ last: 0, owned: false });
  const last = frames.length - 1;
  // The later frames load once the card is within a screen of the viewport.
  const near = useInView(ref, { once: true, margin: "100% 0px" });
  // 0 while the frame's centre is at 42% of the screen or lower, 1 once its top reaches the top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["center 42%", "start start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = reduce ? 0 : Math.min(last, Math.max(0, Math.floor(v * frames.length)));
    setIndex((i) => (i === next ? i : next));
    if (!hovered.current) setOwn(null);
  });

  // The position the wheel starts from, kept in a ref so the listener reads it without re-subscribing.
  const posRef = useRef(0);
  useEffect(() => {
    posRef.current = own ?? index;
  });

  // The wheel listener has to be non-passive to keep the page still.
  useEffect(() => {
    const el = ref.current;
    if (!el || last < 1) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const height = el.clientHeight || 1;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1);
      const pos = posRef.current;
      const g = gesture.current;
      // A new gesture is the site's, unless it pushes past the end the site is already at.
      if (e.timeStamp - g.last > GESTURE_GAP) g.owned = !((dy > 0 && pos >= last - 0.001) || (dy < 0 && pos <= 0.001));
      g.last = e.timeStamp;
      if (!g.owned) return;
      e.preventDefault();
      const next = Math.min(last, Math.max(0, pos + dy / height));
      posRef.current = next;
      setOwn(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [last]);

  const pos = own ?? index;
  const manual = own !== null;
  const move = reduce ? { duration: 0 } : manual ? { duration: 0.25, ease: EASE } : { duration: 0.6, ease: EASE };

  return (
    <span
      className="relative block aspect-[8/5] overflow-hidden rounded-[15px] bg-white/[0.06]"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
      ref={ref}
    >
      <motion.span animate={{ y: `${-pos * 100}%` }} className="flex h-full w-full flex-col" initial={false} transition={move}>
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
      {frames.length > 1 && (!reduce || manual) && (
        <span aria-hidden="true" className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full bg-black/45 p-[3px] backdrop-blur-sm">
          <span className="relative block h-14 w-1 overflow-hidden rounded-full bg-white/25">
            <motion.span
              animate={{ y: `${pos * 100}%` }}
              className="absolute inset-x-0 top-0 rounded-full bg-white"
              initial={false}
              style={{ height: `${100 / frames.length}%` }}
              transition={move}
            />
          </span>
        </span>
      )}
    </span>
  );
}
