"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLang } from "@/lib/lang-context";
import { kirpiIn, nightMinute } from "./mail";

const COPY = {
  tr: {
    sep: ".",
    lead: "Dün 18.00'de atölye kapandı. Sabah 08.30'da gelen kutusu açıldığında her şey rafındaydı.",
    time: "Saat",
    drag: "Saati sürükleyin ya da ok tuşlarıyla ilerletin.",
    phish: "Oltalama olarak ayırdı; bağlantıya dokunmadı.",
    shelved: (tray: string, note: string) => `${tray} rafına koydu: ${note}.`,
    notYet: "Henüz gelmedi.",
    closed: "Atölye kapalı. Gelen kutusu boş.",
    summary: (n: number, drafts: number, blocked: number, morning: boolean) =>
      `${n} e-posta geldi · ${drafts} cevap taslağı hazır${blocked ? ` · ${blocked} oltalama ayıklandı` : ""}${morning ? " · sabah her şey rafında." : "."}`,
  },
  en: {
    sep: ":",
    lead: "The workshop closed at 18:00 yesterday. When the inbox was opened at 08:30, everything was on its shelf.",
    time: "Time",
    drag: "Drag the clock or move it with the arrow keys.",
    phish: "Set aside as phishing; didn't touch the link.",
    shelved: (tray: string, note: string) => `Put on “${tray}”: ${note}.`,
    notYet: "Not here yet.",
    closed: "The workshop is closed. The inbox is empty.",
    summary: (n: number, drafts: number, blocked: number, morning: boolean) =>
      `${n === 1 ? "1 email" : `${n} emails`} in · ${drafts === 1 ? "1 draft reply" : `${drafts} draft replies`} ready${blocked ? ` · ${blocked} phishing caught` : ""}${morning ? " · by morning, everything's on its shelf." : "."}`,
  },
};

// The log runs from closing time (18.00) to when the owner opens the inbox (08.30).
const END = 14 * 60 + 30;
const clockIn = (sep: string) => (min: number) => {
  const t = (18 * 60 + min) % (24 * 60);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}${sep}${String(t % 60).padStart(2, "0")}`;
};
const hours = [0, 2, 4, 6, 8, 10, 12, 14]; // hours after 18.00 that get a tick label
const noop = () => () => {};

/** Dawn over the night panel: none before 05.00, full by the time the owner arrives. */
const dawn = (min: number) => Math.min(1, Math.max(0, (min - 11 * 60) / (END - 11 * 60)));

export function NightLog() {
  const lang = useLang();
  const c = COPY[lang];
  const clock = clockIn(c.sep);
  const { mails, trays } = kirpiIn(lang);
  const events = [...mails].sort((a, b) => nightMinute(a.time) - nightMinute(b.time)).map((m) => ({ mail: m, at: nightMinute(m.time), tray: trays.find((t) => t.id === m.tray)! }));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  // null until the night starts playing or someone drags the clock. Without
  // JavaScript (or with reduced motion) the whole night shows at once.
  const [minute, setMinute] = useState<number | null>(null);
  const run = useRef<ReturnType<typeof animate> | null>(null);
  const shown = minute ?? (mounted && !reduce ? 0 : END);

  useEffect(() => {
    if (!inView || reduce) return;
    run.current = animate(0, END, { duration: 6, ease: [0.45, 0, 0.2, 1], onUpdate: (v) => setMinute(Math.round(v)) });
    return () => run.current?.stop();
  }, [inView, reduce]);

  const arrived = events.filter((e) => e.at <= shown);
  const blocked = arrived.filter((e) => e.mail.phishing).length;
  const drafted = arrived.filter((e) => e.mail.draft).length;

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[var(--kp-night)] text-white" ref={ref}>
      {/* The sky: night indigo that warms into first light as the clock nears morning. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,#3B3F6B,transparent_70%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(110%_75%_at_50%_115%,var(--kp-dawn),#E9A98B_35%,#6D6A94_70%,transparent_100%)] transition-opacity duration-300"
        style={{ opacity: dawn(shown) }}
      />

      <div className="relative p-5 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-[34ch] text-[15px] leading-6 text-white/75">{c.lead}</p>
          <p aria-hidden="true" className="font-[family-name:var(--kp-mono)] text-[clamp(2.8rem,7vw,4.8rem)] leading-none font-medium tracking-[-0.04em] tabular-nums">
            {clock(shown)}
          </p>
        </div>

        {/* Hour axis with a mark for every e-mail; the clock is a native range input. */}
        <div className="relative mt-10">
          <input
            aria-label={c.time}
            aria-valuetext={clock(shown)}
            className="peer absolute inset-x-0 top-0 z-10 h-10 w-full cursor-ew-resize opacity-0"
            max={END}
            min={0}
            onChange={(e) => {
              run.current?.stop();
              setMinute(Number(e.target.value));
            }}
            step={5}
            type="range"
            value={shown}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-5 z-[5] size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,.18)] peer-focus-visible:shadow-[0_0_0_4px_var(--kp-dawn)]"
            style={{ left: `${(shown / END) * 100}%` }}
          />
          <div aria-hidden="true" className="relative h-10">
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
            <div className="absolute top-1/2 left-0 h-px bg-white" style={{ width: `${(shown / END) * 100}%` }} />
            {events.map((e) => (
              <span
                className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-200 ${e.at <= shown ? "border-white" : "border-white/35 bg-[var(--kp-night)]"}`}
                key={e.mail.id}
                style={{ left: `${(e.at / END) * 100}%`, background: e.at <= shown ? (e.mail.phishing ? "var(--kp-stamp)" : e.tray.tone) : undefined }}
              />
            ))}
          </div>
          <div aria-hidden="true" className="relative mt-1 h-5 font-[family-name:var(--kp-mono)] text-[11px] text-white/55">
            {hours.map((h) => (
              <span className={`absolute -translate-x-1/2 ${h % 4 ? "hidden sm:inline" : ""}`} key={h} style={{ left: `${((h * 60) / END) * 100}%` }}>
                {clock(h * 60)}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-white/60">{c.drag}</p>
        </div>

        <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {events.map((e) => {
            const on = e.at <= shown;
            return (
              <li
                className={`min-w-0 rounded-2xl border p-4 transition-[opacity,background-color] duration-300 ${on ? "border-white/20 bg-white/10 opacity-100" : "border-white/10 bg-transparent opacity-35"}`}
                key={e.mail.id}
              >
                <p className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 [overflow-wrap:anywhere] font-semibold">{e.mail.from}</span>
                  <span className="shrink-0 font-[family-name:var(--kp-mono)] text-xs text-white/70 tabular-nums">{e.mail.time.replace(":", c.sep)}</span>
                </p>
                <p className="mt-0.5 min-w-0 [overflow-wrap:anywhere] text-sm text-white/70">{e.mail.subject}</p>
                <p className="mt-3 text-sm">{on ? (e.mail.phishing ? c.phish : c.shelved(e.tray.name, e.mail.note)) : c.notYet}</p>
              </li>
            );
          })}
        </ol>

        <p aria-live="polite" className="mt-6 text-[15px] text-white/85">
          {arrived.length === 0 ? c.closed : c.summary(arrived.length, drafted, blocked, shown >= END)}
        </p>
      </div>
    </div>
  );
}
