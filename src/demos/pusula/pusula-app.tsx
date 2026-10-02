"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { type Answer, ask, type Cite, handbookIn, paraById, suggestionsIn } from "./handbook";

const COPY = {
  tr: {
    subtitle: "Personel el kitabı asistanı · simülasyon",
    file: "el-kitabi-v4.pdf · 5 bölüm · 14 madde · güncelleme 01.09.2026",
    view: "Görünüm",
    tabs: [
      ["soru", "Soru"],
      ["kaynak", "El kitabı"],
    ] as const,
    qa: "Soru ve cevap",
    h1: "El kitabına sorun, cevap kaynağıyla gelsin.",
    lead: "Asistan yalnızca el kitabında yazanı söyler. Her cümlenin hangi maddeden geldiğini gösterir; kitapta olmayan bir şey sorulursa tahmin etmez.",
    examples: "Örnek sorular",
    retrieved: (n: number) => (n ? `${n} madde tarandı` : "Eşleşen madde yok"),
    similarity: (n: number) => `benzerlik %${n}`,
    searching: "El kitabı taranıyor…",
    yourQuestion: "Sorunuz",
    placeholder: "Örn. 52 yaşındayım, 3 yıldır buradayım; kaç gün iznim var?",
    ask: "Sor",
    handbook: "Personel el kitabı",
    company: "Pusula Lojistik A.Ş. (örnek)",
    title: "Personel El Kitabı",
    edition: "Sürüm 4 · 1 Eylül 2026. Yasal kurallar 4857 sayılı İş Kanunu'ndan aktarılmıştır; şirket kuralları örnektir.",
  },
  en: {
    subtitle: "Employee handbook assistant · simulation",
    file: "handbook-v4-en.pdf · 5 sections · 14 clauses · updated 01/09/2026",
    view: "View",
    tabs: [
      ["soru", "Question"],
      ["kaynak", "Handbook"],
    ] as const,
    qa: "Questions and answers",
    h1: "Ask the handbook; the answer comes with its source.",
    lead: "The assistant only says what the handbook says. It shows which clause each sentence comes from, and if you ask about something the handbook doesn't cover, it doesn't guess.",
    examples: "Example questions",
    retrieved: (n: number) => (n === 0 ? "No matching clause" : n === 1 ? "1 clause retrieved" : `${n} clauses retrieved`),
    similarity: (n: number) => `similarity ${n}%`,
    searching: "Searching the handbook…",
    yourQuestion: "Your question",
    placeholder: "e.g. I'm 52 and have been here 3 years; how much leave do I get?",
    ask: "Ask",
    handbook: "Employee handbook",
    company: "Pusula Lojistik A.Ş. (sample)",
    title: "Employee Handbook",
    edition: "Version 4 · 1 September 2026, English edition. Legal rules are taken from Turkey's Labour Act No. 4857; company rules are examples.",
  },
};

type Msg = { role: "user"; text: string } | { role: "bot"; answer: Answer };

export function PusulaApp() {
  const lang = useLang();
  const c = COPY[lang];
  const handbook = handbookIn(lang);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  // `msg: "last"` follows the newest answer; clicking a citation pins an older one.
  const [pick, setPick] = useState<{ msg: number | "last"; para: string | null } | null>(null);
  const [tab, setTab] = useState<"soru" | "kaynak">("soru");
  const doc = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLOListElement>(null);

  const lastBot = msgs.map((m, i) => (m.role === "bot" ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
  const active = pick ? { msg: pick.msg === "last" ? lastBot : pick.msg, para: pick.para } : null;
  const activeAnswer = active ? (msgs[active.msg] as Extract<Msg, { role: "bot" }> | undefined)?.answer : undefined;
  const lit = new Set(activeAnswer?.cites.flatMap((c) => c.sentences) ?? []);
  const litParas = new Set(activeAnswer?.cites.map((c) => c.para) ?? []);

  // Bring the cited paragraph into view inside the document pane.
  useEffect(() => {
    const box = doc.current;
    const id = active?.para ?? activeAnswer?.cites[0]?.para;
    if (!box || !id) return;
    const el = box.querySelector<HTMLElement>(`[data-para="${id}"]`);
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: el.offsetTop - 24, behavior: smooth ? "smooth" : "auto" });
  }, [active?.msg, active?.para, activeAnswer, tab]);

  useEffect(() => {
    chat.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [msgs.length, pending]);

  function send(text: string) {
    const t = text.trim();
    if (!t || pending) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setDraft("");
    setPending(true);
    // A short pause stands in for retrieval and generation.
    setTimeout(() => {
      const answer = ask(t, lang);
      setMsgs((m) => [...m, { role: "bot", answer }]);
      setPick({ msg: "last", para: null });
      setPending(false);
    }, 650);
  }

  function openCite(msg: number, c: Cite) {
    setPick({ msg, para: c.para });
    setTab("kaynak");
  }

  return (
    <>
      <header className="border-b border-[var(--ps-ink)]/10 bg-[var(--ps-paper)]/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <p className="flex items-center gap-3">
            <svg aria-hidden="true" className="size-8 text-[var(--ps-blue)]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" />
              <path d="M16 6l3.2 10L16 26l-3.2-10z" fill="currentColor" fillOpacity="0.18" strokeLinejoin="round" />
            </svg>
            <span>
              <span className="block font-semibold">Pusula Lojistik</span>
              <span className="block text-xs text-[var(--ps-muted)]">{c.subtitle}</span>
            </span>
          </p>
          <p className="font-[family-name:var(--ps-mono)] text-xs text-[var(--ps-muted)]">{c.file}</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-4 sm:px-8 lg:hidden">
        <div aria-label={c.view} className="grid grid-cols-2 gap-1 rounded-xl bg-[var(--ps-paper)]/60 p-1 text-sm font-semibold" role="group">
          {c.tabs.map(([k, l]) => (
            <button aria-pressed={tab === k} className={`min-h-10 rounded-lg ${tab === k ? "bg-[var(--ps-ink)] text-white" : ""}`} key={k} onClick={() => setTab(k)} type="button">
              {l}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:py-8">
        <section aria-label={c.qa} className={`${tab === "soru" ? "flex" : "hidden"} min-h-[70dvh] flex-col rounded-2xl bg-[var(--ps-paper)] lg:flex lg:h-[calc(100dvh-9rem)] lg:min-h-0`}>
          <ol aria-live="polite" className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6" ref={chat}>
            {msgs.length === 0 && (
              <li>
                <h1 className="font-[family-name:var(--ps-serif)] text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.15] font-semibold">{c.h1}</h1>
                <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--ps-muted)]">{c.lead}</p>
                <p className="mt-6 text-xs font-semibold tracking-[0.12em] text-[var(--ps-muted)] uppercase">{c.examples}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {suggestionsIn(lang).map((s) => (
                    <li key={s}>
                      <button className="min-h-10 rounded-full border border-[var(--ps-ink)]/15 px-3.5 text-left text-sm hover:border-[var(--ps-blue)] hover:text-[var(--ps-blue)]" onClick={() => send(s)} type="button">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <li className="flex justify-end" key={i}>
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[var(--ps-ink)] px-4 py-2.5 text-sm text-white">{m.text}</p>
                </li>
              ) : (
                <li className={`rounded-2xl border p-4 transition-colors ${active?.msg === i ? "border-[var(--ps-blue)]/40" : "border-[var(--ps-line)]"}`} key={i}>
                  <details className="group text-xs text-[var(--ps-muted)]">
                    <summary className="cursor-pointer list-none select-none">
                      <span className="underline decoration-dotted underline-offset-2">{c.retrieved(m.answer.retrieved.length)}</span>
                      <span aria-hidden="true" className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <ul className="mt-2 space-y-1.5">
                      {m.answer.retrieved.map((r) => (
                        <li className="grid grid-cols-[3rem_minmax(0,1fr)_5rem] items-center gap-2" key={r.para}>
                          <span className="font-[family-name:var(--ps-mono)]">§{r.para}</span>
                          <span className="min-w-0 [overflow-wrap:anywhere]">{paraById(r.para, lang).title}</span>
                          <span aria-label={c.similarity(Math.round(r.score * 100))} className="h-1.5 overflow-hidden rounded-full bg-[var(--ps-line)]">
                            <span className="block h-full rounded-full bg-[var(--ps-blue)]" style={{ width: `${r.score * 100}%`, opacity: m.answer.unknown ? 0.35 : 1 }} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <p className={`mt-3 font-[family-name:var(--ps-serif)] text-[1.05rem] leading-7 ${m.answer.unknown ? "text-[var(--ps-muted)] italic" : ""}`}>{m.answer.text}</p>
                  {m.answer.cites.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.answer.cites.map((cite) => (
                        <button
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors ${active?.msg === i && (active.para ?? m.answer.cites[0].para) === cite.para ? "bg-[var(--ps-blue)] text-white" : "bg-[var(--ps-cite)] text-[var(--ps-blue)] hover:bg-[var(--ps-blue)] hover:text-white"}`}
                          key={cite.para}
                          onClick={() => openCite(i, cite)}
                          type="button"
                        >
                          <span className="font-[family-name:var(--ps-mono)]">§{cite.para}</span> {paraById(cite.para, lang).title}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ),
            )}
            {pending && (
              <li className="flex items-center gap-2 text-sm text-[var(--ps-muted)]">
                <span className="size-2 rounded-full bg-[var(--ps-blue)] motion-safe:animate-pulse" /> {c.searching}
              </li>
            )}
          </ol>
          <form
            className="flex gap-2 border-t border-[var(--ps-line)] p-3 sm:p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label className="sr-only" htmlFor="ps-q">
              {c.yourQuestion}
            </label>
            <input
              autoComplete="off"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-[var(--ps-ink)]/15 bg-white px-4 focus-visible:border-[var(--ps-blue)] focus-visible:outline-2 focus-visible:outline-[var(--ps-blue)]"
              id="ps-q"
              onChange={(e) => setDraft(e.target.value)}
              placeholder={c.placeholder}
              value={draft}
            />
            <button className="min-h-12 rounded-xl bg-[var(--ps-blue)] px-5 font-semibold text-white disabled:opacity-40" disabled={!draft.trim() || pending} type="submit">
              {c.ask}
            </button>
          </form>
        </section>

        <section
          aria-label={c.handbook}
          className={`${tab === "kaynak" ? "block" : "hidden"} relative h-[75dvh] overflow-y-auto rounded-2xl bg-[var(--ps-paper)] shadow-[0_1px_0_rgba(29,36,51,0.05),0_24px_48px_-32px_rgba(29,36,51,0.4)] lg:block lg:h-[calc(100dvh-9rem)]`}
          ref={doc}
          tabIndex={0}
        >
          <article className="mx-auto max-w-[62ch] px-6 py-10 font-[family-name:var(--ps-serif)] sm:px-10">
            <p className="font-[family-name:var(--ps-mono)] text-xs tracking-[0.14em] text-[var(--ps-muted)] uppercase">{c.company}</p>
            <h2 className="mt-2 text-3xl font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm text-[var(--ps-muted)]">{c.edition}</p>
            {handbook.map((s) => (
              <section className="mt-10" key={s.id}>
                <h3 className="border-b border-[var(--ps-line)] pb-2 text-xl font-semibold">
                  <span className="mr-2 font-[family-name:var(--ps-mono)] text-sm text-[var(--ps-muted)]">{s.id}.</span>
                  {s.title}
                </h3>
                {s.paras.map((p) => (
                  <div className={`relative mt-5 rounded-lg transition-colors ${litParas.has(p.id) ? "bg-[var(--ps-cite)]/40 -mx-3 px-3 py-2" : ""}`} data-para={p.id} key={p.id}>
                    <h4 className="text-[0.95rem] font-semibold">
                      <span className="mr-2 font-[family-name:var(--ps-mono)] text-xs text-[var(--ps-blue)]">§{p.id}</span>
                      {p.title}
                    </h4>
                    <p className="mt-1.5 text-[1.02rem] leading-7">
                      {p.sentences.map((x) => (
                        <span className={lit.has(x.id) ? "rounded-sm bg-[var(--ps-cite)] underline decoration-[var(--ps-blue)] decoration-2 underline-offset-4 [box-decoration-break:clone]" : ""} key={x.id}>
                          {x.text}{" "}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </section>
            ))}
          </article>
        </section>
      </main>
    </>
  );
}
