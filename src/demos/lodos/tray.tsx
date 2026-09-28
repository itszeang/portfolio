"use client";

import CircularText from "@/components/reactbits/CircularText";
import { MotionConfig } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { FIX_MEZE, FIX_PRICE, RESERVE_PATH, tl, tray } from "./data";

// Plate positions on a 400×400 tray: one in the middle, eight around it.
const C = 200;
const RING = 118;
const spots = tray.map((_, i) =>
  i === 0 ? { x: C, y: C, r: 48 } : { x: C + RING * Math.cos(((i - 1) / 8) * Math.PI * 2 - Math.PI / 2), y: C + RING * Math.sin(((i - 1) / 8) * Math.PI * 2 - Math.PI / 2), r: 42 },
);

/** The mark a spoon leaves when the meze is spread on the plate. */
const swirl = (x: number, y: number, r: number) => `M${x - r * 0.55} ${y + r * 0.15} A${r * 0.6} ${r * 0.6} 0 0 1 ${x + r * 0.45} ${y - r * 0.35}`;

/** The waiter's tray: pick six cold mezes for the fixed menu. */
export function MezeTray() {
  const [picked, setPicked] = useState<string[]>(["fava", "haydari", "ezme"]);
  const [people, setPeople] = useState(4);
  const [focus, setFocus] = useState<string | null>(null);
  const full = picked.length >= FIX_MEZE;
  const shown = tray.find((m) => m.id === focus);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= FIX_MEZE ? p : [...p, id]));

  return (
    <MotionConfig reducedMotion="user">
      <div className="@container">
        {/* Side by side only when the column is wide enough, whatever the screen size. */}
        <div className="grid items-center gap-8 @3xl:grid-cols-[auto_minmax(0,1fr)]">
          <div className="relative mx-auto aspect-square w-[min(420px,86vw)] text-[clamp(13px,3.4vw,17px)]">
            {/* Each letter is a full-size rotated square; clip their corners so they can't widen the page. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <CircularText
                className="!h-full !w-full !font-[family-name:var(--lodos-body)] !font-semibold !text-[var(--lodos-cini)]"
                spinDuration={60}
                text="BU AKŞAMIN TEPSİSİ • LODOS MEYHANE • KADIKÖY • "
              />
            </div>
            <svg aria-label="Meze tepsisi" className="absolute inset-[9%] h-[82%] w-[82%] drop-shadow-[0_24px_30px_rgba(29,42,46,0.25)]" role="group" viewBox="0 0 400 400">
              <defs>
                <radialGradient cx="45%" cy="40%" id="lodos-tray" r="65%">
                  <stop offset="0" stopColor="#EEF1EF" />
                  <stop offset="0.75" stopColor="#D6DCD9" />
                  <stop offset="1" stopColor="#BCC4C1" />
                </radialGradient>
                <radialGradient cx="35%" cy="30%" id="lodos-sheen" r="75%">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
                  <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.14" />
                </radialGradient>
              </defs>
              <circle cx={C} cy={C} fill="#B3BBB8" r={196} />
              <circle cx={C} cy={C} fill="url(#lodos-tray)" r={188} stroke="#fff" strokeOpacity="0.7" strokeWidth={1.5} />
              {tray.map((m, i) => {
                const s = spots[i];
                const on = picked.includes(m.id);
                const locked = !on && full;
                return (
                  <g
                    aria-disabled={locked}
                    aria-label={m.name}
                    aria-pressed={on}
                    className={`group outline-none ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                    key={m.id}
                    onBlur={() => setFocus(null)}
                    onClick={() => toggle(m.id)}
                    onFocus={() => setFocus(m.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(m.id);
                      }
                    }}
                    onMouseEnter={() => setFocus(m.id)}
                    onMouseLeave={() => setFocus(null)}
                    opacity={locked ? 0.45 : 1}
                    role="button"
                    tabIndex={0}
                  >
                    <circle
                      className="opacity-0 group-focus-visible:opacity-100"
                      cx={s.x}
                      cy={s.y}
                      fill="none"
                      r={s.r + 7}
                      stroke="var(--lodos-cini)"
                      strokeDasharray="6 5"
                      strokeWidth={3}
                    />
                    <circle cx={s.x} cy={s.y + 3} fill="#000" opacity="0.08" r={s.r} />
                    <circle cx={s.x} cy={s.y} fill="#FFFFFF" r={s.r} stroke={on ? "var(--lodos-nar)" : "#B7BDBA"} strokeWidth={on ? 5 : 1.5} />
                    <circle cx={s.x} cy={s.y} fill="none" r={s.r - 6} stroke="#E4E8E6" strokeWidth={1.5} />
                    <circle cx={s.x} cy={s.y} fill={m.color} r={s.r - 12} />
                    <path d={swirl(s.x, s.y, s.r - 12)} fill="none" stroke="#fff" strokeLinecap="round" strokeOpacity="0.35" strokeWidth={3} />
                    {m.accent &&
                      [0, 1, 2, 3, 4, 5].map((k) => <circle cx={s.x + Math.cos(k * 1.1 + 0.4) * 15} cy={s.y + Math.sin(k * 1.1 + 0.4) * 12} fill={m.accent} key={k} r={2.2} />)}
                    <circle cx={s.x} cy={s.y} fill="url(#lodos-sheen)" r={s.r - 12} />
                    {on && (
                      <g>
                        <circle cx={s.x + s.r * 0.7} cy={s.y - s.r * 0.7} fill="var(--lodos-nar)" r={11} />
                        <path d={`M${s.x + s.r * 0.7 - 5} ${s.y - s.r * 0.7} l3.5 3.5 l6 -7`} fill="none" stroke="#fff" strokeLinecap="round" strokeWidth={2.4} />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div>
            <p aria-live="polite" className="min-h-[3.5rem] text-[var(--lodos-muted)]">
              {shown ? (
                <>
                  <span className="font-[family-name:var(--lodos-display)] text-2xl text-[var(--lodos-ink)]">{shown.name}</span>
                  <br />
                  {shown.note}
                </>
              ) : (
                "Seçmek için bir tabağa dokunun."
              )}
            </p>
            <p className="mt-6 text-sm font-semibold">
              Fix menü tepsin{" "}
              <span className="tabular-nums text-[var(--lodos-nar)]">
                {picked.length}/{FIX_MEZE}
              </span>
            </p>
            <ul className="mt-3 flex min-h-10 flex-wrap gap-2">
              {picked.map((id) => {
                const m = tray.find((x) => x.id === id)!;
                return (
                  <li key={id}>
                    <button
                      aria-label={`${m.name} tepsiden çıkar`}
                      className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[var(--lodos-card)] px-3 text-sm shadow-sm hover:text-[var(--lodos-nar)]"
                      onClick={() => toggle(id)}
                      type="button"
                    >
                      <span aria-hidden="true" className="size-3 rounded-full" style={{ background: m.color, outline: "1px solid #0002" }} />
                      {m.name} <span aria-hidden="true">×</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs text-[var(--lodos-muted)]">
              {full ? "Tepsi tamam. Değiştirmek için birini çıkarın." : `${FIX_MEZE - picked.length} meze daha seçebilirsiniz.`}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[var(--lodos-ink)]/10 pt-6">
              <div>
                <p className="text-xs text-[var(--lodos-muted)]">Kişi</p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    aria-label="Bir kişi azalt"
                    className="grid size-10 place-items-center rounded-full bg-[var(--lodos-card)] text-lg shadow-sm"
                    onClick={() => setPeople((n) => Math.max(1, n - 1))}
                    type="button"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-[family-name:var(--lodos-display)] text-2xl tabular-nums">{people}</span>
                  <button
                    aria-label="Bir kişi artır"
                    className="grid size-10 place-items-center rounded-full bg-[var(--lodos-card)] text-lg shadow-sm"
                    onClick={() => setPeople((n) => Math.min(12, n + 1))}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--lodos-muted)]">Fix menü, kişi başı {tl(FIX_PRICE)}</p>
                {/* Gloock has no ₺ glyph, so the sign comes from the body face. */}
                <p className="mt-1 font-[family-name:var(--lodos-display)] text-3xl tabular-nums">
                  {(people * FIX_PRICE).toLocaleString("tr-TR")} <span className="font-[family-name:var(--lodos-body)] text-2xl">₺</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--lodos-muted)]">6 soğuk meze, 2 ara sıcak ve meyve. İçecekler dahil değildir.</p>

            <Link
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--lodos-nar)] px-7 font-semibold text-white transition-colors hover:bg-[#9E2F3E]"
              href={`${RESERVE_PATH}?kisi=${people}${full ? `&tepsi=${picked.join(",")}` : ""}`}
            >
              {full ? "Bu tepsiyle masa ayırt" : "Masa ayırt"}
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
