"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type Booking,
  SITE_PATH,
  categories,
  dayNames,
  dayShort,
  freeSlots,
  hhmm,
  hours,
  isoDay,
  loadBookings,
  sampleBusy,
  saveBookings,
  services,
  staff,
  tl,
} from "./data";

const STEPS = ["Hizmet", "Gün ve saat", "Bilgiler"] as const;

function nextDays(count: number) {
  const out: Date[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
}

const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const PHONE = /^0?5\d{9}$/;

const btn =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nara-rose)] disabled:cursor-not-allowed disabled:opacity-40";

export function NaraBooking() {
  const params = useSearchParams();
  const [view, setView] = useState<"musteri" | "panel">("musteri");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Booking | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [staffFilter, setStaffFilter] = useState<string | null>(null);
  // Day the panel opens on: the just-made booking's day, else the next open day.
  const [panelDay, setPanelDay] = useState<string | null>(null);

  // Bookings and the link's preselection only exist in the browser.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from localStorage and the URL */
    setBookings(loadBookings());
    const s = params.get("service");
    const st = params.get("staff");
    const d = params.get("day");
    const t = params.get("time");
    if (st) setStaffFilter(st);
    if (s && services.some((x) => x.id === s)) {
      setServiceId(s);
      if (d && t) {
        setDay(d);
        setTime(Number(t));
        setStep(2);
      } else setStep(1);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [params]);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const person = service ? staff.find((p) => p.category === service.category)! : null;
  const days = useMemo(() => nextDays(14), []);
  const slots = service && day && person ? freeSlots(fromIso(day), person.id, service.minutes, bookings) : [];

  function confirm() {
    const e: typeof errors = {};
    if (name.trim().length < 2) e.name = "Adını yaz; en az iki harf.";
    if (!PHONE.test(phone.replace(/\D/g, ""))) e.phone = "Telefonu 05XX XXX XX XX biçiminde yaz.";
    setErrors(e);
    if (Object.keys(e).length || !service || !person || !day || time === null) return;
    const b: Booking = {
      id: `${day}-${time}-${person.id}`,
      day,
      start: time,
      minutes: service.minutes,
      serviceId: service.id,
      staffId: person.id,
      name: name.trim(),
      phone,
    };
    const list = [...bookings, b];
    setBookings(list);
    saveBookings(list);
    setDone(b);
  }

  function restart() {
    setDone(null);
    setServiceId(null);
    setDay(null);
    setTime(null);
    setStep(0);
    setName("");
    setPhone("");
    setErrors({});
  }

  function cancel(id: string) {
    const list = bookings.filter((b) => b.id !== id);
    setBookings(list);
    saveBookings(list);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 py-6">
        <Link className="font-[family-name:var(--nara-display)] text-2xl tracking-tight" href={SITE_PATH}>
          Nara<span className="text-[var(--nara-rose)]">.</span>
          <span className="ml-2 font-[family-name:var(--nara-body)] text-sm text-[var(--nara-muted)]">randevu</span>
        </Link>
        <div className="flex rounded-full bg-[var(--nara-paper)] p-1 text-sm" role="tablist">
          {(
            [
              ["musteri", "Müşteri görünümü"],
              ["panel", "İşletme paneli"],
            ] as const
          ).map(([id, label]) => (
            <button
              aria-selected={view === id}
              className={`min-h-10 rounded-full px-4 font-semibold transition-colors ${view === id ? "bg-[var(--nara-ink)] text-[var(--nara-paper)]" : "text-[var(--nara-muted)] hover:text-[var(--nara-ink)]"}`}
              key={id}
              onClick={() => setView(id)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {view === "panel" ? (
        <Panel bookings={bookings} days={days} initial={panelDay} key={panelDay ?? "next"} onCancel={cancel} />
      ) : done ? (
        <Confirmation
          booking={done}
          onPanel={() => {
            setPanelDay(done.day);
            setView("panel");
          }}
          onRestart={restart}
        />
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 pt-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="min-w-0">
            <ol className="flex flex-wrap gap-2 text-sm">
              {STEPS.map((label, i) => (
                <li key={label}>
                  <button
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 ${i === step ? "bg-[var(--nara-ink)] text-[var(--nara-paper)]" : i < step ? "bg-[var(--nara-paper)] text-[var(--nara-ink)]" : "text-[var(--nara-muted)]"}`}
                    disabled={i > step}
                    onClick={() => setStep(i)}
                    type="button"
                  >
                    <span className="tabular-nums">{i + 1}</span> {label}
                  </button>
                </li>
              ))}
            </ol>

            {step === 0 && (
              <section className="mt-8" aria-label="Hizmet seç">
                <h1 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Ne yaptırmak istersin?</h1>
                <div className="mt-8 space-y-8">
                  {categories
                    .filter((c) => !staffFilter || staff.find((p) => p.id === staffFilter)?.category === c.id)
                    .map((c) => (
                      <div key={c.id}>
                        <h2 className="text-sm font-semibold tracking-wide text-[var(--nara-muted)]">{c.name}</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {services
                            .filter((s) => s.category === c.id)
                            .map((s) => (
                              <button
                                className={`flex min-h-24 flex-col justify-between rounded-2xl border-2 p-4 text-left transition-colors ${serviceId === s.id ? "border-[var(--nara-rose)] bg-[var(--nara-paper)]" : "border-transparent bg-[var(--nara-paper)] hover:border-[var(--nara-ink)]/20"}`}
                                key={s.id}
                                onClick={() => {
                                  setServiceId(s.id);
                                  setTime(null);
                                  setStep(1);
                                }}
                                type="button"
                              >
                                <span className="font-semibold">{s.name}</span>
                                <span className="mt-3 text-sm text-[var(--nara-muted)] tabular-nums">
                                  {s.minutes} dk · {tl(s.price)}
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  {staffFilter && (
                    <button className="text-sm font-semibold text-[var(--nara-rose)] hover:underline" onClick={() => setStaffFilter(null)} type="button">
                      Tüm hizmetleri göster
                    </button>
                  )}
                </div>
              </section>
            )}

            {step === 1 && service && person && (
              <section className="mt-8" aria-label="Gün ve saat seç">
                <h1 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Ne zaman gelirsin?</h1>
                <p className="mt-3 text-[var(--nara-muted)]">
                  {person.name} ile {service.minutes} dakika.
                </p>
                <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
                  {days.map((d) => {
                    const closed = !hours[d.getDay()];
                    const iso = isoDay(d);
                    return (
                      <button
                        className={`flex min-w-[68px] shrink-0 flex-col items-center rounded-2xl px-3 py-3 transition-colors ${day === iso ? "bg-[var(--nara-ink)] text-[var(--nara-paper)]" : "bg-[var(--nara-paper)] hover:bg-white"} disabled:opacity-35`}
                        disabled={closed}
                        key={iso}
                        onClick={() => {
                          setDay(iso);
                          setTime(null);
                        }}
                        type="button"
                      >
                        <span className="text-xs">{dayShort[d.getDay()]}</span>
                        <span className="font-[family-name:var(--nara-display)] text-2xl tabular-nums">{d.getDate()}</span>
                        {closed && <span className="text-[10px]">kapalı</span>}
                      </button>
                    );
                  })}
                </div>
                {day && (
                  <div className="mt-6">
                    {slots.length === 0 ? (
                      <p className="rounded-2xl bg-[var(--nara-paper)] p-5 text-[var(--nara-muted)]">
                        Bu gün {person.name} için boş saat kalmadı. Başka bir gün seç.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {slots.map((t) => (
                          <button
                            aria-pressed={time === t}
                            className={`min-h-12 rounded-xl font-semibold tabular-nums transition-colors ${time === t ? "bg-[var(--nara-rose)] text-white" : "bg-[var(--nara-butter)] hover:bg-[var(--nara-rose)] hover:text-white"}`}
                            key={t}
                            onClick={() => setTime(t)}
                            type="button"
                          >
                            {hhmm(t)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  className={`${btn} mt-8 bg-[var(--nara-ink)] text-[var(--nara-paper)] hover:bg-[var(--nara-rose)]`}
                  disabled={!day || time === null}
                  onClick={() => setStep(2)}
                  type="button"
                >
                  Devam et
                </button>
              </section>
            )}

            {step === 2 && service && (
              <section className="mt-8 max-w-md" aria-label="Bilgilerin">
                <h1 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Son olarak sen</h1>
                <p className="mt-3 text-sm text-[var(--nara-muted)]">
                  Bu bir demo: yazdıkların yalnızca bu tarayıcıda kalır, hiçbir yere gönderilmez.
                </p>
                <label className="mt-8 block text-sm font-semibold" htmlFor="nara-name">
                  Adın
                </label>
                <input
                  aria-describedby={errors.name ? "nara-name-err" : undefined}
                  aria-invalid={!!errors.name}
                  autoComplete="off"
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-transparent bg-[var(--nara-paper)] px-4 outline-none focus:border-[var(--nara-rose)]"
                  id="nara-name"
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((x) => ({ ...x, name: undefined }));
                  }}
                  placeholder="Ayşe"
                  value={name}
                />
                {errors.name && <p className="mt-2 text-sm text-[var(--nara-rose)]" id="nara-name-err">{errors.name}</p>}
                <label className="mt-6 block text-sm font-semibold" htmlFor="nara-phone">
                  Cep telefonu
                </label>
                <input
                  aria-describedby={errors.phone ? "nara-phone-err" : "nara-phone-help"}
                  aria-invalid={!!errors.phone}
                  autoComplete="off"
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-transparent bg-[var(--nara-paper)] px-4 tabular-nums outline-none focus:border-[var(--nara-rose)]"
                  id="nara-phone"
                  inputMode="tel"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((x) => ({ ...x, phone: undefined }));
                  }}
                  placeholder="0532 000 00 00"
                  value={phone}
                />
                {errors.phone ? (
                  <p className="mt-2 text-sm text-[var(--nara-rose)]" id="nara-phone-err">{errors.phone}</p>
                ) : (
                  <p className="mt-2 text-xs text-[var(--nara-muted)]" id="nara-phone-help">Hatırlatma bu numaraya gider.</p>
                )}
                <button className={`${btn} mt-8 w-full bg-[var(--nara-rose)] text-white hover:bg-[var(--nara-ink)]`} onClick={confirm} type="button">
                  Randevuyu onayla
                </button>
              </section>
            )}
          </div>

          <aside className="h-fit rounded-[28px] bg-[var(--nara-paper)] p-6 lg:sticky lg:top-6">
            <p className="font-[family-name:var(--nara-display)] text-xl">Randevun</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Hizmet" value={service?.name} />
              <Row label="Uzman" value={person?.name} />
              <Row label="Gün" value={day ? fromIso(day).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) : undefined} />
              <Row label="Saat" value={time !== null && service ? `${hhmm(time)} – ${hhmm(time + service.minutes)}` : undefined} />
              <Row label="Tutar" value={service ? tl(service.price) : undefined} />
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[var(--nara-ink)]/8 pb-3 last:border-b-0">
      <dt className="text-[var(--nara-muted)]">{label}</dt>
      <dd className="text-right font-semibold">{value ?? "—"}</dd>
    </div>
  );
}

function Confirmation({ booking, onRestart, onPanel }: { booking: Booking; onRestart: () => void; onPanel: () => void }) {
  const s = services.find((x) => x.id === booking.serviceId)!;
  const when = fromIso(booking.day).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <section className="mx-auto max-w-xl pt-10 text-center" aria-live="polite">
      <p className="text-sm font-semibold text-[var(--nara-rose)]">Randevun alındı</p>
      <h1 className="mt-4 font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">
        {when}, {hhmm(booking.start)}
      </h1>
      <p className="mt-4 text-[var(--nara-muted)]">
        {s.name} · {staff.find((p) => p.id === booking.staffId)?.name}
      </p>

      <div className="mx-auto mt-10 max-w-sm rounded-[28px] bg-[var(--nara-ink)] p-5 text-left text-[var(--nara-paper)]">
        <p className="text-xs text-[var(--nara-paper)]/60">Hatırlatma örneği · randevudan bir gün önce</p>
        <p className="mt-3 rounded-2xl rounded-tl-sm bg-[var(--nara-paper)]/10 p-4 text-sm leading-6">
          Nara Studio: Merhaba {booking.name}, yarın {hhmm(booking.start)}&apos;da {s.name.toLocaleLowerCase("tr")} randevun var.
          Gelemeyeceksen İPTAL yazman yeterli.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button className={`${btn} bg-[var(--nara-ink)] text-[var(--nara-paper)] hover:bg-[var(--nara-rose)]`} onClick={onPanel} type="button">
          İşletme panelinde gör
        </button>
        <button className={`${btn} border border-[var(--nara-ink)]/20 hover:border-[var(--nara-ink)]`} onClick={onRestart} type="button">
          Yeni randevu
        </button>
      </div>
    </section>
  );
}

function Panel({
  bookings,
  days,
  initial,
  onCancel,
}: {
  bookings: Booking[];
  days: Date[];
  initial: string | null;
  onCancel: (id: string) => void;
}) {
  const [sel, setSel] = useState(() => initial ?? isoDay(days.find((d) => hours[d.getDay()]) ?? days[0]));
  const date = fromIso(sel);
  const h = hours[date.getDay()];
  const mine = bookings.filter((b) => b.day === sel).sort((a, b) => a.start - b.start);
  const rows = h ? Array.from({ length: (h.close - h.open) / 30 }, (_, i) => h.open + i * 30) : [];

  let busy = 0;
  staff.forEach((p) => (busy += sampleBusy(date, p.id).length));
  mine.forEach((b) => (busy += b.minutes / 30));
  const fill = rows.length ? Math.min(100, Math.round((busy / (rows.length * staff.length)) * 100)) : 0;

  return (
    <section className="pt-4" aria-label="İşletme paneli">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Günün takvimi</h1>
          <p className="mt-2 text-sm text-[var(--nara-muted)]">
            Pembe bloklar bu tarayıcıdan alınan randevular; griler örnek müşteriler.
          </p>
        </div>
        <p className="text-sm">
          Doluluk <span className="font-[family-name:var(--nara-display)] text-3xl tabular-nums">%{fill}</span>
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const iso = isoDay(d);
          const count = bookings.filter((b) => b.day === iso).length;
          return (
            <button
              className={`relative flex min-w-[64px] shrink-0 flex-col items-center rounded-2xl px-3 py-3 ${sel === iso ? "bg-[var(--nara-ink)] text-[var(--nara-paper)]" : "bg-[var(--nara-paper)]"}`}
              key={iso}
              onClick={() => setSel(iso)}
              type="button"
            >
              <span className="text-xs">{dayShort[d.getDay()]}</span>
              <span className="font-[family-name:var(--nara-display)] text-2xl tabular-nums">{d.getDate()}</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-[var(--nara-rose)] text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!h ? (
        <p className="mt-8 rounded-2xl bg-[var(--nara-paper)] p-6 text-[var(--nara-muted)]">Stüdyo bu gün kapalı.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[28px] bg-[var(--nara-paper)] p-4 sm:p-6">
          <div className="grid min-w-[520px] grid-cols-[56px_repeat(3,1fr)] gap-x-3">
            <span />
            {staff.map((p) => (
              <p className="pb-3 text-sm font-semibold" key={p.id}>
                {p.name} <span className="font-normal text-[var(--nara-muted)]">· {p.role.replace(" uzmanı", "")}</span>
              </p>
            ))}
            {rows.map((t) => (
              <PanelRow bookings={mine} date={date} key={t} onCancel={onCancel} t={t} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PanelRow({ t, date, bookings, onCancel }: { t: number; date: Date; bookings: Booking[]; onCancel: (id: string) => void }) {
  return (
    <>
      <span className="border-t border-[var(--nara-ink)]/8 py-1 text-xs tabular-nums text-[var(--nara-muted)]">{hhmm(t)}</span>
      {staff.map((p) => {
        const b = bookings.find((x) => x.staffId === p.id && x.start <= t && t < x.start + x.minutes);
        const sample = !b && sampleBusy(date, p.id).includes(t);
        return (
          <div className="min-h-9 border-t border-[var(--nara-ink)]/8 py-0.5" key={p.id}>
            {b ? (
              b.start === t && (
                <div className="flex h-full items-start justify-between gap-2 rounded-lg bg-[var(--nara-rose)] px-2 py-1 text-xs text-white">
                  <span>
                    <strong>{b.name}</strong> · {services.find((s) => s.id === b.serviceId)?.name}
                  </span>
                  <button className="shrink-0 underline" onClick={() => onCancel(b.id)} type="button">
                    İptal
                  </button>
                </div>
              )
            ) : sample ? (
              <div aria-label="Dolu (örnek)" className="h-full min-h-8 rounded-lg bg-[var(--nara-ink)]/10" />
            ) : null}
          </div>
        );
      })}
    </>
  );
}
