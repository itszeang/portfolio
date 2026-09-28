"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  type Appt,
  type Day,
  type DoctorId,
  doctors,
  EMERGENCY,
  emptyTriage,
  freeStarts,
  type HealthKey,
  healthQuestions,
  hm,
  isoDay,
  openDays,
  seedAppts,
  toothName,
  type Triage,
  urgency,
  type VisitId,
  visits,
} from "./data";
import { DoctorView } from "./doctor-view";
import { ToothChart } from "./tooth-chart";

// Today's date and time only exist in the browser.
const subscribe = () => () => {};
const clientNow = () => {
  const d = new Date();
  return `${isoDay(d)}|${d.getHours() * 60 + d.getMinutes() - (d.getMinutes() % 10)}`;
};
const serverNow = () => null;

export function MineBooking() {
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  if (!now) return <p className="mx-auto max-w-5xl px-5 py-24 text-[var(--mine-muted)] sm:px-8">Randevu ekranı hazırlanıyor…</p>;
  const [iso, min] = now.split("|");
  return <Flow nowMin={Number(min)} todayIso={iso} />;
}

type Step = "visit" | "chart" | "triage" | "danger" | "slot" | "contact" | "health" | "review" | "done";
export type Health = Record<HealthKey, { yes: boolean | null; detail: string }>;
const emptyHealth = Object.fromEntries(healthQuestions.map((h) => [h.key, { yes: null, detail: "" }])) as Health;

/** What the doctor's screen gets once a booking is confirmed. */
export type Booked = Appt & {
  dayLabel: string;
  teeth: number[];
  chart: "adult" | "child" | null;
  triage: Triage | null;
  emergency: boolean;
  patient: string;
  guardian: string | null;
  consentAt: string | null;
  health: Health | null;
};

const PHONE = /^0?5\d{9}$/;
const LETTERS = "ABCDEF";

const pill = (on: boolean) =>
  `min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mine-cobalt)] disabled:cursor-not-allowed disabled:opacity-35 ${
    on ? "bg-[var(--mine-cobalt)] text-white" : "bg-[var(--mine-bg)] hover:bg-[var(--mine-cobalt-soft)]"
  }`;
const field =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-[var(--mine-ink)]/15 bg-white px-4 font-normal focus-visible:border-[var(--mine-cobalt)] focus-visible:outline-2 focus-visible:outline-[var(--mine-cobalt)]";

function Flow({ todayIso, nowMin }: { todayIso: string; nowMin: number }) {
  const [view, setView] = useState<"hasta" | "hekim">("hasta");
  const [history, setHistory] = useState<Step[]>(["visit"]);
  const step = history[history.length - 1];
  const [visitId, setVisitId] = useState<VisitId | null>(null);
  const [teeth, setTeeth] = useState<number[]>([]);
  const [triage, setTriage] = useState<Triage>(emptyTriage);
  const [doctorPick, setDoctorPick] = useState<DoctorId | null>(null);
  const [slot, setSlot] = useState<{ day: number; start: number; emergency: boolean } | null>(null);
  const [dayPick, setDayPick] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [consent, setConsent] = useState(false);
  const [health, setHealth] = useState<Health>(emptyHealth);
  const [tried, setTried] = useState<Step[]>([]);
  const [booked, setBooked] = useState<Booked | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const visit = visits.find((v) => v.id === visitId) ?? null;
  const level = visit?.triage ? urgency(triage) : "normal";
  const days = useMemo(() => openDays(todayIso, 6), [todayIso]);
  const recommended: DoctorId | null = !visit ? null : visit.who.length === 1 ? visit.who[0] : level === "endo" ? "mert" : "elif";
  const doctorId = doctorPick && visit?.who.includes(doctorPick) ? doctorPick : recommended;
  const doctor = doctors.find((d) => d.id === doctorId) ?? null;
  const child = visit?.id === "cocuk";

  const booksFor = (d: Day, doc: DoctorId) => [...seedAppts(d.iso, d.dow, doc), ...(booked && booked.day === d.iso && booked.doctor === doc ? [booked] : [])];
  const startsFor = (i: number) => {
    if (!visit || !doctor || !doctor.days.includes(days[i].dow)) return [];
    return freeStarts(days[i].dow, visit.minutes, booksFor(days[i], doctor.id), days[i].offset === 0 ? nowMin + 60 : 0);
  };
  const dayOpen = days.map((_, i) => startsFor(i).length > 0);
  const dayIdx = dayPick !== null && dayOpen[dayPick] ? dayPick : Math.max(0, dayOpen.indexOf(true));

  // The earliest emergency hour (kept free every weekday) for someone in pain.
  const emergency = (() => {
    for (let i = 0; i < days.length; i++) {
      if (days[i].dow === 6) continue;
      for (const e of EMERGENCY) if (days[i].offset > 0 || e >= nowMin + 30) return { day: i, start: e };
    }
    return null;
  })();
  const closedNow = days[0].offset !== 0 || nowMin >= 19 * 60;

  // Focus the question so letter keys and Enter work at once. New questions are
  // focused when their enter animation ends (see onAnimationComplete below).
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [view]);

  const go = (s: Step) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  function afterVisit(v = visit) {
    if (!v) return;
    if (v.chart) go("chart");
    else go("slot");
  }
  function afterChart() {
    if (visit?.triage) go("triage");
    else go("slot");
  }
  // Problems with the current answers; shown only after a first "Devam", and
  // each one disappears as soon as it is fixed.
  const problems = (s: Step): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === "triage") {
      if (!triage.since) e.since = "Ne zamandır sürdüğünü seçin.";
      if (triage.swelling === null) e.swelling = "Evet ya da hayır seçin.";
      if (triage.night === null) e.night = "Evet ya da hayır seçin.";
      if (triage.danger === null) e.danger = "Evet ya da hayır seçin.";
    }
    if (s === "contact") {
      if (child) {
        if (childName.trim().length < 2) e.childName = "Çocuğun adını yazın.";
        const age = Number(childAge);
        if (!childAge || !Number.isInteger(age) || age < 0 || age > 17) e.childAge = "0 ile 17 arasında bir yaş yazın.";
      }
      if (name.trim().length < 2) e.name = child ? "Veli adını yazın." : "Adınızı yazın; en az iki harf.";
      if (!PHONE.test(phone.replace(/\D/g, ""))) e.phone = "Telefonu 05XX XXX XX XX biçiminde yazın.";
    }
    return e;
  };
  const errors = tried.includes(step) ? problems(step) : {};

  function afterTriage() {
    setTried((t) => [...t, "triage"]);
    if (Object.keys(problems("triage")).length) return;
    go(urgency(triage) === "danger" ? "danger" : "slot");
  }
  function afterContact() {
    setTried((t) => [...t, "contact"]);
    if (Object.keys(problems("contact")).length) return;
    go(consent ? "health" : "review");
  }
  function confirm() {
    if (!visit || !doctor || !slot) return;
    const d = days[slot.day];
    const stamp = new Date();
    setBooked({
      id: `mine-${d.iso}-${slot.start}`,
      doctor: doctor.id,
      day: d.iso,
      dayLabel: d.long,
      start: slot.start,
      minutes: visit.minutes,
      visit: visit.id,
      who: child ? childName.trim() : name.trim(),
      mine: true,
      teeth,
      chart: visit.chart,
      triage: visit.triage ? triage : null,
      emergency: slot.emergency,
      patient: child ? `${childName.trim()} (${childAge} yaş)` : name.trim(),
      guardian: child ? name.trim() : null,
      consentAt: consent ? `${stamp.toLocaleDateString("tr-TR")} ${stamp.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : null,
      health: consent ? health : null,
    });
    go("done");
  }
  function restart() {
    setHistory(["visit"]);
    setVisitId(null);
    setTeeth([]);
    setTriage(emptyTriage);
    setDoctorPick(null);
    setSlot(null);
    setDayPick(null);
    setName("");
    setPhone("");
    setChildName("");
    setChildAge("");
    setConsent(false);
    setHealth(emptyHealth);
    setTried([]);
  }

  // Rough progress: how far along the path this visit type takes.
  const path: Step[] = ["visit", ...(visit?.chart ? (["chart"] as Step[]) : []), ...(visit?.triage ? (["triage"] as Step[]) : []), "slot", "contact", ...(consent ? (["health"] as Step[]) : []), "review"];
  const progress = step === "done" ? 1 : Math.max(0.06, path.indexOf(step) / path.length);

  const slotOk = slot && slot.day < days.length && (slot.emergency || startsFor(slot.day).includes(slot.start));

  const title = (text: string, sub?: string) => (
    <div>
      <h2 className="font-[family-name:var(--mine-display)] text-[clamp(1.8rem,4.2vw,2.8rem)] leading-[1.05] font-light tracking-[-0.03em] outline-none" ref={heading} tabIndex={-1}>
        {text}
      </h2>
      {sub && <p className="mt-3 max-w-[52ch] text-[var(--mine-muted)]">{sub}</p>}
    </div>
  );
  const err = (k: string) => errors[k] && <p className="mt-2 text-sm text-[var(--mine-alarm)]">{errors[k]}</p>;
  const yesNo = (value: boolean | null, set: (v: boolean) => void, label: string) => (
    <div aria-label={label} className="flex gap-2" role="group">
      {[
        [true, "Evet"],
        [false, "Hayır"],
      ].map(([v, l]) => (
        <button aria-pressed={value === v} className={pill(value === v)} key={String(v)} onClick={() => set(v as boolean)} type="button">
          {l as string}
        </button>
      ))}
    </div>
  );
  const nav = (next: (() => void) | null, label = "Devam", disabled = false) => (
    <div className="mt-10 flex items-center justify-between gap-4">
      {history.length > 1 ? (
        <button className="min-h-11 px-1 font-semibold text-[var(--mine-muted)] hover:text-[var(--mine-ink)]" onClick={back} type="button">
          ← Geri
        </button>
      ) : (
        <span />
      )}
      {next && (
        <button
          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--mine-ink)] px-7 font-semibold text-white transition-colors hover:bg-[var(--mine-cobalt)] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={disabled}
          onClick={next}
          type="button"
        >
          {label}
          <kbd className="hidden rounded bg-white/15 px-1.5 text-xs font-normal sm:inline">Enter ↵</kbd>
        </button>
      )}
    </div>
  );

  // Enter continues and letters pick a visit type, as long as no text field has focus.
  const onKey = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || (e.target as HTMLElement).getAttribute("role") === "button") return;
    if (step === "visit") {
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0 && visits[i]) {
        setVisitId(visits[i].id);
        afterVisit(visits[i]);
      }
    }
    if (e.key === "Enter") {
      if (step === "chart") afterChart();
      else if (step === "triage") afterTriage();
      else if (step === "slot" && slotOk) go("contact");
      else if (step === "health") go("review");
    }
  };

  let screen: React.ReactNode;
  if (step === "visit") {
    screen = (
      <>
        {title("Merhaba. Bugün sizi ne getirdi?", "Birini seçin; gerisini ona göre soracağız. Klavyede harfle de seçebilirsiniz.")}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {visits.map((v, i) => (
            <li key={v.id}>
              <button
                aria-pressed={visitId === v.id}
                className={`flex min-h-20 w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mine-cobalt)] ${
                  visitId === v.id ? "border-[var(--mine-cobalt)] bg-[var(--mine-cobalt-soft)]" : "border-[var(--mine-ink)]/10 bg-white hover:border-[var(--mine-cobalt)]/50"
                }`}
                onClick={() => {
                  setVisitId(v.id);
                  setTeeth([]);
                  afterVisit(v);
                }}
                type="button"
              >
                <kbd className="grid size-7 shrink-0 place-items-center rounded-md border border-[var(--mine-ink)]/15 text-xs font-bold">{LETTERS[i]}</kbd>
                <span>
                  <span className="block font-semibold">{v.name}</span>
                  <span className="mt-0.5 block text-sm text-[var(--mine-muted)]">
                    {v.hint} {v.minutes} dk.
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {nav(null)}
      </>
    );
  } else if (step === "chart" && visit?.chart) {
    screen = (
      <>
        {title(child ? "Çocuğunuzun hangi dişi?" : "Hangi diş?", "Aynaya bakar gibi düşünün: sağınız ekranın sağında. Emin değilseniz boş bırakın.")}
        <div className="mt-6 grid items-center gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[360px]">
            <ToothChart kind={visit.chart} marked={teeth} onToggle={(f) => setTeeth((t) => (t.includes(f) ? t.filter((x) => x !== f) : [...t, f]))} />
          </div>
          <div aria-live="polite">
            <p className="text-sm font-semibold">{teeth.length ? `${teeth.length} diş işaretlendi` : "Henüz diş işaretlenmedi"}</p>
            <ul className="mt-3 space-y-2">
              {teeth.map((f) => (
                <li className="flex items-center justify-between gap-3 rounded-xl bg-[var(--mine-bg)] px-3 py-2 text-sm" key={f}>
                  {toothName(f)}
                  <button aria-label={`${toothName(f)} işaretini kaldır`} className="grid size-8 place-items-center rounded-full hover:bg-white" onClick={() => setTeeth((t) => t.filter((x) => x !== f))} type="button">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {nav(afterChart, teeth.length ? "Devam" : "Emin değilim, devam")}
      </>
    );
  } else if (step === "triage") {
    const pc = triage.pain >= 7 ? "var(--mine-alarm)" : triage.pain >= 4 ? "var(--mine-warn)" : "var(--mine-ok)";
    screen = (
      <>
        {title("Ağrıyı biraz anlatın.", "Bu sorular tanı koymaz; yalnızca size ne kadar erken bakmamız gerektiğini belirler.")}
        <div className="mt-8 space-y-7">
          <fieldset>
            <legend className="font-semibold">Ne zamandır?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["bugun", "Bugün başladı"],
                  ["gunler", "Birkaç gündür"],
                  ["haftalar", "Haftalardır"],
                ] as const
              ).map(([k, l]) => (
                <button aria-pressed={triage.since === k} className={pill(triage.since === k)} key={k} onClick={() => setTriage((t) => ({ ...t, since: k }))} type="button">
                  {l}
                </button>
              ))}
            </div>
            {err("since")}
          </fieldset>
          <div>
            <label className="font-semibold" htmlFor="mine-pain">
              Şu an ne kadar ağrıyor? <span className="tabular-nums" style={{ color: pc }}>{triage.pain}/10</span>
            </label>
            <input
              aria-valuetext={`${triage.pain} / 10`}
              className="mt-4 block w-full accent-[var(--mine-cobalt)]"
              id="mine-pain"
              max={10}
              min={0}
              onChange={(e) => setTriage((t) => ({ ...t, pain: Number(e.target.value) }))}
              type="range"
              value={triage.pain}
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--mine-muted)]">
              <span>0 · hiç</span>
              <span>5 · dikkatimi dağıtıyor</span>
              <span>10 · dayanılmaz</span>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-semibold">Yüzünüzde şişlik ya da ateş var mı?</p>
              <div className="mt-3">{yesNo(triage.swelling, (v) => setTriage((t) => ({ ...t, swelling: v })), "Şişlik ya da ateş")}</div>
              {err("swelling")}
            </div>
            <div>
              <p className="font-semibold">Ağrı geceleri uyandırıyor mu?</p>
              <div className="mt-3">{yesNo(triage.night, (v) => setTriage((t) => ({ ...t, night: v })), "Gece ağrısı")}</div>
              {err("night")}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--mine-alarm)]/25 bg-[var(--mine-alarm)]/5 p-4">
            <p className="font-semibold">Nefes almakta ya da yutkunmakta zorlanıyor musunuz, şişlik göze ya da boyna yayılıyor mu?</p>
            <div className="mt-3">{yesNo(triage.danger, (v) => setTriage((t) => ({ ...t, danger: v })), "Tehlike belirtileri")}</div>
            {err("danger")}
          </div>
        </div>
        {nav(afterTriage)}
      </>
    );
  } else if (step === "danger") {
    screen = (
      <div role="alert">
        <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-alarm)] uppercase">Beklemeyin</p>
        {title("Bu belirtiler hemen bakılmasını gerektirebilir.", "Randevu beklemeyin. 112'yi arayın ya da en yakın hastanenin acil servisine gidin.")}
        <a className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[var(--mine-alarm)] px-7 font-semibold text-white" href="tel:112">
          112&apos;yi ara
        </a>
        <p className="mt-4 text-sm text-[var(--mine-muted)]">Acil durum geçtikten sonra kontrol için buradan randevu alabilirsiniz.</p>
        {nav(null)}
      </div>
    );
  } else if (step === "slot" && visit && doctor) {
    const starts = startsFor(dayIdx);
    screen = (
      <>
        {title(visit.id === "cocuk" ? "Ne zaman gelelim?" : "Ne zaman gelirsiniz?", `${visit.name} · ${visit.minutes} dakika`)}

        {level === "urgent" && emergency && (
          <div className="mt-8 rounded-2xl bg-[var(--mine-alarm)]/6 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-alarm)] uppercase">Ağrı için ayrılan saat</p>
            <p className="mt-2 font-[family-name:var(--mine-display)] text-2xl font-semibold">
              {days[emergency.day].short}, {hm(emergency.start)} · {doctors[0].short}
            </p>
            <p className="mt-1 text-sm text-[var(--mine-muted)]">Her gün iki saati ağrısı olan hastalara ayırıyoruz. Anlattıklarınıza göre bu saati öneriyoruz.</p>
            {closedNow && (
              <p className="mt-2 text-sm text-[var(--mine-muted)]">Şu an kapalıyız. Beklenemeyecek bir ağrıda nöbetçi Ağız ve Diş Sağlığı Merkezi&apos;ne başvurabilirsiniz.</p>
            )}
            <button
              aria-pressed={!!slot?.emergency}
              className={`mt-4 ${pill(!!slot?.emergency)} ${slot?.emergency ? "" : "bg-white"}`}
              onClick={() => {
                setDoctorPick("elif");
                setSlot({ day: emergency.day, start: emergency.start, emergency: true });
              }}
              type="button"
            >
              {slot?.emergency ? "Bu saat seçildi ✓" : "Bu saati al"}
            </button>
          </div>
        )}

        {visit.who.length > 1 && (
          <fieldset className="mt-8">
            <legend className="font-semibold">Hekim</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {visit.who.map((id) => {
                const d = doctors.find((x) => x.id === id)!;
                return (
                  <button
                    aria-pressed={doctorId === id}
                    className={`rounded-2xl border p-4 text-left transition-colors ${doctorId === id ? "border-[var(--mine-cobalt)] bg-[var(--mine-cobalt-soft)]" : "border-[var(--mine-ink)]/10 bg-white hover:border-[var(--mine-cobalt)]/50"}`}
                    key={id}
                    onClick={() => {
                      setDoctorPick(id);
                      setSlot(null);
                    }}
                    type="button"
                  >
                    <span className="block font-semibold">{d.name}</span>
                    <span className="block text-sm text-[var(--mine-muted)]">{d.role}</span>
                    {id === recommended && <span className="mt-2 inline-block rounded-full bg-[var(--mine-ink)] px-2 py-0.5 text-[11px] font-semibold text-white">{level === "endo" ? "Gece ağrısı için önerilen" : "Önerilen"}</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
        {visit.who.length === 1 && (
          <p className="mt-8 text-sm">
            <span className="font-semibold">{doctor.name}</span> <span className="text-[var(--mine-muted)]">· {doctor.role}</span>
          </p>
        )}

        <fieldset className="mt-6">
          <legend className="font-semibold">Gün</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {days.map((d, i) => (
              <button aria-pressed={i === dayIdx} className={pill(i === dayIdx)} disabled={!dayOpen[i]} key={d.iso} onClick={() => setDayPick(i)} type="button">
                {d.short}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-6">
          <legend className="font-semibold">Saat</legend>
          {starts.length ? (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {starts.map((t) => {
                const on = !!slot && !slot.emergency && slot.day === dayIdx && slot.start === t;
                return (
                  <button aria-pressed={on} className={`${pill(on)} px-0 tabular-nums`} key={t} onClick={() => setSlot({ day: dayIdx, start: t, emergency: false })} type="button">
                    {hm(t)}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--mine-muted)]">{doctor.short} bu hafta dolu ya da çalışmıyor. Diğer hekimi seçin.</p>
          )}
        </fieldset>
        {nav(() => slotOk && go("contact"), "Devam", !slotOk)}
      </>
    );
  } else if (step === "contact") {
    screen = (
      <>
        {title(child ? "Çocuğunuzu ve sizi tanıyalım." : "Sizi nasıl arayalım?", "Onay ve bir gün önceki hatırlatma bu numaraya gelir.")}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {child && (
            <>
              <label className="block text-sm font-semibold" htmlFor="mine-child">
                Çocuğun adı
                <input aria-invalid={!!errors.childName} className={field} id="mine-child" onChange={(e) => setChildName(e.target.value)} value={childName} />
                {err("childName")}
              </label>
              <label className="block text-sm font-semibold" htmlFor="mine-age">
                Yaşı
                <input aria-invalid={!!errors.childAge} className={field} id="mine-age" inputMode="numeric" onChange={(e) => setChildAge(e.target.value.replace(/\D/g, "").slice(0, 2))} value={childAge} />
                {err("childAge")}
              </label>
            </>
          )}
          <label className="block text-sm font-semibold" htmlFor="mine-name">
            {child ? "Veli adı soyadı" : "Ad soyad"}
            <input aria-invalid={!!errors.name} autoComplete="name" className={field} id="mine-name" onChange={(e) => setName(e.target.value)} value={name} />
            {err("name")}
          </label>
          <label className="block text-sm font-semibold" htmlFor="mine-phone">
            Cep telefonu
            <input aria-invalid={!!errors.phone} autoComplete="tel" className={field} id="mine-phone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
            {err("phone")}
          </label>
        </div>

        <div className="mt-8 rounded-2xl bg-[var(--mine-bg)] p-5 text-sm leading-6">
          <div className="text-[var(--mine-muted)]">
            Adınız ve telefonunuz randevunuzu yönetmek için işlenir.{" "}
            <details className="inline">
              <summary className="inline cursor-pointer font-semibold text-[var(--mine-ink)] underline underline-offset-2">Aydınlatma metni</summary>
              <span className="mt-2 block">
                Veri sorumlusu Mine Ağız ve Diş Sağlığı Polikliniği&apos;dir (örnek). Kimlik ve iletişim bilgileriniz randevu sözleşmesinin kurulması için (KVKK m. 5/2-c) işlenir,
                üçüncü kişilere aktarılmaz. Haklarınız için KVKK m. 11&apos;e bakın.
              </span>
            </details>
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3" htmlFor="mine-consent">
            <input checked={consent} className="mt-1 size-5 shrink-0 accent-[var(--mine-cobalt)]" id="mine-consent" onChange={(e) => setConsent(e.target.checked)} type="checkbox" />
            <span>
              <span className="font-semibold">İsteğe bağlı açık rıza:</span> Kullandığım ilaçlar, alerjilerim ve hastalıklarım gibi sağlık bilgilerimin, randevu öncesi hekimimle paylaşılmak üzere işlenmesine açık rıza veriyorum.
              <span className="mt-1 block text-[var(--mine-muted)]">Vermezseniz bu soruları klinikte sorarız; randevunuz etkilenmez. Rızanızı istediğiniz zaman geri alabilirsiniz.</span>
            </span>
          </label>
        </div>
        {nav(afterContact)}
      </>
    );
  } else if (step === "health") {
    screen = (
      <>
        {title("Hekiminizin bilmesi gerekenler", "Yalnızca rıza verdiğiniz için soruyoruz. Emin olmadığınız soruyu boş bırakabilirsiniz.")}
        <ul className="mt-8 divide-y divide-[var(--mine-ink)]/8">
          {healthQuestions
            .filter((q) => !(child && q.adultOnly))
            .map((q) => (
              <li className="py-4" key={q.key}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{q.q}</p>
                  {yesNo(health[q.key].yes, (v) => setHealth((h) => ({ ...h, [q.key]: { ...h[q.key], yes: v } })), q.q)}
                </div>
                {q.detail && health[q.key].yes && (
                  <input
                    aria-label={q.detail}
                    className={`${field} mt-3`}
                    onChange={(e) => setHealth((h) => ({ ...h, [q.key]: { ...h[q.key], detail: e.target.value } }))}
                    placeholder={q.detail}
                    value={health[q.key].detail}
                  />
                )}
              </li>
            ))}
        </ul>
        {nav(() => go("review"))}
      </>
    );
  } else if (step === "review" && visit && doctor && slot) {
    const rows: [string, string][] = [
      ["Neden", visit.name],
      ...(teeth.length ? ([["Diş", teeth.map(toothName).join(", ")]] as [string, string][]) : []),
      ...(visit.triage ? ([["Ağrı", `${triage.pain}/10${triage.swelling ? ", şişlik var" : ""}${triage.night ? ", gece uyandırıyor" : ""}`]] as [string, string][]) : []),
      ["Hekim", doctor.name],
      ["Zaman", `${days[slot.day].long}, ${hm(slot.start)}${slot.emergency ? " (ağrı saati)" : ""}`],
      [child ? "Hasta" : "Ad", child ? `${childName} (${childAge} yaş), veli ${name}` : name],
      ["Telefon", phone],
      ["Sağlık bilgileri", consent ? "Hekiminizle paylaşılacak" : "Klinikte sorulacak"],
    ];
    screen = (
      <>
        {title("Her şey doğru mu?")}
        <dl className="mt-8 divide-y divide-[var(--mine-ink)]/8 rounded-2xl bg-[var(--mine-bg)] px-5">
          {rows.map(([k, v]) => (
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]" key={k}>
              <dt className="text-sm text-[var(--mine-muted)]">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        {nav(confirm, "Randevuyu onayla")}
      </>
    );
  } else if (step === "done" && booked) {
    const d = doctors.find((x) => x.id === booked.doctor)!;
    screen = (
      <div aria-live="polite">
        <div className="grid size-14 place-items-center rounded-full bg-[var(--mine-ok)] text-2xl text-white">✓</div>
        {title(`Randevunuz hazır, ${(booked.guardian ?? booked.who).split(/\s+/)[0]}.`, `${booked.dayLabel}, ${hm(booked.start)} · ${d.name}. Bir gün önce SMS ile hatırlatırız (örnek; mesaj gönderilmez).`)}
        <p className="mt-4 max-w-[52ch] text-sm text-[var(--mine-muted)]">Ağrınız artarsa ya da yüzünüzde şişlik olursa randevuyu beklemeyin, kliniği arayın.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="min-h-12 rounded-full bg-[var(--mine-ink)] px-6 font-semibold text-white hover:bg-[var(--mine-cobalt)]"
            onClick={() => downloadIcs(booked, d.name, visits.find((v) => v.id === booked.visit)!.name)}
            type="button"
          >
            Takvime ekle
          </button>
          <button className="min-h-12 rounded-full bg-[var(--mine-cobalt-soft)] px-6 font-semibold hover:bg-[var(--mine-cobalt)] hover:text-white" onClick={() => setView("hekim")} type="button">
            Hekim ekranında gör
          </button>
          <button className="min-h-12 px-3 font-semibold underline underline-offset-4" onClick={restart} type="button">
            Yeni randevu
          </button>
        </div>
      </div>
    );
  }

  const summary: [string, string][] = [
    ...(visit ? ([["Neden", visit.name]] as [string, string][]) : []),
    ...(teeth.length ? ([["Diş", teeth.length === 1 ? toothName(teeth[0]) : `${teeth.length} diş`]] as [string, string][]) : []),
    ...(visit?.triage && history.includes("slot") ? ([["Ağrı", `${triage.pain}/10`]] as [string, string][]) : []),
    ...(doctor && history.includes("slot") ? ([["Hekim", doctor.short]] as [string, string][]) : []),
    ...(slot ? ([["Zaman", `${days[slot.day].short}, ${hm(slot.start)}`]] as [string, string][]) : []),
  ];

  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--mine-ink)]/8 bg-[var(--mine-bg)]">
      <header className="border-b border-[var(--mine-ink)]/8 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <p className="text-sm font-medium">Online randevu</p>
          <div aria-label="Görünüm" className="flex rounded-full bg-[var(--mine-bg)] p-1 text-sm font-semibold" role="group">
            {(
              [
                ["hasta", "Hasta"],
                ["hekim", "Hekim ekranı"],
              ] as const
            ).map(([k, l]) => (
              <button aria-pressed={view === k} className={`min-h-10 rounded-full px-4 transition-colors ${view === k ? "bg-[var(--mine-ink)] text-white" : "hover:bg-white"}`} key={k} onClick={() => setView(k)} type="button">
                {l}
              </button>
            ))}
          </div>
        </div>
        {view === "hasta" && (
          <div aria-hidden="true" className="h-1 bg-[var(--mine-ink)]/5">
            <div className="h-full bg-[var(--mine-cobalt)] transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </header>

      <div className="px-4 pt-8 pb-10 sm:px-8">
        {view === "hekim" ? (
          <DoctorView booked={booked} booksFor={booksFor} days={days} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <MotionConfig reducedMotion="user">
              <AnimatePresence initial={false} mode="wait">
                <motion.section
                  animate={{ opacity: 1, y: 0 }}
                  className="min-w-0 rounded-[2rem] bg-[var(--mine-card)] p-6 shadow-[0_1px_0_rgba(17,22,51,0.04),0_24px_48px_-32px_rgba(17,22,51,0.35)] sm:p-10"
                  exit={{ opacity: 0, y: -12 }}
                  initial={{ opacity: 0, y: 16 }}
                  key={step}
                  onAnimationComplete={() => heading.current?.focus()}
                  onKeyDown={onKey}
                  transition={{ duration: 0.22 }}
                >
                  {screen}
                </motion.section>
              </AnimatePresence>
            </MotionConfig>
            <aside aria-label="Randevu özeti" className="hidden lg:block">
              <div className="sticky top-8">
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-muted)] uppercase">Randevunuz</p>
                {summary.length ? (
                  <dl className="mt-4 space-y-4">
                    {summary.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-[var(--mine-muted)]">{k}</dt>
                        <dd className="font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm text-[var(--mine-muted)]">Seçtikleriniz burada birikir.</p>
                )}
                <p className="mt-10 text-xs leading-5 text-[var(--mine-muted)]">
                  Sağlık hizmetlerinde reklam yasağı nedeniyle bu sayfada fiyat ve hasta yorumu yer almaz.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function downloadIcs(b: Booked, doctorName: string, visitName: string) {
  const d = b.day.replace(/-/g, "");
  const t = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}${String(m % 60).padStart(2, "0")}00`;
  const text = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mine Dis (ornek)//TR",
    "BEGIN:VEVENT",
    `UID:${b.id}@mine.example`,
    `DTSTAMP:${d}T000000`,
    `DTSTART:${d}T${t(b.start)}`,
    `DTEND:${d}T${t(b.start + b.minutes)}`,
    `SUMMARY:Diş randevusu: ${visitName}`,
    `DESCRIPTION:${doctorName}. Örnek randevu.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "mine-randevu.ics";
  a.click();
  URL.revokeObjectURL(url);
}
