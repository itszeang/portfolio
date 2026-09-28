import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollFrames } from "@/components/scroll-frames";
import { type Demo, servicePages } from "@/content";

export const demoHref = (d: Demo) => {
  const page = servicePages.find((p) => p.id === d.service);
  return page ? `/hizmetler/${page.slug}/${d.slug}` : "/";
};

/** The card's screenshots: the hero, then any frames from further down the page. */
const framesOf = (d: Demo) =>
  Array.from({ length: d.frames }, (_, i) => (i === 0 ? `/images/ornekler/${d.slug}.webp` : `/images/ornekler/${d.slug}-${i + 1}.webp`));

/**
 * One demo as a portfolio card: screenshots of the site, then what it is and
 * what it does. Screenshots live in public/images/ornekler and are taken at
 * 1440×900 without the DemoBar, so every card shows the same crop.
 */
export function DemoCard({ demo, sizes, priority = false }: { demo: Demo; sizes: string; priority?: boolean }) {
  return (
    <Link
      className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-white/[0.035] p-2 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff85b3]"
      href={demoHref(demo)}
    >
      <ScrollFrames frames={framesOf(demo)} priority={priority} sizes={sizes} />
      <span className="flex flex-1 flex-col px-3 pt-4 pb-3">
        <span className="text-[13px] text-white/50">{demo.kind}</span>
        <span className="mt-1 flex items-center justify-between gap-3">
          <span className="text-[17px] leading-6 font-medium tracking-[-0.015em] text-white">{demo.name}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-white/40 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff85b3]"
          />
        </span>
        <span className="mt-2 text-sm leading-6 text-white/62">{demo.summary}</span>
      </span>
    </Link>
  );
}
