import { positions } from "./data";

/** A 7-a-side pitch from above with the team's names on their positions. */
export function LineupPitch({ names, missing }: { names: Record<string, string>; missing: Record<string, boolean> }) {
  return (
    <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 200 300">
      <defs>
        <pattern height="40" id="dk-stripes" patternUnits="userSpaceOnUse" width="200">
          <rect fill="var(--dk-turf)" height="20" width="200" />
          <rect fill="var(--dk-turf-dark)" height="20" width="200" y="20" />
        </pattern>
      </defs>
      <rect fill="url(#dk-stripes)" height="300" rx="10" width="200" />
      <g fill="none" stroke="var(--dk-line)" strokeOpacity="0.85" strokeWidth="1.6">
        <rect height="284" rx="4" width="184" x="8" y="8" />
        <line x1="8" x2="192" y1="150" y2="150" />
        <circle cx="100" cy="150" r="24" />
        <rect height="34" width="84" x="58" y="8" />
        <rect height="34" width="84" x="58" y="258" />
      </g>
      {positions.map((p, i) => {
        const name = names[p.key]?.trim();
        const gap = missing[p.key];
        return (
          <g key={p.key}>
            <circle
              cx={p.x}
              cy={p.y}
              fill={gap ? "none" : p.key === "kaleci" ? "var(--dk-ink)" : "var(--dk-bib)"}
              r="13"
              stroke={gap ? "var(--dk-line)" : "white"}
              strokeDasharray={gap ? "4 3" : undefined}
              strokeWidth="2"
            />
            <text className="fill-white text-[11px] font-black" dominantBaseline="central" textAnchor="middle" x={p.x} y={p.y + 0.5}>
              {gap ? "?" : i + 1}
            </text>
            <text className="fill-white text-[9px] font-semibold" textAnchor="middle" x={p.x} y={p.y + 25}>
              {gap ? "Aranıyor" : (name || p.label).slice(0, 12)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
