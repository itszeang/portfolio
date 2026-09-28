"use client";

import { UnsplashPhoto } from "@/demos/shared/unsplash";
import { BadgeCheck, BedDouble, Building2, MapPin, Ruler, X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  type Deal,
  type Destination,
  type Listing,
  type Loan,
  commute,
  defaultLoan,
  destinations,
  listings,
  monthly,
  short,
  tl,
  toPlace,
} from "./data";
import { images } from "./theme";

const ROOMS = ["1+0", "1+1", "2+1", "3+1", "4+1"];

function Verified() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--esik-muted)]">
      <BadgeCheck aria-hidden="true" className="size-3.5" /> EİDS ile doğrulandı
    </span>
  );
}

const chip = (on: boolean) =>
  `min-h-9 rounded-md px-3 text-xs font-semibold tracking-wide uppercase transition-colors ${on ? "bg-[var(--esik-ink)] text-white" : "bg-[var(--esik-card)] hover:bg-[var(--esik-cream)]"}`;

export function SearchApp() {
  const [deal, setDeal] = useState<Deal | "Tümü">("Tümü");
  const [rooms, setRooms] = useState<string[]>([]);
  const [to, setTo] = useState<Destination>("Alsancak");
  const [budget, setBudget] = useState(200_000);
  const [sort, setSort] = useState<"cost" | "commute">("cost");
  const [loan, setLoan] = useState<Loan>(defaultLoan);
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    return listings
      .map((l) => ({ l, m: monthly(l, loan), min: commute(l.district, to) }))
      .filter(({ l, m }) => (deal === "Tümü" || l.deal === deal) && (rooms.length === 0 || rooms.includes(l.rooms)) && m.total <= budget)
      .sort((a, b) => (sort === "cost" ? a.m.total - b.m.total : a.min - b.min));
  }, [deal, rooms, to, budget, sort, loan]);

  const open = results.find((r) => r.l.id === openId) ?? null;

  return (
    <div>
      {/* Filters */}
      <div className="rounded-2xl bg-[var(--esik-bg)] p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto]">
          <div>
            <p className="text-xs font-semibold text-[var(--esik-muted)]">İlan türü</p>
            <div className="mt-2 flex gap-2">
              {(["Tümü", "Satılık", "Kiralık"] as const).map((d) => (
                <button aria-pressed={deal === d} className={chip(deal === d)} key={d} onClick={() => setDeal(d)} type="button">
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--esik-muted)]">Oda sayısı</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROOMS.map((r) => (
                <button
                  aria-pressed={rooms.includes(r)}
                  className={chip(rooms.includes(r))}
                  key={r}
                  onClick={() => setRooms((x) => (x.includes(r) ? x.filter((y) => y !== r) : [...x, r]))}
                  type="button"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--esik-muted)]" htmlFor="esik-to">
              Her gün gittiğin yer
            </label>
            <select
              className="mt-2 block min-h-9 w-full rounded-md border-0 bg-[var(--esik-card)] px-3 text-sm font-medium"
              id="esik-to"
              onChange={(e) => setTo(e.target.value as Destination)}
              value={to}
            >
              {destinations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <label className="text-xs font-semibold text-[var(--esik-muted)]" htmlFor="esik-budget">
            Aylık en fazla
          </label>
          <input
            className="h-10 min-w-[180px] flex-1 accent-[var(--esik-ink)]"
            id="esik-budget"
            max={200_000}
            min={20_000}
            onChange={(e) => setBudget(Number(e.target.value))}
            step={5_000}
            type="range"
            value={budget}
          />
          <span className="min-w-28 text-right font-semibold tabular-nums">{tl(budget)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--esik-muted)]" aria-live="polite">
          <span className="font-semibold text-[var(--esik-ink)]">{results.length} ilan</span> · {to} için yol süresiyle
        </p>
        <div className="flex gap-2 text-sm">
          <button aria-pressed={sort === "cost"} className={chip(sort === "cost")} onClick={() => setSort("cost")} type="button">
            Aylık maliyete göre
          </button>
          <button aria-pressed={sort === "commute"} className={chip(sort === "commute")} onClick={() => setSort("commute")} type="button">
            Yol süresine göre
          </button>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[var(--esik-line)] p-8 text-center text-[var(--esik-muted)] sm:col-span-2 lg:col-span-3">
            Bu ölçütlere uyan ilan yok. Bütçeyi artır ya da oda seçimini kaldır.
          </li>
        )}
        {results.map(({ l, m, min }) => (
          <li key={l.id}>
            <button className="group block w-full overflow-hidden rounded-2xl bg-[var(--esik-card)] text-left shadow-[0_1px_2px_rgba(22,35,43,.06)] transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(22,35,43,.45)]" onClick={() => setOpenId(l.id)} type="button">
              <span className="relative block aspect-[16/11] overflow-hidden">
                <UnsplashPhoto className="transition-transform duration-500 group-hover:scale-[1.03]" image={images[l.id as keyof typeof images]} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <span className="absolute top-3 right-3 flex gap-1.5 text-[11px] font-semibold tracking-wide uppercase">
                  <span className="rounded-md bg-[var(--esik-cream)] px-2 py-1">{l.rooms}</span>
                  <span className="rounded-md bg-white px-2 py-1">{l.deal}</span>
                </span>
                <span className="absolute bottom-3 left-3 rounded-full bg-[var(--esik-ink)]/85 px-3 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur">
                  {toPlace(to)} {min} dk
                </span>
              </span>
              <span className="block p-4">
                <span className="block truncate font-medium">{l.title}</span>
                <span className="mt-1 flex items-center gap-1 text-sm text-[var(--esik-muted)]">
                  <MapPin aria-hidden="true" className="size-3.5" /> {l.district}
                </span>
                <span className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--esik-line)] pt-3 text-sm text-[var(--esik-muted)]">
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Ruler aria-hidden="true" className="size-3.5" /> {l.net}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble aria-hidden="true" className="size-3.5" /> {l.rooms.split("+")[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 aria-hidden="true" className="size-3.5" /> {l.floor === 0 ? "B" : l.floor}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[10px] tracking-wide uppercase">Aylık toplam</span>
                    <span className="block font-semibold text-[var(--esik-ink)] tabular-nums">{tl(m.total)}</span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && <DetailDialog key={open.l.id} listing={open.l} loan={loan} min={open.min} onClose={() => setOpenId(null)} setLoan={setLoan} to={to} />}
    </div>
  );
}

/** The listing's full breakdown in a modal dialog (native <dialog>: focus trap and Esc for free). */
function DetailDialog({ onClose, ...props }: { listing: Listing; loan: Loan; setLoan: (x: Loan) => void; to: Destination; min: number; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      aria-label={props.listing.title}
      className="m-auto max-h-[92dvh] w-[min(980px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl bg-[var(--esik-card)] p-0 text-[var(--esik-ink)] backdrop:bg-[#16232B]/55 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      onClose={onClose}
      ref={ref}
    >
      <div className="grid max-h-[92dvh] overflow-y-auto md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[4/3] md:sticky md:top-0 md:aspect-auto md:h-[92dvh]">
          <UnsplashPhoto image={images[props.listing.id as keyof typeof images]} sizes="(min-width: 768px) 45vw, 100vw" />
        </div>
        <div className="relative">
          <button aria-label="Kapat" className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-[var(--esik-bg)] hover:bg-[var(--esik-cream)]" onClick={() => ref.current?.close()} type="button">
            <X aria-hidden="true" className="size-4" />
          </button>
          <Detail {...props} />
        </div>
      </div>
    </dialog>
  );
}

function Detail({ listing: l, loan, setLoan, to, min }: { listing: Listing; loan: Loan; setLoan: (x: Loan) => void; to: Destination; min: number }) {
  const m = monthly(l, loan);
  const parts = [
    { label: l.deal === "Kiralık" ? "Kira" : "Kredi taksiti", value: m.base, color: "#16232B" },
    { label: "Aidat", value: m.dues, color: "#7FA8B6" },
    { label: "Fatura (tahmini)", value: m.utilities, color: "#F2C879" },
  ];
  return (
    <div className="p-5 sm:p-7">
      <p className="text-xs text-[var(--esik-muted)]">
        {l.id} · {l.district}
      </p>
      <h3 className="mt-1 pr-12 text-3xl font-medium tracking-[-0.03em]">{l.title}</h3>
      <div className="mt-2">
        <Verified />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {[
          ["Brüt / net", `${l.gross} / ${l.net} m²`],
          ["Kat", `${l.floor === 0 ? "Bahçe" : l.floor} / ${l.floors}`],
          ["Bina yaşı", `${l.age}`],
          ["Isınma", l.heating],
          ["Krediye uygun", l.deal === "Satılık" ? (l.credit ? "Evet" : "Hayır") : "—"],
          ["Yol", `${toPlace(to)} ${min} dk`],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] text-[var(--esik-muted)]">{k}</dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-[var(--esik-line)] pt-5">
        <p className="text-xs text-[var(--esik-muted)]">Aylık toplam</p>
        <p className="text-5xl font-medium tracking-[-0.04em] tabular-nums">{tl(m.total)}</p>
        <div aria-hidden="true" className="mt-4 flex h-3 overflow-hidden rounded-full">
          {parts.map((p) => (
            <span key={p.label} style={{ width: `${(p.value / m.total) * 100}%`, background: p.color }} />
          ))}
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {parts.map((p) => (
            <li className="flex items-center justify-between gap-3" key={p.label}>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: p.color }} />
                {p.label}
              </span>
              <span className="tabular-nums">{tl(p.value)}</span>
            </li>
          ))}
        </ul>
      </div>

      {l.deal === "Satılık" && (
        <div className="mt-6 space-y-4 border-t border-[var(--esik-line)] pt-5 text-sm">
          <p className="font-semibold">Kredi hesabı</p>
          <Slider format={(v) => `%${Math.round(v * 100)}`} label="Peşinat" max={0.6} min={0.2} onChange={(v) => setLoan({ ...loan, down: v })} step={0.05} value={loan.down} />
          <Slider format={(v) => `${v} ay`} label="Vade" max={180} min={36} onChange={(v) => setLoan({ ...loan, months: v })} step={12} value={loan.months} />
          <Slider format={(v) => `%${v.toLocaleString("tr-TR")}`} label="Aylık faiz" max={4} min={1.5} onChange={(v) => setLoan({ ...loan, rate: v })} step={0.01} value={loan.rate} />
          <p className="text-xs leading-5 text-[var(--esik-muted)]">
            Peşinat {short(l.price * loan.down)}. Faiz ve fatura tutarları örnektir; kesin teklif için bankanızla görüşün.
          </p>
        </div>
      )}

      <Viewing listingId={l.id} />
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  const id = `esik-${label}`;
  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor={id}>{label}</label>
        <span className="font-semibold tabular-nums">{format(value)}</span>
      </div>
      <input className="mt-1 h-9 w-full accent-[var(--esik-ink)]" id={id} max={max} min={min} onChange={(e) => onChange(Number(e.target.value))} step={step} type="range" value={value} />
    </div>
  );
}

function Viewing({ listingId }: { listingId: string }) {
  const days = useMemo(() => {
    const out: { key: string; label: string }[] = [];
    const d = new Date();
    for (let i = 1; out.length < 4; i++) {
      const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (x.getDay() === 0) continue;
      out.push({ key: x.toISOString().slice(0, 10), label: x.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" }) });
    }
    return out;
  }, []);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!day || !time) return setError("Önce bir gün ve saat seç.");
    if (!/^0?5\d{9}$/.test(phone.replace(/\D/g, ""))) return setError("Telefonu 05XX XXX XX XX biçiminde yaz.");
    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <p aria-live="polite" className="mt-6 rounded-xl bg-[var(--esik-cream)] p-4 text-sm leading-6">
        {listingId} için yerinde görme talebin alındı. Danışman aynı gün arayıp saati teyit eder. (Örnek; talep gönderilmedi.)
      </p>
    );
  }

  return (
    <form className="mt-6 border-t border-[var(--esik-line)] pt-5" noValidate onSubmit={submit}>
      <p className="text-sm font-semibold">Yerinde görme</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {days.map((d) => (
          <button aria-pressed={day === d.key} className={chip(day === d.key)} key={d.key} onClick={() => setDay(d.key)} type="button">
            {d.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {["10:00", "13:00", "17:30"].map((t) => (
          <button aria-pressed={time === t} className={chip(time === t)} key={t} onClick={() => setTime(t)} type="button">
            {t}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-xs font-semibold text-[var(--esik-muted)]" htmlFor="esik-phone">
        Cep telefonu
      </label>
      <input
        aria-describedby={error ? "esik-view-err" : undefined}
        className="mt-1 min-h-11 w-full rounded-lg border border-[var(--esik-line)] px-4 text-sm outline-none focus:border-[var(--esik-ink)]"
        id="esik-phone"
        inputMode="tel"
        onChange={(e) => setPhone(e.target.value)}
        placeholder="0532 000 00 00"
        value={phone}
      />
      {error && (
        <p className="mt-2 text-sm text-[#b3261e]" id="esik-view-err">
          {error}
        </p>
      )}
      <button className="mt-4 min-h-11 w-full rounded-lg bg-[var(--esik-ink)] px-5 text-sm font-semibold text-white hover:bg-black" type="submit">
        Görme talebi gönder
      </button>
    </form>
  );
}
