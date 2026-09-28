"use client";

import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { BOOKING_PATH, type Category, categories, dayNames, freeSlots, hhmm, hours, isoDay, loadBookings, services, staff, tl } from "./data";
import { figtree, images, newsreader, nrVars } from "./site-theme";

const ASSISTANT_PATH = "/hizmetler/yapay-zeka-otomasyonu/nara-asistan";

// Free times depend on the visitor's clock, so they only exist in the browser.
const subscribe = () => () => {};
const useMinute = () => useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 60000), () => 0);

const picks: { staffId: string; serviceId: string; image: keyof typeof images }[] = [
  { staffId: "ece", serviceId: "klasik-cilt", image: "bakim" },
  { staffId: "selin", serviceId: "kas-tasarimi", image: "kas" },
  { staffId: "deniz", serviceId: "manikur", image: "tirnak" },
];

/** The next open day that still has time left, and each specialist's free times on it. */
function useOpenings() {
  const minute = useMinute();
  if (!minute) return null;
  const now = new Date(minute * 60000);
  for (let i = 0; i < 8; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const h = hours[d.getDay()];
    if (!h || (i === 0 && now.getHours() * 60 + now.getMinutes() > h.close - 90)) continue;
    const bookings = loadBookings();
    const label = i === 0 ? "Bugün" : i === 1 ? "Yarın" : dayNames[d.getDay()];
    const rows = picks.map((p) => {
      const service = services.find((s) => s.id === p.serviceId)!;
      return { ...p, service, person: staff.find((s) => s.id === p.staffId)!, slots: freeSlots(d, p.staffId, service.minutes, bookings, now).slice(0, 4) };
    });
    return { label, day: isoDay(d), rows };
  }
  return null;
}

const bookHref = (serviceId: string, staffId?: string, day?: string, time?: number) =>
  `${BOOKING_PATH}?service=${serviceId}${staffId && day && time !== undefined ? `&staff=${staffId}&day=${day}&time=${time}` : ""}`;

export function NaraSite() {
  const open = useOpenings();
  const [filter, setFilter] = useState<Category | "tumu">("tumu");
  const first = open?.rows.flatMap((r) => r.slots.map((t) => ({ ...r, t }))).sort((a, b) => a.t - b.t)[0];
  const list = services.filter((s) => filter === "tumu" || s.category === filter);
  const durations = services.map((s) => s.minutes);

  return (
    <div className={`${newsreader.variable} ${figtree.variable} min-h-[100dvh] bg-[var(--nr-bg)] font-[family-name:var(--nr-sans)] text-[var(--nr-ink)] antialiased`} style={nrVars}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 text-[11px] tracking-[0.16em] text-[var(--nr-muted)] uppercase sm:px-10">
        <span className="hidden sm:inline">Randevular yarım saatlik aralıklarla</span>
        <span aria-live="polite" className="text-[var(--nr-ink)]">
          {first ? (
            <>
              <span aria-hidden="true" className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-[var(--nr-rose)]" />
              {open!.label} ilk boş saat {hhmm(first.t)} · {first.person.name}
            </>
          ) : (
            " "
          )}
        </span>
        <span className="hidden md:inline">Nara Studio · Cihangir · Pazartesi kapalı</span>
      </div>

      <header className="sticky top-3 z-30 flex justify-center px-4">
        <nav aria-label="Nara Studio" className="flex w-full max-w-[560px] items-center justify-between gap-4 rounded-full bg-white/90 py-2 pr-2 pl-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)] backdrop-blur">
          <a className="font-[family-name:var(--nr-serif)] text-2xl leading-none" href="#">
            Nara
          </a>
          <span className="hidden gap-6 text-sm sm:flex">
            <a className="hover:opacity-60" href="#hizmetler">
              Hizmetler
            </a>
            <a className="hover:opacity-60" href="#uzmanlar">
              Uzmanlar
            </a>
            <a className="hover:opacity-60" href="#studyo">
              Stüdyo
            </a>
          </span>
          <Link className="inline-flex min-h-10 items-center rounded-full bg-[var(--nr-ink)] px-5 text-sm font-semibold text-white hover:bg-black" href={BOOKING_PATH}>
            Randevu al
          </Link>
        </nav>
      </header>

      <main>
        <section className="px-5 pt-10 sm:px-10">
          <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">Nara Studio — cilt, kaş ve tırnak</p>
          <div className="mt-4 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <h1 className="font-[family-name:var(--nr-serif)] text-[clamp(3.6rem,11vw,10rem)] leading-[0.88] font-light tracking-[-0.035em]">
              Güzellik,
              <br />
              <span className="pl-[0.9em] italic max-sm:pl-0">acele etmeden.</span>
            </h1>
            <div className="lg:pb-10">
              <p className="max-w-[34ch] text-lg leading-8 text-[var(--nr-muted)]">Her randevuya bir saat ve bir uzman ayırıyoruz. Önce kısa bir analiz, sonra yalnızca ihtiyacınız olan bakım.</p>
              <Link className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--nr-ink)] px-6 font-semibold text-white hover:bg-black" href={BOOKING_PATH}>
                Randevu al <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
            <UnsplashPhoto image={images.hero} priority sizes="100vw" />
            {first && (
              <Link
                className="absolute bottom-5 left-5 flex max-w-[calc(100%-2.5rem)] flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-white/75 px-5 py-2.5 text-sm backdrop-blur-md hover:bg-white sm:bottom-8 sm:left-8"
                href={bookHref(first.service.id, first.staffId, open!.day, first.t)}
              >
                <span className="font-[family-name:var(--nr-serif)] text-lg">
                  {open!.label} {hhmm(first.t)}
                </span>
                <span className="text-[var(--nr-muted)]">
                  {first.service.name} · {first.person.name} · boş
                </span>
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-8 px-5 py-28 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          <p className="text-[11px] tracking-[0.18em] uppercase">
            <span className="text-[var(--nr-muted)]">(01)</span> Yaklaşımımız
          </p>
          <div>
            <p className="font-[family-name:var(--nr-serif)] text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.18] font-light text-[var(--nr-quiet)]">
              Az şey yapıyoruz, özenle yapıyoruz. Dokuz hizmet, üç uzman ve her randevu arasında boş bırakılan bir çeyrek saat; kimse bir sonrakine yetişmek için acele etmiyor.
            </p>
            <dl className="mt-10 flex flex-wrap gap-x-16 gap-y-6">
              {[
                [String(staff.length), "uzman"],
                [String(services.length), "hizmet, hepsi fiyatlı"],
                [`${Math.min(...durations)}–${Math.max(...durations)}`, "dakika süren seanslar"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-[family-name:var(--nr-serif)] text-5xl font-light">{n}</span>
                    <span className="mt-1 block text-sm text-[var(--nr-muted)]">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="grid items-center gap-10 px-5 pb-28 sm:px-10 lg:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden">
            <UnsplashPhoto image={images.imza} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="lg:pl-10">
            <p className="text-[11px] tracking-[0.18em] uppercase">
              <span className="text-[var(--nr-muted)]">(02)</span> İmza bakım
            </p>
            <h2 className="mt-5 font-[family-name:var(--nr-serif)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-light tracking-[-0.03em]">
              Klasik cilt
              <br />
              <span className="italic">bakımı.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] leading-7 text-[var(--nr-muted)]">
              Temizlik, peeling, ihtiyaca göre maske ve nem. Başlamadan önce Ece cildinize bakar ve yalnızca gerekeni uygular; bakımın sonunda evde ne yapacağınızı yazılı olarak verir.
            </p>
            <dl className="mt-8 grid max-w-sm grid-cols-2 border-t border-[var(--nr-line)] pt-5 text-sm">
              <div>
                <dt className="text-[var(--nr-muted)]">Süre</dt>
                <dd className="mt-1 font-[family-name:var(--nr-serif)] text-2xl">60 dk</dd>
              </div>
              <div>
                <dt className="text-[var(--nr-muted)]">Fiyat</dt>
                <dd className="mt-1 font-[family-name:var(--nr-serif)] text-2xl">
                  {/* Newsreader has no lira sign; it comes from the body face. */}
                  1.200 <span className="font-[family-name:var(--nr-sans)] text-xl">₺</span>
                </dd>
              </div>
            </dl>
            <Link className="mt-8 inline-flex items-center gap-2 border-b border-[var(--nr-ink)] pb-1 text-sm font-semibold hover:opacity-60" href={bookHref("klasik-cilt")}>
              Bu bakım için saat seç <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>

        <section aria-labelledby="hizmetler-baslik" className="scroll-mt-24 bg-[var(--nr-alt)] px-5 py-28 sm:px-10" id="hizmetler">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase">
                <span className="text-[var(--nr-muted)]">(03)</span> Hizmetler
              </p>
              <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]" id="hizmetler-baslik">
                Dokuz hizmet. <span className="text-[var(--nr-quiet)] italic">Hepsi süreli.</span>
              </h2>
            </div>
            <div aria-label="Hizmet türü" className="flex flex-wrap gap-x-6 gap-y-2 text-sm" role="group">
              {[{ id: "tumu" as const, name: "Tümü" }, ...categories].map((c) => (
                <button
                  aria-pressed={filter === c.id}
                  className={`min-h-10 border-b pb-0.5 transition-colors ${filter === c.id ? "border-[var(--nr-ink)]" : "border-transparent text-[var(--nr-muted)] hover:text-[var(--nr-ink)]"}`}
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  type="button"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <ol className="mt-12 border-t border-[var(--nr-line)]">
            {list.map((s) => {
              const person = staff.find((p) => p.category === s.category)!;
              return (
                <li className="border-b border-[var(--nr-line)]" key={s.id}>
                  <Link className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-6 sm:grid-cols-[3rem_minmax(0,1.4fr)_minmax(0,1fr)_6rem_7rem_1.5rem]" href={bookHref(s.id)}>
                    <span className="text-xs text-[var(--nr-muted)] tabular-nums">{String(services.indexOf(s) + 1).padStart(2, "0")}</span>
                    <span className="font-[family-name:var(--nr-serif)] text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-light transition-transform group-hover:translate-x-1">{s.name}</span>
                    <span className="col-start-2 text-sm text-[var(--nr-muted)] sm:col-start-auto">
                      {categories.find((c) => c.id === s.category)!.name} · {person.name}
                    </span>
                    <span className="col-start-2 text-sm text-[var(--nr-muted)] sm:col-start-auto">{s.minutes} dk</span>
                    <span className="col-start-3 row-start-1 text-right tabular-nums sm:col-start-auto sm:row-start-auto">{tl(s.price)}</span>
                    <ArrowUpRight aria-hidden="true" className="hidden size-4 text-[var(--nr-muted)] group-hover:text-[var(--nr-ink)] sm:block" />
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-xs text-[var(--nr-muted)]">Fiyatlar örnektir. Satıra dokunun; randevu o hizmetle açılır.</p>
        </section>

        <section aria-labelledby="uzmanlar-baslik" className="scroll-mt-24 px-5 py-28 sm:px-10" id="uzmanlar">
          <p className="text-[11px] tracking-[0.18em] uppercase">
            <span className="text-[var(--nr-muted)]">(04)</span> Uzmanlar
          </p>
          <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]" id="uzmanlar-baslik">
            Üç uzman, <span className="text-[var(--nr-quiet)] italic">üç ayrı masa.</span>
          </h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {picks.map((p) => {
              const person = staff.find((s) => s.id === p.staffId)!;
              const row = open?.rows.find((r) => r.staffId === p.staffId);
              return (
                <li key={p.staffId}>
                  <div className="aspect-[4/5] overflow-hidden">
                    <UnsplashPhoto image={images[p.image]} sizes="(min-width: 768px) 33vw, 100vw" />
                  </div>
                  <p className="mt-5 font-[family-name:var(--nr-serif)] text-3xl font-light">{person.name}</p>
                  <p className="text-sm text-[var(--nr-muted)]">{person.role}</p>
                  <p className="mt-4 text-xs tracking-[0.14em] text-[var(--nr-muted)] uppercase">{open ? `${open.label} boş saatler` : "Boş saatler"}</p>
                  <div className="mt-2 flex min-h-10 flex-wrap gap-2">
                    {row && row.slots.length === 0 && <span className="text-sm text-[var(--nr-muted)]">Bu gün dolu.</span>}
                    {row?.slots.map((t) => (
                      <Link className="inline-flex min-h-10 items-center rounded-full border border-[var(--nr-line)] px-4 text-sm tabular-nums hover:border-[var(--nr-ink)]" href={bookHref(p.serviceId, p.staffId, open!.day, t)} key={t}>
                        {hhmm(t)}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="adimlar-baslik" className="bg-[var(--nr-alt)] px-5 py-28 sm:px-10">
          <p className="text-[11px] tracking-[0.18em] uppercase">
            <span className="text-[var(--nr-muted)]">(05)</span> Randevu nasıl geçer
          </p>
          <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]" id="adimlar-baslik">
            Bir saat, <span className="text-[var(--nr-quiet)] italic">üç adımda.</span>
          </h2>
          <ol className="mt-12 space-y-6">
            {(
              [
                ["I", "Önce bakarız.", "Uzmanınız cildinizi, kaşınızı ya da tırnağınızı inceler ve ne yapacağını anlatır. Gerekmeyen hiçbir şeyi önermeyiz.", "analiz"],
                ["II", "Sonra bakım.", "Tek kullanımlık setler, sessiz bir oda ve sizin için ayrılmış bir saat. Aceleyle biten bir seans olmaz.", "serum"],
                ["III", "Evde devamı.", "Çıkarken evde ne yapmanız gerektiğini yazılı veririz. Bir hafta sonra nasıl olduğunu sormak için mesaj atarız.", "sonra"],
              ] as const
            ).map(([n, title, text, img], i) => (
              <li className="sticky grid overflow-hidden border border-[var(--nr-line)] bg-white md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]" key={n} style={{ top: `${96 + i * 28}px` }}>
                <div className="aspect-[16/10] md:aspect-auto md:min-h-[380px]">
                  <UnsplashPhoto image={images[img]} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
                <div className="flex flex-col p-8 sm:p-12">
                  <p className="flex justify-between font-[family-name:var(--nr-serif)] text-lg">
                    <span>{n} — Adım</span>
                    <span className="text-xs text-[var(--nr-muted)]">0{i + 1}</span>
                  </p>
                  <h3 className="mt-10 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]">{title}</h3>
                  <p className="mt-5 max-w-[40ch] leading-7 text-[var(--nr-muted)]">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="studyo-baslik" className="scroll-mt-24 grid gap-10 px-5 py-28 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]" id="studyo">
          <div className="aspect-[16/11] overflow-hidden">
            <UnsplashPhoto image={images.studyo} sizes="(min-width: 1024px) 56vw, 100vw" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase">
              <span className="text-[var(--nr-muted)]">(06)</span> Stüdyo
            </p>
            <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,4.4vw,4rem)] leading-none font-light tracking-[-0.03em]" id="studyo-baslik">
              Cihangir&apos;de, <span className="italic">ikinci kat.</span>
            </h2>
            <dl className="mt-10 divide-y divide-[var(--nr-line)] border-y border-[var(--nr-line)] text-sm">
              {hours.map((h, d) => ({ h, d })).slice(1).concat({ h: hours[0], d: 0 }).map(({ h, d }) => (
                <div className="flex justify-between py-3" key={d}>
                  <dt>{dayNames[d]}</dt>
                  <dd className="tabular-nums text-[var(--nr-muted)]">{h ? `${hhmm(h.open)} – ${hhmm(h.close)}` : "Kapalı"}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-6 text-[var(--nr-muted)]">
              Sorunuz mu var? Mesaj asistanımız fiyatı, süreyi ve boş saati hemen söyler.{" "}
              <Link className="text-[var(--nr-ink)] underline underline-offset-4" href={ASSISTANT_PATH}>
                Mesajla sor
              </Link>
            </p>
          </div>
        </section>

        <section aria-labelledby="notlar-baslik" className="px-5 pb-28 sm:px-10">
          <p className="text-[11px] tracking-[0.18em] uppercase">
            <span className="text-[var(--nr-muted)]">(07)</span> Notlar
          </p>
          <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]" id="notlar-baslik">
            Bakım <span className="text-[var(--nr-quiet)] italic">üzerine.</span>
          </h2>
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {(
              [
                ["havlu", "Cilt · 3 dk", "Cilt bakımından sonraki ilk 24 saat", "Makyajı ertesi sabaha bırakın, sıcak duştan ve güneşten kaçının; cildiniz bakımı o gece tamamlar."],
                ["alet", "Tırnak · 2 dk", "Kalıcı ojeyi evde kazımayın", "Kazımak tırnağın üst katmanını da götürür. Çıkarmak için on beş dakikalık bir randevu yeterli."],
                ["koltuk", "Stüdyo · 2 dk", "Neden randevu aralarında çeyrek saat var", "Her misafirden sonra koltuk, aletler ve havlular değişir. O çeyrek saat bunun için."],
              ] as const
            ).map(([img, tag, title, text]) => (
              <li key={title}>
                <div className="aspect-[4/3] overflow-hidden">
                  <UnsplashPhoto image={images[img]} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <p className="mt-5 text-[11px] tracking-[0.16em] text-[var(--nr-muted)] uppercase">{tag}</p>
                <h3 className="mt-2 font-[family-name:var(--nr-serif)] text-2xl leading-snug font-light">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--nr-muted)]">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-[var(--nr-line)] px-5 pt-20 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="font-[family-name:var(--nr-serif)] text-[clamp(2rem,3.4vw,3rem)] leading-tight font-light">Bir saat ayıralım.</p>
            <Link className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--nr-ink)] px-6 font-semibold text-white hover:bg-black" href={BOOKING_PATH}>
              Randevu al <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            {[
              ["Stüdyo", [["Hizmetler", "#hizmetler"], ["Uzmanlar", "#uzmanlar"], ["Ziyaret", "#studyo"]]],
              ["Randevu", [["Randevu al", BOOKING_PATH], ["Mesajla sor", ASSISTANT_PATH]]],
              ["Yasal", [["KVKK aydınlatma metni (örnek)", ""]]],
            ].map(([title, links]) => (
              <div key={title as string}>
                <p className="text-[11px] tracking-[0.16em] text-[var(--nr-muted)] uppercase">{title as string}</p>
                <ul className="mt-3 space-y-2">
                  {(links as string[][]).map(([l, h]) => (
                    <li key={l}>
                      {h ? (
                        <Link className="hover:opacity-60" href={h}>
                          {l}
                        </Link>
                      ) : (
                        <span className="text-[var(--nr-muted)]">{l}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p aria-hidden="true" className="mt-16 text-center font-[family-name:var(--nr-serif)] text-[clamp(8rem,30vw,26rem)] leading-[0.8] font-light tracking-[-0.05em] text-[#C9C5BE] select-none">
          Nara
        </p>
        <p className="flex flex-wrap justify-between gap-2 py-6 text-xs text-[var(--nr-muted)]">
          <span>© 2026 Nara Studio · örnek işletme, adres ve telefon içermez</span>
          <span>Fotoğraflar: Unsplash · {creditsOf(images).join(", ")}</span>
        </p>
      </footer>
    </div>
  );
}
