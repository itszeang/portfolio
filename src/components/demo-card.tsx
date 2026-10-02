import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollFrames } from "@/components/scroll-frames";
import type { Demo } from "@/content";
import { demoPath } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

/**
 * The card's screenshots: the hero, then any frames from further down the
 * page. English ones are taken from the /en version of the demo.
 */
const framesOf = (d: Demo, lang: Lang) => {
  const dir = lang === "en" ? "/images/ornekler/en" : "/images/ornekler";
  return Array.from({ length: d.frames }, (_, i) => (i === 0 ? `${dir}/${d.slug}.webp` : `${dir}/${d.slug}-${i + 1}.webp`));
};

/**
 * One demo as a portfolio card: screenshots of the site, then what it is and
 * what it does. Screenshots live in public/images/ornekler and are taken at
 * 1440×900 without the DemoBar, so every card shows the same crop.
 */
export function DemoCard({ demo, sizes, priority = false, lang = "tr" }: { demo: Demo; sizes: string; priority?: boolean; lang?: Lang }) {
  return (
    <Link
      className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-white/[0.035] p-2 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff85b3]"
      href={demoPath(lang, demo)}
    >
      <ScrollFrames frames={framesOf(demo, lang)} priority={priority} sizes={sizes} />
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
