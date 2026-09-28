"use client";

import SplitFlapText from "@/components/reactbits/SplitFlapText";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  addDays,
  type BarberId,
  barberName,
  barbers,
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
  serviceName,
  services,
  type Shop,
  tick,
  tl,
} from "./data";

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
const flapSize = "clamp(28px, 8.4vw, 42px)";

export function SinekkaydiApp() {
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
        <p className="text-sm text-[var(--sk-muted)]">Demo: bir dakika üç saniyede geçer.</p>
        <div aria-label="Görünüm" className="flex border border-[var(--sk-line)] p-1 text-sm" role="group">
          {(
            [
              ["musteri", "Müşteri"],
              ["dukkan", "Dükkan ekranı"],
            ] as const
          ).map(([k, l]) => (
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
                  Şu an dükkanda
                </h3>
                <span className="flex items-center gap-2 text-xs text-white/60">
                  <span className="size-2 rounded-full bg-[var(--sk-copper)] motion-safe:animate-pulse" /> {running ? "Canlı" : "Durdu"}
                </span>
              </div>
              <p className="sr-only">
                Sırada {waiting} kişi var. Şimdi gelen biri yaklaşık {walkInEta} dakika bekler.
              </p>
              <div aria-hidden="true" className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">SIRADA</p>
                  <SplitFlapText charset="numeric" fontSize={flapSize} loop={false} padTo={6} text={`${waiting} KİŞİ`} tileColor="#2B2522" />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">ŞİMDİ GELSENİZ</p>
                  <SplitFlapText charset="numeric" fontSize={flapSize} loop={false} padTo={6} text={walkInEta === 0 ? "HEMEN" : `~${walkInEta} DK`} textColor="#E6B08E" tileColor="#2B2522" />
                </div>
              </div>
              {/* Three compact chairs side by side on a phone, so "Sıraya gir" stays near the top. */}
              <ul className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:grid-cols-1 sm:gap-3">
                {shop.chairs.map((c) => {
                  const total = c.ticket ? minutesOf(c.ticket.service) : 1;
                  return (
                    <li className="border border-[var(--sk-line)] p-3 sm:p-4" key={c.barber}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                        <span className="text-sm font-semibold sm:text-base">{barberName(c.barber)}</span>
                        <span className={`text-xs sm:text-sm ${c.ticket ? "text-white/70" : "font-semibold text-[var(--sk-copper-light)]"}`}>
                          {c.ticket ? `${c.left} dk kaldı` : "Boş"}
                        </span>
                      </div>
                      <p className="mt-1 hidden text-xs text-white/50 sm:block">
                        {c.ticket ? `No ${c.ticket.no} · ${serviceName(c.ticket.service)}${c.ticket.no === mine?.no ? " · siz" : ""}` : barbers.find((b) => b.id === c.barber)!.note}
                      </p>
                      <div aria-hidden="true" className="mt-3 h-1 overflow-hidden bg-white/10">
                        <div className="h-full bg-[var(--sk-copper)] transition-[width] duration-700" style={{ width: c.ticket ? `${(1 - c.left / total) * 100}%` : "0%" }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-white/40 sm:mt-5">Dükkan ekranından berber gibi sıradakini çağırabilirsiniz.</p>
            </section>

            <section className="border border-[var(--sk-line)] bg-[var(--sk-panel)] p-5 sm:p-7">
              <div aria-label="Ne yapmak istersiniz?" className="grid grid-cols-2 gap-1 border border-[var(--sk-line)] p-1" role="group">
                {(
                  [
                    ["sira", "Sıraya gir"],
                    ["randevu", "Randevu al"],
                  ] as const
                ).map(([k, l]) => (
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
  const [service, setService] = useState<ServiceId>("sac");
  const [pref, setPref] = useState<BarberId | null>(null);
  const [travel, setTravel] = useState(10);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const errName = tried && name.trim().length < 2 ? "Adınızı yazın." : null;
  const errPhone = tried && !PHONE.test(phone.replace(/\D/g, "")) ? "Telefonu 05XX XXX XX XX biçiminde yazın." : null;

  if (mine) {
    const chair = shop.chairs.find((c) => c.ticket?.no === mine.no);
    const inQueue = shop.queue.findIndex((t) => t.no === mine.no);
    const done = shop.done.includes(mine.no);
    const eta = inQueue >= 0 ? (etaOf(shop, mine.no) ?? 0) : 0;
    const phase = done ? "done" : chair ? "seated" : inQueue < 0 ? "left" : eta <= mine.travel ? "go" : "wait";
    const t = [...shop.queue, ...shop.chairs.flatMap((c) => (c.ticket ? [c.ticket] : []))].find((x) => x.no === mine.no);
    const message = {
      wait: "Evde ya da işinizde bekleyin; yola çıkma vaktini söyleriz.",
      go: "Yola çıkma vakti! Siz gelene kadar sıranız gelmiş olur.",
      seated: `Sıranız geldi: ${chair ? barberName(chair.barber) : ""} sizi bekliyor.`,
      done: "Sağlıcakla! Bir dahaki sefere saatini seçip randevu da alabilirsiniz.",
      left: "Sıradan çıktınız.",
    }[phase];
    return (
      <div>
        <div className={`p-5 ${phase === "go" ? "bg-[#3A2A20]" : phase === "seated" ? "bg-[#2F3A2C]" : "bg-white/5"}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase">Sıra numaranız</p>
              <div aria-hidden="true" className="mt-2">
                <SplitFlapText charset="numeric" fontSize={48} loop={false} padTo={3} text={String(mine.no)} tileColor="#1B1F24" />
              </div>
              <p className="sr-only">{mine.no}</p>
            </div>
            {phase === "wait" || phase === "go" ? (
              <div className="text-right">
                <p className="font-[family-name:var(--sk-display)] text-4xl tabular-nums">~{eta} dk</p>
                <p className="text-sm">önünüzde {inQueue} kişi</p>
              </div>
            ) : null}
          </div>
          <p aria-live="polite" className="mt-4 font-semibold">
            {message}
          </p>
          {t && phase !== "done" && (
            <p className="mt-1 text-sm opacity-75">
              {serviceName(t.service)} · {t.pref ? barberName(t.pref) : "ilk boşalan berber"} · dükkana {mine.travel} dk
            </p>
          )}
        </div>
        <p className="mt-4 text-sm text-[var(--sk-muted)]">Sıranıza {mine.travel} dakika kala SMS de gelir (örnek; mesaj gönderilmez).</p>
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
              Sıradan çık
            </button>
          ) : (
            <>
              <button className="min-h-12 bg-[var(--sk-copper)] px-6 font-semibold text-white hover:bg-[#9A5E3F]" onClick={() => setJoined(null)} type="button">
                Yeniden sıraya gir
              </button>
              <button className="min-h-12 px-4 font-semibold underline underline-offset-4" onClick={onBook} type="button">
                Randevu al
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const options: { id: BarberId | null; label: string }[] = [{ id: null, label: "İlk boşalan" }, ...barbers.map((b) => ({ id: b.id, label: b.name }))];
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
        <legend className="font-semibold">Ne yaptıracaksınız?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <button aria-pressed={service === s.id} className={chip(service === s.id)} key={s.id} onClick={() => setService(s.id)} type="button">
              {s.name} <span className="font-normal opacity-70">· {s.minutes} dk</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">Kimde?</legend>
        <p className="text-sm text-[var(--sk-muted)]">Bekleme süresi seçiminize göre değişir.</p>
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
                <span className="font-normal tabular-nums opacity-80">{eta === 0 ? "hemen" : `~${eta} dk`}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">Dükkana kaç dakikada gelirsiniz?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[5, 10, 15, 20].map((m) => (
            <button aria-pressed={travel === m} className={chip(travel === m)} key={m} onClick={() => setTravel(m)} type="button">
              {m} dk
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold" htmlFor="sk-name">
          Adınız
          <input aria-invalid={!!errName} autoComplete="given-name" className={field} id="sk-name" onChange={(e) => setName(e.target.value)} value={name} />
          {errName && <span className="mt-1 block font-normal text-[#F2A38F]">{errName}</span>}
        </label>
        <label className="block text-sm font-semibold" htmlFor="sk-phone">
          Cep telefonu
          <input aria-invalid={!!errPhone} autoComplete="tel" className={field} id="sk-phone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
          {errPhone && <span className="mt-1 block font-normal text-[#F2A38F]">{errPhone}</span>}
        </label>
      </div>
      <button className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--sk-copper)] font-[family-name:var(--sk-display)] text-lg tracking-wide text-white hover:bg-[#9A5E3F]" type="submit">
        SIRAYA GİR <span className="font-[family-name:var(--sk-body)] text-sm font-semibold opacity-80">· No {shop.nextNo}</span>
      </button>
      <p className="mt-3 text-center text-xs text-[var(--sk-muted)]">Sıra ücretsiz. Gelmezseniz 10 dakika sonra sıranız düşer.</p>
    </form>
  );
}

function BookPanel() {
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  const [service, setService] = useState<ServiceId>("sac");
  const [barber, setBarber] = useState<BarberId | null>(null);
  const [dayPick, setDayPick] = useState<0 | 1 | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<{ day: string; time: number; barber: BarberId; service: ServiceId } | null>(null);
  if (!now) return <p className="text-[var(--sk-muted)]">Saatler yükleniyor…</p>;

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
  const errName = tried && name.trim().length < 2 ? "Adınızı yazın." : null;
  const errPhone = tried && !PHONE.test(phone.replace(/\D/g, "")) ? "Telefonu 05XX XXX XX XX biçiminde yazın." : null;

  if (done) {
    return (
      <div aria-live="polite">
        <p className="text-[11px] font-bold tracking-[0.16em] text-[#F2A38F] uppercase">Randevunuz alındı</p>
        <p className="mt-2 font-[family-name:var(--sk-display)] text-3xl leading-tight">
          {done.day === today ? "Bugün" : "Yarın"} {hm(done.time)}
        </p>
        <p className="mt-2">
          {barberName(done.barber)} · {serviceName(done.service)} · {tl(services.find((s) => s.id === done.service)!.price)}
        </p>
        <p className="mt-4 text-sm text-[var(--sk-muted)]">
          Kapora yok. Gelemeyecekseniz en geç bir saat önce SMS&apos;teki bağlantıdan iptal edin; saatiniz sıradaki müşteriye açılsın (örnek; mesaj gönderilmez).
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
          Başka randevu
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
        <legend className="font-semibold">Hizmet</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <button aria-pressed={service === s.id} className={chip(service === s.id)} key={s.id} onClick={() => setService(s.id)} type="button">
              {s.name} <span className="font-normal opacity-70">· {tl(s.price)}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">Berber</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[null, ...barbers.map((b) => b.id)].map((b) => (
            <button aria-pressed={barber === b} className={chip(barber === b)} key={b ?? "any"} onClick={() => setBarber(b)} type="button">
              {b ? barberName(b) : "Fark etmez"}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">Saat</legend>
        <div className="mt-3 flex gap-2">
          {(["Bugün", "Yarın"] as const).map((l, i) => (
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
          <p className="mt-3 text-sm text-[var(--sk-muted)]">Bu gün boş saat kalmadı. Canlı sıraya girebilirsiniz.</p>
        )}
        {tried && !slot && <p className="mt-2 text-sm text-[#F2A38F]">Bir saat seçin.</p>}
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold" htmlFor="sk-bname">
          Adınız
          <input aria-invalid={!!errName} autoComplete="given-name" className={field} id="sk-bname" onChange={(e) => setName(e.target.value)} value={name} />
          {errName && <span className="mt-1 block font-normal text-[#F2A38F]">{errName}</span>}
        </label>
        <label className="block text-sm font-semibold" htmlFor="sk-bphone">
          Cep telefonu
          <input aria-invalid={!!errPhone} autoComplete="tel" className={field} id="sk-bphone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
          {errPhone && <span className="mt-1 block font-normal text-[#F2A38F]">{errPhone}</span>}
        </label>
      </div>

      {/* On a phone the booking button stays under the thumb with the summary on it. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--sk-line)] bg-[var(--sk-bg)]/95 p-3 backdrop-blur sm:static sm:mt-7 sm:border-0 sm:bg-transparent sm:p-0">
        <button className="flex min-h-14 w-full items-center justify-between gap-3 bg-[var(--sk-copper)] px-5 text-left text-white hover:bg-[#9A5E3F]" type="submit">
          <span className="min-w-0">
            <span className="block font-[family-name:var(--sk-display)] tracking-wide">RANDEVUYU AL</span>
            <span className="block truncate text-xs opacity-85">
              {svc.name}
              {slot ? ` · ${day === 0 ? "bugün" : "yarın"} ${hm(slot.t)} · ${barberName(slot.who)}` : " · saat seçin"}
            </span>
          </span>
          <span className="shrink-0 font-semibold">{tl(svc.price)}</span>
        </button>
      </div>
      <p className="mt-3 text-xs text-[var(--sk-muted)]">Fiyatlar örnektir. Kapora alınmaz.</p>
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
  const next = shop.queue[0];
  return (
    <div className="border border-[var(--sk-line)] bg-[var(--sk-panel)] p-5 text-white sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-[family-name:var(--sk-display)] text-3xl text-[var(--sk-copper-light)]">Dükkan ekranı</h3>
        <button className="min-h-11 border border-[var(--sk-line)] px-4 text-sm font-semibold hover:bg-white/5" onClick={() => setRunning(!running)} type="button">
          {running ? "Canlı akışı durdur" : "Canlı akışı başlat"}
        </button>
      </div>
      <p className="mt-2 max-w-[60ch] text-sm text-white/60">Duvardaki ekran ve berberin tableti. Kesim bitince “Bitir”e basmak sıradaki müşteriye haber verir.</p>

      <div aria-hidden="true" className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">SIRADAKİ</p>
          <SplitFlapText charset="numeric" fontSize={flapSize} loop={false} padTo={4} text={next ? `NO${next.no}` : "YOK"} tileColor="#2B2522" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-white/50">SON ÇAĞRILAN</p>
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
        {shop.last ? `${shop.last.no} numara, ${barberName(shop.last.barber)} koltuğuna.` : ""}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Koltuklar</h2>
          <ul className="mt-3 space-y-3">
            {shop.chairs.map((c) => (
              <li className="flex items-center justify-between gap-3 border border-[var(--sk-line)] p-4" key={c.barber}>
                <span className="min-w-0">
                  <span className="block font-semibold">{barberName(c.barber)}</span>
                  <span className="block truncate text-sm text-white/60">
                    {c.ticket ? `No ${c.ticket.no} ${c.ticket.name}${c.ticket.no === mine ? " (siz)" : ""} · ${c.left} dk` : "Boş, sırada uygun kimse yok"}
                  </span>
                </span>
                <button
                  className="min-h-11 shrink-0 bg-[var(--sk-copper)] px-4 text-sm font-semibold disabled:opacity-30"
                  disabled={!c.ticket}
                  onClick={() => setShop((s) => finish(s, c.barber))}
                  type="button"
                >
                  Bitir, sıradakini çağır
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Sıra ({shop.queue.length})</h2>
          {shop.queue.length ? (
            <ol className="mt-3 divide-y divide-white/8 border border-[var(--sk-line)]">
              {shop.queue.map((t) => (
                <li className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${t.no === mine ? "text-[var(--sk-copper-light)]" : ""}`} key={t.no}>
                  <span className="font-semibold tabular-nums">No {t.no}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {t.name}
                    {t.no === mine ? " (siz)" : ""} · {serviceName(t.service)}
                  </span>
                  <span className="shrink-0 text-white/60">{t.pref ? barberName(t.pref) : "ilk boşalan"}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-white/60">Sırada kimse yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
