import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowUp, Plus } from "lucide-react";
import { doksanIn, KAPORA } from "./data";
import { DoksanApp } from "./doksan-app";
import { anton, dkVars, images, inter } from "./theme";
import type { Lang } from "@/lib/i18n";

const big = "font-[family-name:var(--dk-display)] uppercase leading-[0.9]";

/** The red sticker: the club's "90'" on a rotated tag. */
function Sticker({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-grid place-items-center rounded-md bg-[var(--dk-bib)] px-3 py-1 font-[family-name:var(--dk-display)] leading-none text-white ${className}`}>
      90&apos;
    </span>
  );
}

const COPY = {
  tr: {
    book: "Saha ayır",
    h1: ["Akşam oldu.", "Maç başlıyor."],
    who: "Kimle?",
    lead: "İlk maçınızdan yüzüncüsüne kadar Doksan'da ışıklı sahalar, yelek, top ve duş hazır. Boş saati görün, kaporayı yatırın, kadroyu kurun.",
    seeTimes: "Boş saatleri gör",
    features: (pitchNames: string[]) => [
      ["tel", "İki saha. Işıklar gece yarısına kadar açık.", `${pitchNames.map((p) => p.replace(" · ", ", ")).join(" ve ")}. Yedi kişilik takımlar için ölçülmüş, 2024'te yenilenmiş sentetik çim.`],
      ["kale", "Maçınızı biz düşünelim. Siz oynayın.", "Kapora, iptal kuralı, sabit saat ve kişi başı ücret tek ekranda. Grup mesajını da biz yazarız, siz yapıştırın."],
    ],
    bookH2: ["Sahayı ayır —", "kadroyu kur."],
    bookLead: "Boş saatler ve fiyatlar aşağıda. Kaporayı yatırınca saat sizin; maçtan bir gün öncesine kadar ücretsiz iptal.",
    tiles: [
      ["cizgi", "7'ye 7", "Her sahada iki kale, çizgiler yeni."],
      ["top", "Yelek ve top", "Ücretsiz, maçtan önce hazır."],
      ["gece", "24.00'e kadar", "Işıklar son maç bitene kadar açık."],
    ],
    faqTitle: "Aklınıza takılanlar",
    faq: (deposit: string) => [
      ["Saha nasıl ayrılır?", "Aşağıdan günü ve boş saati seçin, takım adını ve kaptanın telefonunu yazın. Kapora bağlantısı SMS ile gelir."],
      ["Kapora ne kadar, geri alınır mı?", `Kapora ${deposit}. Maçtan 24 saat öncesine kadar iptal ederseniz iade edilir; son 24 saatte iptal ederseniz yanar.`],
      ["Her hafta aynı saatte oynayabilir miyiz?", "Evet. Sabit saat seçerseniz saha her hafta sizin olur ve %10 indirim uygulanır; istediğiniz hafta bırakabilirsiniz."],
      ["Yelek ve top veriliyor mu?", "Yelek, top ve duş ücretsiz. Krampon yerine halı saha ayakkabısı giyin."],
      ["Yağmurda maç iptal olur mu?", "Kapalı sahada olmaz. Açık sahada fırtına uyarısı varsa ücretsiz erteleriz."],
    ],
    toTop: "Başa dön",
    tea: "Maç sonrası çay bizden",
    venue: "Doksan Halı Saha, Bursa · örnek işletme",
    hoursTitle: "Saatler",
    hours: ["Hafta içi 16.00–24.00", "Hafta sonu 10.00–24.00"],
    credits: (c: string) => `Fotoğraflar: Unsplash · ${c}. Fiyatlar örnektir.`,
  },
  en: {
    book: "Book a pitch",
    h1: ["Night falls.", "Match starts."],
    who: "Who's in?",
    lead: "From your first match to your hundredth, Doksan has floodlit pitches, bibs, a ball and showers ready. See the free hours, pay the deposit, pick the line-up.",
    seeTimes: "See free times",
    features: (pitchNames: string[]) => [
      ["tel", "Two pitches. Lights on until midnight.", `${pitchNames.map((p) => p.replace(" · ", ", ")).join(" and ")}. Sized for seven-a-side teams, with artificial turf relaid in 2024.`],
      ["kale", "We'll think about the match. You play it.", "Deposit, cancellation rule, weekly slot and price per player on one screen. We even write the group message; you just paste it."],
    ],
    bookH2: ["Book the pitch —", "pick the team."],
    bookLead: "Free hours and prices are below. Once the deposit is paid, the hour is yours; free cancellation up to a day before the match.",
    tiles: [
      ["cizgi", "7-a-side", "Two goals on every pitch, fresh lines."],
      ["top", "Bibs and ball", "Free, ready before kick-off."],
      ["gece", "Till midnight", "Lights stay on until the last match ends."],
    ],
    faqTitle: "Questions",
    faq: (deposit: string) => [
      ["How do I book a pitch?", "Choose the day and a free hour below, then write the team name and the captain's phone number. The deposit link comes by SMS."],
      ["How much is the deposit, and is it refundable?", `The deposit is ${deposit}. Cancel up to 24 hours before the match and it's refunded; cancel in the last 24 hours and it's lost.`],
      ["Can we play at the same time every week?", "Yes. Choose a weekly slot and the pitch is yours every week with 10% off; you can drop any week you like."],
      ["Are bibs and a ball provided?", "Bibs, a ball and showers are free. Wear astro shoes rather than studs."],
      ["Is the match cancelled if it rains?", "Not on the indoor pitch. On the outdoor pitch, if there's a storm warning we move your match for free."],
    ],
    toTop: "Back to top",
    tea: "Tea's on us after the match",
    venue: "Doksan Halı Saha, Bursa · a sample business",
    hoursTitle: "Hours",
    hours: ["Weekdays 16:00–24:00", "Weekends 10:00–24:00"],
    credits: (c: string) => `Photos: Unsplash · ${c}. Prices are examples.`,
  },
};

/** Doksan Halı Saha: a pitch website with its booking inside. */
export function DoksanPage({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { pitches, tl } = doksanIn(lang);
  return (
    <div className={`${anton.variable} ${inter.variable} min-h-[100dvh] bg-[var(--dk-bg)] font-[family-name:var(--dk-font)] text-[var(--dk-ink)] antialiased`} style={dkVars}>
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <a className={`${big} text-4xl`} href="#">
          Doksan
        </a>
        <a className="inline-flex min-h-11 items-center rounded-lg bg-[var(--dk-ink)] px-5 font-[family-name:var(--dk-display)] text-white uppercase hover:bg-black" href="#saha">
          {c.book}
        </a>
      </header>

      <main>
        <section className="relative px-5 pt-10 pb-24 text-center sm:px-10">
          <h1 className={`${big} relative mx-auto max-w-[12ch] text-[clamp(4.6rem,15vw,14rem)] tracking-[-0.04em]`}>
            {c.h1[0]}
            <br />
            {c.h1[1]}
            <span className="absolute top-1/2 left-1/2 hidden w-[min(18vw,210px)] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] overflow-hidden rounded-3xl shadow-2xl sm:block">
              <span className="block aspect-[3/4]">
                <UnsplashPhoto image={images.vurus} lang={lang} priority sizes="300px" />
              </span>
              <span className="absolute inset-x-3 bottom-3 rounded-lg bg-[var(--dk-bib)] py-1 text-[clamp(1.2rem,2vw,1.8rem)] tracking-normal text-white">{c.who}</span>
            </span>
          </h1>
          <Sticker className="absolute top-[16%] right-[7%] hidden -rotate-12 text-[clamp(2.5rem,5vw,4.5rem)] md:inline-grid" />
          <p className="mx-auto mt-16 max-w-[46ch] text-lg leading-7 font-semibold">{c.lead}</p>
          <a className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[var(--dk-ink)] px-6 font-[family-name:var(--dk-display)] text-lg text-white uppercase hover:bg-black" href="#saha">
            {c.seeTimes}
          </a>
        </section>

        <section className="bg-[var(--dk-ink)] px-5 py-24 text-white sm:px-10">
          <div className="mx-auto grid max-w-6xl gap-16">
            {c.features(pitches.map((p) => p.name)).map(([img, title, text], i) => (
              <div className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`} key={title}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <UnsplashPhoto image={images[img]} lang={lang} sizes="(min-width: 768px) 45vw, 100vw" />
                </div>
                <div>
                  <h2 className={`${big} text-[clamp(2.6rem,5vw,4.4rem)]`}>{title}</h2>
                  <p className="mt-6 max-w-[44ch] text-lg leading-7 font-semibold text-white/85">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="saha-baslik" className="scroll-mt-4 px-5 py-24 sm:px-10" id="saha">
          <div className="mx-auto max-w-6xl">
            <h2 className={`${big} text-[clamp(3.4rem,8vw,7rem)]`} id="saha-baslik">
              {c.bookH2[0]}
              <br />
              {c.bookH2[1]}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lg leading-7 font-semibold">{c.bookLead}</p>
            <div className="mt-12">
              <DoksanApp />
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-10">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {c.tiles.map(([img, t, d]) => (
              <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl" key={t}>
                <UnsplashPhoto image={images[img]} lang={lang} sizes="(min-width: 768px) 33vw, 100vw" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(4,21,20,.85))] p-5 pt-16 text-white">
                  <span className={`${big} block text-4xl`}>{t}</span>
                  <span className="mt-2 block font-semibold">{d}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section aria-labelledby="sss-baslik" className="px-5 pb-24 sm:px-10">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
            <div>
              <h2 className={`${big} text-[clamp(2.6rem,5vw,4rem)]`} id="sss-baslik">
                {c.faqTitle}
              </h2>
              <Sticker className="mt-8 -rotate-6 text-5xl" />
            </div>
            <div className="space-y-3">
              {c.faq(tl(KAPORA)).map(([q, a]) => (
                <details className="group rounded-2xl bg-[#F4F4F2] px-5" key={q}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-[family-name:var(--dk-display)] text-2xl uppercase [&::-webkit-details-marker]:hidden">
                    {q}
                    <Plus aria-hidden="true" className="size-5 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="pb-5 leading-7 font-semibold text-[var(--dk-muted)]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-[var(--dk-ink)] px-5 pt-16 pb-10 text-white sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,0.6fr))]">
          <a aria-label={c.toTop} className="grid size-40 place-items-center rounded-full bg-[var(--dk-bg)] text-[var(--dk-bib)] hover:bg-white" href="#">
            <ArrowUp aria-hidden="true" className="size-16" strokeWidth={3} />
          </a>
          <div>
            <p className={`${big} text-3xl`}>{c.tea}</p>
            <p className="mt-2 text-sm font-semibold text-white/70">{c.venue}</p>
          </div>
          <div className="text-sm font-semibold text-white/70">
            <p className={`${big} text-3xl text-white`}>{c.hoursTitle}</p>
            <p className="mt-2">{c.hours[0]}</p>
            <p>{c.hours[1]}</p>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl text-xs text-white/50">{c.credits(creditsOf(images).join(", "))}</p>
      </footer>
    </div>
  );
}
