import { ArrowUpRight } from "lucide-react";
import { ScrollFrames } from "@/components/scroll-frames";
import type { Project } from "@/content";
import type { Lang } from "@/lib/i18n";

/**
 * A shipped product of my own, in the same card as the demos. Its website's
 * screenshots scroll by as the card rises, like the demo cards'.
 */
export function ProjectCard({ project, sizes, lang = "tr" }: { project: Project; sizes: string; lang?: Lang }) {
  const link = project.links[0];
  return (
    <a
      className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-white/[0.035] p-2 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff85b3]"
      href={link?.href}
      rel="noreferrer"
      target="_blank"
    >
      <ScrollFrames frames={project.siteImages.map((i) => i.src)} sizes={sizes} />
      <span className="flex flex-1 flex-col px-3 pt-4 pb-3">
        <span className="text-[13px] text-white/50">{lang === "en" ? "My own product" : "Kendi ürünüm"} · {project.kind}</span>
        <span className="mt-1 flex items-center justify-between gap-3">
          <span className="text-[17px] leading-6 font-medium tracking-[-0.015em] text-white">{project.name}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-white/40 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff85b3]"
          />
        </span>
        <span className="mt-2 text-sm leading-6 text-white/62">{project.summary}</span>
        <span className="sr-only">{lang === "en" ? " (opens in a new tab)" : " (yeni sekmede açılır)"}</span>
      </span>
    </a>
  );
}
