"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Chip, type LogLine, type State, openingFor, respond } from "./assistant-engine";
import { naraIn } from "./data";
import { body, display, naraVars } from "./theme";
import type { Lang } from "@/lib/i18n";

type Msg = { id: number; from: "user" | "bot"; text: string; chips?: Chip[] };
type Entry = LogLine & { id: number; turn: number };

const KIND_STYLE: Record<LogLine["kind"], string> = {
  niyet: "bg-[var(--nara-bg)] text-[var(--nara-ink)]",
  kaynak: "bg-[var(--nara-sage)] text-[var(--nara-ink)]",
  araç: "bg-[var(--nara-butter)] text-[var(--nara-ink)]",
  eylem: "bg-[var(--nara-rose)] text-white",
  devir: "bg-white text-[var(--nara-ink)] ring-1 ring-[var(--nara-ink)]/20",
};

const COPY = {
  tr: {
    kinds: { niyet: "Anladığı", kaynak: "Kaynak", araç: "Araç", eylem: "Yaptığı", devir: "İnsana devir" } as Record<LogLine["kind"], string>,
    assistant: "mesaj asistanı",
    toPanel: "İşletme paneline git →",
    h1: "Mesajlara Nara adına o cevap verir.",
    lead: "Soldaki telefona yaz ya da önerilere dokun. Sağda asistanın her cevapta ne anladığını, hangi bilgiye baktığını ve ne yaptığını görürsün. Gerçek kurulumda bu konuşma WhatsApp üzerinden olur.",
    typing: "yazıyor…",
    status: "asistan · genelde anında yanıtlar",
    typingLabel: "Asistan yazıyor",
    message: "Mesaj",
    placeholder: "Mesaj yaz",
    send: "Gönder",
    sample: "Örnek sohbet; mesajlar hiçbir yere gönderilmez.",
    behind: "Perde arkası",
    behindLead: "Her cevapta asistanın izlediği adımlar",
    empty: "Henüz bir mesaj yok. Soldan bir soru sor; asistanın anladığı niyet, baktığı kaynak ve yaptığı işlem burada sırayla görünecek.",
    bookedNote: "Asistanın oluşturduğu randevu, Nara'nın randevu sisteminde gerçekten duruyor.",
    seeInPanel: "İşletme panelinde gör →",
    principles: [
      ["Sadece kendi bilgisiyle", "Fiyat, saat ve hizmetleri işletmenin kendi listelerinden okur."],
      ["Araçlarına bağlı", "Takvime bakar, randevuyu oluşturur, hatırlatmayı planlar."],
      ["Bilmiyorsa uydurmaz", "Cevabı kaynaklarında yoksa konuşmayı ekibe devreder."],
    ],
  },
  en: {
    kinds: { niyet: "Understood", kaynak: "Source", araç: "Tool", eylem: "Did", devir: "Handed to a person" } as Record<LogLine["kind"], string>,
    assistant: "message assistant",
    toPanel: "Go to the studio panel →",
    h1: "It answers messages on Nara's behalf.",
    lead: "Type into the phone on the left or tap a suggestion. On the right you'll see, for every reply, what the assistant understood, what it checked and what it did. In a real setup this conversation happens on WhatsApp.",
    typing: "typing…",
    status: "assistant · usually replies instantly",
    typingLabel: "The assistant is typing",
    message: "Message",
    placeholder: "Write a message",
    send: "Send",
    sample: "A sample chat; no message is sent anywhere.",
    behind: "Behind the scenes",
    behindLead: "The steps the assistant takes for each reply",
    empty: "No messages yet. Ask something on the left; the intent the assistant understood, the source it checked and what it did will appear here in order.",
    bookedNote: "The booking the assistant made really is in Nara's booking system.",
    seeInPanel: "See it in the studio panel →",
    principles: [
      ["Only its own information", "It reads prices, times and services from the business's own lists."],
      ["Connected to its tools", "It checks the calendar, makes the booking and schedules the reminder."],
      ["Doesn't make things up", "When the answer isn't in its sources, it hands the chat to the team."],
    ],
  },
};

/** Nara's messaging assistant: the "yapay zekâ otomasyonu" demo (scripted, no model). */
export function NaraAssistant({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { bookingPath: BOOKING_PATH, sitePath: SITE_PATH } = naraIn(lang);
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    const opening = openingFor(lang);
    return [{ id: 0, from: "bot", text: opening.text, chips: opening.chips }];
  });
  const [log, setLog] = useState<Entry[]>([]);
  const [state, setState] = useState<State>({ stage: "idle" });
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(1);
  const turnRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string, shown = text) {
    if (!text.trim() || typing) return;
    const turn = ++turnRef.current;
    setMsgs((m) => [...m.map((x) => ({ ...x, chips: undefined })), { id: idRef.current++, from: "user", text: shown }]);
    setDraft("");
    setTyping(true);
    const reply = respond(text, state, new Date(), lang);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        setTyping(false);
        setState(reply.state);
        setMsgs((m) => [...m, { id: idRef.current++, from: "bot", text: reply.text, chips: reply.chips }]);
        setLog((l) => [...l, ...reply.log.map((x) => ({ ...x, id: idRef.current++, turn }))]);
      },
      reduce ? 150 : 700 + Math.min(900, reply.text.length * 8),
    );
  }

  const booked = log.some((l) => l.booked);

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--nara-bg)] font-[family-name:var(--nara-body)] text-[var(--nara-ink)] antialiased`}
      style={naraVars}
    >
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <header className="sticky top-3 z-30 my-4 flex flex-wrap items-center justify-between gap-3 rounded-[28px] bg-white/90 py-2 pr-2 pl-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)] backdrop-blur sm:rounded-full">
          <Link className="font-[family-name:var(--nara-display)] text-2xl tracking-tight" href={SITE_PATH}>
            Nara
            <span className="ml-2 font-[family-name:var(--nara-body)] text-sm text-[var(--nara-muted)]">{c.assistant}</span>
          </Link>
          <Link className="text-sm font-semibold text-[var(--nara-rose)] hover:underline" href={BOOKING_PATH}>
            {c.toPanel}
          </Link>
        </header>

        <div className="max-w-2xl pt-4">
          <h1 className="font-[family-name:var(--nara-display)] text-[clamp(2.2rem,5vw,3.6rem)] leading-[1] tracking-[-0.02em]">
            {c.h1}
          </h1>
          <p className="mt-4 text-[var(--nara-muted)]">
            {c.lead}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-12">
          {/* Phone */}
          <div className="mx-auto w-full max-w-[400px] rounded-[44px] bg-[var(--nara-ink)] p-3 shadow-[0_40px_80px_-40px_rgba(43,24,48,0.6)]">
            <div className="flex h-[640px] flex-col overflow-hidden rounded-[34px] bg-[var(--nara-paper)]">
              <div className="flex items-center gap-3 border-b border-[var(--nara-ink)]/8 bg-white px-4 py-3">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-[var(--nara-rose)] font-[family-name:var(--nara-display)] text-white">
                  N
                </span>
                <div>
                  <p className="text-sm font-semibold">Nara Studio</p>
                  <p className="text-xs text-[var(--nara-muted)]">{typing ? c.typing : c.status}</p>
                </div>
              </div>

              <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-3 py-4" ref={listRef}>
                {msgs.map((m) => (
                  <div className={m.from === "user" ? "flex justify-end" : "flex flex-col items-start"} key={m.id}>
                    <p
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-5 ${m.from === "user" ? "rounded-br-md bg-[var(--nara-ink)] text-[var(--nara-paper)]" : "rounded-bl-md bg-white shadow-sm"}`}
                    >
                      {m.text}
                    </p>
                    {m.chips && (
                      <div className="mt-2 flex max-w-[92%] flex-wrap gap-1.5">
                        {m.chips.map((c) => (
                          <button
                            className="min-h-9 rounded-full border border-[var(--nara-rose)]/40 bg-white px-3 text-[13px] font-semibold text-[var(--nara-rose)] transition-colors hover:bg-[var(--nara-rose)] hover:text-white"
                            key={c.label}
                            onClick={() => send(c.value, c.label)}
                            type="button"
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {typing && (
                  <p aria-label={c.typingLabel} className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span className="size-1.5 animate-bounce rounded-full bg-[var(--nara-muted)] motion-reduce:animate-none" key={i} style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </p>
                )}
              </div>

              <form
                className="flex items-center gap-2 border-t border-[var(--nara-ink)]/8 bg-white p-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
              >
                <label className="sr-only" htmlFor="nara-msg">
                  {c.message}
                </label>
                <input
                  autoComplete="off"
                  className="min-h-11 flex-1 rounded-full bg-[var(--nara-bg)] px-4 text-[14px] outline-none focus:ring-2 focus:ring-[var(--nara-rose)]"
                  id="nara-msg"
                  maxLength={200}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={c.placeholder}
                  value={draft}
                />
                <button
                  aria-label={c.send}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--nara-rose)] text-white disabled:opacity-40"
                  disabled={!draft.trim() || typing}
                  type="submit"
                >
                  <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
            <p className="px-4 pt-3 pb-1 text-center text-[11px] text-[var(--nara-paper)]/55">{c.sample}</p>
          </div>

          {/* Behind the scenes */}
          <section aria-labelledby="perde" className="border border-[var(--nara-sage)] bg-[var(--nara-paper)] p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-[family-name:var(--nara-display)] text-3xl" id="perde">
                {c.behind}
              </h2>
              <p className="text-xs text-[var(--nara-muted)]">{c.behindLead}</p>
            </div>

            {log.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-[var(--nara-ink)]/20 p-6 text-sm leading-6 text-[var(--nara-muted)]">
                {c.empty}
              </p>
            ) : (
              <ol className="mt-6 space-y-2.5">
                {log.map((l) => (
                  <li className="flex items-start gap-3" key={l.id}>
                    <span className="w-7 shrink-0 pt-1 text-right text-xs tabular-nums text-[var(--nara-muted)]">{l.turn}</span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${KIND_STYLE[l.kind]}`}>{c.kinds[l.kind]}</span>
                    <span className="pt-0.5 text-sm leading-6">{l.text}</span>
                  </li>
                ))}
              </ol>
            )}

            {booked && (
              <div className="mt-8 rounded-2xl bg-[var(--nara-ink)] p-5 text-[var(--nara-paper)]">
                <p className="text-sm leading-6">
                  {c.bookedNote}
                </p>
                <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--nara-butter)] hover:underline" href={BOOKING_PATH}>
                  {c.seeInPanel}
                </Link>
              </div>
            )}

            <dl className="mt-10 grid gap-4 border-t border-[var(--nara-ink)]/10 pt-6 text-sm sm:grid-cols-3">
              {c.principles.map(([t, d]) => (
                <div key={t}>
                  <dt className="font-semibold">{t}</dt>
                  <dd className="mt-1 leading-6 text-[var(--nara-muted)]">{d}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
