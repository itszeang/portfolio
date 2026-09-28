"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import type { Project } from "@/content";

/**
 * A shipped product of my own, as a gallery card in the same frame as the
 * demo cards: screenshots of its website on one strip. While the card crosses
 * the middle of the screen, each stretch of scrolling slides in the next page.
 */
export function ProjectCard({ project, sizes }: { project: Project; sizes: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const frames = project.siteImages;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The stretch of scrolling while the whole card is on screen is split evenly
  // between the frames, so the first one is still showing when it comes into view.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(frames.length - 1, Math.max(0, Math.floor(((v - 0.28) / 0.44) * frames.length)));
    setIndex((i) => (i === next ? i : next));
  });
  const link = project.links[0];

  return (
    <a
      className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-white/[0.035] p-2 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff85b3]"
      href={link?.href}
      ref={ref}
      rel="noreferrer"
      target="_blank"
    >
      <span className="relative block aspect-[8/5] overflow-hidden rounded-[15px] bg-[#F5F7FC]">
        <motion.span
          animate={{ x: `${-index * 100}%` }}
          className="flex h-full w-full"
          initial={false}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {frames.map((img, i) => (
            <span className="relative block h-full shrink-0 basis-full" key={img.src}>
              <Image alt={i === 0 ? img.alt : ""} className="object-cover object-top" fill sizes={sizes} src={img.src} />
            </span>
          ))}
        </motion.span>
        <span aria-hidden="true" className="absolute inset-0 rounded-[15px] ring-1 ring-white/10 ring-inset" />
        <span aria-hidden="true" className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5 backdrop-blur-sm">
          {frames.map((img, i) => (
            <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} key={img.src} />
          ))}
        </span>
      </span>
      <span className="flex flex-1 flex-col px-3 pt-4 pb-3">
        <span className="text-[13px] text-white/50">Kendi ürünüm · {project.kind}</span>
        <span className="mt-1 flex items-center justify-between gap-3">
          <span className="text-[17px] leading-6 font-medium tracking-[-0.015em] text-white">{project.name}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-white/40 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff85b3]"
          />
        </span>
        <span className="mt-2 text-sm leading-6 text-white/62">{project.summary}</span>
        <span className="sr-only"> (yeni sekmede açılır)</span>
      </span>
    </a>
  );
}
