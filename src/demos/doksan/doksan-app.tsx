"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLang } from "@/lib/lang-context";
import { locale } from "@/lib/i18n";
import { before, type Day, doksanIn, FIXED_OFF, hh, HOURS, isoDay, KAPORA, type PitchId, priceOf, takenAt, week } from "./data";
import { LineupPitch } from "./lineup-pitch";

const COPY = {
  tr: {
    loading: "Saatler yükleniyor…",
    errTeam: "Takım adını yazın.",
    errCaptain: "Kaptanın adını yazın.",
    errPhone: "Telefonu 05XX XXX XX XX biçiminde yazın.",
    intro: "Takım olarak saha ayırın; tesis panelinde aynı hafta işletmenin gözünden görünür.",
    view: "Görünüm",
    views: [
      ["takim", "Takım"],
      ["tesis", "Tesis paneli"],
    ] as const,
    pitch: "Saha",
    day: "Gün",
    free: "Boş",
    evening: "AKŞAM",
    fixed: "SABİT",
    gone: "Geçti",
    priceNote: "Fiyatlar saatlik ve örnektir. Kapalı saha 200 ₺ fazladır.",
    pickTime: "Saat seçin",
    pickLead: "Listeden boş bir saate dokunun. Her hafta aynı saatte oynuyorsanız sabit saat alın; %10 indirimli.",
    weekly: "Her hafta bu saat bizim",
    weeklyNote: "Sabit saat · %10 indirim · istediğiniz hafta bırakırsınız",
    team: "Takım adı",
    teamPh: "Örn. Salı Beyleri",
    captain: "Kaptan",
    captainPhone: "Kaptanın telefonu",
    fee: "Saha ücreti",
    perWeek: " (haftalık)",
    depositNow: "Şimdi kapora",
    rest: "Kalan, sahada",
    book: "Sahayı ayır",
    smsNote: "Kapora bağlantısı onaydan sonra SMS ile gelir; 2 saat içinde yatırılmazsa saat boşa çıkar (örnek; ödeme alınmaz).",
    rules: (deposit: string) => [
      ["Kapora", `${deposit}, maçtan 24 saat öncesine kadar iade edilir.`],
      ["Son 24 saat", "İptal ederseniz kapora yanar."],
      ["Gelmezseniz", "Saha ücretinin tamamı alınır."],
      ["Sahada", "Yelek, top ve duş ücretsiz. Krampon değil, halı saha ayakkabısı."],
    ],
    cancelRule: "İptal kuralı",
    lastFree: "Ücretsiz iptal ve kapora iadesi için son an:",
    last24: "Son 24 saatte iptal: kapora yanar.",
    noShow: "Gelmezseniz saha ücretinin tamamı.",
    message: (team: string, when: string, pitch: string, each: string, split: number, listed: string[], wanted: string[]) =>
      [
        `⚽ ${team}: ${when}, Doksan Halı Saha, ${pitch}.`,
        `Kişi başı ${each} (${split} kişi).`,
        listed.length ? `Kadro: ${listed.join(", ")}` : "",
        wanted.length ? `Eksik: ${wanted.join(", ")}. Gelebilen yazsın!` : "",
      ],
    booked: "Saha ayrıldı",
    yours: (team: string) => `${team}, saha sizin!`,
    everyWeek: " · her hafta",
    depositSms: "Kapora bağlantısı SMS ile gelir (örnek).",
    lineup: "Kadro",
    lineupLead: "İsimleri yazın; eksik mevki varsa işaretleyin, mesaja “aranıyor” diye eklensin.",
    missing: "Eksik",
    split: "Kaç kişi bölüşüyor?",
    less: "Bir kişi azalt",
    more: "Bir kişi artır",
    each: "Kişi başı",
    groupMsg: "Grup mesajı",
    copy: "Mesajı kopyala",
    copied: "Kopyalandı; WhatsApp grubuna yapıştırın.",
    copyFail: "Kopyalanamadı; metni seçip kopyalayın.",
    seeFacility: "Tesis panelinde gör",
    another: "Başka saat ayır",
    facility: "Tesis paneli",
    facilityLead: "Önümüzdeki yedi gün, saat saat. Sabit takımlar her hafta aynı yerde; kaporası gelmeyenler turuncu çerçeveli.",
    stats: ["Doluluk", "Haftalık ciro", "Kapora bekleyen", "Sabit takım saati"],
    pct: (n: number) => `%${n}`,
    weekGrid: "Haftalık doluluk",
    hour: "Saat",
    you: "(siz)",
    freeLower: "boş",
    legend: ["Sabit takım", "Tek maç", "Kapora bekliyor", "Sizin rezervasyonunuz"],
  },
  en: {
    loading: "Loading times…",
    errTeam: "Write the team name.",
    errCaptain: "Write the captain's name.",
    errPhone: "Enter a Turkish mobile number as 05XX XXX XX XX.",
    intro: "Book a pitch as a team; the venue panel shows the same week from the business's side.",
    view: "View",
    views: [
      ["takim", "Team"],
      ["tesis", "Venue panel"],
    ] as const,
    pitch: "Pitch",
    day: "Day",
    free: "Free",
    evening: "EVENING",
    fixed: "WEEKLY",
    gone: "Passed",
    priceNote: "Prices are per hour and are examples. The indoor pitch is ₺200 more.",
    pickTime: "Choose a time",
    pickLead: "Tap a free hour in the list. If you play at the same time every week, take a weekly slot; it's 10% off.",
    weekly: "This hour is ours every week",
    weeklyNote: "Weekly slot · 10% off · drop any week you like",
    team: "Team name",
    teamPh: "e.g. Salı Beyleri",
    captain: "Captain",
    captainPhone: "Captain's phone",
    fee: "Pitch fee",
    perWeek: " (weekly)",
    depositNow: "Deposit now",
    rest: "Balance, at the pitch",
    book: "Book the pitch",
    smsNote: "The deposit link comes by SMS after you confirm; if it isn't paid within 2 hours, the slot is released (a sample; no payment is taken).",
    rules: (deposit: string) => [
      ["Deposit", `${deposit}, refunded up to 24 hours before kick-off.`],
      ["Last 24 hours", "Cancel and the deposit is lost."],
      ["No-show", "The full pitch fee is charged."],
      ["At the pitch", "Bibs, ball and showers are free. Astro shoes, not studs."],
    ],
    cancelRule: "Cancellation rule",
    lastFree: "Last moment for free cancellation and a deposit refund:",
    last24: "Cancel in the last 24 hours: the deposit is lost.",
    noShow: "No-show: the full pitch fee.",
    message: (team: string, when: string, pitch: string, each: string, split: number, listed: string[], wanted: string[]) =>
      [
        `⚽ ${team}: ${when}, Doksan Halı Saha, ${pitch}.`,
        `${each} each (${split} players).`,
        listed.length ? `Line-up: ${listed.join(", ")}` : "",
        wanted.length ? `Missing: ${wanted.join(", ")}. Shout if you can make it!` : "",
      ],
    booked: "Pitch booked",
    yours: (team: string) => `${team}, the pitch is yours!`,
    everyWeek: " · every week",
    depositSms: "The deposit link comes by SMS (a sample).",
    lineup: "Line-up",
    lineupLead: "Write the names; if a position is missing, tick it and it goes into the message as “wanted”.",
    missing: "Missing",
    split: "How many are splitting it?",
    less: "One fewer",
    more: "One more",
    each: "Each",
    groupMsg: "Group message",
    copy: "Copy the message",
    copied: "Copied; paste it into the WhatsApp group.",
    copyFail: "Couldn't copy; select the text and copy it.",
    seeFacility: "See it in the venue panel",
    another: "Book another time",
    facility: "Venue panel",
    facilityLead: "The next seven days, hour by hour. Weekly teams are in the same place every week; those whose deposit hasn't arrived are outlined in orange.",
    stats: ["Occupancy", "Weekly takings", "Awaiting deposit", "Weekly team slots"],
    pct: (n: number) => `${n}%`,
    weekGrid: "Weekly occupancy",
    hour: "Time",
    you: "(you)",
    freeLower: "free",
    legend: ["Weekly team", "One-off match", "Awaiting deposit", "Your booking"],
  },
};

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
  const lang = useLang();
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  if (!now) return <p className="mx-auto max-w-6xl px-5 py-24 text-[var(--dk-muted)] sm:px-8">{COPY[lang].loading}</p>;
  const [iso, hour] = now.split("|");
  return <App nowHour={Number(hour)} todayIso={iso} />;
}

function App({ todayIso, nowHour }: { todayIso: string; nowHour: number }) {
  const lang = useLang();
  const c = COPY[lang];
  const { pitches, tl } = doksanIn(lang);
  const days = useMemo(() => week(todayIso, lang), [todayIso, lang]);
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
    team: tried && team.trim().length < 2 ? c.errTeam : null,
    captain: tried && captain.trim().length < 2 ? c.errCaptain : null,
    phone: tried && !PHONE.test(phone.replace(/\D/g, "")) ? c.errPhone : null,
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
        <p className="text-sm text-[var(--dk-muted)]">{c.intro}</p>
        <div aria-label={c.view} className="flex rounded-xl bg-white p-1 text-sm font-semibold" role="group">
          {c.views.map(([k, l]) => (
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
                <div aria-label={c.pitch} className="grid gap-3 sm:grid-cols-2" role="group">
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

                <div aria-label={c.day} className="mt-6 flex gap-2 overflow-x-auto pb-1" role="group">
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
                                <span className="font-semibold text-[var(--dk-turf-dark)]">{c.free}</span>
                                {peak && <span className="ml-2 rounded bg-[var(--dk-ink)] px-1.5 py-0.5 text-[10px] font-bold text-white">{c.evening}</span>}
                              </span>
                            )}
                            {s === "taken" && t && (
                              <span className="block truncate text-sm text-[var(--dk-muted)]">
                                {t.team}
                                {t.fixed && <span className="ml-2 rounded border border-[var(--dk-muted)]/40 px-1.5 text-[10px] font-bold">{c.fixed}</span>}
                              </span>
                            )}
                            {s === "past" && <span className="block text-sm text-[var(--dk-muted)]/70">{c.gone}</span>}
                          </span>
                          <span className={`text-sm font-bold tabular-nums ${s === "free" ? "" : "text-[var(--dk-muted)]/50 line-through"}`}>{tl(priceOf(pitch, h))}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-3 text-xs text-[var(--dk-muted)]">{c.priceNote}</p>
              </div>

              <aside aria-live="polite" className="scroll-mt-4 rounded-2xl bg-white p-5 sm:p-6 lg:sticky lg:top-6" ref={form}>
                {selectable === null ? (
                  <>
                    <p className={`${wide} text-lg`}>{c.pickTime}</p>
                    <p className="mt-2 text-sm text-[var(--dk-muted)]">{c.pickLead}</p>
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
                        <span className="block text-sm font-bold">{c.weekly}</span>
                        <span className="block text-xs text-[var(--dk-muted)]">{c.weeklyNote}</span>
                      </span>
                      <input checked={fixed} className="size-5 shrink-0 accent-[var(--dk-turf)]" id="dk-fixed" onChange={(e) => setFixed(e.target.checked)} type="checkbox" />
                    </label>

                    <div className="mt-5 space-y-3">
                      <label className="block text-sm font-semibold" htmlFor="dk-team">
                        {c.team}
                        <input aria-invalid={!!errors.team} className={field} id="dk-team" onChange={(e) => setTeam(e.target.value)} placeholder={c.teamPh} value={team} />
                        {errors.team && <span className="mt-1 block font-normal text-[#C2410C]">{errors.team}</span>}
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <label className="block text-sm font-semibold" htmlFor="dk-captain">
                          {c.captain}
                          <input aria-invalid={!!errors.captain} autoComplete="name" className={field} id="dk-captain" onChange={(e) => setCaptain(e.target.value)} value={captain} />
                          {errors.captain && <span className="mt-1 block font-normal text-[#C2410C]">{errors.captain}</span>}
                        </label>
                        <label className="block text-sm font-semibold" htmlFor="dk-phone">
                          {c.captainPhone}
                          <input aria-invalid={!!errors.phone} autoComplete="tel" className={field} id="dk-phone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
                          {errors.phone && <span className="mt-1 block font-normal text-[#C2410C]">{errors.phone}</span>}
                        </label>
                      </div>
                    </div>

                    <dl className="mt-5 space-y-1.5 border-t border-dashed border-[var(--dk-ink)]/20 pt-4 text-sm">
                      <div className="flex justify-between">
                        <dt>
                          {c.fee}
                          {fixed ? c.perWeek : ""}
                        </dt>
                        <dd className="font-bold tabular-nums">{tl(price)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>{c.depositNow}</dt>
                        <dd className="font-bold tabular-nums">{tl(KAPORA)}</dd>
                      </div>
                      <div className="flex justify-between text-[var(--dk-muted)]">
                        <dt>{c.rest}</dt>
                        <dd className="tabular-nums">{tl(price - KAPORA)}</dd>
                      </div>
                    </dl>

                    <CancelLine day={day} hour={selectable} />

                    <button className={`${wide} mt-6 min-h-14 w-full rounded-xl bg-[var(--dk-bib)] text-lg tracking-tight text-[var(--dk-ink)] transition-colors hover:bg-[var(--dk-ink)] hover:text-white`} type="submit">
                      {c.book}
                    </button>
                    <p className="mt-2 text-xs text-[var(--dk-muted)]">{c.smsNote}</p>
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
  const lang = useLang();
  const { tl } = doksanIn(lang);
  return (
    <ul className="mt-5 space-y-2 text-sm">
      {COPY[lang].rules(tl(KAPORA)).map(([k, v]) => (
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
  const lang = useLang();
  const c = COPY[lang];
  const hoursAway = day.offset * 24 + hour; // rough; only used for proportions
  const freeShare = Math.max(0.08, Math.min(0.84, (hoursAway - 24) / hoursAway));
  return (
    <div className="mt-5">
      <p className="text-sm font-bold">{c.cancelRule}</p>
      <div aria-hidden="true" className="mt-2 flex h-2.5 overflow-hidden rounded-full">
        <span className="bg-[var(--dk-turf)]" style={{ width: `${freeShare * 100}%` }} />
        <span className="flex-1 bg-[var(--dk-bib)]" />
        <span className="w-2.5 bg-[var(--dk-ink)]" />
      </div>
      <ul className="mt-2 space-y-1 text-xs">
        <li className="flex gap-2">
          <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-[var(--dk-turf)]" />
          <span>
            {c.lastFree} <b>{before(day, hour, 24, lang)}</b>.
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-[var(--dk-bib)]" />
          <span>{c.last24}</span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-[var(--dk-ink)]" />
          <span>{c.noShow}</span>
        </li>
      </ul>
    </div>
  );
}

function Lineup({ booking, onFacility, onNew }: { booking: Booking; onFacility: () => void; onNew: () => void }) {
  const lang = useLang();
  const c = COPY[lang];
  const { pitches, positions, tl } = doksanIn(lang);
  const [names, setNames] = useState<Record<string, string>>({});
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const [split, setSplit] = useState(14);
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const pitchName = pitches.find((p) => p.id === booking.pitch)!.name;
  const each = booking.price / split;
  const wanted = positions.filter((p) => missing[p.key]).map((p) => p.label.toLocaleLowerCase(locale(lang)));
  const listed = positions.flatMap((p, i) => (!missing[p.key] && names[p.key]?.trim() ? [`${i + 1}. ${names[p.key].trim()}`] : []));
  const message = c
    .message(booking.team, `${booking.day.long} ${hh(booking.hour)}`, pitchName, tl(each), split, listed, [...new Set(wanted)])
    .filter(Boolean)
    .join("\n");

  return (
    <section aria-live="polite">
      <p className="text-xs font-bold tracking-[0.16em] text-[var(--dk-turf-dark)] uppercase">
        {c.booked} · {booking.code}
      </p>
      <h3 className={`${wide} mt-2 text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]`}>{c.yours(booking.team)}</h3>
      <p className="mt-3 text-[var(--dk-muted)]">
        {booking.day.long}, {hh(booking.hour)} · {pitchName}
        {booking.fixed ? c.everyWeek : ""} · {tl(booking.price)}. {c.depositSms}
      </p>

      <div className="mt-10 grid items-start gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[260px]">
          <LineupPitch missing={missing} names={names} />
        </div>
        <div>
          <h4 className={`${wide} text-2xl`}>{c.lineup}</h4>
          <p className="mt-1 text-sm text-[var(--dk-muted)]">{c.lineupLead}</p>
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
                  {c.missing}
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-white p-4">
            <span className="text-sm font-bold">{c.split}</span>
            <div className="flex items-center gap-2">
              <button aria-label={c.less} className="grid size-10 place-items-center rounded-full bg-[var(--dk-bg)] text-lg" onClick={() => setSplit((n) => Math.max(2, n - 1))} type="button">
                −
              </button>
              <output className="w-8 text-center text-lg font-black tabular-nums">{split}</output>
              <button aria-label={c.more} className="grid size-10 place-items-center rounded-full bg-[var(--dk-bg)] text-lg" onClick={() => setSplit((n) => Math.min(20, n + 1))} type="button">
                +
              </button>
            </div>
            <span className="text-sm">
              {c.each} <b className="tabular-nums">{tl(each)}</b>
            </span>
          </div>

          <label className="mt-6 block text-sm font-bold" htmlFor="dk-msg">
            {c.groupMsg}
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
              {c.copy}
            </button>
            <span className="text-sm text-[var(--dk-muted)]" role="status">
              {copied === "ok" ? c.copied : copied === "fail" ? c.copyFail : ""}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="min-h-12 rounded-xl bg-[var(--dk-ink)] px-5 font-bold text-white hover:bg-[var(--dk-bib)] hover:text-[var(--dk-ink)]" onClick={onFacility} type="button">
              {c.seeFacility}
            </button>
            <button className="min-h-12 px-3 font-bold underline underline-offset-4" onClick={onNew} type="button">
              {c.another}
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
  const lang = useLang();
  const c = COPY[lang];
  const { pitches, tl } = doksanIn(lang);
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

  const stats = [c.pct(open ? Math.round((sold / open) * 100) : 0), tl(revenue), String(unpaid), String(fixedCount)];

  return (
    <div>
      <h3 className={`${wide} text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]`}>{c.facility}</h3>
      <p className="mt-3 max-w-[60ch] text-[var(--dk-muted)]">{c.facilityLead}</p>
      <div aria-label={c.pitch} className="mt-6 flex gap-2" role="group">
        {pitches.map((p) => (
          <button aria-pressed={pitch === p.id} className={`min-h-11 rounded-lg px-4 text-sm font-bold ${pitch === p.id ? "bg-[var(--dk-ink)] text-white" : "bg-white"}`} key={p.id} onClick={() => setPitch(p.id)} type="button">
            {p.name}
          </button>
        ))}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((k, i) => [k, stats[i]]).map(([k, v]) => (
          <div className="rounded-xl bg-white p-4" key={k}>
            <dt className="text-xs text-[var(--dk-muted)]">{k}</dt>
            <dd className={`${wide} mt-1 text-xl tabular-nums`}>{v}</dd>
          </div>
        ))}
      </dl>

      <div aria-label={c.weekGrid} className="mt-6 overflow-x-auto rounded-2xl bg-white p-4" role="region" tabIndex={0}>
        <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="w-14" scope="col">
                <span className="sr-only">{c.hour}</span>
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
                      <span className="line-clamp-2 leading-tight">{s === "mine" ? `${booking?.team} ${c.you}` : s === "taken" ? t?.team : s === "past" ? "" : c.freeLower}</span>
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
          <span className="size-3 rounded-sm bg-[var(--dk-turf-dark)]" /> {c.legend[0]}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-turf)]" /> {c.legend[1]}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-turf)] outline-2 -outline-offset-2 outline-[var(--dk-bib)]" /> {c.legend[2]}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-[var(--dk-bib)]" /> {c.legend[3]}
        </li>
      </ul>
    </div>
  );
}
