"use client";

import { UnsplashPhoto } from "@/demos/shared/unsplash";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useId, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { locale } from "@/lib/i18n";
import { type Kind, type Project, type Room, area, etutIn, kinds } from "./data";
import { images } from "./theme";

const COPY = {
  tr: {
    plan: (n: string) => `${n} kat planı`,
    before: "ÖNCE",
    after: "SONRA",
    slide: "Önce ve sonra arasında kaydır",
    total: "TOPLAM ALAN",
    selected: "SEÇİLİ MEKÂN",
    hover: "Plandaki bir mekânın üzerine gelin.",
    split: "BÖLME",
    spaces: "mekân",
    kind: "Proje türü",
    all: "Tümü",
    open: "Plan açık",
    see: "Planı gör",
    scale: "ÖLÇEK 1:100 · KAT PLANI",
  },
  en: {
    plan: (n: string) => `${n}, floor plan`,
    before: "BEFORE",
    after: "AFTER",
    slide: "Slide between before and after",
    total: "TOTAL AREA",
    selected: "SELECTED SPACE",
    hover: "Hover over or focus a space on the plan.",
    split: "LAYOUT",
    spaces: "spaces",
    kind: "Project type",
    all: "All",
    open: "Plan open",
    see: "See the plan",
    scale: "SCALE 1:100 · FLOOR PLAN",
  },
};

const S = 40; // px per metre
const PAD = 44; // room for the dimension line

/** Rooms as a scaled floor plan. `labels` off for thumbnails. */
function Rooms({
  rooms,
  hovered,
  onHover,
  labels = true,
  tone = "ink",
}: {
  rooms: Room[];
  hovered?: number | null;
  onHover?: (i: number | null) => void;
  labels?: boolean;
  tone?: "ink" | "ghost";
}) {
  const { m2 } = etutIn(useLang());
  const stroke = tone === "ghost" ? "var(--etut-muted)" : "var(--etut-ink)";
  return (
    <g>
      {rooms.map((r, i) => {
        const on = hovered === i;
        return (
          <g
            key={`${r.name}-${i}`}
            onFocus={() => onHover?.(i)}
            onMouseEnter={() => onHover?.(i)}
            onMouseLeave={() => onHover?.(null)}
            tabIndex={onHover ? 0 : undefined}
            className={onHover ? "cursor-crosshair outline-none" : undefined}
            aria-label={onHover ? `${r.name}, ${m2(r.w * r.h)}` : undefined}
          >
            <rect fill={on ? "rgba(228,87,46,0.14)" : "var(--etut-card)"} height={r.h * S} stroke={stroke} strokeWidth={2} width={r.w * S} x={r.x * S} y={r.y * S} />
            {labels && (
              <>
                <text
                  fill={on ? "var(--etut-red)" : stroke}
                  fontFamily="var(--etut-mono)"
                  fontSize={r.w < 3 ? 9 : 11}
                  textAnchor="middle"
                  x={(r.x + r.w / 2) * S}
                  y={(r.y + r.h / 2) * S - 4}
                >
                  {r.name}
                </text>
                <text fill="var(--etut-muted)" fontFamily="var(--etut-mono)" fontSize={9} textAnchor="middle" x={(r.x + r.w / 2) * S} y={(r.y + r.h / 2) * S + 11}>
                  {m2(r.w * r.h)}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Dimension({ width }: { width: number }) {
  const { fmt } = etutIn(useLang());
  const w = width * S;
  return (
    <g fill="none" stroke="var(--etut-muted)" strokeWidth={1}>
      <line x1={0} x2={w} y1={-22} y2={-22} />
      <line x1={0} x2={0} y1={-30} y2={-14} />
      <line x1={w} x2={w} y1={-30} y2={-14} />
      <line x1={-4} x2={4} y1={-18} y2={-26} />
      <line x1={w - 4} x2={w + 4} y1={-18} y2={-26} />
      <text fill="var(--etut-muted)" fontFamily="var(--etut-mono)" fontSize={10} stroke="none" textAnchor="middle" x={w / 2} y={-28}>
        {fmt(width)} m
      </text>
    </g>
  );
}

/** Large interactive plan, with a before/after split for renovations. */
function PlanViewer({ project }: { project: Project }) {
  const lang = useLang();
  const c = COPY[lang];
  const { m2, fmt } = etutIn(lang);
  const [hovered, setHovered] = useState<number | null>(null);
  const [split, setSplit] = useState(50);
  const clipA = useId();
  const clipB = useId();
  const w = project.width * S;
  const h = project.depth * S;
  const room = hovered !== null ? project.plan[hovered] : null;
  const vb = `${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`;
  const at = (split / 100) * w;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="relative overflow-hidden bg-[var(--etut-card)] p-3 sm:p-5">
        <svg aria-label={c.plan(project.name)} className="h-auto w-full" role="img" viewBox={vb}>
          <defs>
            <clipPath id={clipA}>
              <rect height={h + PAD * 2} width={at + PAD} x={-PAD} y={-PAD} />
            </clipPath>
            <clipPath id={clipB}>
              <rect height={h + PAD * 2} width={w - at + PAD} x={at} y={-PAD} />
            </clipPath>
          </defs>
          <Dimension width={project.width} />
          {project.before ? (
            <>
              <g clipPath={`url(#${clipA})`}>
                <Rooms rooms={project.before} tone="ghost" />
              </g>
              <g clipPath={`url(#${clipB})`}>
                <Rooms hovered={hovered} onHover={setHovered} rooms={project.plan} />
              </g>
              <line stroke="var(--etut-red)" strokeWidth={2} x1={at} x2={at} y1={-10} y2={h + 10} />
              <text fill="var(--etut-red)" fontFamily="var(--etut-mono)" fontSize={10} textAnchor="end" x={at - 6} y={h + 24}>
                {c.before}
              </text>
              <text fill="var(--etut-red)" fontFamily="var(--etut-mono)" fontSize={10} x={at + 6} y={h + 24}>
                {c.after}
              </text>
            </>
          ) : (
            <Rooms hovered={hovered} onHover={setHovered} rooms={project.plan} />
          )}
          <rect fill="none" height={h} stroke="var(--etut-ink)" strokeWidth={6} width={w} x={0} y={0} />
        </svg>
        {project.before && (
          <label className="mt-4 flex items-center gap-4 font-[family-name:var(--etut-mono)] text-[11px] text-[var(--etut-muted)]">
            <span>{c.before}</span>
            <input
              aria-label={c.slide}
              className="h-11 flex-1 accent-[var(--etut-red)]"
              max={100}
              min={0}
              onChange={(e) => setSplit(Number(e.target.value))}
              type="range"
              value={split}
            />
            <span>{c.after}</span>
          </label>
        )}
      </div>

      <div className="flex flex-col gap-5 font-[family-name:var(--etut-mono)] text-[12px]">
        <div className="border-t-2 border-[var(--etut-ink)] pt-3">
          <p className="text-[var(--etut-muted)]">{c.total}</p>
          <p className="mt-1 font-[family-name:var(--etut-display)] text-6xl font-bold tracking-[-0.05em]">
            <NumberTicker className="text-[var(--etut-ink)] dark:text-[var(--etut-ink)]" key={project.id} locale={locale(lang)} value={area(project.plan)} /> m²
          </p>
        </div>
        <div className="min-h-28 border-t border-[var(--etut-ink)]/20 pt-3" aria-live="polite">
          <p className="text-[var(--etut-muted)]">{c.selected}</p>
          {room ? (
            <>
              <p className="mt-1 font-[family-name:var(--etut-body)] text-lg font-semibold">{room.name}</p>
              <p className="mt-1">
                {fmt(room.w)} × {fmt(room.h)} m · <span className="text-[var(--etut-red)]">{m2(room.w * room.h)}</span>
              </p>
            </>
          ) : (
            <p className="mt-1 font-[family-name:var(--etut-body)] text-sm text-[var(--etut-muted)]">{c.hover}</p>
          )}
        </div>
        {project.before && (
          <div className="border-t border-[var(--etut-ink)]/20 pt-3">
            <p className="text-[var(--etut-muted)]">{c.split}</p>
            <p className="mt-1">
              {project.before.length} {c.spaces} → {project.plan.length} {c.spaces}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Thumb({ project }: { project: Project }) {
  const w = project.width * S;
  const h = project.depth * S;
  return (
    <svg aria-hidden="true" className="h-auto w-full" viewBox={`-20 -20 ${w + 40} ${h + 40}`}>
      <Rooms labels={false} rooms={project.plan} />
      <rect fill="none" height={h} stroke="var(--etut-ink)" strokeWidth={8} width={w} x={0} y={0} />
    </svg>
  );
}

/** Project list with a type filter; the chosen one opens in the plan viewer. */
export function ProjectsExplorer() {
  const lang = useLang();
  const c = COPY[lang];
  const { projects, kindName } = etutIn(lang);
  const [kind, setKind] = useState<Kind | "all">("all");
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const list = projects.filter((p) => kind === "all" || p.kind === kind);
  const selected = projects.find((p) => p.id === selectedId)!;

  return (
    <div>
      <div aria-label={c.kind} className="flex flex-wrap gap-x-6 gap-y-2" role="radiogroup">
        {(["all", ...kinds] as const).map((k) => (
          <button
            aria-checked={kind === k}
            className={`min-h-10 border-b-2 px-1 text-sm font-medium transition-colors ${kind === k ? "border-[var(--etut-ink)]" : "border-transparent text-[var(--etut-muted)] hover:text-[var(--etut-ink)]"}`}
            key={k}
            onClick={() => setKind(k)}
            role="radio"
            type="button"
          >
            {k === "all" ? c.all : kindName(k)}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2">
        {list.map((p) => {
          const on = selectedId === p.id;
          return (
            <button
              aria-pressed={on}
              className="group block text-left"
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                document.getElementById("plan")?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
              }}
              type="button"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--etut-card)]">
                <UnsplashPhoto
                  className="grayscale transition-[filter,scale] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
                  image={images[p.id]}
                  lang={lang}
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute right-3 bottom-3 w-28 bg-white/90 p-1.5 sm:w-36">
                  <Thumb project={p} />
                </span>
              </span>
              <span className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <span>
                  <span className="block font-bold">{p.name}</span>
                  <span className="block">{p.place}</span>
                </span>
                <span className="font-bold">
                  {on ? c.open : c.see} <span aria-hidden="true" className={`ml-1 inline-block size-2.5 ${on ? "bg-[var(--etut-red)]" : "bg-[var(--etut-ink)]"}`} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-14 scroll-mt-6" id="plan">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--etut-ink)] pt-4">
          <div>
            <p className="font-[family-name:var(--etut-mono)] text-[11px] text-[var(--etut-muted)]">
              {kindName(selected.kind).toLocaleUpperCase(locale(lang))} · {selected.place.toLocaleUpperCase(locale(lang))} · {selected.year}
            </p>
            <h3 className="mt-2 font-[family-name:var(--etut-display)] text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.05em]">{selected.name}</h3>
          </div>
          <p className="font-[family-name:var(--etut-mono)] text-[11px] text-[var(--etut-muted)]">{c.scale}</p>
        </div>
        <p className="mt-5 max-w-[62ch] leading-7">{selected.story}</p>
        <div className="mt-8">
          <PlanViewer key={selected.id} project={selected} />
        </div>
      </div>
    </div>
  );
}
