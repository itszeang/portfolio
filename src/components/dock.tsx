// macOS-style dock for the footer links: icons swell and lift as the pointer
// nears them, with spring physics. Touch devices and reduced-motion users get
// a static row of the same glass buttons.
import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type DockLink = {
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

const BASE = 44;
const MAX = 72;
const RANGE = 140;

function DockItem({ link, mouseX }: { link: DockLink; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE]);
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 13 });
  const iconScale = useTransform(size, [BASE, MAX], [1, 1.45]);
  return (
    <motion.a
      ref={ref}
      href={link.href}
      className="dock-item"
      style={reduce ? undefined : { width: size, height: size }}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={link.external ? `${link.label} (yeni sekmede açılır)` : link.label}
    >
      <motion.span className="dock-icon" style={reduce ? undefined : { scale: iconScale }}>
        {link.icon}
      </motion.span>
      <span className="dock-tip" aria-hidden="true">
        {link.label}
      </span>
    </motion.a>
  );
}

export function Dock({ links }: { links: DockLink[] }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <nav
      className="dock"
      aria-label="Bağlantılar"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") mouseX.set(e.clientX);
      }}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      {links.map((l) => (
        <DockItem key={l.label} link={l} mouseX={mouseX} />
      ))}
    </nav>
  );
}

export function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
    </svg>
  );
}
