import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowRight, Baby, ClipboardList, HeartHandshake, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { doctors, visits } from "./data";
import { MineBooking } from "./mine-booking";
import { NextFree } from "./next-free";
import { body, display, images, mineVars, mono } from "./theme";

const pill = "inline-flex items-center gap-2 rounded-full bg-[var(--mine-cobalt-soft)] px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase";
const h2 = "text-[clamp(2.1rem,4.2vw,3.2rem)] leading-[1.08] font-light tracking-[-0.035em]";
const btn = "inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-[15px] font-medium transition-colors";

const areas = [
  { n: "01", title: "Koruyucu bakım", text: "Muayene, diş taşı temizliği, röntgen ve çocuklar için fissür örtücü.", tone: "bg-[var(--mine-cobalt-soft)]" },
  { n: "02", title: "Tedavi edici diş hekimliği", text: "Diş rengi dolgular, kırık diş ve düşen dolgu onarımı.", tone: "bg-[#DCE7F0]" },
  { n: "03", title: "Kanal tedavisi", text: "Endodonti uzmanımızla, gerekirse birkaç seansta.", tone: "bg-[#EFE7DE]" },
  { n: "04", title: "Çocuk diş hekimliği", text: "Pedodonti uzmanımızla, ilk muayeneden itibaren sakin bir ortamda.", tone: "bg-[#F1F0EC]" },
];

const lists = [
  { icon: ShieldCheck, title: "Koruyucu", items: ["Muayene ve kontrol", "Diş taşı temizliği", "Panoramik röntgen", "Fissür örtücü", "Florür uygulaması"] },
  { icon: Stethoscope, title: "Tedavi", items: ["Kompozit dolgu", "Kırık diş onarımı", "Kanal tedavisi", "Diş çekimi", "Gece plağı"] },
  { icon: Baby, title: "Çocuk ve acil", items: ["Süt dişi tedavileri", "Yer tutucu", "Ağrı için ayrılan saatler", "Travma sonrası kontrol", "Ağız hijyeni eğitimi"] },
];

/** Mine Ağız ve Diş Sağlığı Polikliniği: a clinic site with its booking app inside. */
export function MinePage() {
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
          <span className="hidden text-sm text-[var(--mine-muted)] sm:inline">Hafta içi 09.00–19.00 · Cumartesi 10.00–15.00</span>
          <a className={`${btn} bg-[var(--mine-lime)] hover:bg-[#CBE08E]`} href="#randevu">
            Randevu al <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </header>

      <div className="mx-3 rounded-[28px] bg-white sm:mx-4">
        <main>
          <section className="grid items-center gap-10 px-5 pt-10 pb-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:pt-16">
            <div className="lg:pl-10">
              <p className={pill}>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--mine-cobalt)]" /> Ağız ve diş sağlığı polikliniği · Ankara
              </p>
              <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,4.6rem)] leading-[1.02] font-light tracking-[-0.045em]">
                Diş hekimine gitmek <span className="bg-[var(--mine-lime)] px-2 [box-decoration-break:clone]">kolay</span> olsun.
              </h1>
              <p className="mt-6 max-w-[44ch] leading-7 text-[var(--mine-muted)]">
                Ne yaptıracağınızı seçin, dişinizi şemada gösterin, uygun saati alın. Ağrınız varsa birkaç soruyla size ne kadar erken bakmamız gerektiğini belirleriz.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className={`${btn} bg-[var(--mine-lime)] hover:bg-[#CBE08E]`} href="#randevu">
                  Randevu al <ArrowRight aria-hidden="true" className="size-4" />
                </a>
                <a className={`${btn} border border-[var(--mine-ink)]/80 hover:bg-[var(--mine-bg)]`} href="#tedaviler">
                  Tedavileri gör
                </a>
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm text-[var(--mine-muted)]">
                <HeartHandshake aria-hidden="true" className="size-4 text-[var(--mine-cobalt)]" /> Her gün iki saat, yalnızca ağrısı olan hastalara ayrılır.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/4] overflow-hidden rounded-[28px] sm:aspect-[5/4] lg:aspect-[4/4]">
                <UnsplashPhoto image={images.hero} priority sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
              <div className="absolute right-4 bottom-20 hidden rounded-2xl bg-white px-4 py-3 text-sm shadow-[0_10px_30px_-12px_rgba(30,42,26,.35)] sm:flex sm:items-center sm:gap-3">
                <ShieldCheck aria-hidden="true" className="size-5 text-[var(--mine-cobalt)]" />
                <span>
                  <span className="block font-medium">Sağlık bilgileriniz</span>
                  <span className="block text-xs text-[var(--mine-muted)]">yalnızca açık rızanızla</span>
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <NextFree />
              </div>
            </div>
          </section>

          <section aria-label="Kısaca" className="px-5 sm:px-10">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                [String(doctors.length), "Hekim, ikisi uzman"],
                [String(visits.length), "Muayene türü, hepsi süreli"],
                ["2 sa", "Her gün ağrı için ayrılır"],
                ["30 dk", "İlk muayene süresi"],
              ].map(([n, l]) => (
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
            <p className={pill}>Tedaviler</p>
            <h2 className={`${h2} mt-5`} id="tedaviler-baslik">
              Dişinizin ihtiyacı olan her şey,
              <br />
              <span className="text-[var(--mine-muted)]">tek ve sakin bir yerde.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[48ch] text-[var(--mine-muted)]">Rutin kontrolden kanal tedavisine, çocuklardan acil ağrıya kadar; dosyanızı zaten tanıyan bir ekiple.</p>
            <ul className="mt-12 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((a) => (
                <li className={`flex min-h-64 flex-col rounded-2xl p-5 ${a.tone}`} key={a.n}>
                  <span className="flex items-start justify-between">
                    <span className="grid size-9 place-items-center rounded-lg bg-white">
                      <ShieldCheck aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-xs text-[var(--mine-muted)]">{a.n}</span>
                  </span>
                  <span className="mt-auto">
                    <span className="block text-lg">{a.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-[var(--mine-muted)]">{a.text}</span>
                    <a className="mt-4 flex items-center gap-1.5 border-t border-[var(--mine-ink)]/10 pt-3 text-sm font-medium" href="#randevu">
                      Randevu al <ArrowRight aria-hidden="true" className="size-3.5" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="randevu-baslik" className="scroll-mt-4 bg-[var(--mine-bg)] px-3 py-20 sm:px-10" id="randevu">
            <div className="text-center">
              <p className={pill}>Online randevu</p>
              <h2 className={`${h2} mt-5`} id="randevu-baslik">
                Randevunuzu şimdi alın,
                <br />
                <span className="text-[var(--mine-muted)]">iki dakikada.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[var(--mine-muted)]">
                Randevu alındığında hekim ekranı da güncellenir. Denemek için bir randevu oluşturup üstteki &quot;Hekim ekranı&quot;na geçin.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-6xl">
              <MineBooking />
            </div>
          </section>

          <section className="grid items-center gap-10 px-5 py-24 sm:px-10 lg:grid-cols-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[28px]">
              <UnsplashPhoto image={images.rontgen} sizes="(min-width: 1024px) 45vw, 100vw" />
              <p className="absolute bottom-4 left-4 max-w-[80%] rounded-xl bg-white px-4 py-3 text-sm">&quot;Diş hekimliği açık, nazik ve acelesiz olmalı.&quot;</p>
            </div>
            <div className="lg:pl-6">
              <h2 className={h2}>
                Önce dinleriz,
                <br />
                <span className="text-[var(--mine-muted)]">sonra bakarız.</span>
              </h2>
              <p className="mt-5 max-w-[46ch] leading-7 text-[var(--mine-muted)]">
                Her tedavi planı sizin beklentiniz, konforunuz ve neyin gerçekten gerektiğine dair açık bir konuşmayla başlar.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  [ClipboardList, "Tedaviye başlamadan yazılı tedavi planı"],
                  [Sparkles, "Gereğinden fazla müdahale yok"],
                  [HeartHandshake, "Diş hekiminden korkanlar için sakin bir ortam"],
                ].map(([Icon, t]) => {
                  const I = Icon as typeof ClipboardList;
                  return (
                    <li className="flex items-center gap-3" key={t as string}>
                      <I aria-hidden="true" className="size-4 text-[var(--mine-cobalt)]" /> {t as string}
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
              <p className="mt-3 text-xs text-[var(--mine-muted)]">Hekim isimleri örnektir; gerçek kişilerle ilgisi yoktur.</p>
            </div>
          </section>

          <section aria-labelledby="liste-baslik" className="bg-[var(--mine-bg)] px-5 py-24 text-center sm:px-10">
            <p className={pill}>Tüm tedaviler</p>
            <h2 className={`${h2} mt-5`} id="liste-baslik">
              Her tedavi,
              <br />
              <span className="text-[var(--mine-muted)]">sade Türkçeyle.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[var(--mine-muted)]">Kod yok, jargon yok. Bizde olmayan bir tedaviye ihtiyacınız olursa sizi güvendiğimiz bir uzmana yönlendiririz.</p>
            <div className="mx-auto mt-12 grid max-w-6xl overflow-hidden rounded-2xl border border-[var(--mine-ink)]/10 bg-white text-left md:grid-cols-3">
              {lists.map((l) => (
                <div className="border-[var(--mine-ink)]/10 p-6 not-last:border-b md:not-last:border-r md:not-last:border-b-0" key={l.title}>
                  <p className="flex items-center gap-3 text-lg">
                    <span className="grid size-9 place-items-center rounded-lg bg-[var(--mine-cobalt-soft)]">
                      <l.icon aria-hidden="true" className="size-4" />
                    </span>
                    {l.title}
                  </p>
                  <ul className="mt-5 divide-y divide-[var(--mine-ink)]/8 text-sm">
                    {l.items.map((i) => (
                      <li className="flex items-center gap-2 py-2.5" key={i}>
                        <span aria-hidden="true" className="text-[var(--mine-cobalt)]">
                          ✓
                        </span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 px-5 py-24 sm:px-10 lg:grid-cols-3">
            {(
              [
                ["oda", "Tek kullanımlık setler, her hastadan sonra sterilizasyon."],
                ["bekleme", "Beklemeyin diye randevular arasında çeyrek saat pay bırakılır."],
                ["firca", "Çıkarken evde bakımınızı yazılı olarak veririz."],
              ] as const
            ).map(([img, t]) => (
              <figure key={img}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <UnsplashPhoto image={images[img]} sizes="(min-width: 1024px) 30vw, 100vw" />
                </div>
                <figcaption className="mt-3 text-sm text-[var(--mine-muted)]">{t}</figcaption>
              </figure>
            ))}
          </section>
        </main>

        <footer className="rounded-b-[28px] bg-[var(--mine-ink)] px-5 py-14 text-white sm:px-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <p className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-light tracking-[-0.03em]">Ağrınız mı var? Beklemeyin.</p>
              <p className="mt-3 max-w-[46ch] text-sm leading-6 text-white/70">
                Yüzünüzde yayılan şişlik, nefes almada ya da yutkunmada zorluk varsa randevu beklemeyin; 112&apos;yi arayın ya da en yakın acil servise gidin.
              </p>
            </div>
            <div className="text-sm leading-6 text-white/70 md:text-right">
              <p>Mine Ağız ve Diş Sağlığı Polikliniği · Ankara (örnek işletme)</p>
              <p>Sağlık hizmetlerinin tanıtımına ilişkin mevzuat gereği bu sitede fiyat, hasta yorumu ve başarı iddiası yer almaz.</p>
              <p className="mt-3 text-white/50">Fotoğraflar: Unsplash · {creditsOf(images).join(", ")}</p>
            </div>
          </div>
        </footer>
      </div>
      <div className="h-4" />
    </div>
  );
}
