import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowRight, Baby, ClipboardList, HeartHandshake, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { mineIn } from "./data";
import { MineBooking } from "./mine-booking";
import { NextFree } from "./next-free";
import { body, display, images, mineVars, mono } from "./theme";
import type { Lang } from "@/lib/i18n";

const pill = "inline-flex items-center gap-2 rounded-full bg-[var(--mine-cobalt-soft)] px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase";
const h2 = "text-[clamp(2.1rem,4.2vw,3.2rem)] leading-[1.08] font-light tracking-[-0.035em]";
const btn = "inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-[15px] font-medium transition-colors";

const TONES = ["bg-[var(--mine-cobalt-soft)]", "bg-[#DCE7F0]", "bg-[#EFE7DE]", "bg-[#F1F0EC]"];
const LIST_ICONS = [ShieldCheck, Stethoscope, Baby];
const PROMISE_ICONS = [ClipboardList, Sparkles, HeartHandshake];

const COPY = {
  tr: {
    hours: "Hafta içi 09.00–19.00 · Cumartesi 10.00–15.00",
    book: "Randevu al",
    eyebrow: "Ağız ve diş sağlığı polikliniği · Ankara",
    h1: ["Diş hekimine gitmek ", "kolay", " olsun."],
    lead: "Ne yaptıracağınızı seçin, dişinizi şemada gösterin, uygun saati alın. Ağrınız varsa birkaç soruyla size ne kadar erken bakmamız gerektiğini belirleriz.",
    seeTreatments: "Tedavileri gör",
    painHours: "Her gün iki saat, yalnızca ağrısı olan hastalara ayrılır.",
    healthInfo: "Sağlık bilgileriniz",
    onlyConsent: "yalnızca açık rızanızla",
    brief: "Kısaca",
    stats: (doctors: number, visits: number) => [
      [String(doctors), "Hekim, ikisi uzman"],
      [String(visits), "Muayene türü, hepsi süreli"],
      ["2 sa", "Her gün ağrı için ayrılır"],
      ["30 dk", "İlk muayene süresi"],
    ],
    treatments: "Tedaviler",
    treatH2: ["Dişinizin ihtiyacı olan her şey,", "tek ve sakin bir yerde."],
    treatLead: "Rutin kontrolden kanal tedavisine, çocuklardan acil ağrıya kadar; dosyanızı zaten tanıyan bir ekiple.",
    areas: [
      ["Koruyucu bakım", "Muayene, diş taşı temizliği, röntgen ve çocuklar için fissür örtücü."],
      ["Tedavi edici diş hekimliği", "Diş rengi dolgular, kırık diş ve düşen dolgu onarımı."],
      ["Kanal tedavisi", "Endodonti uzmanımızla, gerekirse birkaç seansta."],
      ["Çocuk diş hekimliği", "Pedodonti uzmanımızla, ilk muayeneden itibaren sakin bir ortamda."],
    ],
    online: "Online randevu",
    bookH2: ["Randevunuzu şimdi alın,", "iki dakikada."],
    bookLead: "Randevu alındığında hekim ekranı da güncellenir. Denemek için bir randevu oluşturup üstteki \"Hekim ekranı\"na geçin.",
    quote: "\"Diş hekimliği açık, nazik ve acelesiz olmalı.\"",
    listenH2: ["Önce dinleriz,", "sonra bakarız."],
    listenLead: "Her tedavi planı sizin beklentiniz, konforunuz ve neyin gerçekten gerektiğine dair açık bir konuşmayla başlar.",
    promises: ["Tedaviye başlamadan yazılı tedavi planı", "Gereğinden fazla müdahale yok", "Diş hekiminden korkanlar için sakin bir ortam"],
    namesNote: "Hekim isimleri örnektir; gerçek kişilerle ilgisi yoktur.",
    allTreatments: "Tüm tedaviler",
    allH2: ["Her tedavi,", "sade Türkçeyle."],
    allLead: "Kod yok, jargon yok. Bizde olmayan bir tedaviye ihtiyacınız olursa sizi güvendiğimiz bir uzmana yönlendiririz.",
    lists: [
      ["Koruyucu", ["Muayene ve kontrol", "Diş taşı temizliği", "Panoramik röntgen", "Fissür örtücü", "Florür uygulaması"]],
      ["Tedavi", ["Kompozit dolgu", "Kırık diş onarımı", "Kanal tedavisi", "Diş çekimi", "Gece plağı"]],
      ["Çocuk ve acil", ["Süt dişi tedavileri", "Yer tutucu", "Ağrı için ayrılan saatler", "Travma sonrası kontrol", "Ağız hijyeni eğitimi"]],
    ] as [string, string[]][],
    photos: [
      ["oda", "Tek kullanımlık setler, her hastadan sonra sterilizasyon."],
      ["bekleme", "Beklemeyin diye randevular arasında çeyrek saat pay bırakılır."],
      ["firca", "Çıkarken evde bakımınızı yazılı olarak veririz."],
    ],
    painTitle: "Ağrınız mı var? Beklemeyin.",
    painText: "Yüzünüzde yayılan şişlik, nefes almada ya da yutkunmada zorluk varsa randevu beklemeyin; 112'yi arayın ya da en yakın acil servise gidin.",
    clinic: "Mine Ağız ve Diş Sağlığı Polikliniği · Ankara (örnek işletme)",
    law: "Sağlık hizmetlerinin tanıtımına ilişkin mevzuat gereği bu sitede fiyat, hasta yorumu ve başarı iddiası yer almaz.",
    credits: "Fotoğraflar",
  },
  en: {
    hours: "Weekdays 09:00–19:00 · Saturday 10:00–15:00",
    book: "Book",
    eyebrow: "Dental clinic · Ankara",
    h1: ["Going to the dentist should be ", "easy", "."],
    lead: "Choose what you need, show us the tooth on a chart and take a time that suits you. If you're in pain, a few questions tell us how soon we should see you.",
    seeTreatments: "See treatments",
    painHours: "Two hours every day are kept only for patients in pain.",
    healthInfo: "Your health information",
    onlyConsent: "only with your explicit consent",
    brief: "In brief",
    stats: (doctors: number, visits: number) => [
      [String(doctors), "Dentists, two of them specialists"],
      [String(visits), "Visit types, each with a set length"],
      ["2 hrs", "Kept for pain every day"],
      ["30 min", "Length of a first visit"],
    ],
    treatments: "Treatments",
    treatH2: ["Everything your teeth need,", "in one calm place."],
    treatLead: "From routine check-ups to root canals, from children to urgent pain; with a team that already knows your file.",
    areas: [
      ["Preventive care", "Check-ups, scale and clean, X-rays and fissure sealants for children."],
      ["Restorative dentistry", "Tooth-coloured fillings, broken teeth and lost fillings repaired."],
      ["Root canal treatment", "With our endodontist, over a few sessions if needed."],
      ["Children's dentistry", "With our paediatric dentist, in a calm setting from the very first visit."],
    ],
    online: "Online booking",
    bookH2: ["Book your appointment now,", "in two minutes."],
    bookLead: "When you book, the dentist's screen updates too. To try it, make a booking and switch to \"Dentist's screen\" at the top.",
    quote: "\"Dentistry should be clear, kind and unhurried.\"",
    listenH2: ["We listen first,", "then we look."],
    listenLead: "Every treatment plan starts with an open conversation about what you expect, your comfort and what's really needed.",
    promises: ["A written treatment plan before any treatment", "No more work than necessary", "A calm setting for people who are nervous of the dentist"],
    namesNote: "Dentists' names are examples; they are not real people.",
    allTreatments: "All treatments",
    allH2: ["Every treatment,", "in plain English."],
    allLead: "No codes, no jargon. If you need a treatment we don't offer, we'll refer you to a specialist we trust.",
    lists: [
      ["Preventive", ["Check-up", "Scale and clean", "Panoramic X-ray", "Fissure sealant", "Fluoride treatment"]],
      ["Treatment", ["Composite filling", "Broken tooth repair", "Root canal treatment", "Extraction", "Night guard"]],
      ["Children and urgent", ["Baby tooth treatment", "Space maintainer", "Hours kept for pain", "Check-up after an injury", "Oral hygiene coaching"]],
    ] as [string, string[]][],
    photos: [
      ["oda", "Single-use kits, and sterilisation after every patient."],
      ["bekleme", "A quarter of an hour is left between appointments so you don't wait."],
      ["firca", "As you leave, we give you your home care in writing."],
    ],
    painTitle: "In pain? Don't wait.",
    painText: "If swelling is spreading across your face, or you're struggling to breathe or swallow, don't wait for an appointment: call 112 (Turkey's emergency number) or go to the nearest emergency department.",
    clinic: "Mine Ağız ve Diş Sağlığı Polikliniği · Ankara (a sample business)",
    law: "Under Turkish rules on promoting health services, this site shows no prices, patient reviews or claims of success.",
    credits: "Photos",
  },
};

/** Mine Ağız ve Diş Sağlığı Polikliniği: a clinic site with its booking app inside. */
export function MinePage({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { doctors, visits } = mineIn(lang);
  return (
    <div
      className={`${display.variable} ${mono.variable} ${body.variable} min-h-[100dvh] bg-[var(--mine-page)] font-[family-name:var(--mine-body)] text-[var(--mine-ink)] antialiased`}
      style={mineVars}
    >
      <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-10">
        <a className="flex items-center gap-2 text-xl font-semibold tracking-[-0.03em]" href="#">
          <svg aria-hidden="true" className="size-7 text-[var(--mine-cobalt)]" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M7 3c-2.5 0-4 2-4 4.5 0 2 1 3.5 1.5 5.5.6 2.5.8 8 2.6 8 1.6 0 1.6-5.5 4.9-5.5s3.3 5.5 4.9 5.5c1.8 0 2-5.5 2.6-8 .5-2 1.5-3.5 1.5-5.5C21 5 19.5 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3Z" />
          </svg>
          Mine Diş
        </a>
        <div className="flex items-center gap-5">
          <span className="hidden text-sm text-[var(--mine-muted)] sm:inline">{c.hours}</span>
          <a className={`${btn} bg-[var(--mine-lime)] hover:bg-[#CBE08E]`} href="#randevu">
            {c.book} <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </header>

      <div className="mx-3 rounded-[28px] bg-white sm:mx-4">
        <main>
          <section className="grid items-center gap-10 px-5 pt-10 pb-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:pt-16">
            <div className="lg:pl-10">
              <p className={pill}>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--mine-cobalt)]" /> {c.eyebrow}
              </p>
              <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,4.6rem)] leading-[1.02] font-light tracking-[-0.045em]">
                {c.h1[0]}
                <span className="bg-[var(--mine-lime)] px-2 [box-decoration-break:clone]">{c.h1[1]}</span>
                {c.h1[2]}
              </h1>
              <p className="mt-6 max-w-[44ch] leading-7 text-[var(--mine-muted)]">{c.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className={`${btn} bg-[var(--mine-lime)] hover:bg-[#CBE08E]`} href="#randevu">
                  {c.book} <ArrowRight aria-hidden="true" className="size-4" />
                </a>
                <a className={`${btn} border border-[var(--mine-ink)]/80 hover:bg-[var(--mine-bg)]`} href="#tedaviler">
                  {c.seeTreatments}
                </a>
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm text-[var(--mine-muted)]">
                <HeartHandshake aria-hidden="true" className="size-4 text-[var(--mine-cobalt)]" /> {c.painHours}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/4] overflow-hidden rounded-[28px] sm:aspect-[5/4] lg:aspect-[4/4]">
                <UnsplashPhoto image={images.hero} lang={lang} priority sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
              <div className="absolute right-4 bottom-20 hidden rounded-2xl bg-white px-4 py-3 text-sm shadow-[0_10px_30px_-12px_rgba(30,42,26,.35)] sm:flex sm:items-center sm:gap-3">
                <ShieldCheck aria-hidden="true" className="size-5 text-[var(--mine-cobalt)]" />
                <span>
                  <span className="block font-medium">{c.healthInfo}</span>
                  <span className="block text-xs text-[var(--mine-muted)]">{c.onlyConsent}</span>
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <NextFree />
              </div>
            </div>
          </section>

          <section aria-label={c.brief} className="px-5 sm:px-10">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {c.stats(doctors.length, visits.length).map(([n, l]) => (
                <div className="rounded-2xl border border-[var(--mine-ink)]/8 bg-[var(--mine-bg)] px-4 py-8 text-center" key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block text-[clamp(2.2rem,4vw,3rem)] leading-none font-light tracking-[-0.04em]">{n}</span>
                    <span className="mt-3 block text-[11px] font-semibold tracking-[0.14em] text-[var(--mine-muted)] uppercase">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="tedaviler-baslik" className="scroll-mt-4 px-5 pt-24 pb-10 text-center sm:px-10" id="tedaviler">
            <p className={pill}>{c.treatments}</p>
            <h2 className={`${h2} mt-5`} id="tedaviler-baslik">
              {c.treatH2[0]}
              <br />
              <span className="text-[var(--mine-muted)]">{c.treatH2[1]}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[48ch] text-[var(--mine-muted)]">{c.treatLead}</p>
            <ul className="mt-12 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
              {c.areas.map(([title, text], i) => (
                <li className={`flex min-h-64 flex-col rounded-2xl p-5 ${TONES[i]}`} key={title}>
                  <span className="flex items-start justify-between">
                    <span className="grid size-9 place-items-center rounded-lg bg-white">
                      <ShieldCheck aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-xs text-[var(--mine-muted)]">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-auto">
                    <span className="block text-lg">{title}</span>
                    <span className="mt-1 block text-sm leading-6 text-[var(--mine-muted)]">{text}</span>
                    <a className="mt-4 flex items-center gap-1.5 border-t border-[var(--mine-ink)]/10 pt-3 text-sm font-medium" href="#randevu">
                      {c.book} <ArrowRight aria-hidden="true" className="size-3.5" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="randevu-baslik" className="scroll-mt-4 bg-[var(--mine-bg)] px-3 py-20 sm:px-10" id="randevu">
            <div className="text-center">
              <p className={pill}>{c.online}</p>
              <h2 className={`${h2} mt-5`} id="randevu-baslik">
                {c.bookH2[0]}
                <br />
                <span className="text-[var(--mine-muted)]">{c.bookH2[1]}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[var(--mine-muted)]">{c.bookLead}</p>
            </div>
            <div className="mx-auto mt-10 max-w-6xl">
              <MineBooking />
            </div>
          </section>

          <section className="grid items-center gap-10 px-5 py-24 sm:px-10 lg:grid-cols-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[28px]">
              <UnsplashPhoto image={images.rontgen} lang={lang} sizes="(min-width: 1024px) 45vw, 100vw" />
              <p className="absolute bottom-4 left-4 max-w-[80%] rounded-xl bg-white px-4 py-3 text-sm">{c.quote}</p>
            </div>
            <div className="lg:pl-6">
              <h2 className={h2}>
                {c.listenH2[0]}
                <br />
                <span className="text-[var(--mine-muted)]">{c.listenH2[1]}</span>
              </h2>
              <p className="mt-5 max-w-[46ch] leading-7 text-[var(--mine-muted)]">{c.listenLead}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {c.promises.map((t, i) => {
                  const I = PROMISE_ICONS[i];
                  return (
                    <li className="flex items-center gap-3" key={t}>
                      <I aria-hidden="true" className="size-4 text-[var(--mine-cobalt)]" /> {t}
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-8 grid gap-3 border-t border-[var(--mine-ink)]/10 pt-6 text-sm sm:grid-cols-3">
                {doctors.map((d) => (
                  <div key={d.id}>
                    <dt className="font-medium">{d.name}</dt>
                    <dd className="text-[var(--mine-muted)]">{d.role}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-[var(--mine-muted)]">{c.namesNote}</p>
            </div>
          </section>

          <section aria-labelledby="liste-baslik" className="bg-[var(--mine-bg)] px-5 py-24 text-center sm:px-10">
            <p className={pill}>{c.allTreatments}</p>
            <h2 className={`${h2} mt-5`} id="liste-baslik">
              {c.allH2[0]}
              <br />
              <span className="text-[var(--mine-muted)]">{c.allH2[1]}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[var(--mine-muted)]">{c.allLead}</p>
            <div className="mx-auto mt-12 grid max-w-6xl overflow-hidden rounded-2xl border border-[var(--mine-ink)]/10 bg-white text-left md:grid-cols-3">
              {c.lists.map(([title, items], li) => {
                const Icon = LIST_ICONS[li];
                return (
                  <div className="border-[var(--mine-ink)]/10 p-6 not-last:border-b md:not-last:border-r md:not-last:border-b-0" key={title}>
                    <p className="flex items-center gap-3 text-lg">
                      <span className="grid size-9 place-items-center rounded-lg bg-[var(--mine-cobalt-soft)]">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      {title}
                    </p>
                    <ul className="mt-5 divide-y divide-[var(--mine-ink)]/8 text-sm">
                      {items.map((i) => (
                        <li className="flex items-center gap-2 py-2.5" key={i}>
                          <span aria-hidden="true" className="text-[var(--mine-cobalt)]">
                            ✓
                          </span>
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 px-5 py-24 sm:px-10 lg:grid-cols-3">
            {c.photos.map(([img, t]) => (
              <figure key={img}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <UnsplashPhoto image={images[img]} lang={lang} sizes="(min-width: 1024px) 30vw, 100vw" />
                </div>
                <figcaption className="mt-3 text-sm text-[var(--mine-muted)]">{t}</figcaption>
              </figure>
            ))}
          </section>
        </main>

        <footer className="rounded-b-[28px] bg-[var(--mine-ink)] px-5 py-14 text-white sm:px-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <p className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-light tracking-[-0.03em]">{c.painTitle}</p>
              <p className="mt-3 max-w-[46ch] text-sm leading-6 text-white/70">{c.painText}</p>
            </div>
            <div className="text-sm leading-6 text-white/70 md:text-right">
              <p>{c.clinic}</p>
              <p>{c.law}</p>
              <p className="mt-3 text-white/50">
                {c.credits}: Unsplash · {creditsOf(images).join(", ")}
              </p>
            </div>
          </div>
        </footer>
      </div>
      <div className="h-4" />
    </div>
  );
}
