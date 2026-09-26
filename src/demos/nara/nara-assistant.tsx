"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Chip, type LogLine, type State, opening, respond } from "./assistant-engine";
import { BOOKING_PATH, SITE_PATH } from "./data";
import { body, display, naraVars } from "./theme";

type Msg = { id: number; from: "user" | "bot"; text: string; chips?: Chip[] };
type Entry = LogLine & { id: number; turn: number };

const KIND_STYLE: Record<LogLine["kind"], string> = {
  niyet: "bg-[var(--nara-bg)] text-[var(--nara-ink)]",
  kaynak: "bg-[var(--nara-sage)] text-[var(--nara-ink)]",
  araç: "bg-[var(--nara-butter)] text-[var(--nara-ink)]",
  eylem: "bg-[var(--nara-rose)] text-white",
  devir: "bg-white text-[var(--nara-ink)] ring-1 ring-[var(--nara-ink)]/20",
};

const KIND_LABEL: Record<LogLine["kind"], string> = {
  niyet: "Anladığı",
  kaynak: "Kaynak",
  araç: "Araç",
  eylem: "Yaptığı",
  devir: "İnsana devir",
};

/** Nara's messaging assistant: the "yapay zekâ otomasyonu" demo (scripted, no model). */
export function NaraAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "bot", text: opening.text, chips: opening.chips }]);
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
    const reply = respond(text, state);
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

  const booked = log.some((l) => l.text.startsWith("Randevu oluşturuldu"));

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--nara-bg)] font-[family-name:var(--nara-body)] text-[var(--nara-ink)] antialiased`}
      style={naraVars}
    >
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-6">
          <Link className="font-[family-name:var(--nara-display)] text-2xl tracking-tight" href={SITE_PATH}>
            Nara<span className="text-[var(--nara-rose)]">.</span>
            <span className="ml-2 font-[family-name:var(--nara-body)] text-sm text-[var(--nara-muted)]">mesaj asistanı</span>
          </Link>
          <Link className="text-sm font-semibold text-[var(--nara-rose)] hover:underline" href={BOOKING_PATH}>
            İşletme paneline git →
          </Link>
        </header>

        <div className="max-w-2xl pt-4">
          <h1 className="font-[family-name:var(--nara-display)] text-[clamp(2.2rem,5vw,3.6rem)] leading-[1] tracking-[-0.02em]">
            Mesajlara Nara adına o cevap verir.
          </h1>
          <p className="mt-4 text-[var(--nara-muted)]">
            Soldaki telefona yaz ya da önerilere dokun. Sağda asistanın her cevapta ne anladığını, hangi bilgiye
            baktığını ve ne yaptığını görürsün. Gerçek kurulumda bu konuşma WhatsApp üzerinden olur.
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
                  <p className="text-xs text-[var(--nara-muted)]">{typing ? "yazıyor…" : "asistan · genelde anında yanıtlar"}</p>
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
                  <p aria-label="Asistan yazıyor" className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
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
                  Mesaj
                </label>
                <input
                  autoComplete="off"
                  className="min-h-11 flex-1 rounded-full bg-[var(--nara-bg)] px-4 text-[14px] outline-none focus:ring-2 focus:ring-[var(--nara-rose)]"
                  id="nara-msg"
                  maxLength={200}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Mesaj yaz"
                  value={draft}
                />
                <button
                  aria-label="Gönder"
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
            <p className="px-4 pt-3 pb-1 text-center text-[11px] text-[var(--nara-paper)]/55">Örnek sohbet; mesajlar hiçbir yere gönderilmez.</p>
          </div>

          {/* Behind the scenes */}
          <section aria-labelledby="perde" className="rounded-[28px] bg-[var(--nara-paper)] p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-[family-name:var(--nara-display)] text-3xl" id="perde">
                Perde arkası
              </h2>
              <p className="text-xs text-[var(--nara-muted)]">Her cevapta asistanın izlediği adımlar</p>
            </div>

            {log.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-[var(--nara-ink)]/20 p-6 text-sm leading-6 text-[var(--nara-muted)]">
                Henüz bir mesaj yok. Soldan bir soru sor; asistanın anladığı niyet, baktığı kaynak ve yaptığı işlem
                burada sırayla görünecek.
              </p>
            ) : (
              <ol className="mt-6 space-y-2.5">
                {log.map((l) => (
                  <li className="flex items-start gap-3" key={l.id}>
                    <span className="w-7 shrink-0 pt-1 text-right text-xs tabular-nums text-[var(--nara-muted)]">{l.turn}</span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${KIND_STYLE[l.kind]}`}>{KIND_LABEL[l.kind]}</span>
                    <span className="pt-0.5 text-sm leading-6">{l.text}</span>
                  </li>
                ))}
              </ol>
            )}

            {booked && (
              <div className="mt-8 rounded-2xl bg-[var(--nara-ink)] p-5 text-[var(--nara-paper)]">
                <p className="text-sm leading-6">
                  Asistanın oluşturduğu randevu, Nara&apos;nın randevu sisteminde gerçekten duruyor.
                </p>
                <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--nara-butter)] hover:underline" href={BOOKING_PATH}>
                  İşletme panelinde gör →
                </Link>
              </div>
            )}

            <dl className="mt-10 grid gap-4 border-t border-[var(--nara-ink)]/10 pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-semibold">Sadece kendi bilgisiyle</dt>
                <dd className="mt-1 leading-6 text-[var(--nara-muted)]">Fiyat, saat ve hizmetleri işletmenin kendi listelerinden okur.</dd>
              </div>
              <div>
                <dt className="font-semibold">Araçlarına bağlı</dt>
                <dd className="mt-1 leading-6 text-[var(--nara-muted)]">Takvime bakar, randevuyu oluşturur, hatırlatmayı planlar.</dd>
              </div>
              <div>
                <dt className="font-semibold">Bilmiyorsa uydurmaz</dt>
                <dd className="mt-1 leading-6 text-[var(--nara-muted)]">Cevabı kaynaklarında yoksa konuşmayı ekibe devreder.</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
