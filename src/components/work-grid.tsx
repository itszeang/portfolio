"use client";

import { useState } from "react";
import { DemoCard } from "@/components/demo-card";
import { demos } from "@/content";

const FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "web", label: "Web siteleri" },
  { id: "randevu", label: "Randevu sistemleri" },
  { id: "ai", label: "Yapay zekâ" },
  { id: "mobil", label: "Mobil" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/** Homepage grid of every demo, filterable by the service it shows. */
export function WorkGrid() {
  const [filter, setFilter] = useState<FilterId>("all");
  const count = (id: FilterId) => (id === "all" ? demos.length : demos.filter((d) => d.service === id).length);
  const shown = filter === "all" ? demos : demos.filter((d) => d.service === filter);

  return (
    <div>
      <div aria-label="Hizmete göre süz" className="flex flex-wrap gap-2" role="group">
        {FILTERS.filter((f) => count(f.id) > 0).map((f) => (
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
            {f.label}
            <span className={`text-xs tabular-nums ${filter === f.id ? "text-black/50" : "text-white/40"}`}>{count(f.id)}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {shown.length} örnek gösteriliyor
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((d) => (
          <li key={d.slug}>
            <DemoCard demo={d} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
