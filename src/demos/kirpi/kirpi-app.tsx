"use client";

import { Highlighter } from "@/components/magicui/highlighter";
import { ArrowRight, BellRing, Check, CornerDownRight, FolderCheck, Inbox, Paperclip, RotateCcw, ShieldAlert, Trash2 } from "lucide-react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { kirpiIn, type Mail, type Mark, nightMinute, type Tray } from "./mail";

type Status = "open" | "sent" | "mine" | "trash";
type Tone = "samimi" | "resmi";

/** Fired by the page's "Postayı ayıkla" links, so they can sort the inbox from outside it. */
export const SORT_EVENT = "kirpi:sort";

const byTime = (a: Mail, b: Mail) => nightMinute(a.time) - nightMinute(b.time);

const COPY = {
  tr: {
    tl: (n: number) => `${n.toLocaleString("tr-TR")} ₺`,
    inbox: "Gelen kutusu",
    sent: (n: number, of: number) => `gönderilen ${n}/${of}`,
    newMail: "8 yeni e-posta",
    range: " · dün 18.40 – bugün 08.10 · asistan hepsini okudu",
    sort: "Rafına ayır",
    unsorted: "Ayıklanmamış e-postalar",
    shelves: "Raflar",
    reset: "İlk hâline döndür",
    openMail: "Açık e-posta",
    badgeSent: "Gönderildi",
    badgeTrash: "Çöpte",
    badgeMine: "Siz yazacaksınız",
    badgePhish: "Oltalama",
    note: "Asistanın notu",
    value: "Tahmini değer",
    quoted: "Teklif listesinde; yarın 10.00'da hatırlatırım.",
    addQuote: "Teklif listesine ekle",
    stamp: "OLTALAMA",
    noReplyWritten: "Bu e-postaya cevap yazmadım.",
    dontClick: "Bağlantıya tıklamayın. Şüpheniz varsa pazar yerine kendi uygulamasından girin.",
    binned: "Çöpe atıldı.",
    bin: "Çöpe at",
    draftFor: (from: string) => `Cevap taslağı · ${from}`,
    toneLabel: "Cevabın tonu",
    tones: [
      ["samimi", "Samimi"],
      ["resmi", "Resmî"],
    ] as const,
    approve: "Onayla ve gönder",
    mine: "Ben yazarım",
    sentNote: "Gönderildi. (Örnek; gerçek bir e-posta gitmedi.)",
    setAside: "Taslağı kenara koydum; bu cevabı siz yazacaksınız.",
    bringBack: "Taslağı geri getir",
  },
  en: {
    tl: (n: number) => `₺${n.toLocaleString("en-GB")}`,
    inbox: "Inbox",
    sent: (n: number, of: number) => `sent ${n}/${of}`,
    newMail: "8 new emails",
    range: " · yesterday 18:40 – today 08:10 · the assistant has read them all",
    sort: "Sort onto shelves",
    unsorted: "Unsorted emails",
    shelves: "Shelves",
    reset: "Put it back as it was",
    openMail: "Open email",
    badgeSent: "Sent",
    badgeTrash: "In the bin",
    badgeMine: "You'll write it",
    badgePhish: "Phishing",
    note: "Assistant's note",
    value: "Estimated value",
    quoted: "On the quote list; I'll remind you at 10:00 tomorrow.",
    addQuote: "Add to quote list",
    stamp: "PHISHING",
    noReplyWritten: "I didn't write a reply to this email.",
    dontClick: "Don't click the link. If in doubt, log in to the marketplace through its own app.",
    binned: "Moved to the bin.",
    bin: "Move to bin",
    draftFor: (from: string) => `Draft reply · ${from}`,
    toneLabel: "Tone of the reply",
    tones: [
      ["samimi", "Friendly"],
      ["resmi", "Formal"],
    ] as const,
    approve: "Approve and send",
    mine: "I'll write it",
    sentNote: "Sent. (A sample; no real email went out.)",
    setAside: "I've set the draft aside; you'll write this reply.",
    bringBack: "Bring the draft back",
  },
};

export function KirpiApp() {
  const lang = useLang();
  const c = COPY[lang];
  const { mails, trays, clock } = kirpiIn(lang);
  const ordered = [...mails].sort(byTime);
  const [sorted, setSorted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [tone, setTone] = useState<Record<string, Tone>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [quotes, setQuotes] = useState<string[]>([]);
  const desk = useRef<HTMLElement>(null);

  const st = (m: Mail) => status[m.id] ?? "open";
  const mail = mails.find((m) => m.id === selected) ?? null;
  const replyable = mails.filter((m) => m.draft).length;
  const sent = mails.filter((m) => st(m) === "sent").length;
  const byTray = (t: Tray) => mails.filter((m) => m.tray === t).sort(byTime);

  useEffect(() => {
    const onSort = () => {
      setSorted(true);
      setSelected((s) => s ?? "m1");
    };
    window.addEventListener(SORT_EVENT, onSort);
    return () => window.removeEventListener(SORT_EVENT, onSort);
  }, []);

  function sort() {
    setSorted(true);
    setSelected("m1");
  }
  function open(id: string) {
    setSelected(id);
    // Below the desktop layout the open mail sits under the shelves.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() => desk.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-hidden rounded-[22px] border border-[var(--kp-line)] bg-white text-left shadow-[0_50px_100px_-50px_rgba(26,21,18,.5)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--kp-line)] bg-[var(--kp-panel)] px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Inbox aria-hidden="true" className="size-4" /> {c.inbox}
            <span className="hidden font-normal text-[var(--kp-muted)] sm:inline">· Kirpi Seramik</span>
          </p>
          <p aria-live="polite" className="font-[family-name:var(--kp-mono)] text-xs text-[var(--kp-muted)] tabular-nums">
            {c.sent(sent, replyable)}
          </p>
        </div>

        <LayoutGroup>
          {!sorted ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                <p className="text-sm text-[var(--kp-muted)]">
                  <b className="font-semibold text-[var(--kp-ink)]">{c.newMail}</b>
                  {c.range}
                </p>
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--kp-ink)] px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
                  onClick={sort}
                  type="button"
                >
                  {c.sort} <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </div>
              <ul aria-label={c.unsorted} className="border-t border-[var(--kp-line)]">
                {ordered.map((m) => (
                  <motion.li className="relative border-b border-[var(--kp-line)] bg-white last:border-b-0" key={m.id} layout="position" layoutId={m.id}>
                    <span className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)_auto] sm:px-6">
                      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[var(--kp-panel)] text-sm font-semibold">
                        {m.from.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block min-w-0 [overflow-wrap:anywhere] text-[15px] font-semibold">{m.from}</span>
                        <span className="block min-w-0 [overflow-wrap:anywhere] text-sm text-[var(--kp-muted)] sm:hidden">{m.subject}</span>
                      </span>
                      <span className="hidden min-w-0 [overflow-wrap:anywhere] text-sm text-[var(--kp-muted)] sm:block">{m.subject}</span>
                      <span className="font-[family-name:var(--kp-mono)] text-xs text-[var(--kp-muted)] tabular-nums">{clock(m.time)}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : (
            <section aria-label={c.shelves} className="px-4 py-5 sm:px-6">
              <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {trays.map((t) => {
                  const list = byTray(t.id);
                  return (
                    <div key={t.id}>
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <span aria-hidden="true" className="size-2 rounded-full" style={{ background: t.tone }} />
                        {t.name}
                        <span className="font-normal text-[var(--kp-muted)] tabular-nums">{list.length}</span>
                      </h3>
                      <p className="mt-1 text-[13px] text-[var(--kp-muted)]">{t.hint}</p>
                      <ul className="mt-3 space-y-2.5">
                        {list.map((m) => (
                          <li key={m.id}>
                            <motion.button
                              aria-current={selected === m.id}
                              aria-label={`${m.from}: ${m.subject}, ${clock(m.time)}. ${m.note}`}
                              className={`block w-full rounded-xl border bg-white p-3 text-left transition-[border-color,box-shadow] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--kp-ink)] ${
                                selected === m.id ? "border-[var(--kp-ink)] shadow-[0_10px_24px_-14px_rgba(26,21,18,.6)]" : "border-[var(--kp-line)] hover:border-[#CFC8BF]"
                              }`}
                              layout="position"
                              layoutId={m.id}
                              onClick={() => open(m.id)}
                              transition={{ type: "spring", stiffness: 260, damping: 30, delay: ordered.indexOf(m) * 0.05 }}
                              type="button"
                            >
                              <MailCard mail={m} status={st(m)} />
                            </motion.button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <button className="mt-6 inline-flex min-h-10 items-center gap-1.5 text-sm text-[var(--kp-muted)] hover:text-[var(--kp-ink)]" onClick={() => setSorted(false)} type="button">
                <RotateCcw aria-hidden="true" className="size-3.5" /> {c.reset}
              </button>
            </section>
          )}
        </LayoutGroup>

        {sorted && mail && (
          <section aria-label={c.openMail} className="grid scroll-mt-4 gap-5 border-t border-[var(--kp-line)] bg-[var(--kp-panel)] p-4 sm:p-6 lg:grid-cols-2" ref={desk}>
            <Letter key={mail.id} mail={mail} onQuote={() => setQuotes((q) => [...q, mail.id])} quoted={quotes.includes(mail.id)} trashed={st(mail) === "trash"} />
            <Reply
              draft={edits[`${mail.id}:${tone[mail.id] ?? "samimi"}`] ?? mail.draft?.[tone[mail.id] ?? "samimi"] ?? ""}
              key={`r-${mail.id}`}
              mail={mail}
              onDraft={(v) => setEdits((e) => ({ ...e, [`${mail.id}:${tone[mail.id] ?? "samimi"}`]: v }))}
              onStatus={(s) => setStatus((x) => ({ ...x, [mail.id]: s }))}
              onTone={(t) => setTone((x) => ({ ...x, [mail.id]: t }))}
              status={st(mail)}
              tone={tone[mail.id] ?? "samimi"}
            />
          </section>
        )}
      </div>
    </MotionConfig>
  );
}

/** One sorted e-mail: who, what, and the assistant's one line on it. */
function MailCard({ mail, status }: { mail: Mail; status: Status }) {
  const lang = useLang();
  const c = COPY[lang];
  const { trays, clock } = kirpiIn(lang);
  const badge =
    status === "sent"
      ? { text: c.badgeSent, color: "var(--kp-glaze)" }
      : status === "trash"
        ? { text: c.badgeTrash, color: "var(--kp-muted)" }
        : status === "mine"
          ? { text: c.badgeMine, color: "var(--kp-muted)" }
          : mail.phishing
            ? { text: c.badgePhish, color: "var(--kp-stamp)" }
            : null;
  return (
    <span className={`block ${status === "trash" ? "opacity-55" : ""}`}>
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block min-w-0 [overflow-wrap:anywhere] text-[15px] font-semibold">{mail.from}</span>
          <span className="block min-w-0 [overflow-wrap:anywhere] text-[13px] text-[var(--kp-muted)]">{mail.subject}</span>
        </span>
        <span className="shrink-0 font-[family-name:var(--kp-mono)] text-[11px] text-[var(--kp-muted)] tabular-nums">{clock(mail.time)}</span>
      </span>
      <span className="mt-2.5 flex items-start gap-1.5 text-[13px] leading-5" style={{ color: trays.find((x) => x.id === mail.tray)!.tone }}>
        <CornerDownRight aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        {mail.note}
      </span>
      {badge && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold" style={{ borderColor: badge.color, color: badge.color }}>
          {status === "sent" && <Check aria-hidden="true" className="size-3" />}
          {badge.text}
        </span>
      )}
    </span>
  );
}

/** The e-mail itself, with the phrases the assistant understood marked by hand. */
function Letter({ mail, quoted, onQuote, trashed }: { mail: Mail; quoted: boolean; onQuote: () => void; trashed: boolean }) {
  const lang = useLang();
  const c = COPY[lang];
  const { clock } = kirpiIn(lang);
  const pencil = mail.phishing ? "#B3261E" : "#6A615A";
  const render = (line: string) => {
    const hits = mail.marks.filter((mk) => line.includes(mk.text)).sort((a, b) => line.indexOf(a.text) - line.indexOf(b.text));
    if (!hits.length) return line;
    const out: React.ReactNode[] = [];
    let rest = line;
    hits.forEach((mk: Mark, i) => {
      const at = rest.indexOf(mk.text);
      out.push(<Fragment key={`t${i}`}>{rest.slice(0, at)}</Fragment>);
      out.push(
        <Highlighter action={mk.action} color={mk.action === "highlight" ? "#D5E6DF" : pencil} iterations={1} key={`m${i}`} padding={mk.action === "circle" ? 6 : 2} strokeWidth={1.4}>
          {mk.text}
        </Highlighter>,
      );
      rest = rest.slice(at + mk.text.length);
    });
    out.push(<Fragment key="end">{rest}</Fragment>);
    return out;
  };

  return (
    <article className="relative self-start rounded-2xl border border-[var(--kp-line)] bg-white p-5 sm:p-7">
      <p className="text-[13px] text-[var(--kp-muted)]">
        <span className="font-semibold text-[var(--kp-ink)]">{mail.from}</span> &lt;{mail.address}&gt; · {clock(mail.time)}
      </p>
      <h3 className="mt-3 font-[family-name:var(--kp-display)] text-2xl leading-tight font-semibold tracking-[-0.02em]">{mail.subject}</h3>
      <div className={`mt-4 space-y-3 text-[16px] leading-[1.7] ${mail.phishing ? "break-words" : ""}`}>
        {mail.body.map((line, i) => (
          <p key={i}>{render(line)}</p>
        ))}
      </div>
      {mail.attachment && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--kp-line)] px-2.5 py-1.5 text-[13px]">
          <Paperclip aria-hidden="true" className="size-3.5" /> {mail.attachment}
        </p>
      )}

      <div className="mt-6 rounded-xl bg-[var(--kp-panel)] p-4">
        <p className="text-[13px] font-semibold">{c.note}</p>
        <ul className="mt-2 space-y-1.5 text-[14px] leading-6">
          {mail.understood.map((u) => (
            <li className="flex gap-2" key={u}>
              <CornerDownRight aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-[var(--kp-muted)]" />
              {u}
            </li>
          ))}
        </ul>
        {mail.checked.length > 0 && (
          <dl className="mt-3 space-y-1.5 border-t border-[var(--kp-line)] pt-3 text-[13px] leading-5">
            {mail.checked.map((c) => (
              <div className="grid gap-x-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]" key={c.where}>
                <dt className="font-[family-name:var(--kp-mono)] text-[12px] text-[var(--kp-muted)]">{c.where}</dt>
                <dd>{c.found}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {mail.escalate && (
        <p className="mt-4 flex items-start gap-2 text-sm">
          <BellRing aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#B45309]" /> {mail.escalate}
        </p>
      )}
      {mail.opportunity && (
        <div aria-live="polite" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span>
            {c.value} <b>{c.tl(mail.opportunity)}</b>
          </span>
          {quoted ? (
            <span className="font-semibold">{c.quoted}</span>
          ) : (
            <button className="min-h-10 rounded-full border border-[var(--kp-ink)] px-4 font-semibold hover:bg-[var(--kp-ink)] hover:text-white" onClick={onQuote} type="button">
              {c.addQuote}
            </button>
          )}
        </div>
      )}
      {mail.phishing && !trashed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 right-5 rotate-[12deg] rounded-[4px] border-[3px] border-[var(--kp-stamp)] px-3 py-1 font-[family-name:var(--kp-mono)] text-lg font-bold tracking-widest text-[var(--kp-stamp)] mix-blend-multiply"
        >
          {c.stamp}
        </span>
      )}
    </article>
  );
}

/** The drafted reply in two tones, or the reason there is none. */
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
  const c = COPY[useLang()];
  const panel = "self-start rounded-2xl border border-[var(--kp-line)] bg-white p-5 sm:p-7";
  if (mail.phishing) {
    return (
      <div className={panel}>
        <p className="flex items-center gap-2 text-lg font-semibold">
          <ShieldAlert aria-hidden="true" className="size-5 text-[var(--kp-stamp)]" /> {c.noReplyWritten}
        </p>
        <ul className="mt-4 space-y-2">
          {mail.phishing.map((r) => (
            <li className="border-l-2 border-[var(--kp-stamp)] pl-3" key={r}>
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--kp-muted)]">{c.dontClick}</p>
        {status === "trash" ? (
          <p aria-live="polite" className="mt-5 font-semibold">
            {c.binned}
          </p>
        ) : (
          <button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--kp-stamp)] px-5 text-sm font-semibold text-white hover:bg-[#961F18]" onClick={() => onStatus("trash")} type="button">
            <Trash2 aria-hidden="true" className="size-4" /> {c.bin}
          </button>
        )}
      </div>
    );
  }
  if (mail.noReply) {
    return (
      <div className={panel}>
        <p className="flex items-center gap-2 text-lg font-semibold">
          <FolderCheck aria-hidden="true" className="size-5 text-[var(--kp-glaze)]" /> {mail.noReply}
        </p>
      </div>
    );
  }
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-[13px] font-semibold" htmlFor="kp-reply">
          {c.draftFor(mail.from)}
        </label>
        <div aria-label={c.toneLabel} className="inline-flex rounded-full border border-[var(--kp-line)] p-0.5" role="group">
          {c.tones.map(([k, l]) => (
            <button
              aria-pressed={tone === k}
              className={`min-h-9 rounded-full px-3.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed ${tone === k ? "bg-[var(--kp-ink)] text-white" : "text-[var(--kp-muted)] hover:text-[var(--kp-ink)]"}`}
              disabled={status !== "open"}
              key={k}
              onClick={() => onTone(k)}
              type="button"
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <textarea
        className="mt-4 block min-h-[320px] w-full resize-y rounded-xl border border-[var(--kp-line)] bg-[var(--kp-panel)]/40 p-4 text-[15px] leading-7 focus-visible:border-[var(--kp-ink)] focus-visible:outline-none read-only:cursor-default read-only:opacity-70"
        id="kp-reply"
        onChange={(e) => onDraft(e.target.value)}
        readOnly={status !== "open"}
        value={draft}
      />
      <div aria-live="polite" className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {status === "open" && (
          <>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--kp-ink)] px-6 text-sm font-semibold text-white hover:bg-black" onClick={() => onStatus("sent")} type="button">
              {c.approve}
            </button>
            <button className="min-h-11 text-sm font-semibold underline underline-offset-4" onClick={() => onStatus("mine")} type="button">
              {c.mine}
            </button>
          </>
        )}
        {status === "sent" && (
          <p className="flex items-center gap-2 font-semibold text-[var(--kp-glaze)]">
            <Check aria-hidden="true" className="size-4" /> {c.sentNote}
          </p>
        )}
        {status === "mine" && (
          <p className="text-sm">
            {c.setAside}{" "}
            <button className="font-semibold underline underline-offset-4" onClick={() => onStatus("open")} type="button">
              {c.bringBack}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
