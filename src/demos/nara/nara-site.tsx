import Link from "next/link";
import { BOOKING_PATH, categories, dayNames, hhmm, hours, services, staff, tl } from "./data";
import { body, display, naraVars } from "./theme";
import { TodaySlots } from "./today-slots";

const LONGEST = Math.max(...services.map((s) => s.minutes));

/** Nara Studio's website: the "kurumsal web sitesi" demo. */
export function NaraSite() {
  // Monday first, the way a Turkish studio would print its hours.
  const week = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--nara-bg)] font-[family-name:var(--nara-body)] text-[var(--nara-ink)] antialiased`}
      style={naraVars}
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-6 sm:px-8">
        <Link className="font-[family-name:var(--nara-display)] text-2xl tracking-tight" href="#">
          Nara<span className="text-[var(--nara-rose)]">.</span>
        </Link>
        <nav aria-label="Nara Studio" className="flex items-center gap-6 text-sm">
          <a className="hidden hover:text-[var(--nara-rose)] sm:inline" href="#hizmetler">Hizmetler</a>
          <a className="hidden hover:text-[var(--nara-rose)] sm:inline" href="#ekip">Ekip</a>
          <a className="hidden hover:text-[var(--nara-rose)] sm:inline" href="#ziyaret">Ziyaret</a>
          <Link
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--nara-ink)] px-5 font-semibold text-[var(--nara-paper)] transition-colors hover:bg-[var(--nara-rose)]"
            href={BOOKING_PATH}
          >
            Randevu al
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-10 pb-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--nara-rose)]">Cilt · kaş ve kirpik · tırnak</p>
            <h1 className="mt-5 font-[family-name:var(--nara-display)] text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.95] tracking-[-0.03em]">
              Kendine ayırdığın saat, <em className="text-[var(--nara-rose)] not-italic">acele etmeden.</em>
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-8 text-[var(--nara-muted)]">
              Nara, aynı anda tek misafirle çalışan küçük bir bakım stüdyosu. Randevunu internetten al,
              geldiğinde seni kimse beklemesin.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--nara-rose)] px-7 font-semibold text-white transition-colors hover:bg-[var(--nara-ink)]"
                href={BOOKING_PATH}
              >
                Randevu al
              </Link>
              <a
                className="inline-flex min-h-12 items-center rounded-full border border-[var(--nara-ink)]/20 px-7 font-semibold transition-colors hover:border-[var(--nara-ink)]"
                href="#hizmetler"
              >
                Fiyatları gör
              </a>
            </div>
          </div>
          <TodaySlots />
        </section>

        <section className="bg-[var(--nara-paper)] py-20 sm:py-28" id="hizmetler">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Hizmetler ve süreler</h2>
              <p className="max-w-[40ch] text-sm leading-6 text-[var(--nara-muted)]">
                Çubuk, işlemin koltukta geçen süresini gösterir. Fiyatlar örnektir.
              </p>
            </div>

            <div className="mt-14 grid gap-14 lg:grid-cols-3 lg:gap-10">
              {categories.map((c) => (
                <div key={c.id}>
                  <h3 className="font-[family-name:var(--nara-display)] text-2xl">{c.name}</h3>
                  <p className="mt-2 text-sm text-[var(--nara-muted)]">{c.note}</p>
                  <ul className="mt-6 divide-y divide-[var(--nara-ink)]/10 border-y border-[var(--nara-ink)]/10">
                    {services
                      .filter((s) => s.category === c.id)
                      .map((s) => (
                        <li className="py-4" key={s.id}>
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-semibold">{s.name}</span>
                            <span className="tabular-nums">{tl(s.price)}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-3">
                            <span aria-hidden="true" className="h-2 flex-1 rounded-full bg-[var(--nara-bg)]">
                              <span
                                className="block h-2 rounded-full bg-[var(--nara-sage)]"
                                style={{ width: `${(s.minutes / LONGEST) * 100}%` }}
                              />
                            </span>
                            <span className="w-14 text-right text-xs tabular-nums text-[var(--nara-muted)]">{s.minutes} dk</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28" id="ekip">
          <h2 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Seni kim karşılayacak</h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-3">
            {staff.map((p, i) => (
              <li className="rounded-[28px] bg-[var(--nara-paper)] p-7" key={p.id}>
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-full font-[family-name:var(--nara-display)] text-2xl text-[var(--nara-paper)]"
                  style={{ background: ["var(--nara-rose)", "var(--nara-ink)", "var(--nara-sage)"][i] }}
                >
                  {p.name[0]}
                </span>
                <p className="mt-6 text-xl font-semibold">{p.name}</p>
                <p className="text-sm text-[var(--nara-muted)]">{p.role}</p>
                <Link
                  className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--nara-rose)] hover:underline"
                  href={`${BOOKING_PATH}?staff=${p.id}`}
                >
                  {p.name} ile randevu al →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[var(--nara-ink)] py-20 text-[var(--nara-paper)] sm:py-28" id="ziyaret">
          <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--nara-display)] text-4xl tracking-[-0.02em] sm:text-5xl">Ziyaret</h2>
              <p className="mt-6 max-w-[40ch] leading-7 text-[var(--nara-paper)]/70">
                Adres ve telefon bu örnek için gösterilmiyor. Gerçek bir sitede burada harita, yol tarifi
                ve tek dokunuşla arama ile WhatsApp düğmeleri yer alır.
              </p>
              <Link
                className="mt-9 inline-flex min-h-12 items-center rounded-full bg-[var(--nara-rose)] px-7 font-semibold text-white transition-colors hover:bg-[var(--nara-paper)] hover:text-[var(--nara-ink)]"
                href={BOOKING_PATH}
              >
                Randevu al
              </Link>
            </div>
            <dl className="divide-y divide-[var(--nara-paper)]/12 border-y border-[var(--nara-paper)]/12">
              {week.map((d) => {
                const h = hours[d];
                return (
                  <div className="flex justify-between py-3.5" key={d}>
                    <dt>{dayNames[d]}</dt>
                    <dd className="tabular-nums text-[var(--nara-paper)]/75">{h ? `${hhmm(h.open)} – ${hhmm(h.close)}` : "Kapalı"}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--nara-muted)] sm:px-8">
        <span className="font-[family-name:var(--nara-display)] text-lg text-[var(--nara-ink)]">
          Nara<span className="text-[var(--nara-rose)]">.</span>
        </span>
        <span>Örnek site · Burak Alp Yahşi</span>
      </footer>
    </div>
  );
}
