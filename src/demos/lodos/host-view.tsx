"use client";

import { type Day, DURATION, hm, hoursOf, type Res, SLOT, tables, zoneName } from "./booking-data";

/** The host stand's book: every table's seatings across the night. */
export function HostView({
  days,
  dayIdx,
  onDay,
  list,
  arrived,
}: {
  days: Day[];
  dayIdx: number;
  onDay: (i: number) => void;
  list: Res[];
  arrived: boolean;
}) {
  const day = days[dayIdx];
  const { open, close } = hoursOf(day.dow);
  const span = close - open;
  const pct = (m: number) => `${((m - open) / span) * 100}%`;
  const hours = Array.from({ length: Math.floor(span / 60) + 1 }, (_, i) => open + i * 60);

  // Tables in use at each half hour; the busiest moment is what the host plans for.
  const load = Array.from({ length: span / SLOT }, (_, i) => {
    const t = open + i * SLOT;
    return { t, used: new Set(list.filter((r) => r.start <= t && t < r.start + DURATION).map((r) => r.table)).size };
  });
  const peak = load.reduce((a, b) => (b.used > a.used ? b : a), load[0]);
  const covers = list.reduce((n, r) => n + r.party, 0);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label="Gün">
        {days.map((d, i) => (
          <button
            aria-pressed={i === dayIdx}
            className={`min-h-10 shrink-0 rounded-[9px] border px-3.5 text-xs tracking-[0.14em] uppercase transition-colors ${i === dayIdx ? "border-[var(--ld-text)] bg-[var(--ld-text)] text-[var(--ld-bg)]" : "border-[var(--ld-line)] hover:border-[var(--ld-text)]"}`}
            key={d.iso}
            onClick={() => onDay(i)}
            type="button"
          >
            {d.short}
          </button>
        ))}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Rezervasyon", String(list.length)],
          ["Beklenen kişi", String(covers)],
          ["En yoğun saat", `${hm(peak.t)} · ${Math.round((peak.used / tables.length) * 100)}%`],
          ["O saatte boş masa", `${tables.length - peak.used}`],
        ].map(([k, v]) => (
          <div className="rounded-[14px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-4" key={k}>
            <dt className="text-xs text-[var(--lodos-muted)]">{k}</dt>
            <dd className="mt-1 font-[family-name:var(--lodos-display)] text-2xl tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-4 sm:p-5" tabIndex={0} aria-label={`${day.long} rezervasyon çizelgesi`}>
        <div className="min-w-[680px]">
          <div className="relative ml-28 h-6 text-[11px] text-[var(--lodos-muted)]">
            {hours.map((h) => (
              <span className="absolute -translate-x-1/2 tabular-nums" key={h} style={{ left: pct(h) }}>
                {hm(h)}
              </span>
            ))}
          </div>
          <ul className="divide-y divide-[var(--lodos-ink)]/8">
            {tables.map((t) => (
              <li className="flex items-center" key={t.id}>
                <span className="w-28 shrink-0 py-2 pr-3 text-xs">
                  <span className="font-semibold">Masa {t.id}</span>
                  <span className="block text-[var(--lodos-muted)]">
                    {t.seats} kişilik · {zoneName[t.zone].split(" ")[0].toLowerCase()}
                  </span>
                </span>
                <div className="relative h-11 flex-1">
                  {hours.map((h) => (
                    <span aria-hidden="true" className="absolute inset-y-0 w-px bg-[var(--lodos-ink)]/6" key={h} style={{ left: pct(h) }} />
                  ))}
                  {list
                    .filter((r) => r.table === t.id)
                    .map((r) => (
                      <span
                        className={`absolute inset-y-1.5 flex items-center gap-1 overflow-hidden rounded-lg px-2 text-[11px] whitespace-nowrap ${r.mine ? "bg-[var(--lodos-nar)] font-semibold text-white shadow-md" : "bg-[var(--lodos-ink)]/10"}`}
                        key={r.id}
                        style={{ left: pct(r.start), width: `calc(${((Math.min(r.start + DURATION, close) - r.start) / span) * 100}% - 3px)` }}
                        title={`${hm(r.start)} · ${r.who} · ${r.party} kişi`}
                      >
                        {r.mine && arrived && <span aria-label="geldi">✓</span>}
                        {hm(r.start)} · {r.mine ? `${r.who} (siz)` : r.who} · {r.party}k
                      </span>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-xs text-[var(--lodos-muted)]">
        Her oturuş 2,5 saat. Misafir isimleri örnektir ve baş harflerle gösterilir.
      </p>
    </div>
  );
}
