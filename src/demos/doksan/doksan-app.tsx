"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { before, type Day, FIXED_OFF, hh, HOURS, isoDay, KAPORA, type PitchId, pitches, positions, priceOf, takenAt, tl, week } from "./data";
import { LineupPitch } from "./lineup-pitch";

const subscribe = () => () => {};
const clientNow = () => {
  const d = new Date();
  return `${isoDay(d)}|${d.getHours()}`;
};
const serverNow = () => null;

const PHONE = /^0?5\d{9}$/;
const wide = "font-[family-name:var(--dk-display)] uppercase";
const field =
  "mt-1.5 block min-h-12 w-full rounded-lg border border-[var(--dk-ink)]/15 bg-white px-3.5 font-normal focus-visible:border-[var(--dk-turf)] focus-visible:outline-2 focus-visible:outline-[var(--dk-turf)]";

type Booking = { pitch: PitchId; day: Day; hour: number; fixed: boolean; team: string; captain: string; price: number; code: string };

export function DoksanApp() {
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  if (!now) return <p className="mx-auto max-w-6xl px-5 py-24 text-[var(--dk-muted)] sm:px-8">Saatler yükleniyor…</p>;
  const [iso, hour] = now.split("|");
  return <App nowHour={Number(hour)} todayIso={iso} />;
}

function App({ todayIso, nowHour }: { todayIso: string; nowHour: number }) {
  const days = useMemo(() => week(todayIso), [todayIso]);
  const [view, setView] = useState<"takim" | "tesis">("takim");
  const [pitch, setPitch] = useState<PitchId>("acik");
  const [dayIdx, setDayIdx] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [fixed, setFixed] = useState(false);
  const [team, setTeam] = useState("");
  const [captain, setCaptain] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const form = useRef<HTMLElement>(null);

  const day = days[dayIdx];
  const past = (d: Day, h: number) => d.offset === 0 && h <= nowHour;
  const mineAt = (d: Day, p: PitchId, h: number) =>
    !!booking && booking.pitch === p && booking.hour === h && (booking.day.iso === d.iso || (booking.fixed && booking.day.dow === d.dow && d.offset >= booking.day.offset));
  const status = (d: Day, p: PitchId, h: number) => (mineAt(d, p, h) ? "mine" : takenAt(d.iso, d.dow, p, h) ? "taken" : past(d, h) ? "past" : "free");
  const selectable = hour !== null && status(day, pitch, hour) === "free" ? hour : null;
  const price = selectable !== null ? priceOf(pitch, selectable) * (fixed ? 1 - FIXED_OFF : 1) : 0;

  const errors = {
    team: tried && team.trim().length < 2 ? "Takım adını yazın." : null,
    captain: tried && captain.trim().length < 2 ? "Kaptanın adını yazın." : null,
    phone: tried && !PHONE.test(phone.replace(/\D/g, "")) ? "Telefonu 05XX XXX XX XX biçiminde yazın." : null,
  };

  function book() {
    setTried(true);
    if (selectable === null || team.trim().length < 2 || captain.trim().length < 2 || !PHONE.test(phone.replace(/\D/g, ""))) return;
    setBooking({
      pitch,
      day,
      hour: selectable,
      fixed,
      team: team.trim(),
      captain: captain.trim(),
      price,
      code: `DK-${day.date.getDate()}${pitch === "acik" ? "1" : "2"}${String(selectable % 24).padStart(2, "0")}`,
    });
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--dk-muted)]">Takım olarak saha ayırın; tesis panelinde aynı hafta işletmenin gözünden görünür.</p>
        <div aria-label="Görünüm" className="flex rounded-xl bg-white p-1 text-sm font-semibold" role="group">
          {(
            [
              ["takim", "Takım"],
              ["tesis", "Tesis paneli"],
            ] as const
          ).map(([k, l]) => (
            <button aria-pressed={view === k} className={`min-h-10 rounded-lg px-4 transition-colors ${view === k ? "bg-[var(--dk-ink)] text-white" : "hover:bg-[var(--dk-bg)]"}`} key={k} onClick={() => setView(k)} type="button">
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        {view === "tesis" ? (
          <Facility booking={booking} days={days} past={past} status={status} />
        ) : booking ? (
          <Lineup booking={booking} onFacility={() => setView("tesis")} onNew={() => {
            setBooking(null);
            setHour(null);
            setTried(false);
          }} />
        ) : (
          <>
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="min-w-0">
                <div aria-label="Saha" className="grid gap-3 sm:grid-cols-2" role="group">
                  {pitches.map((p) => (
                    <button
                      aria-pressed={pitch === p.id}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-3 text-left transition-colors ${pitch === p.id ? "border-[var(--dk-ink)] bg-white" : "border-transparent bg-white/60 hover:bg-white"}`}
                      key={p.id}
                      onClick={() => setPitch(p.id)}
                      type="button"
                    >
                      <span aria-hidden="true" className={`relative h-12 w-18 shrink-0 overflow-hidden rounded-md ${p.id === "kapali" ? "bg-[var(--dk-turf-dark)]" : "bg-[var(--dk-turf)]"}`}>
                        <span className="absolute inset-1 rounded-sm border border-white/70" />
                        <span className="absolute inset-y-1 left-1/2 w-px bg-white/70" />
                        {p.id === "kapali" && <span className="absolute inset-x-0 -top-5 h-10 rounded-[50%] border-b-2 border-white/60" />}
                      </span>
                      <span>
                        <span className="block font-bold">{p.name}</span>
                        <span className="block text-sm text-[var(--dk-muted)]">{p.note}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <div aria-label="Gün" className="mt-6 flex gap-2 overflow-x-auto pb-1" role="group">
                  {days.map((d, i) => (
                    <button
                      aria-pressed={i === dayIdx}
                      className={`min-h-11 shrink-0 rounded-lg px-4 text-sm font-bold transition-colors ${i === dayIdx ? "bg-[var(--dk-ink)] text-white" : "bg-white hover:bg-white/70"}`}
                      key={d.iso}
                      onClick={() => {
                        setDayIdx(i);
                        setHour(null);
                      }}
                      type="button"
                    >
                      {d.short}
                    </button>
                  ))}
                </div>

                <ol aria-label={`${day.long}, ${pitches.find((p) => p.id === pitch)!.name}`} className="mt-5 overflow-hidden rounded-2xl bg-white">
                  {HOURS.map((h) => {
                    const s = status(day, pitch, h);
                    const t = takenAt(day.iso, day.dow, pitch, h);
                    const on = selectable === h;
                    const peak = h >= 19 && h <= 22;
                    return (
                      <li className={`border-b border-[var(--dk-ink)]/8 last:border-0 ${on ? "bg-[var(--dk-bib)]/12" : ""}`} key={h}>
                        <button
                          aria-pressed={on}
                          className={`grid min-h-16 w-full grid-cols-[4.6rem_minmax(0,1fr)_auto] items-center gap-3 px-4 text-left transition-colors sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] ${
                            s === "free" ? "hover:bg-[var(--dk-bg)]/60" : "cursor-not-allowed"
                          } ${on ? "shadow-[inset_4px_0_0_var(--dk-bib)]" : ""}`}
                          disabled={s !== "free"}
                          onClick={() => {
                            setHour(h);
                            // In the one-column layout the form is below the list: bring it up.
                            if (window.matchMedia("(max-width: 1023px)").matches) {
                              const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                              requestAnimationFrame(() => form.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
                            }
                          }}
                          type="button"
                        >
                          <span className={`${wide} text-lg tabular-nums sm:text-xl ${s === "free" ? "" : "text-[var(--dk-muted)]/60"}`}>{hh(h)}</span>
                          <span className="min-w-0">
                            {s === "free" && (
                              <span className="block text-sm">
                                <span className="font-semibold text-[var(--dk-turf-dark)]">Boş</span>
                                {peak && <span className="ml-2 rounded bg-[var(--dk-ink)] px-1.5 py-0.5 text-[10px] font-bold text-white">AKŞAM</span>}
                              </span>
                            )}
                            {s === "taken" && t && (
                              <span className="block truncate text-sm text-[var(--dk-muted)]">
                                {t.team}
                                {t.fixed && <span className="ml-2 rounded border border-[var(--dk-muted)]/40 px-1.5 text-[10px] font-bold">SABİT</span>}
                              </span>
                            )}
                            {s === "past" && <span className="block text-sm text-[var(--dk-muted)]/70">Geçti</span>}
                          </span>
                          <span className={`text-sm font-bold tabular-nums ${s === "free" ? "" : "text-[var(--dk-muted)]/50 line-through"}`}>{tl(priceOf(pitch, h))}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-3 text-xs text-[var(--dk-muted)]">Fiyatlar saatlik ve örnektir. Kapalı saha 200 ₺ fazladır.</p>
              </div>

              <aside aria-live="polite" className="scroll-mt-4 rounded-2xl bg-white p-5 sm:p-6 lg:sticky lg:top-6" ref={form}>
                {selectable === null ? (
                  <>
                    <p className={`${wide} text-lg`}>Saat seçin</p>
                    <p className="mt-2 text-sm text-[var(--dk-muted)]">Listeden boş bir saate dokunun. Her hafta aynı saatte oynuyorsanız sabit saat alın; %10 indirimli.</p>
                    <Rules />
                  </>
                ) : (
                  <form
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      book();
                    }}
                  >
                    <p className="text-xs font-bold tracking-[0.14em] text-[var(--dk-muted)] uppercase">{pitches.find((p) => p.id === pitch)!.name}</p>
                    <p className={`${wide} mt-1 text-2xl leading-tight`}>
                      {day.short} {hh(selectable)}
                    </p>
                    <p className="text-sm text-[var(--dk-muted)]">
                      {day.long}, {hh(selectable)}–{hh(selectable + 1)}
                    </p>

                    <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[var(--dk-bg)] p-3.5" htmlFor="dk-fixed">
                      <span>
                        <span className="block text-sm font-bold">Her hafta bu saat bizim</span>
                        <span className="block text-xs text-[var(--dk-muted)]">Sabit saat · %10 indirim · istediğiniz hafta bırakırsınız</span>
                      </span>
                      <input checked={fixed} className="size-5 shrink-0 accent-[var(--dk-turf)]" id="dk-fixed" onChange={(e) => setFixed(e.target.checked)} type="checkbox" />
                    </label>

                    <div className="mt-5 space-y-3">
                      <label className="block text-sm font-semibold" htmlFor="dk-team">
                        Takım adı
                        <input aria-invalid={!!errors.team} className={field} id="dk-team" onChange={(e) => setTeam(e.target.value)} placeholder="Örn. Salı Beyleri" value={team} />
                        {errors.team && <span className="mt-1 block font-normal text-[#C2410C]">{errors.team}</span>}
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <label className="block text-sm font-semibold" htmlFor="dk-captain">
                          Kaptan
                          <input aria-invalid={!!errors.captain} autoComplete="name" className={field} id="dk-captain" onChange={(e) => setCaptain(e.target.value)} value={captain} />
                          {errors.captain && <span className="mt-1 block font-normal text-[#C2410C]">{errors.captain}</span>}
                        </label>
                        <label className="block text-sm font-semibold" htmlFor="dk-phone">
                          Kaptanın telefonu
                          <input aria-invalid={!!errors.phone} autoComplete="tel" className={field} id="dk-phone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
                          {errors.phone && <span className="mt-1 block font-normal text-[#C2410C]">{errors.phone}</span>}
                        </label>
                      </div>
                    </div>

                    <dl className="mt-5 space-y-1.5 border-t border-dashed border-[var(--dk-ink)]/20 pt-4 text-sm">
                      <div className="flex justify-between">
                        <dt>Saha ücreti{fixed ? " (haftalık)" : ""}</dt>
                        <dd className="font-bold tabular-nums">{tl(price)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Şimdi kapora</dt>
                        <dd className="font-bold tabular-nums">{tl(KAPORA)}</dd>
                      </div>
                      <div className="flex justify-between text-[var(--dk-muted)]">
                        <dt>Kalan, sahada</dt>
                        <dd className="tabular-nums">{tl(price - KAPORA)}</dd>
                      </div>
                    </dl>

                    <CancelLine day={day} hour={selectable} />

                    <button className={`${wide} mt-6 min-h-14 w-full rounded-xl bg-[var(--dk-bib)] text-lg tracking-tight text-[var(--dk-ink)] transition-colors hover:bg-[var(--dk-ink)] hover:text-white`} type="submit">
                      Sahayı ayır
                    </button>
                    <p className="mt-2 text-xs text-[var(--dk-muted)]">Kapora bağlantısı onaydan sonra SMS ile gelir; 2 saat içinde yatırılmazsa saat boşa çıkar (örnek; ödeme alınmaz).</p>
                  </form>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Rules() {
  return (
    <ul className="mt-5 space-y-2 text-sm">
      {[
        ["Kapora", `${tl(KAPORA)}, maçtan 24 saat öncesine kadar iade edilir.`],
        ["Son 24 saat", "İptal ederseniz kapora yanar."],
        ["Gelmezseniz", "Saha ücretinin tamamı alınır."],
        ["Sahada", "Yelek, top ve duş ücretsiz. Krampon değil, halı saha ayakkabısı."],
      ].map(([k, v]) => (
        <li className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2" key={k}>
          <span className="font-bold">{k}</span>
          <span className="text-[var(--dk-muted)]">{v}</span>
        </li>
      ))}
    </ul>
  );
}

/** The cancellation rule as a line from now to kick-off. */
function CancelLine({ day, hour }: { day: Day; hour: number }) {
  const hoursAway = day.offset * 24 + hour; // rough; only used for proportions
  const freeShare = Math.max(0.08, Math.min(0.84, (hoursAway - 24) / hoursAway));
  return (
    <div className="mt-5">
      <p className="text-sm font-bold">İptal kuralı</p>
      <div aria-hidden="true" className="mt-2 flex h-2.5 overflow-hidden rounded-full">
        <span className="bg-[var(--dk-turf)]" style={{ width: `${freeShare * 100}%` }} />
        <span className="flex-1 bg-[var(--dk-bib)]" />
        <span className="w-2.5 bg-[var(--dk-ink)]" />
      </div>
      <ul className="mt-2 space-y-1 text-xs">
        <li className="flex gap-2">
          <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-[var(--dk-turf)]" />
          <span>
            Ücretsiz iptal ve kapora iadesi için son an: <b>{before(day, hour, 24)}</b>.
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-[var(--dk-bib)]" />
          <span>Son 24 saatte iptal: kapora yanar.</span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-[var(--dk-ink)]" />
          <span>Gelmezseniz saha ücretinin tamamı.</span>
        </li>
      </ul>
    </div>
  );
}

function Lineup({ booking, onFacility, onNew }: { booking: Booking; onFacility: () => void; onNew: () => void }) {
  const [names, setNames] = useState<Record<string, string>>({});
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const [split, setSplit] = useState(14);
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const pitchName = pitches.find((p) => p.id === booking.pitch)!.name;
  const each = booking.price / split;
  const wanted = positions.filter((p) => missing[p.key]).map((p) => p.label.toLocaleLowerCase("tr"));
  const listed = positions.flatMap((p, i) => (!missing[p.key] && names[p.key]?.trim() ? [`${i + 1}. ${names[p.key].trim()}`] : []));
  const message = [
    `⚽ ${booking.team}: ${booking.day.long} ${hh(booking.hour)}, Doksan Halı Saha, ${pitchName}.`,
    `Kişi başı ${tl(each)} (${split} kişi).`,
    listed.length ? `Kadro: ${listed.join(", ")}` : "",
    wanted.length ? `Eksik: ${[...new Set(wanted)].join(", ")}. Gelebilen yazsın!` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section aria-live="polite">
      <p className="text-xs font-bold tracking-[0.16em] text-[var(--dk-turf-dark)] uppercase">Saha ayrıldı · {booking.code}</p>
      <h3 className={`${wide} mt-2 text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]`}>{booking.team}, saha sizin!</h3>
      <p className="mt-3 text-[var(--dk-muted)]">
        {booking.day.long}, {hh(booking.hour)} · {pitchName}
        {booking.fixed ? " · her hafta" : ""} · {tl(booking.price)}. Kapora bağlantısı SMS ile gelir (örnek).
      </p>

      <div className="mt-10 grid items-start gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[260px]">
          <LineupPitch missing={missing} names={names} />
        </div>
        <div>
          <h4 className={`${wide} text-2xl`}>Kadro</h4>
          <p className="mt-1 text-sm text-[var(--dk-muted)]">İsimleri yazın; eksik mevki varsa işaretleyin, mesaja “aranıyor” diye eklensin.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {positions.map((p, i) => (
              <li className="flex items-center gap-2" key={p.key}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${p.key === "kaleci" ? "bg-[var(--dk-ink)] text-white" : "bg-[var(--dk-bib)]"}`}>{i + 1}</span>
                <input
                  aria-label={`${i + 1}. ${p.label}`}
                  className="min-h-11 min-w-0 flex-1 rounded-lg border border-[var(--dk-ink)]/15 bg-white px-3 text-sm disabled:bg-[var(--dk-bg)]"
                  disabled={!!missing[p.key]}
                  maxLength={18}
                  onChange={(e) => setNames((n) => ({ ...n, [p.key]: e.target.value }))}
                  placeholder={p.label}
                  value={names[p.key] ?? ""}
                />
                <label className="flex shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold">
                  <input checked={!!missing[p.key]} className="accent-[var(--dk-bib)]" onChange={(e) => setMissing((m) => ({ ...m, [p.key]: e.target.checked }))} type="checkbox" />
                  Eksik
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-white p-4">
            <span className="text-sm font-bold">Kaç kişi bölüşüyor?</span>
            <div className="flex items-center gap-2">
              <button aria-label="Bir kişi azalt" className="grid size-10 place-items-center rounded-full bg-[var(--dk-bg)] text-lg" onClick={() => setSplit((n) => Math.max(2, n - 1))} type="button">
                −
              </button>
              <output className="w-8 text-center text-lg font-black tabular-nums">{split}</output>
              <button aria-label="Bir kişi artır" className="grid size-10 place-items-center rounded-full bg-[var(--dk-bg)] text-lg" onClick={() => setSplit((n) => Math.min(20, n + 1))} type="button">
                +
              </button>
            </div>
            <span className="text-sm">
              Kişi başı <b className="tabular-nums">{tl(each)}</b>
            </span>
          </div>

          <label className="mt-6 block text-sm font-bold" htmlFor="dk-msg">
            Grup mesajı
            <textarea className="mt-2 block min-h-32 w-full rounded-xl border border-[var(--dk-ink)]/15 bg-white p-3 font-normal" id="dk-msg" readOnly value={message} />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              className="min-h-12 rounded-xl bg-[var(--dk-turf)] px-5 font-bold text-white hover:bg-[var(--dk-turf-dark)]"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message);
                  setCopied("ok");
                } catch {
                  setCopied("fail");
                }
              }}
              type="button"
            >
              Mesajı kopyala
            </button>
            <span className="text-sm text-[var(--dk-muted)]" role="status">
              {copied === "ok" ? "Kopyalandı; WhatsApp grubuna yapıştırın." : copied === "fail" ? "Kopyalanamadı; metni seçip kopyalayın." : ""}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="min-h-12 rounded-xl bg-[var(--dk-ink)] px-5 font-bold text-white hover:bg-[var(--dk-bib)] hover:text-[var(--dk-ink)]" onClick={onFacility} type="button">
              Tesis panelinde gör
            </button>
            <button className="min-h-12 px-3 font-bold underline underline-offset-4" onClick={onNew} type="button">
              Başka saat ayır
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Facility({
  days,
  status,
  past,
  booking,
}: {
  days: Day[];
  status: (d: Day, p: PitchId, h: number) => string;
  past: (d: Day, h: number) => boolean;
  booking: Booking | null;
}) {
  const [pitch, setPitch] = useState<PitchId>(booking?.pitch ?? "acik");
  let sold = 0;
  let revenue = 0;
  let open = 0;
  let unpaid = 0;
  let fixedCount = 0;
  for (const d of days)
    for (const h of HOURS) {
      if (past(d, h)) continue;
      open += 1;
      const s = status(d, pitch, h);
      const t = takenAt(d.iso, d.dow, pitch, h);
      if (s === "taken" && t) {
        sold += 1;
        revenue += priceOf(pitch, h) * (t.fixed ? 1 - FIXED_OFF : 1);
        if (!t.paid) unpaid += 1;
        if (t.fixed) fixedCount += 1;
      }
      if (s === "mine" && booking) {
        sold += 1;
        revenue += booking.price;
        unpaid += 1;
      }
    }

  return (
    <div>
      <h3 className={`${wide} text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]`}>Tesis paneli</h3>
      <p className="mt-3 max-w-[60ch] text-[var(--dk-muted)]">Önümüzdeki yedi gün, saat saat. Sabit takımlar her hafta aynı yerde; kaporası gelmeyenler turuncu çerçeveli.</p>
      <div aria-label="Saha" className="mt-6 flex gap-2" role="group">
        {pitches.map((p) => (
          <button aria-pressed={pitch === p.id} className={`min-h-11 rounded-lg px-4 text-sm font-bold ${pitch === p.id ? "bg-[var(--dk-ink)] text-white" : "bg-white"}`} key={p.id} onClick={() => setPitch(p.id)} type="button">
            {p.name}
          </button>
        ))}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Doluluk", `%${open ? Math.round((sold / open) * 100) : 0}`],
          ["Haftalık ciro", tl(revenue)],
          ["Kapora bekleyen", String(unpaid)],
          ["Sabit takım saati", String(fixedCount)],
        ].map(([k, v]) => (
          <div className="rounded-xl bg-white p-4" key={k}>
            <dt className="text-xs text-[var(--dk-muted)]">{k}</dt>
            <dd className={`${wide} mt-1 text-xl tabular-nums`}>{v}</dd>
          </div>
        ))}
      </dl>

      <div aria-label="Haftalık doluluk" className="mt-6 overflow-x-auto rounded-2xl bg-white p-4" role="region" tabIndex={0}>
        <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="w-14" scope="col">
                <span className="sr-only">Saat</span>
              </th>
              {days.map((d) => (
                <th className="pb-1 text-left font-bold" key={d.iso} scope="col">
                  {d.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h}>
                <th className="pr-2 text-right font-bold tabular-nums" scope="row">
                  {hh(h)}
                </th>
                {days.map((d) => {
                  const s = status(d, pitch, h);
                  const t = takenAt(d.iso, d.dow, pitch, h);
                  const cls =
                    s === "mine"
                      ? "bg-[var(--dk-bib)] font-bold text-[var(--dk-ink)]"
                      : s === "taken" && t?.fixed
                        ? "bg-[var(--dk-turf-dark)] text-white"
                        : s === "taken"
                          ? `bg-[var(--dk-turf)] text-white ${t && !t.paid ? "outline-2 -outline-offset-2 outline-[var(--dk-bib)]" : ""}`
                          : s === "past"
                            ? "bg-[var(--dk-bg)]/60 text-[var(--dk-muted)]/50"
                            : "bg-[var(--dk-bg)] text-[var(--dk-muted)]";
                  return (
                    <td className={`h-10 rounded-md px-1.5 ${cls}`} key={d.iso}>
                      <span className="line-clamp-2 leading-tight">{s === "mine" ? `${booking?.team} (siz)` : s === "taken" ? t?.team : s === "past" ? "" : "boş"}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--dk-muted)]">
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-turf-dark)]" /> Sabit takım
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-turf)]" /> Tek maç
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-turf)] outline-2 -outline-offset-2 outline-[var(--dk-bib)]" /> Kapora bekliyor
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-bib)]" /> Sizin rezervasyonunuz
        </li>
      </ul>
    </div>
  );
}
