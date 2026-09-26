import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Demo, servicePages } from "@/content";

export const demoHref = (d: Demo) => {
  const page = servicePages.find((p) => p.id === d.service);
  return page ? `/hizmetler/${page.slug}/${d.slug}` : "/";
};

/**
 * Compact card for one demo. Deliberately small: the portfolio grid grows by
 * one of these every day, and the page must stay easy to scroll past.
 */
export function DemoCard({ demo }: { demo: Demo }) {
  return (
    <Link
      className="group flex min-h-20 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 pr-4 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
      href={demoHref(demo)}
    >
      <span
        aria-hidden="true"
        className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl"
        style={{ background: demo.surface }}
      >
        <span className="size-5 rounded-full" style={{ background: demo.accent }} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">{demo.name}</span>
        <span className="block truncate text-xs text-white/55">{demo.kind}</span>
      </span>
      <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-white/40 transition-colors group-hover:text-[#ff85b3]" />
    </Link>
  );
}
