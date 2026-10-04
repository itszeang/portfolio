"use client";

import { ArrowRight, ArrowUpRight, AtSign, MapPin, MessageCircle, Nfc, Phone, Star } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { type UnsplashImage, UnsplashPhoto } from "@/demos/shared/unsplash";
import { figtree, images as naraImages, newsreader, nrVars } from "@/demos/nara/site-theme";
import { contact } from "@/content";
import type { Salon } from "./salons";

// A personal sample site for one salon, built on Nara's design. Everything
// specific (name, district, phone, rating) comes from the salon's public map
// listing; services are a starting point, marked as such, and no reviews or
// prices are made up.

type Kind = "sac" | "cilt" | "tirnak" | "epilasyon";

const hair: Record<string, UnsplashImage> = {
  fon: { id: "photo-1580618672591-eb180b1a973f", alt: "Kuaför, müşterisinin saçını fırçayla föner", by: "Adam Winger" },
  kesim: { id: "photo-1634449571010-02389ed0f9b0", alt: "Kuaförde saç kesimi", by: "Lindsay Cash" },
  yikama: { id: "photo-1717160675489-7779f2c91999", alt: "Lavaboda saç yıkama", by: "QUENTIN Mahe" },
  koltuk: { id: "photo-1521590832167-7bcbfaa6381f", alt: "Aynanın önünde kuaför koltukları", by: "Guilherme Petri" },
};

const KIND: Record<Kind, { label: string; h1: [string, string]; lead: string; photo: UnsplashImage; side: UnsplashImage; services: [string, number][] }> = {
  sac: {
    label: "saç tasarımı",
    h1: ["Saçınız,", "tam istediğiniz gibi."],
    lead: "Kesimden renge, fönden özel gün saçına kadar. Saatinizi buradan seçin, sırada beklemeyin.",
    photo: hair.fon,
    side: hair.kesim,
    services: [
      ["Saç kesimi", 45],
      ["Fön", 30],
      ["Saç boyama", 120],
      ["Balyaj / röfle", 180],
      ["Keratin bakımı", 150],
    ],
  },
  cilt: {
    label: "cilt ve kaş bakımı",
    h1: ["Güzellik,", "acele etmeden."],
    lead: "Önce kısa bir analiz, sonra yalnızca ihtiyacınız olan bakım. Saatinizi buradan seçin.",
    photo: naraImages.hero,
    side: naraImages.bakim,
    services: [
      ["Cilt bakımı", 60],
      ["Kaş tasarımı", 30],
      ["Kirpik lifting", 60],
    ],
  },
  tirnak: {
    label: "tırnak bakımı",
    h1: ["Bakımlı eller,", "her gün."],
    lead: "Hijyenik setlerle manikür, pedikür ve kalıcı oje. Saatinizi buradan seçin.",
    photo: naraImages.tirnak,
    side: naraImages.alet,
    services: [
      ["Manikür", 45],
      ["Kalıcı oje", 60],
      ["Pedikür", 60],
    ],
  },
  epilasyon: {
    label: "lazer epilasyon",
    h1: ["Pürüzsüz,", "uzun süre."],
    lead: "Seanslarınızı planlayın, bir sonrakini unutmayın. Saatinizi buradan seçin.",
    photo: naraImages.koltuk,
    side: naraImages.havlu,
    services: [
      ["Lazer epilasyon (bölgesel)", 30],
      ["Ağda", 30],
    ],
  },
};

// A different accent per salon, so no two samples look identical.
const ACCENTS = ["#D9486F", "#9A5B3C", "#4F6B4A", "#6B4E91", "#B0703A", "#2F5D7C"];
const accentOf = (slug: string) => ACCENTS[[...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % ACCENTS.length];

// Footer wordmark sized to the name so it never runs off the page: long names
// wrap onto two balanced lines, sized by the longer line or longest word.
// Wide letters (M, W, &) count for more than narrow ones.
const units = (t: string) => [...t].reduce((n, c) => n + (/[MWmw&@]/.test(c) ? 1.4 : /[A-ZÇĞİÖŞÜ]/.test(c) ? 1.15 : 1), 0);
const wordmarkSize = (name: string) => {
  const longestWord = Math.max(...name.split(/\s+/).map(units));
  const perLine = Math.max(name.length > 14 ? Math.ceil(units(name) / 2) : units(name), longestWord, 4);
  return `min(20rem, ${(150 / perLine).toFixed(1)}vw)`;
};

const DAY = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const subscribe = () => () => {};
const useToday = () => useSyncExternalStore(subscribe, () => new Date().toDateString(), () => "");

/** Taken slots look lived-in but stay the same for a given salon and day. */
const busy = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return (h >>> 0) % 100 < 38;
};

export function SalonSite({ salon }: { salon: Salon }) {
  const kinds = salon.kinds as Kind[];
  const main = KIND[kinds[0]];
  const services = kinds.flatMap((k) => KIND[k].services.map(([name, minutes]) => ({ name, minutes, kind: k })));
  const accent = accentOf(salon.slug);
  const label = kinds.map((k) => KIND[k].label).join(", ");
  const place = salon.mahalle ? `${salon.mahalle}, ${salon.area}` : salon.area;
  const hasRating = salon.rating !== null && salon.reviews > 0;
  const rating = hasRating ? salon.rating!.toFixed(1).replace(".", ",") : "";

  return (
    <div className={`${newsreader.variable} ${figtree.variable} min-h-[100dvh] bg-[var(--nr-bg)] font-[family-name:var(--nr-sans)] text-[var(--nr-ink)] antialiased`} style={{ ...nrVars, "--nr-rose": accent } as React.CSSProperties}>
      <p className="bg-[var(--nr-ink)] px-5 py-2.5 text-center text-[13px] leading-5 text-white/85 sm:px-10" data-teklif-banner>
        Bu sayfa <b className="font-semibold text-white">{salon.name}</b> için hazırlanmış örnek bir tasarımdır.{" "}
        <a className="whitespace-nowrap underline underline-offset-4 hover:text-white" href={contact.phoneHref}>
          Hazırlayan: Burak Alp Yahşi · {contact.phone}
        </a>
      </p>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 text-[11px] tracking-[0.16em] text-[var(--nr-muted)] uppercase sm:px-10">
        <span>{place}</span>
        {hasRating && (
          <span className="text-[var(--nr-ink)]">
            <Star aria-hidden="true" className="mr-1.5 inline size-3 -translate-y-px fill-[var(--nr-rose)] text-[var(--nr-rose)]" />
            {rating} · {salon.reviews} değerlendirme
          </span>
        )}
      </div>

      <header className="sticky top-3 z-30 flex justify-center px-4">
        <nav aria-label={salon.short} className="flex w-full max-w-[560px] items-center justify-between gap-4 rounded-full bg-white/90 py-2 pr-2 pl-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)] backdrop-blur">
          <a
            className={`min-w-0 font-[family-name:var(--nr-serif)] text-balance ${salon.short.length > 12 ? "text-base leading-tight sm:text-lg" : "text-2xl leading-none"}`}
            href="#"
          >
            {salon.short}
          </a>
          <span className="hidden gap-6 text-sm sm:flex">
            <a className="hover:opacity-60" href="#hizmetler">
              Hizmetler
            </a>
            <a className="hover:opacity-60" href="#iletisim">
              İletişim
            </a>
          </span>
          <a className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-[var(--nr-ink)] px-5 text-sm font-semibold text-white hover:bg-black" href="#randevu">
            Randevu al
          </a>
        </nav>
      </header>

      <main>
        <section className="px-5 pt-10 sm:px-10">
          <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">
            <span className="normal-case">{salon.name}</span> — {label}
          </p>
          <div className="mt-4 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <h1 className="font-[family-name:var(--nr-serif)] text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] font-light tracking-[-0.035em]">
              {main.h1[0]}
              <br />
              <span className="pl-[0.9em] italic max-sm:pl-0">{main.h1[1]}</span>
            </h1>
            <div className="lg:pb-8">
              <p className="max-w-[34ch] text-lg leading-8 text-[var(--nr-muted)]">{main.lead}</p>
              <a className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--nr-ink)] px-6 font-semibold text-white hover:bg-black" href="#randevu">
                Randevu al <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
            <UnsplashPhoto image={main.photo} priority sizes="100vw" />
          </div>
        </section>

        <Reviews accent={accent} hasRating={hasRating} rating={rating} salon={salon} />

        <section aria-labelledby="hizmetler-baslik" className="scroll-mt-24 bg-[var(--nr-alt)] px-5 py-24 sm:px-10" id="hizmetler">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">Hizmetler</p>
              <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]" id="hizmetler-baslik">
                Ne yaptırmak <span className="text-[var(--nr-quiet)] italic">istersiniz?</span>
              </h2>
              <div className="mt-8 aspect-[4/3] overflow-hidden">
                <UnsplashPhoto image={main.side} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </div>
            <div>
              <ol className="border-t border-[var(--nr-line)]">
                {services.map((s, i) => (
                  <li className="border-b border-[var(--nr-line)]" key={s.name}>
                    <a className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto_1.25rem] items-baseline gap-x-4 py-5" href={`#randevu`}>
                      <span className="text-xs text-[var(--nr-muted)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-[family-name:var(--nr-serif)] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight font-light transition-transform group-hover:translate-x-1">{s.name}</span>
                      <span className="text-sm text-[var(--nr-muted)]">{s.minutes} dk</span>
                      <ArrowUpRight aria-hidden="true" className="size-4 text-[var(--nr-muted)] group-hover:text-[var(--nr-ink)]" />
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-xs text-[var(--nr-muted)]">Hizmet listesi örnektir; gerçek sitede sizin hizmetleriniz, süreleriniz ve fiyatlarınız yer alır.</p>
            </div>
          </div>
        </section>

        <Booking salon={salon} services={services} />

        <section aria-labelledby="iletisim-baslik" className="scroll-mt-24 grid gap-10 px-5 py-24 sm:px-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" id="iletisim">
          <div className="aspect-[16/11] overflow-hidden">
            <UnsplashPhoto image={kinds.includes("sac") ? hair.koltuk : naraImages.studyo} sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">İletişim</p>
            <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.4rem,4.4vw,4rem)] leading-none font-light tracking-[-0.03em]" id="iletisim-baslik">
              {salon.area}&apos;da, <span className="italic">sizi bekliyoruz.</span>
            </h2>
            <ul className="mt-10 divide-y divide-[var(--nr-line)] border-y border-[var(--nr-line)] text-[15px]">
              <li className="flex gap-3 py-4">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--nr-muted)]" />
                <a className="hover:opacity-60" href={`https://yandex.com.tr/maps/org/${salon.id}/`} rel="noreferrer" target="_blank">
                  {salon.addr}
                </a>
              </li>
              <li className="flex gap-3 py-4">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--nr-muted)]" />
                <a className="tabular-nums hover:opacity-60" href={salon.phoneHref}>
                  {salon.phone}
                </a>
              </li>
              {salon.whatsapp && (
                <li className="flex gap-3 py-4">
                  <MessageCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--nr-muted)]" />
                  <span>WhatsApp&apos;tan yazabilirsiniz</span>
                </li>
              )}
              {salon.instagram && (
                <li className="flex gap-3 py-4">
                  <AtSign aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--nr-muted)]" />
                  <a className="hover:opacity-60" href={salon.instagram} rel="noreferrer" target="_blank">
                    @{salon.instagram.replace(/^https:\/\/instagram\.com\//, "").replace(/\/.*$/, "")}
                  </a>
                </li>
              )}
            </ul>
            <p className="mt-5 text-sm text-[var(--nr-muted)]">Pazartesi–Cumartesi 09:00–19:00 (örnek; gerçek sitede sizin saatleriniz)</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--nr-line)] px-5 pt-20 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="max-w-[18ch] font-[family-name:var(--nr-serif)] text-[clamp(2rem,3.4vw,3rem)] leading-tight font-light">Saatinizi ayıralım.</p>
          <a className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--nr-ink)] px-6 font-semibold text-white hover:bg-black" href="#randevu">
            Randevu al <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
        <p
          aria-hidden="true"
          className="mt-16 pb-[0.12em] text-center font-[family-name:var(--nr-serif)] leading-[1.02] font-light tracking-[-0.04em] text-balance text-[#C9C5BE] select-none"
          style={{ fontSize: wordmarkSize(salon.short) }}
        >
          {salon.short}
        </p>
        <p className="flex flex-wrap justify-between gap-2 py-6 text-xs text-[var(--nr-muted)]">
          <span>© 2026 {salon.name} · örnek tasarım</span>
          <span>Fotoğraflar: Unsplash</span>
        </p>
      </footer>
    </div>
  );
}

/** The salon's rating, and the review card that brings in more. */
function Reviews({ salon, hasRating, rating, accent }: { salon: Salon; hasRating: boolean; rating: string; accent: string }) {
  const strong = salon.offer === "randevu";
  return (
    <section aria-labelledby="yorum-baslik" className="grid items-center gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">Değerlendirmeler</p>
        {hasRating ? (
          <p className="mt-4 flex items-baseline gap-4">
            <span className="font-[family-name:var(--nr-serif)] text-[clamp(4.5rem,10vw,8rem)] leading-none font-light">{rating}</span>
            <span className="text-[var(--nr-muted)]">
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star className="size-4" fill={i < Math.round(salon.rating!) ? accent : "none"} key={i} stroke={accent} />
                ))}
              </span>
              <span className="mt-1 block text-sm">{salon.reviews} değerlendirme</span>
            </span>
          </p>
        ) : null}
        <h2 className="mt-6 font-[family-name:var(--nr-serif)] text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02] font-light tracking-[-0.03em]" id="yorum-baslik">
          {strong ? (
            <>
              Memnun kaldıysanız, <span className="italic">bir de yazın.</span>
            </>
          ) : (
            <>
              Deneyiminizi <span className="italic">paylaşın.</span>
            </>
          )}
        </h2>
        <p className="mt-5 max-w-[46ch] leading-7 text-[var(--nr-muted)]">
          Kasadaki karta telefonunuzu yaklaştırın ya da karekodu okutun; değerlendirme sayfası açılır. Birkaç saniye sürer ve yeni müşterilerin bizi bulmasına yardım eder.
        </p>
      </div>
      <figure className="mx-auto w-full max-w-[400px]">
        <div className="relative aspect-[1.6] rounded-[18px] p-6 text-white shadow-[0_30px_60px_-25px_rgba(0,0,0,.45)]" style={{ background: `linear-gradient(135deg, ${accent}, #1A1A1A)` }}>
          <p className="font-[family-name:var(--nr-serif)] text-2xl leading-tight">{salon.short}</p>
          <p className="mt-1 text-xs tracking-[0.14em] text-white/70 uppercase">Bizi değerlendirin</p>
          <Nfc aria-hidden="true" className="absolute top-6 right-6 size-7 text-white/80" />
          <div className="absolute right-6 bottom-6 grid size-20 grid-cols-5 gap-[3px] rounded-md bg-white p-2" aria-hidden="true">
            {Array.from({ length: 25 }, (_, i) => (
              <span className={busy(`${salon.slug}${i}`) || i % 6 === 0 ? "bg-[#1A1A1A]" : ""} key={i} />
            ))}
          </div>
          <p className="absolute bottom-6 left-6 flex gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star className="size-4 fill-white text-white" key={i} />
            ))}
          </p>
        </div>
        <figcaption className="mt-4 text-center text-xs text-[var(--nr-muted)]">NFC&apos;li değerlendirme kartı: telefonu yaklaştırmak yeterli</figcaption>
      </figure>
    </section>
  );
}

/** A booking request that lands in the salon's WhatsApp. In the sample, nothing is sent. */
function Booking({ salon, services }: { salon: Salon; services: { name: string; minutes: number; kind: Kind }[] }) {
  const today = useToday();
  const [service, setService] = useState(services[0].name);
  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);

  const days = useMemo(() => {
    if (!today) return [];
    const out: { label: string; long: string; key: string }[] = [];
    const base = new Date(today);
    for (let i = 0; out.length < 6; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      if (d.getDay() === 0) continue;
      out.push({ label: i === 0 ? "Bugün" : i === 1 ? "Yarın" : `${DAY[d.getDay()].slice(0, 3)} ${d.getDate()}`, long: `${d.getDate()} ${["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"][d.getMonth()]} ${DAY[d.getDay()]}`, key: d.toDateString() });
    }
    return out;
  }, [today]);

  const now = new Date();
  const slots = days[dayIdx]
    ? Array.from({ length: 20 }, (_, i) => 9 * 60 + i * 30).filter((t) => t + 30 <= 19 * 60 && !(dayIdx === 0 && days[0].label === "Bugün" && t <= now.getHours() * 60 + now.getMinutes() + 30) && !busy(`${salon.slug}${days[dayIdx].key}${t}`))
    : [];
  const ok = time !== null && slots.includes(time) && name.trim().length >= 2;
  const message = `Merhaba, ${days[dayIdx]?.long ?? ""} saat ${time !== null ? hhmm(time) : ""} için ${service.toLocaleLowerCase("tr")} randevusu almak istiyorum. Adım: ${name.trim()}`;

  return (
    <section aria-labelledby="randevu-baslik" className="scroll-mt-24 px-5 py-24 sm:px-10" id="randevu">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">Online randevu</p>
          <h2 className="mt-4 font-[family-name:var(--nr-serif)] text-[clamp(2.6rem,5vw,4.5rem)] leading-none font-light tracking-[-0.03em]" id="randevu-baslik">
            Saatinizi <span className="text-[var(--nr-quiet)] italic">seçin.</span>
          </h2>
          <p className="mt-5 max-w-[40ch] leading-7 text-[var(--nr-muted)]">
            Telefonla aramanıza gerek yok. Hizmeti, günü ve saati seçin; randevu talebiniz salonun WhatsApp&apos;ına hazır bir mesaj olarak düşer, onaylanınca size dönülür.
          </p>
        </div>

        {sent ? (
          <div aria-live="polite" className="rounded-[22px] bg-[var(--nr-alt)] p-7 sm:p-10">
            <p className="text-[11px] tracking-[0.18em] text-[var(--nr-muted)] uppercase">Salonun WhatsApp&apos;ına düşen mesaj</p>
            <p className="mt-4 max-w-[44ch] rounded-2xl rounded-tl-sm bg-white p-5 leading-7 shadow-sm">{message}</p>
            <p className="mt-6 text-sm leading-6 text-[var(--nr-muted)]">Bu örnek sayfada mesaj gönderilmedi. Gerçek sitede bu talep doğrudan salonun telefonuna gelir.</p>
            <button className="mt-6 text-sm font-semibold underline underline-offset-4" onClick={() => (setSent(false), setTime(null), setTried(false))} type="button">
              Yeni randevu
            </button>
          </div>
        ) : (
          <form
            className="rounded-[22px] border border-[var(--nr-line)] p-6 sm:p-8"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setTried(true);
              if (ok) setSent(true);
            }}
          >
            <fieldset>
              <legend className="text-sm font-semibold">Hizmet</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {services.map((s) => (
                  <button
                    aria-pressed={service === s.name}
                    className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${service === s.name ? "border-[var(--nr-ink)] bg-[var(--nr-ink)] text-white" : "border-[var(--nr-line)] hover:border-[var(--nr-ink)]"}`}
                    key={s.name}
                    onClick={() => setService(s.name)}
                    type="button"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Gün</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {days.map((d, i) => (
                  <button
                    aria-pressed={dayIdx === i}
                    className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${dayIdx === i ? "border-[var(--nr-ink)] bg-[var(--nr-ink)] text-white" : "border-[var(--nr-line)] hover:border-[var(--nr-ink)]"}`}
                    key={d.key}
                    onClick={() => (setDayIdx(i), setTime(null))}
                    type="button"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Saat</legend>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((t) => (
                  <button
                    aria-pressed={time === t}
                    className={`min-h-10 rounded-full border text-sm tabular-nums transition-colors ${time === t ? "border-[var(--nr-rose)] bg-[var(--nr-rose)] text-white" : "border-[var(--nr-line)] hover:border-[var(--nr-ink)]"}`}
                    key={t}
                    onClick={() => setTime(t)}
                    type="button"
                  >
                    {hhmm(t)}
                  </button>
                ))}
              </div>
              {tried && time === null && <p className="mt-2 text-sm text-[var(--nr-rose)]">Bir saat seçin.</p>}
            </fieldset>
            <label className="mt-6 block text-sm font-semibold" htmlFor="teklif-ad">
              Adınız
              <input
                className="mt-2 block min-h-12 w-full rounded-xl border border-[var(--nr-line)] bg-white px-4 font-normal focus-visible:border-[var(--nr-ink)] focus-visible:outline-none"
                id="teklif-ad"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </label>
            {tried && name.trim().length < 2 && <p className="mt-2 text-sm text-[var(--nr-rose)]">Adınızı yazın.</p>}
            <button className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--nr-ink)] px-6 font-semibold text-white hover:bg-black sm:w-auto" type="submit">
              <MessageCircle aria-hidden="true" className="size-4" /> WhatsApp&apos;tan randevu iste
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
