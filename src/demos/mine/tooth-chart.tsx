"use client";

import { toothName } from "./data";

// Two U-shaped arches facing each other, as the patient sees them in a mirror:
// their right is on the right. Each tooth sits on an ellipse; the angles were
// found by walking the ellipse by tooth width, so neighbours never overlap.
type Arch = {
  w: number;
  h: number;
  rx: number;
  ry: number;
  up: number; // centre of the upper ellipse
  down: number; // centre of the lower ellipse
  teeth: { angle: number; w: number; h: number }[];
};

const arches: Record<"adult" | "child", Arch> = {
  adult: {
    w: 360,
    h: 414,
    rx: 128,
    ry: 190,
    up: 226,
    down: 203,
    teeth: [
      { angle: 5.2, w: 20, h: 18 },
      { angle: 14.6, w: 17, h: 17 },
      { angle: 23.2, w: 18, h: 21 },
      { angle: 32.2, w: 21, h: 21 },
      { angle: 41.2, w: 21, h: 21 },
      { angle: 51, w: 29, h: 27 },
      { angle: 61.4, w: 28, h: 26 },
      { angle: 70.8, w: 25, h: 24 },
    ],
  },
  child: {
    w: 260,
    h: 236,
    rx: 95,
    ry: 100,
    up: 132,
    down: 116,
    teeth: [
      { angle: 6.6, w: 19, h: 17 },
      { angle: 19.3, w: 17, h: 17 },
      { angle: 31.5, w: 18, h: 20 },
      { angle: 46, w: 25, h: 24 },
      { angle: 63.5, w: 29, h: 27 },
    ],
  },
};

type Tooth = { fdi: number; x: number; y: number; rot: number; w: number; h: number };

function layout(kind: "adult" | "child"): Tooth[] {
  const a = arches[kind];
  const cx = a.w / 2;
  const base = kind === "adult" ? [1, 2, 3, 4] : [5, 6, 7, 8];
  return base.flatMap((q, qi) => {
    const side = qi === 0 || qi === 3 ? 1 : -1; // quadrants 1/5 and 4/8 are the patient's right
    const upper = qi < 2;
    return a.teeth.map((s, i) => {
      const r = (s.angle * Math.PI) / 180;
      return {
        fdi: q * 10 + i + 1,
        x: cx + side * a.rx * Math.sin(r),
        y: upper ? a.up - a.ry * Math.cos(r) : a.down + a.ry * Math.cos(r),
        rot: (upper ? side : -side) * s.angle,
        w: s.w,
        h: s.h,
      };
    });
  });
}

/** The gum band under one arch, a little past the last tooth on each side. */
function gum(a: Arch, upper: boolean) {
  const end = ((a.teeth[a.teeth.length - 1].angle + 7) * Math.PI) / 180;
  const cx = a.w / 2;
  const y = upper ? a.up - a.ry * Math.cos(end) : a.down + a.ry * Math.cos(end);
  return `M${cx - a.rx * Math.sin(end)} ${y} A${a.rx} ${a.ry} 0 0 ${upper ? 1 : 0} ${cx + a.rx * Math.sin(end)} ${y}`;
}

/** Tap the teeth that trouble you. `readOnly` shows the clinic's copy with FDI numbers. */
export function ToothChart({
  kind,
  marked,
  onToggle,
  readOnly = false,
}: {
  kind: "adult" | "child";
  marked: number[];
  onToggle?: (fdi: number) => void;
  readOnly?: boolean;
}) {
  const a = arches[kind];
  const teeth = layout(kind);
  const mid = (a.up - a.ry * Math.cos((a.teeth[a.teeth.length - 1].angle * Math.PI) / 180) + (a.down + a.ry * Math.cos((a.teeth[a.teeth.length - 1].angle * Math.PI) / 180))) / 2;
  return (
    <svg aria-label={readOnly ? "İşaretlenen dişler" : "Diş şeması"} className="block h-auto w-full" role="group" viewBox={`0 0 ${a.w} ${a.h}`}>
      <path d={gum(a, true)} fill="none" stroke="var(--mine-gum)" strokeLinecap="round" strokeOpacity="0.6" strokeWidth={kind === "adult" ? 40 : 38} />
      <path d={gum(a, false)} fill="none" stroke="var(--mine-gum)" strokeLinecap="round" strokeOpacity="0.6" strokeWidth={kind === "adult" ? 40 : 38} />
      <text className="fill-[var(--mine-muted)] text-[10px] font-semibold tracking-[0.14em]" textAnchor="middle" x={a.w / 2} y={mid - 26}>
        ÜST ÇENE
      </text>
      <text className="fill-[var(--mine-muted)] text-[10px] font-semibold tracking-[0.14em]" textAnchor="middle" x={a.w / 2} y={mid + 33}>
        ALT ÇENE
      </text>
      <text className="fill-[var(--mine-ink)] text-[12px] font-bold" textAnchor="end" x={a.w - 4} y={mid + 4}>
        SAĞ
      </text>
      <text className="fill-[var(--mine-ink)] text-[12px] font-bold" x="4" y={mid + 4}>
        SOL
      </text>
      {teeth.map((t) => {
        const on = marked.includes(t.fdi);
        const shape = (
          <>
            <rect
              className={readOnly ? "" : "transition-[stroke] group-hover:stroke-[var(--mine-cobalt)]"}
              fill={on ? "var(--mine-cobalt)" : "#FFFFFF"}
              height={t.h}
              rx={Math.min(t.w, t.h) / 2.4}
              stroke={on ? "var(--mine-cobalt)" : "#A9AFC4"}
              strokeWidth="1.5"
              transform={`rotate(${t.rot} ${t.x} ${t.y})`}
              width={t.w}
              x={t.x - t.w / 2}
              y={t.y - t.h / 2}
            />
            {readOnly && (
              <text className={`text-[9px] font-bold ${on ? "fill-white" : "fill-[var(--mine-muted)]"}`} dominantBaseline="central" textAnchor="middle" x={t.x} y={t.y}>
                {t.fdi}
              </text>
            )}
          </>
        );
        if (readOnly) return <g key={t.fdi}>{shape}</g>;
        return (
          <g
            aria-label={`${toothName(t.fdi)} (${t.fdi})`}
            aria-pressed={on}
            className="group cursor-pointer outline-none"
            key={t.fdi}
            onClick={() => onToggle?.(t.fdi)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle?.(t.fdi);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <circle className="opacity-0 group-focus-visible:opacity-100" cx={t.x} cy={t.y} fill="none" r={Math.max(t.w, t.h) / 2 + 4} stroke="var(--mine-ink)" strokeWidth="2" />
            {shape}
          </g>
        );
      })}
    </svg>
  );
}
