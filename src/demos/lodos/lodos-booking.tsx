"use client";

import TearTicket from "@/components/reactbits/TearTicket";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useLang } from "@/lib/lang-context";
import { DEPOSIT, DURATION, fits, GROUP, hm, hoursOf, isFree, isoDay, MAX_PARTY, nextDays, type Res, seedDay, SLOT, tables, trayFrom, type Zone, zoneNames } from "./booking-data";
import { lodosIn } from "./data";
import { FloorPlan, type TableState } from "./floor-plan";
import { HostView } from "./host-view";
import { Photo } from "./photos";

// The date and time only exist in the browser; while prerendering there is none.
const subscribe = () => () => {};
const clientNow = () => {
  const d = new Date();
  return `${isoDay(d)}|${d.getHours() * 60 + d.getMinutes() - (d.getMinutes() % 10)}`;
};
const serverNow = () => null;

const PHONE = /^0?5\d{9}$/;

const COPY = {
  tr: {
    preparing: "Salon planı hazırlanıyor…",
    occasions: ["Doğum günü", "Yıldönümü", "İş yemeği", "İlk kez geliyoruz"],
    errName: "Adınızı yazın; en az iki harf.",
    errPhone: "Telefonu 05XX XXX XX XX biçiminde yazın.",
    words: { book: "Masa", host: "Defter", done: "Afiyet" },
    view: "Görünüm",
    guest: "Misafir",
    hostBook: "Salon defteri",
    hostLead: "Bu ekranı yalnızca işletme görür. Gecenin bütün rezervasyonları masa masa; yeni gelen anında yerine oturur.",
    received: "Rezervasyon alındı",
    reserved: (who: string) => `${who}, masanız ayrıldı.`,
    summary: (day: string, time: string, party: number, table: number) => `${day}, ${time} · ${party} kişi · Masa ${table}. Onay ve yol tarifi SMS ile gelir (örnek; mesaj gönderilmez).`,
    tear: (table: number) => `Masa ${table} koçanını kopar`,
    table: "Masa",
    tearHint: "koparın →",
    meyhane: "meyhane · Kadıköy",
    day: "Gün",
    time: "Saat",
    guests: "Kişi",
    welcome: "Hoş geldiniz! Masanız hazır; salon defterinde de geldiğiniz işaretlendi.",
    tearHow: "Kapıda garson koçanı koparır. Denemek için koçanı sağa sürükleyin ya da seçip Enter'a basın.",
    yourNote: "Notunuz",
    trayArrives: (list: string) => `Tepsiniz (${list}) oturduğunuzda gelir.`,
    seeInBook: "Salon defterinde gör",
    newBooking: "Yeni rezervasyon",
    h1: "Masa ayırt",
    lead: "Kişi sayısını ve akşamı seçin, salon planından masanızı gösterin. Masa 2,5 saatliğine sizin.",
    howMany: "Kaç kişisiniz?",
    fewer: "Bir kişi azalt",
    more: "Bir kişi artır",
    group: (n: number, deposit: string) => `${n} kişi ve üzeri: fix menü ve kişi başı ${deposit} ön ödeme. Ödeme bağlantısı onaydan sonra gelir (örnek; bu demoda ödeme alınmaz).`,
    whichNight: "Hangi akşam?",
    timeHead: "Saat",
    tooLate: "Bugün için rezervasyon saati geçti; yarını seçin.",
    slotLabel: (time: string, free: number) => `${time}${free ? `, ${free} masa boş` : ", dolu"}`,
    where: "Nerede oturmak istersiniz?",
    free: "Boş",
    selected: "Seçili",
    taken: "Dolu",
    scroll: "Planı yana kaydırabilirsiniz.",
    freeFor: (n: number) => `${n} kişi için boş masalar`,
    none: "Bu saatte uygun masa kalmadı",
    noneLead: "Başka bir saat ya da akşam seçin. Hafta içi çoğu akşam kapıdan da masa bulunur.",
    people: (n: number) => `${n} kişi`,
    name: "Ad soyad",
    phone: "Cep telefonu",
    occasion: "Özel bir gün mü?",
    note: "Not",
    optional: "(isteğe bağlı)",
    notePlaceholder: "Alerji, bebek sandalyesi, sürpriz pasta…",
    siteTray: "Sitede seçtiğiniz tepsi",
    onTable: "Oturduğunuzda masada olur.",
    submit: "Masayı ayırt",
    privacy: "Adınız ve telefonunuz yalnızca bu rezervasyon için kullanılır. Masanızı 20 dakika tutarız.",
  },
  en: {
    preparing: "Setting out the floor plan…",
    occasions: ["Birthday", "Anniversary", "Business dinner", "Our first visit"],
    errName: "Write your name; at least two letters.",
    errPhone: "Enter a Turkish mobile number as 05XX XXX XX XX.",
    words: { book: "Table", host: "Book", done: "Enjoy" },
    view: "View",
    guest: "Guest",
    hostBook: "Host's book",
    hostLead: "Only the restaurant sees this screen. Every booking of the night, table by table; a new one takes its place at once.",
    received: "Booking received",
    reserved: (who: string) => `${who}, your table is booked.`,
    summary: (day: string, time: string, party: number, table: number) => `${day}, ${time} · ${party} ${party === 1 ? "guest" : "guests"} · Table ${table}. The confirmation and directions come by text (a sample; no message is sent).`,
    tear: (table: number) => `Tear off the stub for table ${table}`,
    table: "Table",
    tearHint: "tear off →",
    meyhane: "meyhane · Kadıköy",
    day: "Day",
    time: "Time",
    guests: "Guests",
    welcome: "Welcome! Your table is ready, and the host's book shows you've arrived.",
    tearHow: "At the door the waiter tears off the stub. To try it, drag the stub to the right, or select it and press Enter.",
    yourNote: "Your note",
    trayArrives: (list: string) => `Your tray (${list}) arrives when you sit down.`,
    seeInBook: "See it in the host's book",
    newBooking: "New booking",
    h1: "Book a table",
    lead: "Choose how many of you and the evening, then point out your table on the floor plan. The table is yours for 2.5 hours.",
    howMany: "How many of you?",
    fewer: "One guest fewer",
    more: "One guest more",
    group: (n: number, deposit: string) => `${n} guests or more: the set menu and a ${deposit} deposit per person. The payment link comes after confirmation (a sample; no payment is taken here).`,
    whichNight: "Which evening?",
    timeHead: "Time",
    tooLate: "It's too late to book for today; choose tomorrow.",
    slotLabel: (time: string, free: number) => `${time}${free ? `, ${free} tables free` : ", full"}`,
    where: "Where would you like to sit?",
    free: "Free",
    selected: "Selected",
    taken: "Taken",
    scroll: "You can scroll the plan sideways.",
    freeFor: (n: number) => `Free tables for ${n}`,
    none: "No suitable tables left at this time",
    noneLead: "Pick another time or evening. On most weeknights there's a table at the door.",
    people: (n: number) => `${n} ${n === 1 ? "guest" : "guests"}`,
    name: "Full name",
    phone: "Mobile phone",
    occasion: "A special day?",
    note: "Note",
    optional: "(optional)",
    notePlaceholder: "Allergies, a high chair, a surprise cake…",
    siteTray: "The tray you chose on the site",
    onTable: "It will be on the table when you sit down.",
    submit: "Book the table",
    privacy: "Your name and phone number are only used for this booking. We hold your table for 20 minutes.",
  },
};

const chip = (on: boolean) =>
  `min-h-10 rounded-[9px] border px-3.5 text-xs tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ld-text)] disabled:cursor-not-allowed ${
    on
      ? "border-[var(--ld-text)] bg-[var(--ld-text)] text-[var(--ld-bg)]"
      : "border-[var(--ld-line)] hover:border-[var(--ld-text)] disabled:text-[var(--ld-muted)]/50 disabled:line-through disabled:hover:border-[var(--ld-line)]"
  }`;

export function LodosBooking() {
  const lang = useLang();
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  if (!now) {
    return <p className="px-6 py-24 text-[var(--ld-muted)]">{COPY[lang].preparing}</p>;
  }
  const [iso, min] = now.split("|");
  return <Booking nowMin={Number(min)} todayIso={iso} />;
}

type Mine = Res & { dayIdx: number; code: string; note: string };

function Booking({ todayIso, nowMin }: { todayIso: string; nowMin: number }) {
  const lang = useLang();
  const c = COPY[lang];
  const zoneName = zoneNames[lang];
  const { sitePath: SITE_PATH, tl } = lodosIn(lang);
  const params = useSearchParams();
  const [view, setView] = useState<"misafir" | "salon">("misafir");
  const [party, setParty] = useState(() => Math.min(MAX_PARTY, Math.max(1, Number(params.get("kisi")) || 2)));
  const [dayPick, setDayPick] = useState<number | null>(null);
  const [timePick, setTimePick] = useState<number | null>(null);
  const [tablePick, setTablePick] = useState<number | null>(null);
  const [prefer, setPrefer] = useState<Zone | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [mine, setMine] = useState<Mine | null>(null);
  const [arrived, setArrived] = useState(false);
  const mezes = useMemo(() => trayFrom(params.get("tepsi"), lang), [params, lang]);

  const days = useMemo(() => nextDays(todayIso, 7, lang), [todayIso, lang]);
  const seeded = useMemo(() => days.map((d) => seedDay(d.iso, d.dow)), [days]);
  const listFor = (i: number) => (mine && mine.dayIdx === i ? [...seeded[i], mine] : seeded[i]);

  // Every seating time of a day, with how many tables for this party are still free.
  const slotsFor = (i: number) => {
    const { open, close } = hoursOf(days[i].dow);
    const list = listFor(i);
    const out: { t: number; free: number }[] = [];
    for (let t = open; t <= close - DURATION; t += SLOT) {
      if (i === 0 && t < nowMin + 30) continue;
      out.push({ t, free: tables.filter((tb) => fits(tb, party) && isFree(tb.id, t, list)).length });
    }
    return out;
  };
  const allSlots = days.map((_, i) => slotsFor(i));
  const open = allSlots.map((s) => s.some((x) => x.free > 0));

  // Picks fall back to a sensible default when they stop being possible.
  const dayIdx = dayPick !== null && (open[dayPick] || view === "salon") ? dayPick : Math.max(0, open.indexOf(true));
  const slots = allSlots[dayIdx];
  const bookable = slots.filter((s) => s.free > 0).map((s) => s.t);
  const time = timePick !== null && bookable.includes(timePick) ? timePick : bookable.includes(20 * 60) ? 20 * 60 : (bookable[0] ?? null);
  const list = listFor(dayIdx);
  const state = (id: number): TableState => {
    const t = tables.find((x) => x.id === id)!;
    if (!fits(t, party)) return "nofit";
    if (time === null || !isFree(id, time, list)) return "taken";
    return id === tablePick ? "selected" : "free";
  };
  const states = Object.fromEntries(tables.map((t) => [t.id, state(t.id)]));
  const table = tables.find((t) => t.id === tablePick && states[t.id] === "selected") ?? null;
  const freeTables = tables.filter((t) => states[t.id] === "free" || states[t.id] === "selected");
  const zones = [...new Set(tables.filter((t) => fits(t, party)).map((t) => t.zone))];
  const day = days[dayIdx];

  function confirm() {
    const e: typeof errors = {};
    if (name.trim().length < 2) e.name = c.errName;
    if (!PHONE.test(phone.replace(/\D/g, ""))) e.phone = c.errPhone;
    setErrors(e);
    if (Object.keys(e).length || !table || time === null) return;
    setMine({
      id: "mine",
      table: table.id,
      start: time,
      party,
      who: name.trim().split(/\s+/)[0],
      mine: true,
      dayIdx,
      code: `LD${day.date}${String(table.id).padStart(2, "0")}${hm(time).replace(":", "")}`,
      note: [occasion, note.trim()].filter(Boolean).join(" · "),
    });
    setArrived(false);
  }

  function again() {
    setMine(null);
    setArrived(false);
    setTablePick(null);
    setTimePick(null);
    setName("");
    setPhone("");
    setNote("");
    setOccasion(null);
  }

  const word = view === "salon" ? c.words.host : mine ? c.words.done : c.words.book;

  return (
    <div className="gap-4 p-3 sm:p-4 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
      <aside className="relative h-[42svh] min-h-[300px] overflow-hidden rounded-[18px] lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem-2.25rem)]">
        <Photo lang={lang} name={view === "salon" ? "masa" : "salon"} priority sizes="(min-width: 1024px) 36vw, 100vw" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.5),transparent_30%,transparent_55%,rgba(0,0,0,.75))]" />
        <nav
          aria-label="Lodos Meyhane"
          className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1 rounded-[14px] border border-[var(--ld-line)] bg-[#0B0C0B]/85 p-1.5 backdrop-blur sm:top-6 sm:left-6"
        >
          <Link className="px-3 font-[family-name:var(--ld-display)] text-2xl leading-none tracking-[0.06em]" href={SITE_PATH}>
            <span aria-hidden="true" className="mr-1 text-base">
              ←
            </span>
            LODOS
          </Link>
          <div aria-label={c.view} className="flex gap-1" role="group">
            {(
              [
                ["misafir", c.guest],
                ["salon", c.hostBook],
              ] as const
            ).map(([k, label]) => (
              <button
                aria-pressed={view === k}
                className={`min-h-10 rounded-[9px] border px-3 text-xs tracking-[0.12em] uppercase transition-colors ${view === k ? "border-[var(--ld-text)] bg-[var(--ld-text)] text-[var(--ld-bg)]" : "border-[var(--ld-line)] hover:border-[var(--ld-text)]"}`}
                key={k}
                onClick={() => setView(k)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
        <p aria-hidden="true" className="absolute bottom-6 left-6 font-[family-name:var(--ld-display)] text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.82] sm:bottom-10 sm:left-10">
          {lang === "en" ? word.toUpperCase() : word.toLocaleUpperCase("tr")}
        </p>
      </aside>

      <main className="mt-4 min-w-0 pb-16 lg:mt-0">
        {view === "salon" ? (
          <>
            <h1 className="pt-2 font-[family-name:var(--lodos-display)] text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02]">{c.hostBook}</h1>
            <p className="mt-3 max-w-[60ch] text-[var(--lodos-muted)]">
              {c.hostLead}
            </p>
            <div className="mt-8">
              <HostView arrived={arrived} dayIdx={dayIdx} days={days} list={list} onDay={(i) => setDayPick(i)} />
            </div>
          </>
        ) : mine ? (
          <section aria-live="polite" className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.2em] text-[var(--ld-muted)] uppercase">{c.received}</p>
            <h1 className="mt-3 font-[family-name:var(--lodos-display)] text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">{c.reserved(mine.who)}</h1>
            <p className="mt-4 text-[var(--lodos-muted)]">
              {c.summary(days[mine.dayIdx].long, hm(mine.start), mine.party, mine.table)}
            </p>
            <div className="mx-auto mt-10 max-w-[540px]">
              <TearTicket
                ariaLabel={c.tear(mine.table)}
                background="#EFEADF"
                color="#1D2A2E"
                height={230}
                onTear={() => setArrived(true)}
                rotate={-2}
                stub={
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-white">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-80">{c.table}</span>
                    <span className="font-[family-name:var(--lodos-display)] text-6xl leading-none">{mine.table}</span>
                    <span className="mt-2 text-[11px] opacity-80">{c.tearHint}</span>
                  </div>
                }
                stubBackground="#B3243B"
                stubSize={140}
                width={540}
              >
                <div className="flex h-full flex-col justify-between p-6 text-left">
                  <div>
                    <p className="font-[family-name:var(--lodos-display)] text-2xl">Lodos</p>
                    <p className="text-xs text-[#5D5A52]">{c.meyhane}</p>
                  </div>
                  <dl className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <dt className="text-[11px] text-[#5D5A52]">{c.day}</dt>
                      <dd className="font-semibold">{days[mine.dayIdx].short}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#5D5A52]">{c.time}</dt>
                      <dd className="font-semibold tabular-nums">{hm(mine.start)}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#5D5A52]">{c.guests}</dt>
                      <dd className="font-semibold">{mine.party}</dd>
                    </div>
                  </dl>
                  <p className="font-mono text-xs tracking-[0.2em] text-[#5D5A52]">{mine.code}</p>
                </div>
              </TearTicket>
            </div>
            <p className="mx-auto mt-6 max-w-[48ch] text-sm text-[var(--lodos-muted)]">
              {arrived
                ? c.welcome
                : c.tearHow}
            </p>
            {(mine.note || mezes.length > 0) && (
              <p className="mx-auto mt-3 max-w-[52ch] text-sm">
                {mine.note && (
                  <>
                    {c.yourNote}: {mine.note}.{" "}
                  </>
                )}
                {mezes.length > 0 && <>{c.trayArrives(mezes.map((m) => m.name).join(", "))}</>}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                className="min-h-12 rounded-[10px] bg-[var(--ld-text)] px-6 text-xs font-semibold tracking-[0.16em] text-[var(--ld-bg)] uppercase hover:bg-white"
                onClick={() => setView("salon")}
                type="button"
              >
                {c.seeInBook}
              </button>
              <button
                className="min-h-12 rounded-[10px] border border-[var(--ld-line)] px-6 text-xs font-semibold tracking-[0.16em] uppercase hover:border-[var(--ld-text)]"
                onClick={again}
                type="button"
              >
                {c.newBooking}
              </button>
            </div>
          </section>
        ) : (
          <>
            <h1 className="pt-2 font-[family-name:var(--lodos-display)] text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02]">{c.h1}</h1>
            <p className="mt-3 max-w-[60ch] text-[var(--lodos-muted)]">{c.lead}</p>

            <div className="mt-6 grid gap-4 xl:grid-cols-[270px_minmax(0,1fr)]">
              <div className="space-y-8 self-start rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-6">
                <fieldset>
                  <legend className="text-sm font-semibold">{c.howMany}</legend>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      aria-label={c.fewer}
                      className="grid size-11 place-items-center rounded-[9px] border border-[var(--ld-line)] text-xl hover:border-[var(--ld-text)] disabled:opacity-40"
                      disabled={party <= 1}
                      onClick={() => setParty((n) => n - 1)}
                      type="button"
                    >
                      −
                    </button>
                    <output aria-live="polite" className="w-16 text-center font-[family-name:var(--lodos-display)] text-4xl tabular-nums">
                      {party}
                    </output>
                    <button
                      aria-label={c.more}
                      className="grid size-11 place-items-center rounded-[9px] border border-[var(--ld-line)] text-xl hover:border-[var(--ld-text)] disabled:opacity-40"
                      disabled={party >= MAX_PARTY}
                      onClick={() => setParty((n) => n + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  {party >= GROUP && (
                    <p className="mt-3 rounded-[12px] border border-[var(--ld-nar)]/40 p-3 text-sm">
                      {c.group(GROUP, tl(DEPOSIT))}
                    </p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="text-sm font-semibold">{c.whichNight}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {days.map((d, i) => (
                      <button aria-pressed={i === dayIdx} className={chip(i === dayIdx)} disabled={!open[i]} key={d.iso} onClick={() => setDayPick(i)} type="button">
                        {d.short}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-sm font-semibold">{c.timeHead}</legend>
                  {slots.length === 0 ? (
                    <p className="mt-3 text-sm text-[var(--lodos-muted)]">{c.tooLate}</p>
                  ) : (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3">
                      {slots.map((s) => (
                        <button
                          aria-label={c.slotLabel(hm(s.t), s.free)}
                          aria-pressed={s.t === time}
                          className={`${chip(s.t === time)} px-0 tabular-nums`}
                          disabled={!s.free}
                          key={s.t}
                          onClick={() => setTimePick(s.t)}
                          type="button"
                        >
                          {hm(s.t)}
                        </button>
                      ))}
                    </div>
                  )}
                </fieldset>

                {zones.length > 1 && (
                  <fieldset>
                    <legend className="text-sm font-semibold">{c.where}</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {zones.map((z) => (
                        <button aria-pressed={prefer === z} className={chip(prefer === z)} key={z} onClick={() => setPrefer((p) => (p === z ? null : z))} type="button">
                          {zoneName[z]}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
              </div>

              <div className="min-w-0">
                <div className="rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-4 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="font-[family-name:var(--lodos-display)] text-xl">
                      {day.long}
                      {time !== null && `, ${hm(time)}`}
                    </h2>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--lodos-muted)]">
                      <li className="flex items-center gap-1.5">
                        <span className="size-3 rounded-sm bg-[#EFEADF]" /> {c.free}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="size-3 rounded-sm bg-[var(--lodos-nar)]" /> {c.selected}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="size-3 rounded-sm bg-[repeating-linear-gradient(45deg,#3A3F3A_0_2px,#262926_2px_5px)]" /> {c.taken}
                      </li>
                    </ul>
                  </div>
                  {/* On a phone the plan stays tappable at a readable size and scrolls sideways. */}
                  <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
                    <div className="min-w-[600px] sm:min-w-0">
                      <FloorPlan onPick={setTablePick} prefer={prefer} states={states} />
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs text-[var(--lodos-muted)] sm:hidden">{c.scroll}</p>
                </div>

                <div className="mt-6">
                  <h2 className="text-sm font-semibold">{freeTables.length ? c.freeFor(party) : c.none}</h2>
                  {freeTables.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {freeTables.map((t) => (
                        <button
                          aria-pressed={t.id === tablePick}
                          className={`${chip(t.id === tablePick)} ${prefer === t.zone && t.id !== tablePick ? "ring-1 ring-[var(--lodos-cini)]" : ""}`}
                          key={t.id}
                          onClick={() => setTablePick(t.id)}
                          type="button"
                        >
                          {c.table} {t.id} · {zoneName[t.zone]}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--lodos-muted)]">{c.noneLead}</p>
                  )}
                </div>

                {table && time !== null && (
                  <form
                    className="mt-6 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-5 sm:p-7"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      confirm();
                    }}
                  >
                    <p className="font-[family-name:var(--lodos-display)] text-2xl">
                      {c.table} {table.id} · {zoneName[table.zone]}
                    </p>
                    <p className="text-sm text-[var(--lodos-muted)]">
                      {day.long}, {hm(time)}–{hm(time + DURATION)} · {c.people(party)}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-semibold" htmlFor="lodos-name">
                        {c.name}
                        <input
                          aria-describedby={errors.name ? "lodos-name-err" : undefined}
                          aria-invalid={!!errors.name}
                          autoComplete="name"
                          className="mt-1.5 block min-h-12 w-full rounded-[10px] border border-[var(--ld-line)] bg-[var(--ld-bg)] px-4 font-normal focus-visible:border-[var(--ld-text)] focus-visible:outline-2 focus-visible:outline-[var(--ld-text)]"
                          id="lodos-name"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                        {errors.name && (
                          <span className="mt-1 block font-normal text-[var(--lodos-nar)]" id="lodos-name-err">
                            {errors.name}
                          </span>
                        )}
                      </label>
                      <label className="block text-sm font-semibold" htmlFor="lodos-phone">
                        {c.phone}
                        <input
                          aria-describedby={errors.phone ? "lodos-phone-err" : undefined}
                          aria-invalid={!!errors.phone}
                          autoComplete="tel"
                          className="mt-1.5 block min-h-12 w-full rounded-[10px] border border-[var(--ld-line)] bg-[var(--ld-bg)] px-4 font-normal focus-visible:border-[var(--ld-text)] focus-visible:outline-2 focus-visible:outline-[var(--ld-text)]"
                          id="lodos-phone"
                          inputMode="tel"
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05XX XXX XX XX"
                          value={phone}
                        />
                        {errors.phone && (
                          <span className="mt-1 block font-normal text-[var(--lodos-nar)]" id="lodos-phone-err">
                            {errors.phone}
                          </span>
                        )}
                      </label>
                    </div>

                    <fieldset className="mt-5">
                      <legend className="text-sm font-semibold">{c.occasion}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.occasions.map((o) => (
                          <button aria-pressed={occasion === o} className={chip(occasion === o)} key={o} onClick={() => setOccasion((p) => (p === o ? null : o))} type="button">
                            {o}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <label className="mt-5 block text-sm font-semibold" htmlFor="lodos-note">
                      {c.note} <span className="font-normal text-[var(--lodos-muted)]">{c.optional}</span>
                      <textarea
                        className="mt-1.5 block min-h-20 w-full rounded-[10px] border border-[var(--ld-line)] bg-[var(--ld-bg)] px-4 py-3 font-normal focus-visible:border-[var(--ld-text)] focus-visible:outline-2 focus-visible:outline-[var(--ld-text)]"
                        id="lodos-note"
                        maxLength={200}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={c.notePlaceholder}
                        value={note}
                      />
                    </label>

                    {mezes.length > 0 && (
                      <div className="mt-5 rounded-[12px] border border-[var(--ld-line)] p-4 text-sm">
                        <p className="font-semibold">{c.siteTray}</p>
                        <p className="mt-1 text-[var(--lodos-muted)]">{mezes.map((m) => m.name).join(", ")}. {c.onTable}
                        </p>
                      </div>
                    )}

                    <button
                      className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-[var(--ld-text)] px-7 text-xs font-semibold tracking-[0.16em] text-[var(--ld-bg)] uppercase hover:bg-white sm:w-auto"
                      type="submit"
                    >
                      {c.submit}
                    </button>
                    <p className="mt-3 text-xs text-[var(--lodos-muted)]">{c.privacy}</p>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
