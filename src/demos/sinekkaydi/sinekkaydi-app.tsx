"use client";

import SplitFlapText from "@/components/reactbits/SplitFlapText";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  addDays,
  type BarberId,
  barberName,
  booked,
  CLOSE,
  etaOf,
  finish,
  hm,
  initialShop,
  isoDay,
  join,
  leave,
  minutesOf,
  OPEN,
  previewEta,
  type ServiceId,
  type Shop,
  skIn,
  tick,
} from "./data";
import { useLang } from "@/lib/lang-context";

const flapSize = "clamp(28px, 8.4vw, 42px)";

const COPY = {
  tr: {
    demo: "Demo: bir dakika üç saniyede geçer.",
    view: "Görünüm",
    views: [
      ["musteri", "Müşteri"],
      ["dukkan", "Dükkan ekranı"],
    ] as const,
    inShop: "Şu an dükkanda",
    live: "Canlı",
    paused: "Durdu",
    srQueue: (n: number, eta: number) => `Sırada ${n} kişi var. Şimdi gelen biri yaklaşık ${eta} dakika bekler.`,
    // Tile size for the two boards: English words are longer, so they shrink to their column.
    flapFont: flapSize,
    queueLabel: "SIRADA",
    queueFlap: (n: number) => `${n} KİŞİ`,
    ifNow: "ŞİMDİ GELSENİZ",
    nowFlap: "HEMEN",
    etaFlap: (m: number) => `~${m} DK`,
    left: (m: number) => `${m} dk kaldı`,
    free: "Boş",
    you: " · siz",
    callHint: "Dükkan ekranından berber gibi sıradakini çağırabilirsiniz.",
    whatTo: "Ne yapmak istersiniz?",
    tabs: [
      ["sira", "Sıraya gir"],
      ["randevu", "Randevu al"],
    ] as const,
    errName: "Adınızı yazın.",
    errPhone: "Telefonu 05XX XXX XX XX biçiminde yazın.",
    wait: "Evde ya da işinizde bekleyin; yola çıkma vaktini söyleriz.",
    go: "Yola çıkma vakti! Siz gelene kadar sıranız gelmiş olur.",
    seated: (b: string) => `Sıranız geldi: ${b} sizi bekliyor.`,
    done: "Sağlıcakla! Bir dahaki sefere saatini seçip randevu da alabilirsiniz.",
    leftQueue: "Sıradan çıktınız.",
    yourNo: "Sıra numaranız",
    min: "dk",
    ahead: (n: number) => `önünüzde ${n} kişi`,
    firstFree: "ilk boşalan berber",
    toShop: (m: number) => `dükkana ${m} dk`,
    sms: (m: number) => `Sıranıza ${m} dakika kala SMS de gelir (örnek; mesaj gönderilmez).`,
    leave: "Sıradan çık",
    rejoin: "Yeniden sıraya gir",
    book: "Randevu al",
    firstFreeShort: "İlk boşalan",
    whatService: "Ne yaptıracaksınız?",
    who: "Kimde?",
    whoNote: "Bekleme süresi seçiminize göre değişir.",
    now: "hemen",
    travel: "Dükkana kaç dakikada gelirsiniz?",
    name: "Adınız",
    phone: "Cep telefonu",
    join: "SIRAYA GİR",
    free2: "Sıra ücretsiz. Gelmezseniz 10 dakika sonra sıranız düşer.",
    loading: "Saatler yükleniyor…",
    booked: "Randevunuz alındı",
    today: "Bugün",
    tomorrow: "Yarın",
    noDeposit: "Kapora yok. Gelemeyecekseniz en geç bir saat önce SMS'teki bağlantıdan iptal edin; saatiniz sıradaki müşteriye açılsın (örnek; mesaj gönderilmez).",
    another: "Başka randevu",
    service: "Hizmet",
    barber: "Berber",
    any: "Fark etmez",
    time: "Saat",
    noSlots: "Bu gün boş saat kalmadı. Canlı sıraya girebilirsiniz.",
    pickTime: "Bir saat seçin.",
    bookCta: "RANDEVUYU AL",
    when: (today: boolean, t: string, b: string) => ` · ${today ? "bugün" : "yarın"} ${t} · ${b}`,
    chooseTime: " · saat seçin",
    priceNote: "Fiyatlar örnektir. Kapora alınmaz.",
    shopScreen: "Dükkan ekranı",
    pause: "Canlı akışı durdur",
    play: "Canlı akışı başlat",
    shopLead: "Duvardaki ekran ve berberin tableti. Kesim bitince “Bitir”e basmak sıradaki müşteriye haber verir.",
    next: "SIRADAKİ",
    none: "YOK",
    lastCalled: "SON ÇAĞRILAN",
    srCalled: (no: number, b: string) => `${no} numara, ${b} koltuğuna.`,
    chairs: "Koltuklar",
    youParen: " (siz)",
    emptyChair: "Boş, sırada uygun kimse yok",
    finish: "Bitir, sıradakini çağır",
    queue: (n: number) => `Sıra (${n})`,
    firstFreeLower: "ilk boşalan",
    emptyQueue: "Sırada kimse yok.",
  },
  en: {
    demo: "Demo: one minute passes every three seconds.",
    view: "View",
    views: [
      ["musteri", "Customer"],
      ["dukkan", "Shop screen"],
    ] as const,
    inShop: "In the shop now",
    live: "Live",
    paused: "Paused",
    srQueue: (n: number, eta: number) => `${n} people are waiting. Someone arriving now would wait about ${eta} minutes.`,
    flapFont: "min(42px, 13.5cqw)",
    queueLabel: "WAITING",
    queueFlap: (n: number) => `${n} PEOPLE`,
    ifNow: "IF YOU CAME NOW",
    nowFlap: "NOW",
    etaFlap: (m: number) => `~${m} MIN`,
    left: (m: number) => `${m} min left`,
    free: "Free",
    you: " · you",
    callHint: "On the shop screen you can call the next customer, as the barber would.",
    whatTo: "What would you like to do?",
    tabs: [
      ["sira", "Join the queue"],
      ["randevu", "Book a time"],
    ] as const,
    errName: "Write your name.",
    errPhone: "Enter a Turkish mobile number as 05XX XXX XX XX.",
    wait: "Wait at home or at work; we'll tell you when to set off.",
    go: "Time to set off! Your turn will have come by the time you arrive.",
    seated: (b: string) => `It's your turn: ${b} is waiting for you.`,
    done: "Looking sharp! Next time you can also pick a time and book.",
    leftQueue: "You've left the queue.",
    yourNo: "Your number",
    min: "min",
    ahead: (n: number) => (n === 1 ? "1 person ahead of you" : `${n} people ahead of you`),
    firstFree: "first free barber",
    toShop: (m: number) => `${m} min to the shop`,
    sms: (m: number) => `You'll also get an SMS ${m} minutes before your turn (a sample; no message is sent).`,
    leave: "Leave the queue",
    rejoin: "Join the queue again",
    book: "Book a time",
    firstFreeShort: "First free",
    whatService: "What are you having done?",
    who: "With whom?",
    whoNote: "The wait depends on your choice.",
    now: "now",
    travel: "How many minutes away from the shop are you?",
    name: "Your name",
    phone: "Mobile phone",
    join: "JOIN THE QUEUE",
    free2: "Joining is free. If you don't turn up, you drop out after 10 minutes.",
    loading: "Loading times…",
    booked: "You're booked in",
    today: "Today",
    tomorrow: "Tomorrow",
    noDeposit: "No deposit. If you can't make it, cancel at least an hour before using the link in the SMS, so the time opens up for someone else (a sample; no message is sent).",
    another: "Book another",
    service: "Service",
    barber: "Barber",
    any: "Any",
    time: "Time",
    noSlots: "No free times left this day. You can join the live queue.",
    pickTime: "Choose a time.",
    bookCta: "BOOK THIS TIME",
    when: (today: boolean, t: string, b: string) => ` · ${today ? "today" : "tomorrow"} ${t} · ${b}`,
    chooseTime: " · choose a time",
    priceNote: "Prices are examples. No deposit is taken.",
    shopScreen: "Shop screen",
    pause: "Pause the live feed",
    play: "Start the live feed",
    shopLead: "The screen on the wall and the barber's tablet. Pressing “Finish” when a cut is done tells the next customer.",
    next: "NEXT",
    none: "NONE",
    lastCalled: "LAST CALLED",
    srCalled: (no: number, b: string) => `Number ${no}, to ${b}'s chair.`,
    chairs: "Chairs",
    youParen: " (you)",
    emptyChair: "Free, nobody suitable waiting",
    finish: "Finish, call the next",
    queue: (n: number) => `Queue (${n})`,
    firstFreeLower: "first free",
    emptyQueue: "Nobody is waiting.",
  },
};

/** One simulated minute, in milliseconds. */
const SPEED = 3000;
const PHONE = /^0?5\d{9}$/;

const subscribe = () => () => {};
const clientNow = () => {
  const d = new Date();
  return `${isoDay(d)}|${d.getHours() * 60 + d.getMinutes() - (d.getMinutes() % 5)}`;
};
const serverNow = () => null;

const chip = (on: boolean) =>
  `min-h-11 px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sk-copper-light)] disabled:cursor-not-allowed disabled:opacity-30 ${
    on ? "bg-[var(--sk-copper)] text-white" : "border border-[var(--sk-line)] hover:border-[var(--sk-copper-light)]"
  }`;
const field =
  "mt-1.5 block min-h-12 w-full border border-[var(--sk-line)] bg-transparent px-4 font-normal text-white focus-visible:border-[var(--sk-copper-light)] focus-visible:outline-2 focus-visible:outline-[var(--sk-copper-light)]";
const upper = (s: string) => s.toLocaleUpperCase("tr");

export function SinekkaydiApp() {
  const lang = useLang();
  const c = COPY[lang];
  const { barbers, serviceName } = skIn(lang);
  const [shop, setShop] = useState<Shop>(initialShop);
  const [running, setRunning] = useState(true);
  const [view, setView] = useState<"musteri" | "dukkan">("musteri");
  const [tab, setTab] = useState<"sira" | "randevu">("sira");
  const [joined, setJoined] = useState<{ travel: number } | null>(null);
  const mine = joined && shop.mineNo !== null ? { no: shop.mineNo, travel: joined.travel } : null;

  // The shop keeps moving: one minute every few seconds.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setShop((s) => tick(s)), SPEED);
    return () => clearInterval(id);
  }, [running]);

  const waiting = shop.queue.length;
  const walkInEta = previewEta(shop, "sac", null);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--sk-muted)]">{c.demo}</p>
        <div aria-label={c.view} className="flex border border-[var(--sk-line)] p-1 text-sm" role="group">
          {c.views.map(([k, l]) => (
            <button aria-pressed={view === k} className={`min-h-10 px-4 transition-colors ${view === k ? "bg-[var(--sk-copper)] text-white" : "hover:bg-white/5"}`} key={k} onClick={() => setView(k)} type="button">
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        {view === "dukkan" ? (
          <ShopView mine={mine?.no ?? null} running={running} setRunning={setRunning} setShop={setShop} shop={shop} />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <section aria-labelledby="sk-live" className="border border-[var(--sk-line)] bg-[var(--sk-panel)] p-5 text-white sm:p-7 lg:sticky lg:top-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase" id="sk-live">
                  {c.inShop}
                </h3>
                <span className="flex items-center gap-2 text-xs text-white/60">
                  <span className="size-2 rounded-full bg-[var(--sk-copper)] motion-safe:animate-pulse" /> {running ? c.live : c.paused}
                </span>
              </div>
              <p className="sr-only">{c.srQueue(waiting, walkInEta)}</p>
              <div aria-hidden="true" className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="@container">
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">{c.queueLabel}</p>
                  <SplitFlapText charset="numeric" fontSize={c.flapFont} loop={false} padTo={6} text={c.queueFlap(waiting)} tileColor="#2B2522" />
                </div>
                <div className="@container">
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">{c.ifNow}</p>
                  <SplitFlapText charset="numeric" fontSize={c.flapFont} loop={false} padTo={6} text={walkInEta === 0 ? c.nowFlap : c.etaFlap(walkInEta)} textColor="#E6B08E" tileColor="#2B2522" />
                </div>
              </div>
              {/* Three compact chairs side by side on a phone, so "Sıraya gir" stays near the top. */}
              <ul className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:grid-cols-1 sm:gap-3">
                {shop.chairs.map((ch) => {
                  const total = ch.ticket ? minutesOf(ch.ticket.service) : 1;
                  return (
                    <li className="border border-[var(--sk-line)] p-3 sm:p-4" key={ch.barber}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                        <span className="text-sm font-semibold sm:text-base">{barberName(ch.barber)}</span>
                        <span className={`text-xs sm:text-sm ${ch.ticket ? "text-white/70" : "font-semibold text-[var(--sk-copper-light)]"}`}>
                          {ch.ticket ? c.left(ch.left) : c.free}
                        </span>
                      </div>
                      <p className="mt-1 hidden text-xs text-white/50 sm:block">
                        {ch.ticket ? `No ${ch.ticket.no} · ${serviceName(ch.ticket.service)}${ch.ticket.no === mine?.no ? c.you : ""}` : barbers.find((b) => b.id === ch.barber)!.note}
                      </p>
                      <div aria-hidden="true" className="mt-3 h-1 overflow-hidden bg-white/10">
                        <div className="h-full bg-[var(--sk-copper)] transition-[width] duration-700" style={{ width: ch.ticket ? `${(1 - ch.left / total) * 100}%` : "0%" }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-white/40 sm:mt-5">{c.callHint}</p>
            </section>

            <section className="border border-[var(--sk-line)] bg-[var(--sk-panel)] p-5 sm:p-7">
              <div aria-label={c.whatTo} className="grid grid-cols-2 gap-1 border border-[var(--sk-line)] p-1" role="group">
                {c.tabs.map(([k, l]) => (
                  <button aria-pressed={tab === k} className={`min-h-12 font-[family-name:var(--sk-display)] text-lg transition-colors ${tab === k ? "bg-[var(--sk-copper)] text-white" : "text-[var(--sk-copper-light)] hover:bg-white/5"}`} key={k} onClick={() => setTab(k)} type="button">
                    {l}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {tab === "sira" ? <JoinPanel mine={mine} onBook={() => setTab("randevu")} setJoined={setJoined} setShop={setShop} shop={shop} /> : <BookPanel />}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

function JoinPanel({
  shop,
  setShop,
  mine,
  setJoined,
  onBook,
}: {
  shop: Shop;
  setShop: (f: (s: Shop) => Shop) => void;
  mine: { no: number; travel: number } | null;
  setJoined: (j: { travel: number } | null) => void;
  onBook: () => void;
}) {
  const lang = useLang();
  const c = COPY[lang];
  const { services, barbers, serviceName } = skIn(lang);
  const [service, setService] = useState<ServiceId>("sac");
  const [pref, setPref] = useState<BarberId | null>(null);
  const [travel, setTravel] = useState(10);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const errName = tried && name.trim().length < 2 ? c.errName : null;
  const errPhone = tried && !PHONE.test(phone.replace(/\D/g, "")) ? c.errPhone : null;

  if (mine) {
    const chair = shop.chairs.find((c) => c.ticket?.no === mine.no);
    const inQueue = shop.queue.findIndex((t) => t.no === mine.no);
    const done = shop.done.includes(mine.no);
    const eta = inQueue >= 0 ? (etaOf(shop, mine.no) ?? 0) : 0;
    const phase = done ? "done" : chair ? "seated" : inQueue < 0 ? "left" : eta <= mine.travel ? "go" : "wait";
    const t = [...shop.queue, ...shop.chairs.flatMap((c) => (c.ticket ? [c.ticket] : []))].find((x) => x.no === mine.no);
    const message = {
      wait: c.wait,
      go: c.go,
      seated: c.seated(chair ? barberName(chair.barber) : ""),
      done: c.done,
      left: c.leftQueue,
    }[phase];
    return (
      <div>
        <div className={`p-5 ${phase === "go" ? "bg-[#3A2A20]" : phase === "seated" ? "bg-[#2F3A2C]" : "bg-white/5"}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase">{c.yourNo}</p>
              <div aria-hidden="true" className="mt-2">
                <SplitFlapText charset="numeric" fontSize={48} loop={false} padTo={3} text={String(mine.no)} tileColor="#1B1F24" />
              </div>
              <p className="sr-only">{mine.no}</p>
            </div>
            {phase === "wait" || phase === "go" ? (
              <div className="text-right">
                <p className="font-[family-name:var(--sk-display)] text-4xl tabular-nums">
                  ~{eta} {c.min}
                </p>
                <p className="text-sm">{c.ahead(inQueue)}</p>
              </div>
            ) : null}
          </div>
          <p aria-live="polite" className="mt-4 font-semibold">
            {message}
          </p>
          {t && phase !== "done" && (
            <p className="mt-1 text-sm opacity-75">
              {serviceName(t.service)} · {t.pref ? barberName(t.pref) : c.firstFree} · {c.toShop(mine.travel)}
            </p>
          )}
        </div>
        <p className="mt-4 text-sm text-[var(--sk-muted)]">{c.sms(mine.travel)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {phase === "wait" || phase === "go" ? (
            <button
              className="min-h-12 border border-[var(--sk-line)] px-6 font-semibold hover:border-[var(--sk-copper-light)]"
              onClick={() => {
                setShop((s) => leave(s, mine.no));
                setJoined(null);
              }}
              type="button"
            >
              {c.leave}
            </button>
          ) : (
            <>
              <button className="min-h-12 bg-[var(--sk-copper)] px-6 font-semibold text-white hover:bg-[#9A5E3F]" onClick={() => setJoined(null)} type="button">
                {c.rejoin}
              </button>
              <button className="min-h-12 px-4 font-semibold underline underline-offset-4" onClick={onBook} type="button">
                {c.book}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const options: { id: BarberId | null; label: string }[] = [{ id: null, label: c.firstFreeShort }, ...barbers.map((b) => ({ id: b.id, label: b.name }))];
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (name.trim().length < 2 || !PHONE.test(phone.replace(/\D/g, ""))) return;
        // Join against the latest state, even if a minute ticked since this render.
        setShop((s) => join(s, { name: name.trim(), service, pref, mine: true })[0]);
        setJoined({ travel });
      }}
    >
      <fieldset>
        <legend className="font-semibold">{c.whatService}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <button aria-pressed={service === s.id} className={chip(service === s.id)} key={s.id} onClick={() => setService(s.id)} type="button">
              {s.name} <span className="font-normal opacity-70">· {s.minutes} {c.min}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">{c.who}</legend>
        <p className="text-sm text-[var(--sk-muted)]">{c.whoNote}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {options.map((o) => {
            const eta = previewEta(shop, service, o.id);
            return (
              <button
                aria-pressed={pref === o.id}
                className={`${chip(pref === o.id)} flex items-center justify-between gap-2 py-2 text-left`}
                key={o.id ?? "any"}
                onClick={() => setPref(o.id)}
                type="button"
              >
                <span>{o.label}</span>
                <span className="font-normal tabular-nums opacity-80">{eta === 0 ? c.now : `~${eta} ${c.min}`}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">{c.travel}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[5, 10, 15, 20].map((m) => (
            <button aria-pressed={travel === m} className={chip(travel === m)} key={m} onClick={() => setTravel(m)} type="button">
              {m} {c.min}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold" htmlFor="sk-name">
          {c.name}
          <input aria-invalid={!!errName} autoComplete="given-name" className={field} id="sk-name" onChange={(e) => setName(e.target.value)} value={name} />
          {errName && <span className="mt-1 block font-normal text-[#F2A38F]">{errName}</span>}
        </label>
        <label className="block text-sm font-semibold" htmlFor="sk-phone">
          {c.phone}
          <input aria-invalid={!!errPhone} autoComplete="tel" className={field} id="sk-phone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
          {errPhone && <span className="mt-1 block font-normal text-[#F2A38F]">{errPhone}</span>}
        </label>
      </div>
      <button className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--sk-copper)] font-[family-name:var(--sk-display)] text-lg tracking-wide text-white hover:bg-[#9A5E3F]" type="submit">
        {c.join} <span className="font-[family-name:var(--sk-body)] text-sm font-semibold opacity-80">· No {shop.nextNo}</span>
      </button>
      <p className="mt-3 text-center text-xs text-[var(--sk-muted)]">{c.free2}</p>
    </form>
  );
}

function BookPanel() {
  const lang = useLang();
  const c = COPY[lang];
  const { services, barbers, serviceName, tl } = skIn(lang);
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  const [service, setService] = useState<ServiceId>("sac");
  const [barber, setBarber] = useState<BarberId | null>(null);
  const [dayPick, setDayPick] = useState<0 | 1 | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<{ day: string; time: number; barber: BarberId; service: ServiceId } | null>(null);
  if (!now) return <p className="text-[var(--sk-muted)]">{c.loading}</p>;

  const [today, minNow] = now.split("|");
  const days = [today, addDays(today, 1)];
  const slotsFor = (d: 0 | 1) => {
    const out: { t: number; who: BarberId }[] = [];
    for (let t = OPEN; t + minutesOf(service) <= CLOSE; t += 30) {
      if (d === 0 && t < Number(minNow) + 15) continue;
      const who = (barber ? [barber] : barbers.map((b) => b.id)).find((b) => !booked(days[d], b, t));
      if (who) out.push({ t, who });
    }
    return out;
  };
  const day: 0 | 1 = dayPick ?? (slotsFor(0).length ? 0 : 1);
  const slots = slotsFor(day);
  const slot = slots.find((s) => s.t === time) ?? null;
  const svc = services.find((s) => s.id === service)!;
  const errName = tried && name.trim().length < 2 ? c.errName : null;
  const errPhone = tried && !PHONE.test(phone.replace(/\D/g, "")) ? c.errPhone : null;

  if (done) {
    return (
      <div aria-live="polite">
        <p className="text-[11px] font-bold tracking-[0.16em] text-[#F2A38F] uppercase">{c.booked}</p>
        <p className="mt-2 font-[family-name:var(--sk-display)] text-3xl leading-tight">
          {done.day === today ? c.today : c.tomorrow} {hm(done.time)}
        </p>
        <p className="mt-2">
          {barberName(done.barber)} · {serviceName(done.service)} · {tl(services.find((s) => s.id === done.service)!.price)}
        </p>
        <p className="mt-4 text-sm text-[var(--sk-muted)]">
          {c.noDeposit}
        </p>
        <button
          className="mt-6 min-h-12 bg-[var(--sk-copper)] px-6 font-semibold text-white hover:bg-[#9A5E3F]"
          onClick={() => {
            setDone(null);
            setTime(null);
            setTried(false);
          }}
          type="button"
        >
          {c.another}
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (!slot || name.trim().length < 2 || !PHONE.test(phone.replace(/\D/g, ""))) return;
        setDone({ day: days[day], time: slot.t, barber: slot.who, service });
      }}
    >
      <fieldset>
        <legend className="font-semibold">{c.service}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <button aria-pressed={service === s.id} className={chip(service === s.id)} key={s.id} onClick={() => setService(s.id)} type="button">
              {s.name} <span className="font-normal opacity-70">· {tl(s.price)}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">{c.barber}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[null, ...barbers.map((b) => b.id)].map((b) => (
            <button aria-pressed={barber === b} className={chip(barber === b)} key={b ?? "any"} onClick={() => setBarber(b)} type="button">
              {b ? barberName(b) : c.any}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">{c.time}</legend>
        <div className="mt-3 flex gap-2">
          {[c.today, c.tomorrow].map((l, i) => (
            <button aria-pressed={day === i} className={chip(day === i)} disabled={i === 0 && !slotsFor(0).length} key={l} onClick={() => setDayPick(i as 0 | 1)} type="button">
              {l}
            </button>
          ))}
        </div>
        {slots.length ? (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {slots.map((s) => (
              <button aria-pressed={time === s.t} className={`${chip(time === s.t)} px-0 tabular-nums`} key={s.t} onClick={() => setTime(s.t)} type="button">
                {hm(s.t)}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--sk-muted)]">{c.noSlots}</p>
        )}
        {tried && !slot && <p className="mt-2 text-sm text-[#F2A38F]">{c.pickTime}</p>}
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold" htmlFor="sk-bname">
          {c.name}
          <input aria-invalid={!!errName} autoComplete="given-name" className={field} id="sk-bname" onChange={(e) => setName(e.target.value)} value={name} />
          {errName && <span className="mt-1 block font-normal text-[#F2A38F]">{errName}</span>}
        </label>
        <label className="block text-sm font-semibold" htmlFor="sk-bphone">
          {c.phone}
          <input aria-invalid={!!errPhone} autoComplete="tel" className={field} id="sk-bphone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
          {errPhone && <span className="mt-1 block font-normal text-[#F2A38F]">{errPhone}</span>}
        </label>
      </div>

      {/* On a phone the booking button stays under the thumb with the summary on it. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--sk-line)] bg-[var(--sk-bg)]/95 p-3 backdrop-blur sm:static sm:mt-7 sm:border-0 sm:bg-transparent sm:p-0">
        <button className="flex min-h-14 w-full items-center justify-between gap-3 bg-[var(--sk-copper)] px-5 text-left text-white hover:bg-[#9A5E3F]" type="submit">
          <span className="min-w-0">
            <span className="block font-[family-name:var(--sk-display)] tracking-wide">{c.bookCta}</span>
            <span className="block truncate text-xs opacity-85">
              {svc.name}
              {slot ? c.when(day === 0, hm(slot.t), barberName(slot.who)) : c.chooseTime}
            </span>
          </span>
          <span className="shrink-0 font-semibold">{tl(svc.price)}</span>
        </button>
      </div>
      <p className="mt-3 text-xs text-[var(--sk-muted)]">{c.priceNote}</p>
    </form>
  );
}

function ShopView({
  shop,
  setShop,
  running,
  setRunning,
  mine,
}: {
  shop: Shop;
  setShop: (f: (s: Shop) => Shop) => void;
  running: boolean;
  setRunning: (r: boolean) => void;
  mine: number | null;
}) {
  const lang = useLang();
  const c = COPY[lang];
  const { serviceName } = skIn(lang);
  const next = shop.queue[0];
  return (
    <div className="border border-[var(--sk-line)] bg-[var(--sk-panel)] p-5 text-white sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-[family-name:var(--sk-display)] text-3xl text-[var(--sk-copper-light)]">{c.shopScreen}</h3>
        <button className="min-h-11 border border-[var(--sk-line)] px-4 text-sm font-semibold hover:bg-white/5" onClick={() => setRunning(!running)} type="button">
          {running ? c.pause : c.play}
        </button>
      </div>
      <p className="mt-2 max-w-[60ch] text-sm text-white/60">{c.shopLead}</p>

      <div aria-hidden="true" className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">{c.next}</p>
          <SplitFlapText charset="numeric" fontSize={flapSize} loop={false} padTo={4} text={next ? `NO${next.no}` : c.none} tileColor="#2B2522" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">{c.lastCalled}</p>
          <SplitFlapText
            charset="numeric"
            fontSize={flapSize}
            loop={false}
            padTo={9}
            text={shop.last ? upper(`${shop.last.no} ${barberName(shop.last.barber).split(" ").pop()}`) : "—"}
            textColor="#E6B08E"
            tileColor="#2B2522"
          />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {shop.last ? c.srCalled(shop.last.no, barberName(shop.last.barber)) : ""}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">{c.chairs}</h2>
          <ul className="mt-3 space-y-3">
            {shop.chairs.map((ch) => (
              <li className="flex items-center justify-between gap-3 border border-[var(--sk-line)] p-4" key={ch.barber}>
                <span className="min-w-0">
                  <span className="block font-semibold">{barberName(ch.barber)}</span>
                  <span className="block min-w-0 [overflow-wrap:anywhere] text-sm text-white/60">
                    {ch.ticket ? `No ${ch.ticket.no} ${ch.ticket.name}${ch.ticket.no === mine ? c.youParen : ""} · ${ch.left} ${c.min}` : c.emptyChair}
                  </span>
                </span>
                <button
                  className="min-h-11 shrink-0 bg-[var(--sk-copper)] px-4 text-sm font-semibold disabled:opacity-30"
                  disabled={!ch.ticket}
                  onClick={() => setShop((s) => finish(s, ch.barber))}
                  type="button"
                >
                  {c.finish}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">{c.queue(shop.queue.length)}</h2>
          {shop.queue.length ? (
            <ol className="mt-3 divide-y divide-white/8 border border-[var(--sk-line)]">
              {shop.queue.map((t) => (
                <li className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${t.no === mine ? "text-[var(--sk-copper-light)]" : ""}`} key={t.no}>
                  <span className="font-semibold tabular-nums">No {t.no}</span>
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    {t.name}
                    {t.no === mine ? c.youParen : ""} · {serviceName(t.service)}
                  </span>
                  <span className="shrink-0 text-white/60">{t.pref ? barberName(t.pref) : c.firstFreeLower}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-white/60">{c.emptyQueue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
