"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Lang } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import {
  type Appt,
  type Day,
  type DoctorId,
  EMERGENCY,
  emptyTriage,
  freeStarts,
  type HealthKey,
  healthQuestions,
  hm,
  isoDay,
  mineIn,
  openDays,
  seedAppts,
  type Triage,
  urgency,
  type VisitId,
} from "./data";
import { DoctorView } from "./doctor-view";
import { ToothChart } from "./tooth-chart";

const COPY = {
  tr: {
    loading: "Randevu ekranı hazırlanıyor…",
    errSince: "Ne zamandır sürdüğünü seçin.",
    errYesNo: "Evet ya da hayır seçin.",
    errChildName: "Çocuğun adını yazın.",
    errChildAge: "0 ile 17 arasında bir yaş yazın.",
    errGuardian: "Veli adını yazın.",
    errName: "Adınızı yazın; en az iki harf.",
    errPhone: "Telefonu 05XX XXX XX XX biçiminde yazın.",
    childPatient: (n: string, age: string) => `${n} (${age} yaş)`,
    yes: "Evet",
    no: "Hayır",
    next: "Devam",
    back: "← Geri",
    visitTitle: "Merhaba. Bugün sizi ne getirdi?",
    visitSub: "Birini seçin; gerisini ona göre soracağız. Klavyede harfle de seçebilirsiniz.",
    min: "dk.",
    chartChild: "Çocuğunuzun hangi dişi?",
    chartTitle: "Hangi diş?",
    chartSub: "Aynaya bakar gibi düşünün: sağınız ekranın sağında. Emin değilseniz boş bırakın.",
    marked: (n: number) => `${n} diş işaretlendi`,
    noneMarked: "Henüz diş işaretlenmedi",
    unmark: (t: string) => `${t} işaretini kaldır`,
    unsure: "Emin değilim, devam",
    triageTitle: "Ağrıyı biraz anlatın.",
    triageSub: "Bu sorular tanı koymaz; yalnızca size ne kadar erken bakmamız gerektiğini belirler.",
    since: "Ne zamandır?",
    sinceOptions: [
      ["bugun", "Bugün başladı"],
      ["gunler", "Birkaç gündür"],
      ["haftalar", "Haftalardır"],
    ] as const,
    pain: "Şu an ne kadar ağrıyor?",
    scale: ["0 · hiç", "5 · dikkatimi dağıtıyor", "10 · dayanılmaz"],
    swelling: "Yüzünüzde şişlik ya da ateş var mı?",
    swellingLabel: "Şişlik ya da ateş",
    night: "Ağrı geceleri uyandırıyor mu?",
    nightLabel: "Gece ağrısı",
    danger: "Nefes almakta ya da yutkunmakta zorlanıyor musunuz, şişlik göze ya da boyna yayılıyor mu?",
    dangerLabel: "Tehlike belirtileri",
    dontWait: "Beklemeyin",
    dangerTitle: "Bu belirtiler hemen bakılmasını gerektirebilir.",
    dangerSub: "Randevu beklemeyin. 112'yi arayın ya da en yakın hastanenin acil servisine gidin.",
    call: "112'yi ara",
    afterDanger: "Acil durum geçtikten sonra kontrol için buradan randevu alabilirsiniz.",
    whenChild: "Ne zaman gelelim?",
    when: "Ne zaman gelirsiniz?",
    minutes: "dakika",
    painHour: "Ağrı için ayrılan saat",
    painHourText: "Her gün iki saati ağrısı olan hastalara ayırıyoruz. Anlattıklarınıza göre bu saati öneriyoruz.",
    closed: "Şu an kapalıyız. Beklenemeyecek bir ağrıda nöbetçi Ağız ve Diş Sağlığı Merkezi'ne başvurabilirsiniz.",
    taken: "Bu saat seçildi ✓",
    take: "Bu saati al",
    doctor: "Hekim",
    forNight: "Gece ağrısı için önerilen",
    recommended: "Önerilen",
    day: "Gün",
    time: "Saat",
    full: (d: string) => `${d} bu hafta dolu ya da çalışmıyor. Diğer hekimi seçin.`,
    contactChild: "Çocuğunuzu ve sizi tanıyalım.",
    contactTitle: "Sizi nasıl arayalım?",
    contactSub: "Onay ve bir gün önceki hatırlatma bu numaraya gelir.",
    childName: "Çocuğun adı",
    childAge: "Yaşı",
    guardian: "Veli adı soyadı",
    name: "Ad soyad",
    phone: "Cep telefonu",
    privacy: "Adınız ve telefonunuz randevunuzu yönetmek için işlenir.",
    notice: "Aydınlatma metni",
    noticeText:
      "Veri sorumlusu Mine Ağız ve Diş Sağlığı Polikliniği'dir (örnek). Kimlik ve iletişim bilgileriniz randevu sözleşmesinin kurulması için (KVKK m. 5/2-c) işlenir, üçüncü kişilere aktarılmaz. Haklarınız için KVKK m. 11'e bakın.",
    consentLead: "İsteğe bağlı açık rıza:",
    consent: "Kullandığım ilaçlar, alerjilerim ve hastalıklarım gibi sağlık bilgilerimin, randevu öncesi hekimimle paylaşılmak üzere işlenmesine açık rıza veriyorum.",
    consentNote: "Vermezseniz bu soruları klinikte sorarız; randevunuz etkilenmez. Rızanızı istediğiniz zaman geri alabilirsiniz.",
    healthTitle: "Hekiminizin bilmesi gerekenler",
    healthSub: "Yalnızca rıza verdiğiniz için soruyoruz. Emin olmadığınız soruyu boş bırakabilirsiniz.",
    reason: "Neden",
    tooth: "Diş",
    teethCount: (n: number) => `${n} diş`,
    painRow: "Ağrı",
    hasSwelling: ", şişlik var",
    wakes: ", gece uyandırıyor",
    timeRow: "Zaman",
    painSlot: " (ağrı saati)",
    patient: "Hasta",
    nameRow: "Ad",
    childRow: (n: string, age: string, g: string) => `${n} (${age} yaş), veli ${g}`,
    phoneRow: "Telefon",
    healthRow: "Sağlık bilgileri",
    shared: "Hekiminizle paylaşılacak",
    atClinic: "Klinikte sorulacak",
    reviewTitle: "Her şey doğru mu?",
    confirm: "Randevuyu onayla",
    doneTitle: (n: string) => `Randevunuz hazır, ${n}.`,
    doneSub: (when: string, doctor: string) => `${when} · ${doctor}. Bir gün önce SMS ile hatırlatırız (örnek; mesaj gönderilmez).`,
    doneNote: "Ağrınız artarsa ya da yüzünüzde şişlik olursa randevuyu beklemeyin, kliniği arayın.",
    calendar: "Takvime ekle",
    seeDoctor: "Hekim ekranında gör",
    again: "Yeni randevu",
    online: "Online randevu",
    view: "Görünüm",
    views: [
      ["hasta", "Hasta"],
      ["hekim", "Hekim ekranı"],
    ] as const,
    summary: "Randevu özeti",
    yours: "Randevunuz",
    empty: "Seçtikleriniz burada birikir.",
    adBan: "Sağlık hizmetlerinde reklam yasağı nedeniyle bu sayfada fiyat ve hasta yorumu yer almaz.",
    ics: (visit: string) => `Diş randevusu: ${visit}`,
    icsNote: "Örnek randevu.",
    icsFile: "mine-randevu.ics",
  },
  en: {
    loading: "Getting the booking screen ready…",
    errSince: "Choose how long it has lasted.",
    errYesNo: "Choose yes or no.",
    errChildName: "Write the child's name.",
    errChildAge: "Write an age between 0 and 17.",
    errGuardian: "Write the parent's or guardian's name.",
    errName: "Write your name; at least two letters.",
    errPhone: "Enter a Turkish mobile number as 05XX XXX XX XX.",
    childPatient: (n: string, age: string) => `${n} (age ${age})`,
    yes: "Yes",
    no: "No",
    next: "Continue",
    back: "← Back",
    visitTitle: "Hello. What brings you in today?",
    visitSub: "Pick one and we'll ask the rest to suit it. You can also choose with a letter key.",
    min: "min.",
    chartChild: "Which of your child's teeth?",
    chartTitle: "Which tooth?",
    chartSub: "Think of it like a mirror: your right is on the right of the screen. If you're not sure, leave it blank.",
    marked: (n: number) => (n === 1 ? "1 tooth marked" : `${n} teeth marked`),
    noneMarked: "No tooth marked yet",
    unmark: (t: string) => `Unmark ${t.toLowerCase()}`,
    unsure: "Not sure, continue",
    triageTitle: "Tell us a little about the pain.",
    triageSub: "These questions don't diagnose anything; they only decide how soon we should see you.",
    since: "How long has it lasted?",
    sinceOptions: [
      ["bugun", "Started today"],
      ["gunler", "A few days"],
      ["haftalar", "Weeks"],
    ] as const,
    pain: "How much does it hurt right now?",
    scale: ["0 · not at all", "5 · distracting", "10 · unbearable"],
    swelling: "Any swelling in your face, or a fever?",
    swellingLabel: "Swelling or fever",
    night: "Does the pain wake you at night?",
    nightLabel: "Night pain",
    danger: "Are you struggling to breathe or swallow, or is the swelling spreading to your eye or neck?",
    dangerLabel: "Danger signs",
    dontWait: "Don't wait",
    dangerTitle: "These signs may need to be seen straight away.",
    dangerSub: "Don't wait for an appointment. Call 112 (Turkey's emergency number) or go to the nearest hospital's emergency department.",
    call: "Call 112",
    afterDanger: "Once the emergency has passed, you can book a check-up here.",
    whenChild: "When shall we see them?",
    when: "When can you come in?",
    minutes: "minutes",
    painHour: "A time kept for pain",
    painHourText: "We keep two hours every day for patients in pain. From what you've told us, we suggest this time.",
    closed: "We're closed right now. For pain that can't wait, you can go to the on-duty public oral and dental health centre.",
    taken: "Time chosen ✓",
    take: "Take this time",
    doctor: "Dentist",
    forNight: "Suggested for night pain",
    recommended: "Suggested",
    day: "Day",
    time: "Time",
    full: (d: string) => `${d} is fully booked or not working this week. Choose the other dentist.`,
    contactChild: "Tell us about your child and you.",
    contactTitle: "How should we reach you?",
    contactSub: "The confirmation and a reminder the day before go to this number.",
    childName: "Child's name",
    childAge: "Age",
    guardian: "Parent or guardian's full name",
    name: "Full name",
    phone: "Mobile phone",
    privacy: "Your name and phone number are used to manage your appointment.",
    notice: "Privacy notice",
    noticeText:
      "The data controller is Mine Ağız ve Diş Sağlığı Polikliniği (a sample). Your identity and contact details are processed to set up the appointment (KVKK, Turkey's data protection law, art. 5/2-c) and are not passed to third parties. See KVKK art. 11 for your rights.",
    consentLead: "Optional explicit consent:",
    consent: "I give explicit consent for my health information, such as the medicines I take, my allergies and conditions, to be processed so it can be shared with my dentist before the appointment.",
    consentNote: "If you don't, we'll ask these questions at the clinic; your appointment isn't affected. You can withdraw consent at any time.",
    healthTitle: "What your dentist should know",
    healthSub: "We only ask because you consented. You can leave any question you're unsure about blank.",
    reason: "Reason",
    tooth: "Tooth",
    teethCount: (n: number) => `${n} teeth`,
    painRow: "Pain",
    hasSwelling: ", swelling",
    wakes: ", wakes at night",
    timeRow: "Time",
    painSlot: " (pain slot)",
    patient: "Patient",
    nameRow: "Name",
    childRow: (n: string, age: string, g: string) => `${n} (age ${age}), guardian ${g}`,
    phoneRow: "Phone",
    healthRow: "Health information",
    shared: "Shared with your dentist",
    atClinic: "Asked at the clinic",
    reviewTitle: "Is everything right?",
    confirm: "Confirm appointment",
    doneTitle: (n: string) => `You're booked in, ${n}.`,
    doneSub: (when: string, doctor: string) => `${when} · ${doctor}. We'll send an SMS reminder the day before (a sample; no message is sent).`,
    doneNote: "If the pain gets worse or your face swells, don't wait for the appointment; call the clinic.",
    calendar: "Add to calendar",
    seeDoctor: "See it on the dentist's screen",
    again: "New appointment",
    online: "Online booking",
    view: "View",
    views: [
      ["hasta", "Patient"],
      ["hekim", "Dentist's screen"],
    ] as const,
    summary: "Appointment summary",
    yours: "Your appointment",
    empty: "Your choices collect here.",
    adBan: "Turkish law bans advertising health services, so this page shows no prices or patient reviews.",
    ics: (visit: string) => `Dental appointment: ${visit}`,
    icsNote: "Sample appointment.",
    icsFile: "mine-appointment.ics",
  },
};

// Today's date and time only exist in the browser.
const subscribe = () => () => {};
const clientNow = () => {
  const d = new Date();
  return `${isoDay(d)}|${d.getHours() * 60 + d.getMinutes() - (d.getMinutes() % 10)}`;
};
const serverNow = () => null;

export function MineBooking() {
  const lang = useLang();
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  if (!now) return <p className="mx-auto max-w-5xl px-5 py-24 text-[var(--mine-muted)] sm:px-8">{COPY[lang].loading}</p>;
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
  const lang = useLang();
  const c = COPY[lang];
  const { doctors, visits, healthQuestions, toothName, stamp: stampOf } = mineIn(lang);
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
  const days = useMemo(() => openDays(todayIso, 6, lang), [todayIso, lang]);
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
      if (!triage.since) e.since = c.errSince;
      if (triage.swelling === null) e.swelling = c.errYesNo;
      if (triage.night === null) e.night = c.errYesNo;
      if (triage.danger === null) e.danger = c.errYesNo;
    }
    if (s === "contact") {
      if (child) {
        if (childName.trim().length < 2) e.childName = c.errChildName;
        const age = Number(childAge);
        if (!childAge || !Number.isInteger(age) || age < 0 || age > 17) e.childAge = c.errChildAge;
      }
      if (name.trim().length < 2) e.name = child ? c.errGuardian : c.errName;
      if (!PHONE.test(phone.replace(/\D/g, ""))) e.phone = c.errPhone;
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
      patient: child ? c.childPatient(childName.trim(), childAge) : name.trim(),
      guardian: child ? name.trim() : null,
      consentAt: consent ? stampOf(stamp) : null,
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
        [true, c.yes],
        [false, c.no],
      ].map(([v, l]) => (
        <button aria-pressed={value === v} className={pill(value === v)} key={String(v)} onClick={() => set(v as boolean)} type="button">
          {l as string}
        </button>
      ))}
    </div>
  );
  const nav = (next: (() => void) | null, label = c.next, disabled = false) => (
    <div className="mt-10 flex items-center justify-between gap-4">
      {history.length > 1 ? (
        <button className="min-h-11 px-1 font-semibold text-[var(--mine-muted)] hover:text-[var(--mine-ink)]" onClick={back} type="button">
          {c.back}
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
        {title(c.visitTitle, c.visitSub)}
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
                    {v.hint} {v.minutes} {c.min}
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
        {title(child ? c.chartChild : c.chartTitle, c.chartSub)}
        <div className="mt-6 grid items-center gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[360px]">
            <ToothChart kind={visit.chart} marked={teeth} onToggle={(f) => setTeeth((t) => (t.includes(f) ? t.filter((x) => x !== f) : [...t, f]))} />
          </div>
          <div aria-live="polite">
            <p className="text-sm font-semibold">{teeth.length ? c.marked(teeth.length) : c.noneMarked}</p>
            <ul className="mt-3 space-y-2">
              {teeth.map((f) => (
                <li className="flex items-center justify-between gap-3 rounded-xl bg-[var(--mine-bg)] px-3 py-2 text-sm" key={f}>
                  {toothName(f)}
                  <button aria-label={c.unmark(toothName(f))} className="grid size-8 place-items-center rounded-full hover:bg-white" onClick={() => setTeeth((t) => t.filter((x) => x !== f))} type="button">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {nav(afterChart, teeth.length ? c.next : c.unsure)}
      </>
    );
  } else if (step === "triage") {
    const pc = triage.pain >= 7 ? "var(--mine-alarm)" : triage.pain >= 4 ? "var(--mine-warn)" : "var(--mine-ok)";
    screen = (
      <>
        {title(c.triageTitle, c.triageSub)}
        <div className="mt-8 space-y-7">
          <fieldset>
            <legend className="font-semibold">{c.since}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.sinceOptions.map(([k, l]) => (
                <button aria-pressed={triage.since === k} className={pill(triage.since === k)} key={k} onClick={() => setTriage((t) => ({ ...t, since: k }))} type="button">
                  {l}
                </button>
              ))}
            </div>
            {err("since")}
          </fieldset>
          <div>
            <label className="font-semibold" htmlFor="mine-pain">
              {c.pain} <span className="tabular-nums" style={{ color: pc }}>{triage.pain}/10</span>
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
              {c.scale.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-semibold">{c.swelling}</p>
              <div className="mt-3">{yesNo(triage.swelling, (v) => setTriage((t) => ({ ...t, swelling: v })), c.swellingLabel)}</div>
              {err("swelling")}
            </div>
            <div>
              <p className="font-semibold">{c.night}</p>
              <div className="mt-3">{yesNo(triage.night, (v) => setTriage((t) => ({ ...t, night: v })), c.nightLabel)}</div>
              {err("night")}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--mine-alarm)]/25 bg-[var(--mine-alarm)]/5 p-4">
            <p className="font-semibold">{c.danger}</p>
            <div className="mt-3">{yesNo(triage.danger, (v) => setTriage((t) => ({ ...t, danger: v })), c.dangerLabel)}</div>
            {err("danger")}
          </div>
        </div>
        {nav(afterTriage)}
      </>
    );
  } else if (step === "danger") {
    screen = (
      <div role="alert">
        <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-alarm)] uppercase">{c.dontWait}</p>
        {title(c.dangerTitle, c.dangerSub)}
        <a className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[var(--mine-alarm)] px-7 font-semibold text-white" href="tel:112">
          {c.call}
        </a>
        <p className="mt-4 text-sm text-[var(--mine-muted)]">{c.afterDanger}</p>
        {nav(null)}
      </div>
    );
  } else if (step === "slot" && visit && doctor) {
    const starts = startsFor(dayIdx);
    screen = (
      <>
        {title(visit.id === "cocuk" ? c.whenChild : c.when, `${visit.name} · ${visit.minutes} ${c.minutes}`)}

        {level === "urgent" && emergency && (
          <div className="mt-8 rounded-2xl bg-[var(--mine-alarm)]/6 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-alarm)] uppercase">{c.painHour}</p>
            <p className="mt-2 font-[family-name:var(--mine-display)] text-2xl font-semibold">
              {days[emergency.day].short}, {hm(emergency.start)} · {doctors[0].short}
            </p>
            <p className="mt-1 text-sm text-[var(--mine-muted)]">{c.painHourText}</p>
            {closedNow && (
              <p className="mt-2 text-sm text-[var(--mine-muted)]">{c.closed}</p>
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
              {slot?.emergency ? c.taken : c.take}
            </button>
          </div>
        )}

        {visit.who.length > 1 && (
          <fieldset className="mt-8">
            <legend className="font-semibold">{c.doctor}</legend>
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
                    {id === recommended && <span className="mt-2 inline-block rounded-full bg-[var(--mine-ink)] px-2 py-0.5 text-[11px] font-semibold text-white">{level === "endo" ? c.forNight : c.recommended}</span>}
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
          <legend className="font-semibold">{c.day}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {days.map((d, i) => (
              <button aria-pressed={i === dayIdx} className={pill(i === dayIdx)} disabled={!dayOpen[i]} key={d.iso} onClick={() => setDayPick(i)} type="button">
                {d.short}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-6">
          <legend className="font-semibold">{c.time}</legend>
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
            <p className="mt-3 text-sm text-[var(--mine-muted)]">{c.full(doctor.short)}</p>
          )}
        </fieldset>
        {nav(() => slotOk && go("contact"), c.next, !slotOk)}
      </>
    );
  } else if (step === "contact") {
    screen = (
      <>
        {title(child ? c.contactChild : c.contactTitle, c.contactSub)}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {child && (
            <>
              <label className="block text-sm font-semibold" htmlFor="mine-child">
                {c.childName}
                <input aria-invalid={!!errors.childName} className={field} id="mine-child" onChange={(e) => setChildName(e.target.value)} value={childName} />
                {err("childName")}
              </label>
              <label className="block text-sm font-semibold" htmlFor="mine-age">
                {c.childAge}
                <input aria-invalid={!!errors.childAge} className={field} id="mine-age" inputMode="numeric" onChange={(e) => setChildAge(e.target.value.replace(/\D/g, "").slice(0, 2))} value={childAge} />
                {err("childAge")}
              </label>
            </>
          )}
          <label className="block text-sm font-semibold" htmlFor="mine-name">
            {child ? c.guardian : c.name}
            <input aria-invalid={!!errors.name} autoComplete="name" className={field} id="mine-name" onChange={(e) => setName(e.target.value)} value={name} />
            {err("name")}
          </label>
          <label className="block text-sm font-semibold" htmlFor="mine-phone">
            {c.phone}
            <input aria-invalid={!!errors.phone} autoComplete="tel" className={field} id="mine-phone" inputMode="tel" onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" value={phone} />
            {err("phone")}
          </label>
        </div>

        <div className="mt-8 rounded-2xl bg-[var(--mine-bg)] p-5 text-sm leading-6">
          <div className="text-[var(--mine-muted)]">
            {c.privacy}{" "}
            <details className="inline">
              <summary className="inline cursor-pointer font-semibold text-[var(--mine-ink)] underline underline-offset-2">{c.notice}</summary>
              <span className="mt-2 block">{c.noticeText}</span>
            </details>
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3" htmlFor="mine-consent">
            <input checked={consent} className="mt-1 size-5 shrink-0 accent-[var(--mine-cobalt)]" id="mine-consent" onChange={(e) => setConsent(e.target.checked)} type="checkbox" />
            <span>
              <span className="font-semibold">{c.consentLead}</span> {c.consent}
              <span className="mt-1 block text-[var(--mine-muted)]">{c.consentNote}</span>
            </span>
          </label>
        </div>
        {nav(afterContact)}
      </>
    );
  } else if (step === "health") {
    screen = (
      <>
        {title(c.healthTitle, c.healthSub)}
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
      [c.reason, visit.name],
      ...(teeth.length ? ([[c.tooth, teeth.map(toothName).join(", ")]] as [string, string][]) : []),
      ...(visit.triage ? ([[c.painRow, `${triage.pain}/10${triage.swelling ? c.hasSwelling : ""}${triage.night ? c.wakes : ""}`]] as [string, string][]) : []),
      [c.doctor, doctor.name],
      [c.timeRow, `${days[slot.day].long}, ${hm(slot.start)}${slot.emergency ? c.painSlot : ""}`],
      [child ? c.patient : c.nameRow, child ? c.childRow(childName, childAge, name) : name],
      [c.phoneRow, phone],
      [c.healthRow, consent ? c.shared : c.atClinic],
    ];
    screen = (
      <>
        {title(c.reviewTitle)}
        <dl className="mt-8 divide-y divide-[var(--mine-ink)]/8 rounded-2xl bg-[var(--mine-bg)] px-5">
          {rows.map(([k, v]) => (
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]" key={k}>
              <dt className="text-sm text-[var(--mine-muted)]">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        {nav(confirm, c.confirm)}
      </>
    );
  } else if (step === "done" && booked) {
    const d = doctors.find((x) => x.id === booked.doctor)!;
    screen = (
      <div aria-live="polite">
        <div className="grid size-14 place-items-center rounded-full bg-[var(--mine-ok)] text-2xl text-white">✓</div>
        {title(c.doneTitle((booked.guardian ?? booked.who).split(/\s+/)[0]), c.doneSub(`${booked.dayLabel}, ${hm(booked.start)}`, d.name))}
        <p className="mt-4 max-w-[52ch] text-sm text-[var(--mine-muted)]">{c.doneNote}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="min-h-12 rounded-full bg-[var(--mine-ink)] px-6 font-semibold text-white hover:bg-[var(--mine-cobalt)]"
            onClick={() => downloadIcs(booked, d.name, visits.find((v) => v.id === booked.visit)!.name, lang)}
            type="button"
          >
            {c.calendar}
          </button>
          <button className="min-h-12 rounded-full bg-[var(--mine-cobalt-soft)] px-6 font-semibold hover:bg-[var(--mine-cobalt)] hover:text-white" onClick={() => setView("hekim")} type="button">
            {c.seeDoctor}
          </button>
          <button className="min-h-12 px-3 font-semibold underline underline-offset-4" onClick={restart} type="button">
            {c.again}
          </button>
        </div>
      </div>
    );
  }

  const summary: [string, string][] = [
    ...(visit ? ([[c.reason, visit.name]] as [string, string][]) : []),
    ...(teeth.length ? ([[c.tooth, teeth.length === 1 ? toothName(teeth[0]) : c.teethCount(teeth.length)]] as [string, string][]) : []),
    ...(visit?.triage && history.includes("slot") ? ([[c.painRow, `${triage.pain}/10`]] as [string, string][]) : []),
    ...(doctor && history.includes("slot") ? ([[c.doctor, doctor.short]] as [string, string][]) : []),
    ...(slot ? ([[c.timeRow, `${days[slot.day].short}, ${hm(slot.start)}`]] as [string, string][]) : []),
  ];

  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--mine-ink)]/8 bg-[var(--mine-bg)]">
      <header className="border-b border-[var(--mine-ink)]/8 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <p className="text-sm font-medium">{c.online}</p>
          <div aria-label={c.view} className="flex rounded-full bg-[var(--mine-bg)] p-1 text-sm font-semibold" role="group">
            {c.views.map(([k, l]) => (
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
            <aside aria-label={c.summary} className="hidden lg:block">
              <div className="sticky top-8">
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-muted)] uppercase">{c.yours}</p>
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
                  <p className="mt-4 text-sm text-[var(--mine-muted)]">{c.empty}</p>
                )}
                <p className="mt-10 text-xs leading-5 text-[var(--mine-muted)]">
                  {c.adBan}
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function downloadIcs(b: Booked, doctorName: string, visitName: string, lang: Lang) {
  const c = COPY[lang];
  const d = b.day.replace(/-/g, "");
  const t = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}${String(m % 60).padStart(2, "0")}00`;
  const text = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//Mine Dis (ornek)//${lang.toUpperCase()}`,
    "BEGIN:VEVENT",
    `UID:${b.id}@mine.example`,
    `DTSTAMP:${d}T000000`,
    `DTSTART:${d}T${t(b.start)}`,
    `DTEND:${d}T${t(b.start + b.minutes)}`,
    `SUMMARY:${c.ics(visitName)}`,
    `DESCRIPTION:${doctorName}. ${c.icsNote}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = c.icsFile;
  a.click();
  URL.revokeObjectURL(url);
}
