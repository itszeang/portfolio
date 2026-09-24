"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  Bot,
  CalendarCheck,
  Globe,
  LayoutDashboard,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  web: Globe,
  randevu: CalendarCheck,
  mobil: Smartphone,
  panel: LayoutDashboard,
};

type Service = { id: string; name: string; description: string; tagline: string };

/**
 * Service rows rise in sequence. On pointer devices a small glass lens
 * carrying the row's icon trails the cursor across the list, switching
 * icon as the pointer moves between rows.
 */
export function ServicesList({ services }: { services: readonly Service[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.4 });
  const Icon = active ? ICONS[active] : null;

  return (
    <div
      className="relative border-y border-white/18"
      onPointerLeave={() => setActive(null)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
    >
      {services.map((service, i) => (
        <motion.article
          className="group grid gap-3 border-b border-white/14 py-5 last:border-b-0 sm:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.2fr)] sm:gap-7 sm:py-6"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          key={service.id}
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(service.id)}
          transition={{ delay: i * 0.06, duration: 0.8, ease: EASE }}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-medium tracking-[-0.025em] text-white transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:translate-x-1.5 sm:text-xl lg:text-2xl">
            {service.name}
          </h3>
          <p className="max-w-[56ch] text-sm leading-6 text-blue-50/68 transition-colors duration-300 group-hover:text-blue-50/90 lg:text-base lg:leading-7">
            {service.description}
          </p>
        </motion.article>
      ))}

      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {Icon && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="-translate-x-1/2 -translate-y-1/2 grid size-16 place-items-center rounded-full border border-white/16 bg-white/8 text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl"
                exit={{ opacity: 0, scale: 0.6 }}
                initial={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
                    initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
                    key={active}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    <Icon className="size-6" strokeWidth={1.6} />
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
