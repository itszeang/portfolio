"use client";

import { type Table, type Zone, tables, zoneName } from "./booking-data";

export type TableState = "free" | "taken" | "nofit" | "selected";

/** Chair positions around a table, by its shape and size. */
function chairs(t: Table): [number, number][] {
  const { x, y, w, h } = t;
  if (t.round && t.id === 14) return [[x, y - h / 2 - 10], [x, y + h / 2 + 10]];
  if (t.round) return [[x - w / 2 - 10, y], [x + w / 2 + 10, y]];
  if (t.seats === 4) return [[x, y - h / 2 - 10], [x, y + h / 2 + 10], [x - w / 2 - 10, y], [x + w / 2 + 10, y]];
  if (t.seats === 6) return [[x - 24, y - h / 2 - 10], [x + 24, y - h / 2 - 10], [x - 24, y + h / 2 + 10], [x + 24, y + h / 2 + 10], [x - w / 2 - 10, y], [x + w / 2 + 10, y]];
  return [-120, -60, 0, 60, 120].flatMap((dx): [number, number][] => [[x + dx, y - h / 2 - 10], [x + dx, y + h / 2 + 10]]);
}

const stateLabel: Record<TableState, string> = { free: "boş", taken: "dolu", nofit: "kişi sayısına uygun değil", selected: "seçildi" };

/** The dining room from above. Tables are buttons; the room is drawn around them. */
export function FloorPlan({
  states,
  prefer,
  onPick,
}: {
  states: Record<number, TableState>;
  prefer: Zone | null;
  onPick: (id: number) => void;
}) {
  return (
    <svg aria-label="Salon planı" className="block h-auto w-full select-none" role="group" viewBox="0 0 720 500">
      <defs>
        <pattern height="8" id="lodos-hatch" patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="8">
          <rect fill="#262926" height="8" width="8" />
          <line stroke="#3A3F3A" strokeWidth="3" x1="0" x2="0" y1="0" y2="8" />
        </pattern>
      </defs>

      {/* Room */}
      <rect fill="var(--lodos-card)" height="484" rx="8" stroke="var(--lodos-ink)" strokeWidth="3" width="704" x="8" y="8" />
      {[60, 170, 280, 390].map((x) => (
        <rect fill="var(--lodos-cini)" height="7" key={x} opacity="0.55" rx="2" width="90" x={x} y="5" />
      ))}
      <text className="fill-[var(--lodos-muted)] text-[11px] font-semibold tracking-[0.12em] uppercase" x="60" y="34">
        Sokak · pencereler
      </text>
      <rect fill="var(--ld-panel)" height="70" width="10" x="3" y="400" />
      <path d="M26 435 h24 m-8 -8 l8 8 l-8 8" fill="none" stroke="var(--lodos-muted)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <text className="fill-[var(--lodos-muted)] text-[11px] font-semibold" x="24" y="420">
        Giriş
      </text>

      <rect fill="var(--lodos-nar)" fillOpacity="0.07" height="96" rx="10" stroke="var(--lodos-nar)" strokeDasharray="5 5" strokeOpacity="0.45" width="164" x="536" y="22" />
      <text className="fill-[var(--lodos-nar)] font-[family-name:var(--lodos-display)] text-[22px]" x="556" y="62">
        Fasıl
      </text>
      <text className="fill-[var(--lodos-muted)] text-[11px]" x="556" y="84">
        Müzik 21:00&apos;de başlar
      </text>
      <path d="M668 34 v26 a6 6 0 1 1 -3 -5 v-17 l14 -4 v18 a6 6 0 1 1 -3 -5 v-13z" fill="var(--lodos-nar)" opacity="0.7" />

      <rect fill="var(--lodos-ink)" fillOpacity="0.06" height="84" rx="10" width="150" x="550" y="396" />
      <text className="fill-[var(--lodos-muted)] text-[12px] font-semibold" x="568" y="436">
        Meze tezgâhı
      </text>
      <text className="fill-[var(--lodos-muted)] text-[11px]" x="568" y="454">
        ve mutfak
      </text>
      <text className="fill-[var(--lodos-muted)] text-[10px] italic" textAnchor="middle" x="58" y="318">
        sessiz köşe
      </text>

      {/* Tables */}
      {tables.map((t) => {
        const s = states[t.id] ?? "nofit";
        const usable = s === "free" || s === "selected";
        const liked = prefer === t.zone && usable;
        const fill = s === "selected" ? "var(--lodos-nar)" : s === "taken" ? "url(#lodos-hatch)" : "#EFEADF";
        const stroke = s === "selected" ? "var(--lodos-nar)" : s === "free" ? "#EFEADF" : "#3A3F3A";
        const pick = () => usable && onPick(t.id);
        return (
          <g
            aria-disabled={!usable}
            aria-label={`Masa ${t.id}, ${t.seats} kişilik, ${zoneName[t.zone].toLowerCase()}, ${stateLabel[s]}`}
            aria-pressed={s === "selected"}
            className={`group outline-none ${usable ? "cursor-pointer" : "cursor-not-allowed"}`}
            key={t.id}
            onClick={pick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pick();
              }
            }}
            opacity={s === "nofit" ? 0.35 : 1}
            role="button"
            tabIndex={usable ? 0 : -1}
          >
            {liked &&
              (t.round ? (
                <circle cx={t.x} cy={t.y} fill="none" r={t.w / 2 + 22} stroke="var(--lodos-cini)" strokeDasharray="4 4" strokeWidth="2" />
              ) : (
                <rect fill="none" height={t.h + 44} rx="14" stroke="var(--lodos-cini)" strokeDasharray="4 4" strokeWidth="2" width={t.w + 44} x={t.x - t.w / 2 - 22} y={t.y - t.h / 2 - 22} />
              ))}
            {chairs(t).map(([cx, cy], i) => (
              <circle cx={cx} cy={cy} fill={s === "selected" ? "var(--lodos-nar)" : "var(--lodos-ink)"} key={i} opacity={s === "selected" ? 0.45 : 0.14} r="7" />
            ))}
            {t.round ? (
              <circle className="transition-[stroke-width] group-hover:[stroke-width:3.5px] group-focus-visible:[stroke-width:4px]" cx={t.x} cy={t.y} fill={fill} r={t.w / 2} stroke={stroke} strokeWidth="2" />
            ) : (
              <rect className="transition-[stroke-width] group-hover:[stroke-width:3.5px] group-focus-visible:[stroke-width:4px]" fill={fill} height={t.h} rx="6" stroke={stroke} strokeWidth="2" width={t.w} x={t.x - t.w / 2} y={t.y - t.h / 2} />
            )}
            {s === "free" && (
              <rect className="opacity-0 group-focus-visible:opacity-100" fill="none" height={t.h + 34} rx="12" stroke="var(--lodos-cini)" strokeWidth="3" width={t.w + 34} x={t.x - t.w / 2 - 17} y={t.y - t.h / 2 - 17} />
            )}
            <text
              className={`font-[family-name:var(--lodos-display)] text-[17px] ${s === "selected" ? "fill-white" : s === "free" ? "fill-[#1C1E1C]" : "fill-[var(--lodos-muted)]"}`}
              dominantBaseline="central"
              textAnchor="middle"
              x={t.x}
              y={t.y + 1}
            >
              {t.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
