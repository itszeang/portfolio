"use client";

import { Highlighter } from "@/components/magicui/highlighter";
import { BellRing, FolderCheck, Paperclip, ShieldAlert, Trash2 } from "lucide-react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { Fragment, useRef, useState } from "react";
import { type Mail, mails, type Mark, type Tray, trays } from "./mail";

type Status = "open" | "sent" | "mine" | "trash";
type Tone = "samimi" | "resmi";

const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;
// Where each envelope lies in the unsorted pile.
const pile = [
  { x: -120, y: 18, r: -9 },
  { x: 96, y: -10, r: 7 },
  { x: -34, y: -22, r: -3 },
  { x: 150, y: 30, r: 12 },
  { x: -170, y: -12, r: 5 },
  { x: 40, y: 26, r: -6 },
  { x: -70, y: 40, r: 10 },
  { x: 10, y: -4, r: 2 },
];
const tape = "polygon(1.5% 0,98.5% 0,100% 25%,98% 50%,100% 75%,98.5% 100%,1.5% 100%,0 75%,2% 50%,0 25%)";

export function KirpiApp() {
  const [sorted, setSorted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [tone, setTone] = useState<Record<string, Tone>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [quotes, setQuotes] = useState<string[]>([]);
  const desk = useRef<HTMLDivElement>(null);

  const st = (m: Mail) => status[m.id] ?? "open";
  const mail = mails.find((m) => m.id === selected) ?? null;
  const sent = mails.filter((m) => st(m) === "sent").length;
  const byTray = (t: Tray) => mails.filter((m) => m.tray === t).sort((a, b) => a.time.localeCompare(b.time));
  const needsYou = byTray("hemen").length + byTray("karar").length;

  function sort() {
    setSorted(true);
    setSelected("m1");
  }
  function open(id: string) {
    setSelected(id);
    // On a phone the letter opens below the shelves.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        desk.current?.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "start",
        }),
      );
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <header className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 pt-7 sm:px-8">
        <p className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--kp-display)] text-3xl">Kirpi</span>
          <span className="font-[family-name:var(--kp-mono)] text-xs">seramik atölyesi · Avanos</span>
        </p>
        <p className="font-[family-name:var(--kp-mono)] text-xs">
          gönderilen: {sent}
          <span className="hidden sm:inline"> · asistan simülasyonu, gerçek e-posta yok</span>
        </p>
      </header>

      <main className="pb-24">
        <LayoutGroup>
          <section className={`mx-auto max-w-6xl px-5 pt-10 sm:px-8 ${sorted ? "" : "lg:grid lg:grid-cols-2 lg:items-center lg:gap-8"}`}>
            <div>
              <h1 className={`max-w-[16ch] font-[family-name:var(--kp-display)] text-[clamp(2.4rem,6.4vw,5rem)] leading-[0.98] ${sorted ? "" : "lg:text-[clamp(2.4rem,4.4vw,4rem)]"}`}>Sabah postası: sekiz mektup.</h1>
              <p aria-live="polite" className="mt-5 max-w-[46ch] text-lg leading-8">
                {sorted
                  ? `Hepsi rafında. ${needsYou} tanesine bugün sizin bakmanız gerekiyor; kalanların cevabı yazıldı ya da cevap gerekmiyor.`
                  : "Asistan hepsini okudu, sipariş defterine baktı ve cevapları yazdı. Hiçbiri siz onaylamadan gitmez."}
              </p>
            </div>

            {!sorted && (
              <div aria-label="Ayıklanmamış posta" className="mt-10 lg:mt-0" role="group">
                {/* Offsets shrink with the screen so the pile never spills past the edges. */}
                <div aria-hidden="true" className="relative mx-auto h-[230px] max-w-[560px] [--s:0.42] sm:h-[290px] sm:[--s:0.85] lg:[--s:0.75]">
                  {mails.map((m, i) => (
                    <motion.div
                      className="absolute top-1/2 left-1/2 w-[min(68vw,260px)]"
                      key={m.id}
                      layoutId={m.id}
                      style={{
                        x: `calc(-50% + ${pile[i].x}px * var(--s))`,
                        y: `calc(-50% + ${pile[i].y}px * var(--s))`,
                        rotate: pile[i].r,
                        zIndex: i,
                      }}
                    >
                      <Envelope mail={m} status="open" />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    className="min-h-14 rounded-[6px] bg-[var(--kp-tenmoku)] px-10 text-lg font-bold text-[var(--kp-plaster)] shadow-[0_3px_0_#000] transition-transform active:translate-y-[3px] active:shadow-none"
                    onClick={sort}
                    type="button"
                  >
                    Ayıkla
                  </button>
                </div>
              </div>
            )}
          </section>

          {sorted && (
            <section aria-label="Raflar" className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
                {trays.map((t) => {
                  const list = byTray(t.id);
                  return (
                    <div key={t.id}>
                      <div className="relative inline-block -rotate-1 bg-[var(--kp-tape)]/90 px-3 py-1.5" style={{ clipPath: tape }}>
                        <h2 className="font-[family-name:var(--kp-mono)] text-sm font-bold">
                          {t.name} · {list.length}
                        </h2>
                      </div>
                      <p className="mt-2 text-sm">{t.hint}</p>
                      <ul className="mt-4 space-y-3 border-b-[10px] border-[var(--kp-clay-dark)] pb-3">
                        {list.map((m) => (
                          <li key={m.id}>
                            <motion.button
                              aria-current={selected === m.id}
                              aria-label={`${m.from}: ${m.subject}, ${m.time}. ${m.note}`}
                              className={`block w-full rounded-[3px] text-left outline-offset-4 transition-[translate,box-shadow] focus-visible:outline-3 focus-visible:outline-[var(--kp-tenmoku)] ${selected === m.id ? "-translate-y-1 shadow-[0_10px_18px_-8px_rgba(36,26,21,.6)]" : "shadow-[0_2px_4px_rgba(36,26,21,.25)] hover:-translate-y-0.5"}`}
                              layoutId={m.id}
                              onClick={() => open(m.id)}
                              transition={{
                                type: "spring",
                                stiffness: 240,
                                damping: 28,
                                delay: mails.indexOf(m) * 0.06,
                              }}
                              type="button"
                            >
                              <Envelope mail={m} status={st(m)} />
                            </motion.button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <button className="mt-6 font-[family-name:var(--kp-mono)] text-xs underline underline-offset-4" onClick={() => setSorted(false)} type="button">
                Postayı yeniden karıştır
              </button>
            </section>
          )}
        </LayoutGroup>

        {sorted && mail && (
          <section aria-label="Açık mektup" className="mx-auto mt-14 grid max-w-6xl scroll-mt-4 gap-8 px-5 sm:px-8 lg:grid-cols-2" ref={desk}>
            <Letter key={mail.id} mail={mail} quoted={quotes.includes(mail.id)} onQuote={() => setQuotes((q) => [...q, mail.id])} trashed={st(mail) === "trash"} />
            <Reply
              draft={edits[`${mail.id}:${tone[mail.id] ?? "samimi"}`] ?? mail.draft?.[tone[mail.id] ?? "samimi"] ?? ""}
              key={`r-${mail.id}`}
              mail={mail}
              onDraft={(v) =>
                setEdits((e) => ({
                  ...e,
                  [`${mail.id}:${tone[mail.id] ?? "samimi"}`]: v,
                }))
              }
              onStatus={(s) => setStatus((x) => ({ ...x, [mail.id]: s }))}
              onTone={(t) => setTone((x) => ({ ...x, [mail.id]: t }))}
              status={st(mail)}
              tone={tone[mail.id] ?? "samimi"}
            />
          </section>
        )}
      </main>
    </MotionConfig>
  );
}

/** A kraft envelope with an address sticker, a postmark and the assistant's tape note. */
function Envelope({ mail, status }: { mail: Mail; status: Status }) {
  const stamp = status === "sent" ? "GÖNDERİLDİ" : status === "trash" ? "ÇÖPE" : mail.phishing ? "AÇMAYIN" : null;
  return (
    <span
      className={`relative block overflow-hidden rounded-[3px] bg-[var(--kp-kraft)] bg-[linear-gradient(115deg,rgba(255,255,255,.14),transparent_40%),repeating-linear-gradient(35deg,rgba(0,0,0,.025)_0_2px,transparent_2px_5px)] p-3 pb-10 ${status === "trash" ? "opacity-60" : ""}`}
    >
      <span className="block w-[82%] -rotate-[0.6deg] bg-[var(--kp-plaster)] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,.15)]">
        <span className="block truncate text-[15px] font-bold">{mail.from}</span>
        <span className="block truncate text-[13px]">{mail.subject}</span>
      </span>
      <span
        aria-hidden="true"
        className="absolute top-2.5 right-2.5 grid size-12 rotate-12 place-items-center rounded-full border-[1.5px] border-[#6B4A3A]/70 font-[family-name:var(--kp-mono)] text-[10px] leading-tight text-[#6B4A3A]/80"
      >
        <span className="text-center">
          AVANOS
          <br />
          {mail.time}
        </span>
      </span>
      <span
        className="absolute bottom-2 left-3 max-w-[88%] -rotate-1 truncate bg-[var(--kp-tape)]/95 px-2 py-1 font-[family-name:var(--kp-mono)] text-[11px]"
        style={{ clipPath: tape }}
      >
        {mail.note}
      </span>
      {stamp && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[4px] border-[3px] border-[var(--kp-stamp)] px-2 py-0.5 font-[family-name:var(--kp-mono)] text-lg font-bold tracking-widest text-[var(--kp-stamp)] mix-blend-multiply"
        >
          {stamp}
        </span>
      )}
    </span>
  );
}

/** The e-mail laid on the bench, with the phrases the assistant understood marked in pencil. */
function Letter({ mail, quoted, onQuote, trashed }: { mail: Mail; quoted: boolean; onQuote: () => void; trashed: boolean }) {
  const pencil = mail.phishing ? "#B3261E" : "#5B5048";
  const render = (line: string) => {
    const hits = mail.marks.filter((mk) => line.includes(mk.text)).sort((a, b) => line.indexOf(a.text) - line.indexOf(b.text));
    if (!hits.length) return line;
    const out: React.ReactNode[] = [];
    let rest = line;
    hits.forEach((mk: Mark, i) => {
      const at = rest.indexOf(mk.text);
      out.push(<Fragment key={`t${i}`}>{rest.slice(0, at)}</Fragment>);
      out.push(
        <Highlighter
          action={mk.action}
          color={mk.action === "highlight" ? "#CFE3D9" : pencil}
          iterations={1}
          key={`m${i}`}
          padding={mk.action === "circle" ? 6 : 2}
          strokeWidth={1.4}
        >
          {mk.text}
        </Highlighter>,
      );
      rest = rest.slice(at + mk.text.length);
    });
    out.push(<Fragment key="end">{rest}</Fragment>);
    return out;
  };

  return (
    <article className="relative -rotate-[0.4deg] bg-[var(--kp-plaster)] p-6 shadow-[0_18px_30px_-18px_rgba(36,26,21,.55)] sm:p-8">
      <p className="font-[family-name:var(--kp-mono)] text-xs">
        {mail.from} &lt;{mail.address}&gt; · {mail.time}
      </p>
      <h2 className="mt-3 text-xl leading-snug font-bold">{mail.subject}</h2>
      <div className={`mt-4 space-y-3 text-[16px] leading-[1.7] ${mail.phishing ? "break-words" : ""}`}>
        {mail.body.map((line, i) => (
          <p key={i}>{render(line)}</p>
        ))}
      </div>
      {mail.attachment && (
        <p className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--kp-mono)] text-xs">
          <Paperclip aria-hidden="true" className="size-4" /> {mail.attachment}
        </p>
      )}

      <div className="relative mt-7 bg-[var(--kp-tape)] px-5 py-4" style={{ clipPath: tape }}>
        <p className="font-[family-name:var(--kp-mono)] text-xs font-bold">Asistanın notu</p>
        <ul className="mt-2 space-y-1.5 font-[family-name:var(--kp-mono)] text-[13px] leading-5">
          {mail.understood.map((u) => (
            <li key={u}>— {u}</li>
          ))}
        </ul>
        {mail.checked.length > 0 && (
          <dl className="mt-3 space-y-1 border-t border-dashed border-[var(--kp-tenmoku)]/30 pt-3 font-[family-name:var(--kp-mono)] text-[12px] leading-5">
            {mail.checked.map((c) => (
              <div className="grid gap-x-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]" key={c.where}>
                <dt className="font-bold">{c.where}</dt>
                <dd>{c.found}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {mail.escalate && (
        <p className="mt-4 flex items-start gap-2 text-sm">
          <BellRing aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--kp-stamp)]" /> {mail.escalate}
        </p>
      )}
      {mail.opportunity && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span>
            Tahmini değer <b>{tl(mail.opportunity)}</b>
          </span>
          {quoted ? (
            <span className="font-bold">Teklif listesinde; yarın 10.00&apos;da hatırlatırım.</span>
          ) : (
            <button
              className="min-h-10 rounded-[6px] border-2 border-[var(--kp-tenmoku)] px-4 font-bold hover:bg-[var(--kp-tenmoku)] hover:text-[var(--kp-plaster)]"
              onClick={onQuote}
              type="button"
            >
              Teklif listesine ekle
            </button>
          )}
        </div>
      )}
      {mail.phishing && !trashed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-6 rotate-[14deg] rounded-[4px] border-[3px] border-[var(--kp-stamp)] px-3 py-1 font-[family-name:var(--kp-mono)] text-xl font-bold tracking-widest text-[var(--kp-stamp)] mix-blend-multiply"
        >
          OLTALAMA
        </span>
      )}
    </article>
  );
}

/** The reply on ruled letter paper, or the reason there is none. */
function Reply({
  mail,
  status,
  tone,
  draft,
  onStatus,
  onTone,
  onDraft,
}: {
  mail: Mail;
  status: Status;
  tone: Tone;
  draft: string;
  onStatus: (s: Status) => void;
  onTone: (t: Tone) => void;
  onDraft: (v: string) => void;
}) {
  if (mail.phishing) {
    return (
      <div className="self-start bg-[var(--kp-plaster)] p-6 sm:p-8">
        <p className="flex items-center gap-2 text-lg font-bold">
          <ShieldAlert aria-hidden="true" className="size-5 text-[var(--kp-stamp)]" /> Bu mektuba cevap yazmadım.
        </p>
        <ul className="mt-4 space-y-2">
          {mail.phishing.map((r) => (
            <li className="border-l-[3px] border-[var(--kp-stamp)] pl-3" key={r}>
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">Bağlantıya tıklamayın. Şüpheniz varsa pazar yerine kendi uygulamasından girin.</p>
        {status === "trash" ? (
          <p aria-live="polite" className="mt-5 font-bold">
            Çöpe atıldı.
          </p>
        ) : (
          <button
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-[6px] bg-[var(--kp-stamp)] px-6 font-bold text-white"
            onClick={() => onStatus("trash")}
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-4" /> Çöpe at
          </button>
        )}
      </div>
    );
  }
  if (mail.noReply) {
    return (
      <div className="self-start bg-[var(--kp-plaster)] p-6 sm:p-8">
        <p className="flex items-center gap-2 text-lg font-bold">
          <FolderCheck aria-hidden="true" className="size-5 text-[var(--kp-celadon)]" /> {mail.noReply}
        </p>
      </div>
    );
  }
  return (
    <div className="self-start">
      <div aria-label="Cevabın tonu" className="flex gap-1 pl-4" role="group">
        {(
          [
            ["samimi", "Samimi"],
            ["resmi", "Resmî"],
          ] as const
        ).map(([k, l]) => (
          <button
            aria-pressed={tone === k}
            className={`min-h-10 rounded-t-[6px] px-4 font-[family-name:var(--kp-mono)] text-xs font-bold transition-colors ${tone === k ? "bg-[var(--kp-plaster)]" : "bg-[var(--kp-tape)] hover:bg-[var(--kp-plaster)]/80"}`}
            disabled={status !== "open"}
            key={k}
            onClick={() => onTone(k)}
            type="button"
          >
            {l}
          </button>
        ))}
      </div>
      <div className="relative bg-[var(--kp-plaster)] p-6 shadow-[0_18px_30px_-18px_rgba(36,26,21,.55)] sm:p-8">
        <label className="font-[family-name:var(--kp-mono)] text-xs" htmlFor="kp-reply">
          Cevap · {mail.from}
        </label>
        <textarea
          className="mt-3 block min-h-[336px] w-full resize-y bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(36,26,21,.14)_27px,rgba(36,26,21,.14)_28px)] bg-local text-[16px] leading-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--kp-tenmoku)] read-only:cursor-default"
          id="kp-reply"
          onChange={(e) => onDraft(e.target.value)}
          readOnly={status !== "open"}
          value={draft}
        />
        {status === "sent" && (
          <motion.span
            animate={{ opacity: 0.9, scale: 1 }}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[10deg] rounded-[6px] border-4 border-[var(--kp-stamp)] px-4 py-1 font-[family-name:var(--kp-mono)] text-3xl font-bold tracking-widest text-[var(--kp-stamp)] mix-blend-multiply"
            initial={{ opacity: 0, scale: 1.7 }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
          >
            GÖNDERİLDİ
          </motion.span>
        )}
        <div aria-live="polite" className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          {status === "open" && (
            <>
              <button
                className="min-h-12 rounded-[6px] bg-[var(--kp-tenmoku)] px-7 font-bold text-[var(--kp-plaster)] shadow-[0_3px_0_#000] active:translate-y-[3px] active:shadow-none"
                onClick={() => onStatus("sent")}
                type="button"
              >
                Gönder
              </button>
              <button className="min-h-12 font-bold underline underline-offset-4" onClick={() => onStatus("mine")} type="button">
                Ben yazarım
              </button>
            </>
          )}
          {status === "sent" && <p className="font-bold">Gönderildi. (Örnek; gerçek bir e-posta gitmedi.)</p>}
          {status === "mine" && (
            <p>
              Taslağı kenara koydum; bu cevabı siz yazacaksınız.{" "}
              <button className="font-bold underline underline-offset-4" onClick={() => onStatus("open")} type="button">
                Taslağı geri getir
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
