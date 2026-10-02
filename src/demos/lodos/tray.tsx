"use client";

import CircularText from "@/components/reactbits/CircularText";
import { MotionConfig } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { FIX_MEZE, FIX_PRICE, lodosIn, tray as TRAY } from "./data";

// Plate positions on a 400×400 tray: one in the middle, eight around it.
const C = 200;
const RING = 118;
const spots = TRAY.map((_, i) =>
  i === 0 ? { x: C, y: C, r: 48 } : { x: C + RING * Math.cos(((i - 1) / 8) * Math.PI * 2 - Math.PI / 2), y: C + RING * Math.sin(((i - 1) / 8) * Math.PI * 2 - Math.PI / 2), r: 42 },
);

/** The mark a spoon leaves when the meze is spread on the plate. */
const swirl = (x: number, y: number, r: number) => `M${x - r * 0.55} ${y + r * 0.15} A${r * 0.6} ${r * 0.6} 0 0 1 ${x + r * 0.45} ${y - r * 0.35}`;

const COPY = {
  tr: {
    ring: "BU AKŞAMIN TEPSİSİ • LODOS MEYHANE • KADIKÖY • ",
    trayLabel: "Meze tepsisi",
    hint: "Seçmek için bir tabağa dokunun.",
    yourTray: "Fix menü tepsin",
    remove: (name: string) => `${name} tepsiden çıkar`,
    full: "Tepsi tamam. Değiştirmek için birini çıkarın.",
    more: (n: number) => `${n} meze daha seçebilirsiniz.`,
    guests: "Kişi",
    fewer: "Bir kişi azalt",
    moreGuests: "Bir kişi artır",
    perPerson: (price: string) => `Fix menü, kişi başı ${price}`,
    includes: "6 soğuk meze, 2 ara sıcak ve meyve. İçecekler dahil değildir.",
    bookWithTray: "Bu tepsiyle masa ayırt",
    book: "Masa ayırt",
  },
  en: {
    ring: "TONIGHT'S TRAY • LODOS MEYHANE • KADIKÖY • ",
    trayLabel: "Meze tray",
    hint: "Tap a plate to choose it.",
    yourTray: "Your set-menu tray",
    remove: (name: string) => `Remove ${name} from the tray`,
    full: "The tray is full. Take one off to change it.",
    more: (n: number) => `You can pick ${n} more.`,
    guests: "Guests",
    fewer: "One guest fewer",
    moreGuests: "One guest more",
    perPerson: (price: string) => `Set menu, ${price} per person`,
    includes: "6 cold mezes, 2 hot starters and fruit. Drinks not included.",
    bookWithTray: "Book a table with this tray",
    book: "Book a table",
  },
};

/** The waiter's tray: pick six cold mezes for the fixed menu. */
export function MezeTray({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { tray, tl, reservePath: RESERVE_PATH } = lodosIn(lang);
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
                text={c.ring}
              />
            </div>
            <svg aria-label={c.trayLabel} className="absolute inset-[9%] h-[82%] w-[82%] drop-shadow-[0_24px_30px_rgba(29,42,46,0.25)]" role="group" viewBox="0 0 400 400">
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
                c.hint
              )}
            </p>
            <p className="mt-6 text-sm font-semibold">
              {c.yourTray}{" "}
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
                      aria-label={c.remove(m.name)}
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
              {full ? c.full : c.more(FIX_MEZE - picked.length)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[var(--lodos-ink)]/10 pt-6">
              <div>
                <p className="text-xs text-[var(--lodos-muted)]">{c.guests}</p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    aria-label={c.fewer}
                    className="grid size-10 place-items-center rounded-full bg-[var(--lodos-card)] text-lg shadow-sm"
                    onClick={() => setPeople((n) => Math.max(1, n - 1))}
                    type="button"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-[family-name:var(--lodos-display)] text-2xl tabular-nums">{people}</span>
                  <button
                    aria-label={c.moreGuests}
                    className="grid size-10 place-items-center rounded-full bg-[var(--lodos-card)] text-lg shadow-sm"
                    onClick={() => setPeople((n) => Math.min(12, n + 1))}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--lodos-muted)]">{c.perPerson(tl(FIX_PRICE))}</p>
                {/* Gloock has no ₺ glyph, so the sign comes from the body face. */}
                <p className="mt-1 font-[family-name:var(--lodos-display)] text-3xl tabular-nums">
                  {lang === "en" ? (
                    <>
                      <span className="font-[family-name:var(--lodos-body)] text-2xl">₺</span>
                      {(people * FIX_PRICE).toLocaleString("en-GB")}
                    </>
                  ) : (
                    <>
                      {(people * FIX_PRICE).toLocaleString("tr-TR")} <span className="font-[family-name:var(--lodos-body)] text-2xl">₺</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--lodos-muted)]">{c.includes}</p>

            <Link
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--lodos-nar)] px-7 font-semibold text-white transition-colors hover:bg-[#9E2F3E]"
              href={`${RESERVE_PATH}?kisi=${people}${full ? `&tepsi=${picked.join(",")}` : ""}`}
            >
              {full ? c.bookWithTray : c.book}
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
