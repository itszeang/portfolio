"use client";

import { useState } from "react";
import { DemoCard } from "@/components/demo-card";
import { ProjectCard } from "@/components/project-card";
import type { Demo, Project } from "@/content";
import { getDemos, getProjects } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";

const FILTERS = [
  { id: "web", label: { tr: "Web siteleri", en: "Websites" } },
  { id: "randevu", label: { tr: "Randevu sistemleri", en: "Booking systems" } },
  { id: "ai", label: { tr: "Yapay zekâ", en: "AI" } },
  { id: "mobil", label: { tr: "Mobil", en: "Mobile" } },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];
type Item = { key: string; demo?: Demo; project?: Project };

/** A service's cards: its demos in content order, with my own products dropped in at their position. */
function itemsFor(service: FilterId, lang: Lang): Item[] {
  const list: Item[] = getDemos(lang).filter((d) => d.service === service).map((d) => ({ key: d.slug, demo: d }));
  for (const p of getProjects(lang)) {
    if ((p.grid.services as readonly string[]).includes(service)) list.splice(p.grid.position - 1, 0, { key: p.id, project: p });
  }
  return list;
}
const itemsIn = (lang: Lang) => Object.fromEntries(FILTERS.map((f) => [f.id, itemsFor(f.id, lang)])) as Record<FilterId, Item[]>;
const ITEMS = { tr: itemsIn("tr"), en: itemsIn("en") };

const CARD = "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw";

/** Homepage grid of the demos and products for one service at a time; websites first. */
export function WorkGrid() {
  const lang = useLang();
  const items = ITEMS[lang];
  const [filter, setFilter] = useState<FilterId>("web");
  const shown = items[filter];

  return (
    <div>
      <div aria-label={lang === "en" ? "Filter by service" : "Hizmete göre süz"} className="flex flex-wrap gap-2" role="group">
        {FILTERS.filter((f) => items[f.id].length > 0).map((f) => (
          <button
            aria-pressed={filter === f.id}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
              filter === f.id
                ? "border-white bg-white text-black"
                : "border-white/12 bg-white/[0.04] text-white/72 hover:border-white/25 hover:text-white"
            }`}
            key={f.id}
            onClick={() => setFilter(f.id)}
            type="button"
          >
            {f.label[lang]}
            <span className={`text-xs tabular-nums ${filter === f.id ? "text-black/50" : "text-white/40"}`}>{items[f.id].length}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {lang === "en" ? `${shown.length} projects shown` : `${shown.length} çalışma gösteriliyor`}
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((i) => (
          <li key={i.key}>
            {i.demo ? <DemoCard demo={i.demo} lang={lang} sizes={CARD} /> : i.project ? <ProjectCard lang={lang} project={i.project} sizes={CARD} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
