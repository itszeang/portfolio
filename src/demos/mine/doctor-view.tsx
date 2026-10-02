"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import { type Appt, type Day, type DoctorId, hm, mineIn } from "./data";
import type { Booked } from "./mine-booking";
import { ToothChart } from "./tooth-chart";

const COPY = {
  tr: {
    since: { bugun: "bugün başladı", gunler: "birkaç gündür", haftalar: "haftalardır" },
    title: "Hekim ekranı",
    lead: "Hastanın randevu alırken anlattıkları, muayeneden önce hekimin önünde. Bu ekranı yalnızca klinik görür.",
    doctor: "Hekim",
    day: "Gün",
    new: "YENİ",
    min: "dk",
    off: (d: string) => `${d} bu gün çalışmıyor.`,
    sample: "Örnek kayıt. Hasta tarafında bir randevu oluşturun; hekimin göreceği tam kart burada açılır.",
    pick: "Soldan bir randevu seçin.",
    none: "Henüz yeni randevu yok. Hasta ekranından bir randevu oluşturun; hekimin göreceği kart burada açılır.",
    guardian: (g: string) => ` · veli ${g}`,
    painSlot: "Ağrı saati",
    marked: "İşaretlenen diş",
    notMarked: "İşaretlenmedi",
    pain: "Ağrı",
    swelling: ", şişlik ya da ateş var",
    noSwelling: ", şişlik yok",
    wakes: ", geceleri uyandırıyor",
    health: "Sağlık bilgileri",
    warnings: (n: number) => `${n} uyarı, yukarıda`,
    noRisk: "Bildirilen risk yok",
    notShared: "Paylaşılmadı; muayenede sorulacak",
    consent: "Açık rıza kaydı",
    given: (at: string) => `Verildi: ${at}`,
    notGiven: "Verilmedi",
  },
  en: {
    since: { bugun: "started today", gunler: "for a few days", haftalar: "for weeks" },
    title: "Dentist's screen",
    lead: "What the patient said while booking, in front of the dentist before the visit. Only the clinic sees this screen.",
    doctor: "Dentist",
    day: "Day",
    new: "NEW",
    min: "min",
    off: (d: string) => `${d} isn't working this day.`,
    sample: "A sample record. Make a booking on the patient side; the full card the dentist sees opens here.",
    pick: "Choose an appointment on the left.",
    none: "No new appointment yet. Make one from the patient screen; the card the dentist sees opens here.",
    guardian: (g: string) => ` · guardian ${g}`,
    painSlot: "Pain slot",
    marked: "Marked teeth",
    notMarked: "None marked",
    pain: "Pain",
    swelling: ", swelling or fever",
    noSwelling: ", no swelling",
    wakes: ", wakes them at night",
    health: "Health information",
    warnings: (n: number) => (n === 1 ? "1 warning, above" : `${n} warnings, above`),
    noRisk: "No risks reported",
    notShared: "Not shared; will be asked at the visit",
    consent: "Explicit consent record",
    given: (at: string) => `Given: ${at}`,
    notGiven: "Not given",
  },
};

/** What the doctor sees before the patient walks in. */
export function DoctorView({ booked, booksFor, days }: { booked: Booked | null; booksFor: (d: Day, doc: DoctorId) => Appt[]; days: Day[] }) {
  const lang = useLang();
  const c = COPY[lang];
  const { doctors, visits } = mineIn(lang);
  const [doc, setDoc] = useState<DoctorId>(booked?.doctor ?? "elif");
  const [dayIdx, setDayIdx] = useState(() => Math.max(0, days.findIndex((d) => d.iso === booked?.day)));
  const [openId, setOpenId] = useState<string | null>(booked?.id ?? null);
  const day = days[dayIdx];
  const doctor = doctors.find((d) => d.id === doc)!;
  const list = booksFor(day, doc).sort((a, b) => a.start - b.start);
  const open = list.find((a) => a.id === openId) ?? null;
  const card = open && booked && open.id === booked.id ? booked : null;

  return (
    <div>
      <h2 className="font-[family-name:var(--mine-display)] text-[clamp(1.8rem,4.2vw,2.8rem)] leading-[1.05] font-light tracking-[-0.03em]">{c.title}</h2>
      <p className="mt-3 max-w-[60ch] text-[var(--mine-muted)]">{c.lead}</p>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={c.doctor}>
        {doctors.map((d) => (
          <button
            aria-pressed={d.id === doc}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors ${d.id === doc ? "bg-[var(--mine-ink)] text-white" : "bg-white hover:bg-[var(--mine-cobalt-soft)]"}`}
            key={d.id}
            onClick={() => setDoc(d.id)}
            type="button"
          >
            {d.short}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={c.day}>
        {days.map((d, i) => (
          <button
            aria-pressed={i === dayIdx}
            className={`min-h-10 rounded-full px-3.5 text-sm transition-colors ${i === dayIdx ? "bg-[var(--mine-cobalt)] font-semibold text-white" : "bg-white hover:bg-[var(--mine-cobalt-soft)]"}`}
            key={d.iso}
            onClick={() => setDayIdx(i)}
            type="button"
          >
            {d.short}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section aria-label={`${doctor.short}, ${day.long}`} className="rounded-[1.5rem] bg-white p-4">
          {list.length ? (
            <ol className="space-y-1.5">
              {list.map((a) => {
                const v = visits.find((x) => x.id === a.visit)!;
                const on = a.id === openId;
                return (
                  <li key={a.id}>
                    <button
                      aria-pressed={on}
                      className={`grid w-full grid-cols-[3.2rem_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        on ? "bg-[var(--mine-ink)] text-white" : a.mine ? "bg-[var(--mine-cobalt-soft)] hover:bg-[var(--mine-cobalt-soft)]/70" : "hover:bg-[var(--mine-bg)]"
                      }`}
                      onClick={() => setOpenId(a.id)}
                      type="button"
                    >
                      <span className="font-semibold tabular-nums">{hm(a.start)}</span>
                      <span className="min-w-0">
                        <span className="block min-w-0 [overflow-wrap:anywhere] font-semibold">
                          {a.who}
                          {a.mine && <span className={`ml-2 rounded-full px-1.5 text-[10px] ${on ? "bg-white/20" : "bg-[var(--mine-cobalt)] text-white"}`}>{c.new}</span>}
                        </span>
                        <span className={`block min-w-0 [overflow-wrap:anywhere] text-xs ${on ? "text-white/70" : "text-[var(--mine-muted)]"}`}>
                          {v.name} · {a.minutes} {c.min}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="p-3 text-sm text-[var(--mine-muted)]">{c.off(doctor.short)}</p>
          )}
        </section>

        <section aria-live="polite" className="min-w-0 rounded-[1.5rem] bg-white p-6 sm:p-8">
          {card ? (
            <PatientCard b={card} />
          ) : open ? (
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-muted)] uppercase">{hm(open.start)}</p>
              <p className="mt-2 font-[family-name:var(--mine-display)] text-2xl font-semibold">{open.who}</p>
              <p className="mt-1 text-[var(--mine-muted)]">{visits.find((v) => v.id === open.visit)!.name}</p>
              <p className="mt-6 text-sm text-[var(--mine-muted)]">{c.sample}</p>
            </div>
          ) : (
            <p className="text-[var(--mine-muted)]">
              {booked ? c.pick : c.none}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function PatientCard({ b }: { b: Booked }) {
  const lang = useLang();
  const c = COPY[lang];
  const { visits, healthQuestions, toothName } = mineIn(lang);
  const v = visits.find((x) => x.id === b.visit)!;
  const flags = b.health
    ? healthQuestions.filter((q) => b.health![q.key].yes).map((q) => ({ key: q.key, text: q.flag, detail: b.health![q.key].detail }))
    : [];
  return (
    <article>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-[var(--mine-muted)] uppercase">
            {b.dayLabel} · {hm(b.start)}
          </p>
          <h2 className="mt-2 font-[family-name:var(--mine-display)] text-3xl font-semibold tracking-[-0.02em]">{b.patient}</h2>
          <p className="mt-1 text-[var(--mine-muted)]">
            {v.name}
            {b.guardian && c.guardian(b.guardian)}
          </p>
        </div>
        {b.emergency && <span className="rounded-full bg-[var(--mine-alarm)] px-3 py-1 text-xs font-bold text-white">{c.painSlot}</span>}
      </div>

      {flags.length > 0 && (
        <ul className="mt-6 space-y-2">
          {flags.map((f) => (
            <li className="flex gap-3 rounded-xl bg-[var(--mine-warn)]/10 px-4 py-3 text-sm" key={f.key}>
              <span aria-hidden="true" className="font-bold text-[var(--mine-warn)]">!</span>
              <span>
                <span className="font-semibold">{f.text}</span>
                {f.detail && `: ${f.detail}`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        {b.chart && (
          <div>
            <ToothChart kind={b.chart} marked={b.teeth} readOnly />
          </div>
        )}
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-[var(--mine-muted)]">{c.marked}</dt>
            <dd className="mt-0.5 font-semibold">{b.teeth.length ? b.teeth.map((f) => `${f} · ${toothName(f).toLowerCase()}`).join(", ") : c.notMarked}</dd>
          </div>
          {b.triage && (
            <div>
              <dt className="text-[var(--mine-muted)]">{c.pain}</dt>
              <dd className="mt-1">
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-2 w-32 overflow-hidden rounded-full bg-[var(--mine-bg)]">
                    <span className="block h-full rounded-full bg-[var(--mine-alarm)]" style={{ width: `${b.triage.pain * 10}%` }} />
                  </span>
                  <span className="font-semibold tabular-nums">{b.triage.pain}/10</span>
                </span>
                <span className="mt-1 block text-[var(--mine-muted)]">
                  {b.triage.since && c.since[b.triage.since]}
                  {b.triage.swelling ? c.swelling : c.noSwelling}
                  {b.triage.night ? c.wakes : ""}
                </span>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-[var(--mine-muted)]">{c.health}</dt>
            <dd className="mt-0.5 font-semibold">
              {b.consentAt ? (flags.length ? c.warnings(flags.length) : c.noRisk) : c.notShared}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--mine-muted)]">{c.consent}</dt>
            <dd className="mt-0.5">{b.consentAt ? c.given(b.consentAt) : c.notGiven}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
