// Adapted from 21st.dev-listed Aceternity, Magic UI and Kokonut UI primitives.
// Source links, licenses and changes: THIRD_PARTY_NOTICES.md.
import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  return (
    <div ref={ref} className={`scroll-panel ${className}`}>
      <motion.div
        className="scroll-panel-inner"
        style={reduce ? {} : { rotateX, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Word({
  text,
  progress,
  range,
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0.24, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }}>{text} </motion.span>
  );
}

export function TextReveal({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "end 48%"],
  });
  const words = children.split(" ");
  return (
    <p ref={ref} className="manifesto-text">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word
            key={i}
            text={word}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          />
        ))}
      </span>
    </p>
  );
}

export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 70%"],
  });
  return (
    <div ref={ref} className="timeline">
      <div className="timeline-track">
        <motion.div style={{ scaleY: reduce ? 1 : scrollYProgress }} />
      </div>
      {children}
    </div>
  );
}

// Kokonut Background Paths: same cubic wave construction, fewer monochrome paths.
function wavePath(index: number) {
  const points = Array.from({ length: 11 }, (_, i) => {
    const progress = i / 10,
      eased = 1 - (1 - progress) ** 2,
      phase = index * 0.2;
    const amplitude = 150 * (1 - eased * 0.3);
    return {
      x: 2400 - 4800 * eased,
      y:
        800 +
        (-1600 + index * 25) * eased +
        Math.sin(progress * Math.PI * 3 + phase) * amplitude * 0.7 +
        Math.cos(progress * Math.PI * 4 + phase) * amplitude * 0.3,
    };
  });
  return points
    .map((p, i) =>
      i === 0
        ? `M ${p.x} ${p.y}`
        : `C ${points[i - 1].x + (p.x - points[i - 1].x) * 0.4} ${points[i - 1].y}, ${points[i - 1].x + (p.x - points[i - 1].x) * 0.6} ${p.y}, ${p.x} ${p.y}`,
    )
    .join(" ");
}
export function BackgroundPaths() {
  return (
    <svg
      className="background-paths"
      viewBox="-2400 -800 4800 1600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={wavePath(i)}
          stroke="currentColor"
          strokeWidth={2 + i * 0.18}
          opacity={0.08 + i * 0.009}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
