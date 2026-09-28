"use client";

import { useState } from "react";
import { type Appt, type Day, type DoctorId, doctors, healthQuestions, hm, toothName, visits } from "./data";
import type { Booked } from "./mine-booking";
import { ToothChart } from "./tooth-chart";

const since = { bugun: "bugün başladı", gunler: "birkaç gündür", haftalar: "haftalardır" } as const;

/** What the doctor sees before the patient walks in. */
export function DoctorView({ booked, booksFor, days }: { booked: Booked | null; booksFor: (d: Day, doc: DoctorId) => Appt[]; days: Day[] }) {
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
      <h2 className="font-[family-name:var(--mine-display)] text-[clamp(1.8rem,4.2vw,2.8rem)] leading-[1.05] font-light tracking-[-0.03em]">Hekim ekranı</h2>
      <p className="mt-3 max-w-[60ch] text-[var(--mine-muted)]">Hastanın randevu alırken anlattıkları, muayeneden önce hekimin önünde. Bu ekranı yalnızca klinik görür.</p>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Hekim">
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
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Gün">
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
                        <span className="block truncate font-semibold">
                          {a.who}
                          {a.mine && <span className={`ml-2 rounded-full px-1.5 text-[10px] ${on ? "bg-white/20" : "bg-[var(--mine-cobalt)] text-white"}`}>YENİ</span>}
                        </span>
                        <span className={`block truncate text-xs ${on ? "text-white/70" : "text-[var(--mine-muted)]"}`}>
                          {v.name} · {a.minutes} dk
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="p-3 text-sm text-[var(--mine-muted)]">{doctor.short} bu gün çalışmıyor.</p>
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
              <p className="mt-6 text-sm text-[var(--mine-muted)]">Örnek kayıt. Hasta tarafında bir randevu oluşturun; hekimin göreceği tam kart burada açılır.</p>
            </div>
          ) : (
            <p className="text-[var(--mine-muted)]">
              {booked ? "Soldan bir randevu seçin." : "Henüz yeni randevu yok. Hasta ekranından bir randevu oluşturun; hekimin göreceği kart burada açılır."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function PatientCard({ b }: { b: Booked }) {
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
            {b.guardian && ` · veli ${b.guardian}`}
          </p>
        </div>
        {b.emergency && <span className="rounded-full bg-[var(--mine-alarm)] px-3 py-1 text-xs font-bold text-white">Ağrı saati</span>}
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
            <dt className="text-[var(--mine-muted)]">İşaretlenen diş</dt>
            <dd className="mt-0.5 font-semibold">{b.teeth.length ? b.teeth.map((f) => `${f} · ${toothName(f).toLowerCase()}`).join(", ") : "İşaretlenmedi"}</dd>
          </div>
          {b.triage && (
            <div>
              <dt className="text-[var(--mine-muted)]">Ağrı</dt>
              <dd className="mt-1">
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-2 w-32 overflow-hidden rounded-full bg-[var(--mine-bg)]">
                    <span className="block h-full rounded-full bg-[var(--mine-alarm)]" style={{ width: `${b.triage.pain * 10}%` }} />
                  </span>
                  <span className="font-semibold tabular-nums">{b.triage.pain}/10</span>
                </span>
                <span className="mt-1 block text-[var(--mine-muted)]">
                  {b.triage.since && since[b.triage.since]}
                  {b.triage.swelling ? ", şişlik ya da ateş var" : ", şişlik yok"}
                  {b.triage.night ? ", geceleri uyandırıyor" : ""}
                </span>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-[var(--mine-muted)]">Sağlık bilgileri</dt>
            <dd className="mt-0.5 font-semibold">
              {b.consentAt ? (flags.length ? `${flags.length} uyarı, yukarıda` : "Bildirilen risk yok") : "Paylaşılmadı; muayenede sorulacak"}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--mine-muted)]">Açık rıza kaydı</dt>
            <dd className="mt-0.5">{b.consentAt ? `Verildi: ${b.consentAt}` : "Verilmedi"}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
