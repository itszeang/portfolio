"use client";

import { Check, Download, FileText, ImageIcon, Receipt, Send } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { accountName, booking, type Doc, docs, expenseAccounts, type FieldKey, money, moneyFields, type Posted, startJournal, toNumber } from "./data";
import { Paper } from "./paper";

// Every place on the voucher the reader writes something, in the order it writes them.
type Cell = FieldKey | "account";
const order: Cell[] = ["date", "no", "vkn", "account", "matrah", "kdv", "seller", "total"];

type DocState = {
  status: "new" | "reading" | "review" | "approved" | "skipped";
  found: number;
  values: Record<FieldKey, string>;
  account: string;
  confirmed: Cell[];
  posted: number | null;
  by: "auto" | "you" | null;
};
type State = { docs: Record<string, DocState>; journal: Posted[]; threshold: number };
type Action =
  | { type: "read"; id: string }
  | { type: "tick"; id: string }
  | { type: "write"; id: string; cell: Cell; value: string }
  | { type: "approve"; id: string }
  | { type: "skip"; id: string }
  | { type: "threshold"; value: number };

const docById = (id: string) => docs.find((d) => d.id === id)!;
const confOf = (doc: Doc, cell: Cell) => (cell === "account" ? booking[doc.id].expense.conf : doc.fields[cell].conf);
const pencilOf = (doc: Doc, s: DocState, threshold: number) => order.filter((c) => confOf(doc, c) < threshold && !s.confirmed.includes(c));

/** What an accountant would check before signing. Confidence alone is not enough. */
function checks(doc: Doc, s: DocState, journal: Posted[]) {
  const matrah = toNumber(s.values.matrah);
  const kdv = toNumber(s.values.kdv);
  const total = toNumber(s.values.total);
  return [
    { key: "denk", label: "Fiş denk: borç = alacak", ok: Math.abs(matrah + kdv - total) < 0.02 },
    { key: "oran", label: `KDV oranı %${doc.rate} ile tutuyor`, ok: matrah > 0 && Math.abs(kdv / matrah - doc.rate / 100) < 0.005 },
    { key: "vkn", label: "Satıcı VKN on haneli", ok: /^\d{10}$/.test(s.values.vkn.trim()) },
    { key: "mukerrer", label: "Bu belge deftere daha önce işlenmemiş", ok: !journal.some((p) => p.doc === s.values.no.trim()) },
  ];
}

function post(doc: Doc, s: DocState, journal: Posted[], by: "auto" | "you"): Posted {
  return {
    no: journal.length + 1,
    date: s.values.date,
    doc: s.values.no.trim(),
    by,
    lines: [
      { code: s.account, memo: booking[doc.id].memo, debit: toNumber(s.values.matrah), credit: 0 },
      { code: "191", memo: `KDV %${doc.rate}`, debit: toNumber(s.values.kdv), credit: 0 },
      { code: booking[doc.id].pay, memo: s.values.seller, debit: 0, credit: toNumber(s.values.total) },
    ],
  };
}

const initial = (): State => ({
  docs: Object.fromEntries(
    docs.map((d) => [
      d.id,
      {
        status: "new",
        found: 0,
        values: Object.fromEntries(Object.entries(d.fields).map(([k, f]) => [k, moneyFields.includes(k as FieldKey) ? money(Number(f.value)) : f.value])) as Record<FieldKey, string>,
        account: booking[d.id].expense.code,
        confirmed: [],
        posted: null,
        by: null,
      },
    ]),
  ),
  journal: startJournal,
  threshold: 0.95,
});

function reducer(state: State, a: Action): State {
  if (a.type === "threshold") return { ...state, threshold: a.value };
  const s = state.docs[a.id];
  const doc = docById(a.id);
  const put = (next: Partial<DocState>, extra: Partial<State> = {}) => ({ ...state, ...extra, docs: { ...state.docs, [a.id]: { ...s, ...next } } });
  switch (a.type) {
    case "read":
      return put({ status: "reading", found: 0 });
    case "tick": {
      if (s.status !== "reading") return state;
      const found = s.found + 1;
      if (found < order.length) return put({ found });
      // Finished: anything the reader is sure of is inked; file it at once if nothing is left in pencil.
      const done: DocState = { ...s, found, status: "review" };
      const clean = pencilOf(doc, done, state.threshold).length === 0 && checks(doc, done, state.journal).every((c) => c.ok);
      if (!clean) return put(done);
      const entry = post(doc, done, state.journal, "auto");
      return put({ ...done, status: "approved", posted: entry.no, by: "auto" }, { journal: [...state.journal, entry] });
    }
    case "write":
      return put({
        ...(a.cell === "account" ? { account: a.value } : { values: { ...s.values, [a.cell]: a.value } }),
        confirmed: s.confirmed.includes(a.cell) ? s.confirmed : [...s.confirmed, a.cell],
      });
    case "approve": {
      const entry = post(doc, s, state.journal, "you");
      return put({ status: "approved", posted: entry.no, by: "you" }, { journal: [...state.journal, entry] });
    }
    case "skip":
      return put({ status: "skipped" });
  }
}

const slipIcon = { pdf: FileText, photo: ImageIcon, receipt: Receipt } as const;
const statusWord: Record<DocState["status"], string> = { new: "okunmadı", reading: "okunuyor", review: "kurşun kalemde", approved: "işlendi", skipped: "ayrıldı" };

export function MizanApp() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const [selected, setSelected] = useState(docs[0].id);
  const [active, setActive] = useState<FieldKey | null>(null);
  const [speed, setSpeed] = useState(260);
  const [sent, setSent] = useState(false);
  const doc = docById(selected);
  const ds = state.docs[selected];
  const reading = Object.entries(state.docs).find(([, s]) => s.status === "reading")?.[0] ?? null;

  // Play the reading back, one entry at a time.
  useEffect(() => {
    if (!reading) return;
    const id = setInterval(() => dispatch({ type: "tick", id: reading }), speed);
    return () => clearInterval(id);
  }, [reading, speed]);

  function read() {
    setSpeed(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 260);
    dispatch({ type: "read", id: selected });
  }

  const found = ds.status === "new" ? [] : order.slice(0, ds.found);
  const pencil = ds.status === "review" ? pencilOf(doc, ds, state.threshold) : ds.status === "reading" ? found : [];
  const list = ds.status === "new" || ds.status === "reading" ? [] : checks(doc, ds, state.journal.filter((p) => p.no !== ds.posted));
  const dup = list.some((c) => c.key === "mukerrer" && !c.ok);
  const canSign = ds.status === "review" && pencil.length === 0 && list.every((c) => c.ok);
  const lowOnPaper = (ds.status === "review" ? pencil : []).filter((c): c is FieldKey => c !== "account");

  return (
    <MotionConfig reducedMotion="user">
      <style>
        {"@keyframes mz-scan{from{top:-6%}to{top:100%}}.mz-scan{animation:mz-scan 2s linear infinite}@keyframes mz-write{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}.mz-write{animation:mz-write .38s ease-out both}@media (prefers-reduced-motion:reduce){.mz-scan{display:none}.mz-write{animation:none}}"}
      </style>
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 pt-7 sm:px-8">
        <p className="flex items-baseline gap-3">
          <span className="text-2xl font-bold tracking-[0.18em]">MİZAN</span>
          <span className="text-sm opacity-75">ön muhasebe asistanı · simülasyon</span>
        </p>
        <label className="flex items-center gap-3 text-sm" htmlFor="mz-limit">
          Kurşun kalem sınırı
          <input
            className="w-28 accent-[var(--mz-voucher)]"
            id="mz-limit"
            max={99}
            min={80}
            onChange={(e) => dispatch({ type: "threshold", value: Number(e.target.value) / 100 })}
            type="range"
            value={Math.round(state.threshold * 100)}
          />
          <span className="w-9 font-semibold tabular-nums">%{Math.round(state.threshold * 100)}</span>
        </label>
      </header>

      <main className="pb-24">
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
          <h1 className="max-w-[20ch] text-[clamp(2.2rem,5vw,4.1rem)] leading-[1] font-semibold tracking-[-0.01em]">Faturayı okur, mahsup fişini doldurur.</h1>
          <p className="mt-3 max-w-[40ch] font-[family-name:var(--mz-hand)] text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug text-[#C9C4BA]">
            Emin olmadığını kurşun kalemle yazar; siz onaylayınca mürekkebe geçer.
          </p>
        </section>

        <nav aria-label="Gelen evrak" className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
          <ul className="flex gap-3 overflow-x-auto pt-2 pb-3">
            {docs.map((d) => {
              const s = state.docs[d.id];
              const Icon = slipIcon[d.kind];
              const on = d.id === selected;
              return (
                <li className="shrink-0" key={d.id}>
                  <button
                    aria-current={on}
                    className={`flex w-52 items-start gap-3 sm:w-60 rounded-[1px] bg-[var(--mz-light)] p-3 text-left text-[var(--mz-ink)] transition-transform focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--mz-voucher)] ${on ? "-translate-y-1.5 shadow-[0_10px_18px_-10px_rgba(0,0,0,.7)]" : "opacity-85 hover:-translate-y-0.5 hover:opacity-100"}`}
                    onClick={() => setSelected(d.id)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#1b2230]" strokeWidth={1.6} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[#1b2230]">{d.title}</span>
                      <span className="block truncate text-xs text-[#4a4f57]">{d.source}</span>
                      <span className={`mt-1 block font-[family-name:var(--mz-hand)] text-[15px] ${s.status === "approved" ? "text-[var(--mz-ink)]" : s.status === "skipped" ? "text-[var(--mz-red)]" : "text-[var(--mz-pencil)]"}`}>
                        {statusWord[s.status]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mx-auto mt-6 grid max-w-7xl items-start gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <section aria-label="Belge" className="relative mx-auto w-full max-w-[480px]">
            <Paper active={active} doc={doc} flagged={lowOnPaper} found={found.filter((c): c is FieldKey => c !== "account")} scanning={ds.status === "reading"} />
            {ds.status === "new" && (
              <div className="absolute inset-0 grid place-items-center bg-[var(--mz-blotter)]/40">
                <button className="min-h-12 rounded-[1px] bg-[var(--mz-ink)] px-7 text-lg font-semibold text-white shadow-lg hover:bg-[#15296b]" onClick={read} type="button">
                  Belgeyi oku
                </button>
              </div>
            )}
          </section>

          <Voucher
            dispatch={dispatch}
            doc={doc}
            ds={ds}
            dup={dup}
            canSign={canSign}
            checks={list}
            found={found}
            nextNo={state.journal.length + 1}
            onHover={setActive}
            pencil={pencil}
            threshold={state.threshold}
          />
        </div>

        <Journal journal={state.journal} onSend={() => setSent(true)} sent={sent} />
      </main>
    </MotionConfig>
  );
}

/** A value written on the voucher: in pencil until someone is sure of it, then in ink. */
function Written({
  cell,
  text,
  shown,
  pencil,
  editable,
  conf,
  onWrite,
  onHover,
  edit,
  align = "left",
}: {
  cell: Cell;
  text: string;
  shown: boolean;
  pencil: boolean;
  editable: boolean;
  conf: number;
  onWrite: (v: string) => void;
  onHover: (f: FieldKey | null) => void;
  edit: string;
  align?: "left" | "right";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(edit);
  const input = useRef<HTMLInputElement & HTMLSelectElement>(null);
  useEffect(() => {
    if (editing) input.current?.focus();
  }, [editing]);
  const hover = {
    onMouseEnter: () => onHover(cell === "account" ? null : cell),
    onMouseLeave: () => onHover(null),
    onFocus: () => onHover(cell === "account" ? null : cell),
    onBlur: () => onHover(null),
  };

  if (!shown) return <span aria-hidden="true" className="inline-block h-[1.2em] w-16 border-b border-dotted border-[var(--mz-form)]/60 align-bottom" />;

  const hand = `font-[family-name:var(--mz-hand)] text-[1.08em] leading-tight transition-colors duration-500 ${pencil ? "text-[var(--mz-pencil)]" : "text-[var(--mz-ink)]"}`;
  if (editing) {
    const done = () => {
      onWrite(draft);
      setEditing(false);
    };
    return (
      <span className={`inline-flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
        {cell === "account" ? (
          <select className={`${hand} rounded-[1px] border border-[var(--mz-form)] bg-white px-1 text-[var(--mz-ink)]`} onChange={(e) => setDraft(e.target.value)} ref={input} value={draft}>
            {expenseAccounts.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} {a.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`${hand} w-full min-w-24 rounded-[1px] border border-[var(--mz-form)] bg-white px-1.5 text-[var(--mz-ink)] ${align === "right" ? "text-right" : ""}`}
            inputMode={moneyFields.includes(cell as FieldKey) ? "decimal" : undefined}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") done();
              if (e.key === "Escape") setEditing(false);
            }}
            ref={input}
            value={draft}
          />
        )}
        <button aria-label="Mürekkeple yaz" className="grid size-9 shrink-0 place-items-center rounded-[1px] bg-[var(--mz-ink)] text-white" onClick={done} type="button">
          <Check aria-hidden="true" className="size-4" />
        </button>
      </span>
    );
  }
  if (pencil && editable) {
    return (
      <button
        aria-label={`${text}, emin değil (%${Math.round(conf * 100)}). Kontrol edip mürekkeple yazın.`}
        className={`${hand} mz-write group relative inline-flex items-baseline gap-1 border-b border-dashed border-[var(--mz-pencil)] text-left hover:text-[var(--mz-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mz-ink)]`}
        onClick={() => {
          setDraft(edit);
          setEditing(true);
        }}
        type="button"
        {...hover}
      >
        {text}
        <sup className="font-[family-name:var(--mz-print)] text-[10px] font-semibold text-[var(--mz-red)]">%{Math.round(conf * 100)}</sup>
      </button>
    );
  }
  return (
    <span className={`${hand} mz-write`} tabIndex={-1} {...hover}>
      {text}
    </span>
  );
}

function Voucher({
  doc,
  ds,
  found,
  pencil,
  checks: list,
  dup,
  canSign,
  nextNo,
  threshold,
  dispatch,
  onHover,
}: {
  doc: Doc;
  ds: DocState;
  found: Cell[];
  pencil: Cell[];
  checks: { key: string; label: string; ok: boolean }[];
  dup: boolean;
  canSign: boolean;
  nextNo: number;
  threshold: number;
  dispatch: (a: Action) => void;
  onHover: (f: FieldKey | null) => void;
}) {
  const b = booking[doc.id];
  const editable = ds.status === "review";
  const cell = (c: Cell, text: string, edit: string, align: "left" | "right" = "left") => (
    <Written
      align={align}
      cell={c}
      conf={c === "account" ? b.expense.conf : doc.fields[c].conf}
      edit={edit}
      editable={editable}
      key={`${doc.id}-${c}`}
      onHover={onHover}
      onWrite={(v) => dispatch({ type: "write", id: doc.id, cell: c, value: v })}
      pencil={pencil.includes(c)}
      shown={found.includes(c)}
      text={text}
    />
  );
  const amount = (k: FieldKey) => `${money(toNumber(ds.values[k]))}`;
  const debit = toNumber(ds.values.matrah) + toNumber(ds.values.kdv);
  const credit = toNumber(ds.values.total);
  const all = found.length === order.length;
  const no = ds.posted ?? nextNo;

  return (
    <section
      aria-label="Mahsup fişi"
      className="relative bg-[var(--mz-voucher)] p-5 pl-9 text-[#1c2a22] shadow-[0_20px_36px_-20px_rgba(0,0,0,.75)] sm:p-7 sm:pl-12"
    >
      {/* Binder holes: vouchers are filed in a ring binder. */}
      <span aria-hidden="true" className="absolute top-14 left-3 size-3.5 rounded-full bg-[var(--mz-blotter)] sm:left-4" />
      <span aria-hidden="true" className="absolute bottom-14 left-3 size-3.5 rounded-full bg-[var(--mz-blotter)] sm:left-4" />

      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-[var(--mz-form)] pb-2 text-[var(--mz-form)]">
        <h2 className="text-xl font-bold tracking-[0.2em]">MAHSUP FİŞİ</h2>
        <p className="text-sm font-semibold">
          No <span className="font-[family-name:var(--mz-hand)] text-base text-[var(--mz-ink)]">{String(no).padStart(4, "0")}</span>
        </p>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 font-semibold text-[var(--mz-form)]">Tarih</dt>
          <dd className="min-w-0">{cell("date", ds.values.date, ds.values.date)}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 font-semibold text-[var(--mz-form)]">Belge no</dt>
          <dd className="min-w-0">{cell("no", ds.values.no, ds.values.no)}</dd>
        </div>
        <div className="flex items-baseline gap-2 sm:col-span-2">
          <dt className="shrink-0 font-semibold text-[var(--mz-form)]">Satıcı VKN</dt>
          <dd className="min-w-0">{cell("vkn", ds.values.vkn, ds.values.vkn)}</dd>
        </div>
      </dl>

      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-[var(--mz-form)] text-left text-[var(--mz-form)]">
            <th className="py-1.5 font-semibold" scope="col">
              Hesap
            </th>
            <th className="w-[27%] border-l border-[var(--mz-form)] py-1.5 pr-1 text-right font-semibold" scope="col">
              Borç
            </th>
            <th className="w-[27%] border-l border-[var(--mz-form)] py-1.5 pr-1 text-right font-semibold" scope="col">
              Alacak
            </th>
          </tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-[var(--mz-form)]/35 [&_td]:py-2.5 [&_td]:align-top">
          <tr>
            <td className="pr-2">
              <span className="flex flex-wrap items-baseline gap-x-2">
                {cell("account", ds.account, ds.account)}
                <span className={found.includes("account") ? "" : "invisible"}>{accountName(ds.account)}</span>
              </span>
              <span className="block text-xs text-[#4b5a50]">{b.memo}</span>
            </td>
            <td className="border-l border-[var(--mz-form)]/60 pr-1 text-right">{cell("matrah", amount("matrah"), ds.values.matrah, "right")}</td>
            <td className="border-l border-[var(--mz-form)]/60" />
          </tr>
          <tr>
            <td className="pr-2">
              <span className="font-[family-name:var(--mz-hand)] text-[1.08em] text-[var(--mz-ink)]">191</span> İndirilecek KDV
              <span className="block text-xs text-[#4b5a50]">KDV %{doc.rate}</span>
            </td>
            <td className="border-l border-[var(--mz-form)]/60 pr-1 text-right">{cell("kdv", amount("kdv"), ds.values.kdv, "right")}</td>
            <td className="border-l border-[var(--mz-form)]/60" />
          </tr>
          <tr>
            <td className="pr-2">
              <span className="font-[family-name:var(--mz-hand)] text-[1.08em] text-[var(--mz-ink)]">{b.pay}</span> {accountName(b.pay)}
              <span className="block text-xs">{cell("seller", ds.values.seller, ds.values.seller)}</span>
            </td>
            <td className="border-l border-[var(--mz-form)]/60" />
            <td className="border-l border-[var(--mz-form)]/60 pr-1 text-right">{cell("total", amount("total"), ds.values.total, "right")}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t-[3px] border-double border-[var(--mz-red)] font-semibold">
            <td className="py-2 tracking-[0.12em] text-[var(--mz-form)]">TOPLAM</td>
            <td className="border-l border-[var(--mz-form)]/60 py-2 pr-1 text-right font-[family-name:var(--mz-hand)] text-[1.08em] text-[var(--mz-ink)] tabular-nums">{all ? money(debit) : ""}</td>
            <td className="border-l border-[var(--mz-form)]/60 py-2 pr-1 text-right font-[family-name:var(--mz-hand)] text-[1.08em] text-[var(--mz-ink)] tabular-nums">{all ? money(credit) : ""}</td>
          </tr>
        </tfoot>
      </table>

      {list.length > 0 && (
        <ul aria-label="Kontroller" className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
          {list.map((c) => (
            <li className="flex items-center gap-2" key={c.key}>
              <span aria-hidden="true" className={`grid size-4 shrink-0 place-items-center border border-[var(--mz-form)] bg-white font-[family-name:var(--mz-hand)] text-sm leading-none ${c.ok ? "text-[var(--mz-ink)]" : "text-[var(--mz-red)]"}`}>
                {c.ok ? "✓" : "✗"}
              </span>
              <span className={c.ok ? "" : "font-semibold text-[var(--mz-red)]"}>
                {c.label}
                <span className="sr-only">{c.ok ? ": tamam" : ": tutmuyor"}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid gap-4 border-t border-[var(--mz-form)] pt-3 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold text-[var(--mz-form)]">Hazırlayan</p>
          <p className="font-[family-name:var(--mz-hand)] text-lg text-[var(--mz-ink)]">{ds.status === "new" ? "" : "Mizan"}</p>
        </div>
        <div aria-live="polite">
          <p className="font-semibold text-[var(--mz-form)]">Onaylayan</p>
          {ds.status === "approved" && ds.by === "you" && (
            <svg aria-label="İmzanız" className="h-10 w-40 text-[var(--mz-ink)]" role="img" viewBox="0 0 160 40">
              <motion.path
                animate={{ pathLength: 1 }}
                d="M4 30 C 14 6, 22 6, 24 24 S 34 34, 42 16 S 52 6, 56 22 S 66 36, 76 18 C 82 8, 90 10, 92 22 C 94 30, 104 30, 112 20 S 130 12, 156 18"
                fill="none"
                initial={{ pathLength: 0 }}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </svg>
          )}
          {ds.status === "approved" && ds.by === "auto" && (
            <p className="font-[family-name:var(--mz-hand)] text-lg text-[var(--mz-pencil)]">gerek yok · her satır %{Math.round(threshold * 100)} üstünde</p>
          )}
          {ds.status === "review" && !dup && (
            <>
              <button
                className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-[1px] bg-[var(--mz-ink)] px-5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[var(--mz-pencil)]/60"
                disabled={!canSign}
                onClick={() => dispatch({ type: "approve", id: doc.id })}
                type="button"
              >
                İmzala ve deftere işle
              </button>
              {!canSign && (
                <p className="mt-1.5 text-xs">
                  {pencil.length ? `Kurşun kalemdeki ${pencil.length} yeri kontrol edip mürekkeple yazın.` : "Kırmızı işaretli kontrolü düzeltin."}
                </p>
              )}
            </>
          )}
          {ds.status === "review" && dup && (
            <>
              <p className="mt-1 text-[var(--mz-red)]">Bu belge defterde var; ikinci kez işlenmemeli.</p>
              <button className="mt-2 inline-flex min-h-11 items-center rounded-[1px] border-2 border-[var(--mz-red)] px-5 font-semibold text-[var(--mz-red)]" onClick={() => dispatch({ type: "skip", id: doc.id })} type="button">
                Evrakı ayır
              </button>
            </>
          )}
        </div>
      </div>

      {(ds.status === "approved" || ds.status === "skipped") && (
        <motion.span
          animate={{ opacity: 0.85, scale: 1 }}
          aria-hidden="true"
          className={`pointer-events-none absolute top-24 right-5 -rotate-[9deg] rounded-[10px] border-[3px] px-4 py-2 text-center text-lg leading-tight font-bold tracking-[0.12em] mix-blend-multiply ${ds.status === "skipped" ? "border-[var(--mz-red)] text-[var(--mz-red)]" : "border-[var(--mz-stamp)] text-[var(--mz-stamp)]"}`}
          initial={{ opacity: 0, scale: 1.6 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          {ds.status === "skipped" ? "MÜKERRER" : ds.by === "auto" ? "KENDİLİĞİNDEN İŞLENDİ" : "DEFTERE İŞLENDİ"}
          <span className="block text-xs tracking-[0.2em]">{ds.status === "skipped" ? "İŞLENMEDİ" : `MADDE ${ds.posted}`}</span>
        </motion.span>
      )}
    </section>
  );
}

/** The journal book: every posted voucher, three lines each, with running totals. */
function Journal({ journal, sent, onSend }: { journal: Posted[]; sent: boolean; onSend: () => void }) {
  const debit = journal.reduce((n, p) => n + p.lines.reduce((m, l) => m + l.debit, 0), 0);
  const credit = journal.reduce((n, p) => n + p.lines.reduce((m, l) => m + l.credit, 0), 0);
  const vat = journal.reduce((n, p) => n + p.lines.filter((l) => l.code === "191").reduce((m, l) => m + l.debit, 0), 0);

  function csv() {
    const rows = [["Madde", "Tarih", "Belge", "Hesap", "Hesap adı", "Açıklama", "Borç", "Alacak"], ...journal.flatMap((p) => p.lines.map((l) => [String(p.no), p.date, p.doc, l.code, accountName(l.code), l.memo, l.debit ? money(l.debit) : "", l.credit ? money(l.credit) : ""]))];
    const text = "﻿" + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "yevmiye-eylul-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section aria-labelledby="mz-journal" className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold" id="mz-journal">
            Yevmiye defteri
          </h2>
          <p className="mt-1 text-sm opacity-75">Eylül 2026 · her fiş üç satır: gider, KDV ve ödeme</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex min-h-11 items-center gap-2 rounded-[1px] border border-[var(--mz-light)]/60 px-4 font-semibold hover:bg-[var(--mz-light)] hover:text-[var(--mz-blotter)]" onClick={csv} type="button">
            <Download aria-hidden="true" className="size-4" /> Dökümü indir (CSV)
          </button>
          <button className="inline-flex min-h-11 items-center gap-2 rounded-[1px] bg-[var(--mz-light)] px-4 font-semibold text-[var(--mz-blotter)]" onClick={onSend} type="button">
            <Send aria-hidden="true" className="size-4" /> Mali müşavire gönder
          </button>
        </div>
      </div>
      {sent && (
        <p className="mt-2 text-sm" role="status">
          Mali müşavire gönderildi. (Örnek; bir şey gönderilmedi.)
        </p>
      )}

      <div className="mt-5 overflow-x-auto bg-[var(--mz-page)] text-[#1f2530] shadow-[0_20px_36px_-20px_rgba(0,0,0,.75)]" role="region" aria-label="Yevmiye kayıtları" tabIndex={0}>
        <table className="w-full border-collapse sm:min-w-[640px] text-sm [&_td]:border-b [&_td]:border-[rgba(31,58,147,.18)] [&_td]:px-3 [&_td]:py-2">
          <thead>
            <tr className="border-b-2 border-[var(--mz-red)] text-left text-xs tracking-[0.12em] text-[#6b7280]">
              <th className="w-16 px-3 py-2 font-semibold" scope="col">
                MADDE
              </th>
              <th className="hidden w-28 px-3 py-2 font-semibold sm:table-cell" scope="col">
                TARİH
              </th>
              <th className="px-3 py-2 font-semibold" scope="col">
                HESAP
              </th>
              <th className="hidden px-3 py-2 font-semibold sm:table-cell" scope="col">
                AÇIKLAMA
              </th>
              <th className="border-l-[3px] border-double border-[var(--mz-red)]/60 px-3 py-2 text-right font-semibold sm:w-32" scope="col">
                BORÇ
              </th>
              <th className="border-l-[3px] border-double border-[var(--mz-red)]/60 px-3 py-2 text-right font-semibold sm:w-32" scope="col">
                ALACAK
              </th>
            </tr>
          </thead>
          <tbody className="font-[family-name:var(--mz-hand)] text-[15px] text-[var(--mz-ink)]">
            {journal.map((p) =>
              p.lines.map((l, i) => (
                <tr className={p.no > 2 ? "mz-write" : ""} key={`${p.no}-${i}`}>
                  <td className="font-[family-name:var(--mz-print)] font-semibold">{i === 0 ? p.no : ""}</td>
                  <td className="hidden sm:table-cell">{i === 0 ? p.date : ""}</td>
                  <td className={l.credit ? "pl-8" : ""}>
                    {l.code} {accountName(l.code)}
                  </td>
                  <td className="hidden sm:table-cell">
                    {l.memo}
                    {i === 0 && p.by === "auto" && <span className="ml-2 font-[family-name:var(--mz-print)] text-xs text-[#6b7280]">(kendiliğinden)</span>}
                  </td>
                  <td className="border-l-[3px] border-double border-[var(--mz-red)]/60 text-right tabular-nums">{l.debit ? money(l.debit) : ""}</td>
                  <td className="border-l-[3px] border-double border-[var(--mz-red)]/60 text-right tabular-nums">{l.credit ? money(l.credit) : ""}</td>
                </tr>
              )),
            )}
          </tbody>
          <tfoot className="font-[family-name:var(--mz-print)] font-semibold">
            <tr className="border-t-[3px] border-double border-[var(--mz-red)]">
              <td className="px-3 py-3 sm:hidden" colSpan={2}>
                Nakli yekûn
              </td>
              <td className="hidden px-3 py-3 sm:table-cell" colSpan={4}>
                Nakli yekûn
              </td>
              <td className="border-l-[3px] border-double border-[var(--mz-red)]/60 px-3 py-3 text-right tabular-nums">{money(debit)}</td>
              <td className="border-l-[3px] border-double border-[var(--mz-red)]/60 px-3 py-3 text-right tabular-nums">{money(credit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-4 text-lg">
        191 İndirilecek KDV bakiyesi:{" "}
        <b className="tabular-nums">
          {money(vat)} ₺
        </b>
      </p>
    </section>
  );
}
