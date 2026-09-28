import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowUpRight } from "lucide-react";
import { barbers, services, tl } from "./data";
import { SinekkaydiApp } from "./sinekkaydi-app";
import { body, display, images, skVars } from "./theme";

const h2 = "font-[family-name:var(--sk-display)] text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.05] text-[var(--sk-copper-light)]";
const wrap = "mx-auto max-w-[1180px] border-x border-[var(--sk-line)] px-5 sm:px-8";
const btn = "inline-flex min-h-12 items-center gap-2 border border-[var(--sk-copper-light)]/70 px-5 text-[15px] hover:bg-[var(--sk-copper)] hover:border-[var(--sk-copper)]";

const barberPhoto = { huseyin: images.usta, kaan: images.makas, deniz: images.cocuk } as const;
const serviceNote: Record<string, string> = {
  sac: "Makas ya da makine; yıkama ve fön dahil.",
  sakal: "Sıcak havlu, ustura ile kontur.",
  sacsakal: "İkisi bir arada, en çok tercih edilen.",
  cocuk: "12 yaş altı, sabırla.",
  ense: "İki kesim arası tazeleme.",
};

/** Sinekkaydı: a barbershop website with its live queue and booking inside. */
export function SinekkaydiPage() {
  return (
    <div className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--sk-bg)] font-[family-name:var(--sk-body)] text-[var(--sk-ink)] antialiased`} style={skVars}>
      <header className="border-b border-[var(--sk-line)]">
        <div className={`${wrap} flex items-center justify-between gap-4 py-4`}>
          <a className="font-[family-name:var(--sk-display)] text-3xl text-[var(--sk-copper-light)]" href="#">
            Sinekkaydı
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden text-[15px] sm:inline">Eskişehir · 1994&apos;ten beri</span>
            <a className="inline-flex min-h-11 items-center bg-[var(--sk-copper)] px-5 text-[15px] hover:bg-[#9A5E3F]" href="#sira">
              Sıraya gir
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-[var(--sk-line)]">
          <div className={`${wrap} grid items-center gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.7fr)]`}>
            <div>
              <h1 className="font-[family-name:var(--sk-display)] text-[clamp(3rem,5.4vw,4.4rem)] leading-[1] text-[var(--sk-copper-light)]">Sıra beklemeden tıraş.</h1>
              <p className="mt-5 max-w-[34ch] text-lg leading-7 font-light">
                Dükkanda kaç kişi olduğunu buradan görün, sıranızı evden alın. Sıranız yaklaşınca haber verelim, siz gelin.
              </p>
              <a className={`${btn} mt-8`} href="#sira">
                Canlı sırayı gör <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </div>
            <div className="aspect-[5/4] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,12%_100%,12%_78%,0_78%)]">
              <UnsplashPhoto className="grayscale" image={images.hero} priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {[
                ["1994", "Açılış yılı"],
                [String(barbers.length), "Berber, üç koltuk"],
                ["0", "Randevusuz bekleme derdi"],
              ].map(([n, l]) => (
                <div className="bg-[var(--sk-panel)] px-3 py-6 text-center" key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-[family-name:var(--sk-display)] text-4xl text-[var(--sk-copper-light)]">{n}</span>
                    <span className="mt-2 block text-sm font-light">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-b border-[var(--sk-line)]">
          <div className={`${wrap} grid md:grid-cols-[minmax(0,0.7fr)_repeat(3,minmax(0,1fr))]`}>
            <div className="hidden md:block" />
            {[
              ["Önce konuşuruz", "Kesime başlamadan yüzünüze ve saçınıza uyanı birlikte seçeriz."],
              ["Ayrıntıya özen", "Ense, favori ve kontur; aceleye getirilmeden."],
              ["Açık fiyat", "Her hizmetin fiyatı ve süresi aşağıda. Sürpriz yok."],
            ].map(([t, d]) => (
              <div className="border-t border-[var(--sk-line)] bg-[linear-gradient(180deg,#2A211C,transparent)] p-7 md:border-t-0 md:border-l" key={t}>
                <h2 className="font-[family-name:var(--sk-display)] text-2xl text-[var(--sk-copper-light)]">{t}</h2>
                <p className="mt-3 font-light">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sira-baslik" className="scroll-mt-4 border-b border-[var(--sk-line)]" id="sira">
          <div className={`${wrap} py-20`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className={h2} id="sira-baslik">
                Şu an dükkanda
              </h2>
              <p className="max-w-[40ch] font-light text-[var(--sk-muted)]">Sıra panosu dükkandaki ekranla aynı. Sıraya girin ya da saatini seçip randevu alın.</p>
            </div>
            <div className="mt-10">
              <SinekkaydiApp />
            </div>
          </div>
        </section>

        <section aria-labelledby="hizmet-baslik" className="border-b border-[var(--sk-line)]">
          <div className={`${wrap} py-20`}>
            <h2 className={h2} id="hizmet-baslik">
              Hizmetler
            </h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <div className="grid gap-5">
                <div className="aspect-[16/10] overflow-hidden">
                  <UnsplashPhoto className="grayscale" image={images.sakal} sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
                <div className="aspect-[16/10] overflow-hidden">
                  <UnsplashPhoto className="grayscale" image={images.ustura} sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
              </div>
              <ul className="grid gap-5">
                {services.map((s) => (
                  <li className="flex items-center justify-between gap-6 bg-[#3A3735] p-6" key={s.id}>
                    <span>
                      <span className="block font-[family-name:var(--sk-display)] text-2xl text-[var(--sk-copper-light)]">{s.name}</span>
                      <span className="mt-1 block font-light">
                        {serviceNote[s.id]} {s.minutes} dk.
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-lg">{tl(s.price)}</span>
                      <a aria-label={`${s.name} için sıraya gir`} className="mt-2 ml-auto grid size-11 place-items-center bg-[var(--sk-copper)] hover:bg-[#9A5E3F]" href="#sira">
                        <ArrowUpRight aria-hidden="true" className="size-5" />
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-sm text-[var(--sk-muted)]">Fiyatlar örnektir.</p>
          </div>
        </section>

        <section aria-labelledby="saat-baslik" className="border-b border-[var(--sk-line)]">
          <div className={`${wrap} py-20 text-center`}>
            <h2 className={h2} id="saat-baslik">
              Çalışma saatleri
            </h2>
            <dl className="mx-auto mt-10 grid max-w-3xl gap-px bg-[var(--sk-line)] sm:grid-cols-3">
              {[
                ["Pazartesi – Cuma", "10.00 – 21.30"],
                ["Cumartesi", "09.00 – 21.30"],
                ["Pazar", "11.00 – 18.00"],
              ].map(([d, h]) => (
                <div className="bg-[var(--sk-bg)] p-6" key={d}>
                  <dt className="font-light">{d}</dt>
                  <dd className="mt-2 font-[family-name:var(--sk-display)] text-3xl text-[var(--sk-copper-light)]">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="usta-baslik" className="border-b border-[var(--sk-line)]">
          <div className={`${wrap} grid items-center gap-10 py-20 lg:grid-cols-2`}>
            <div className="grid grid-cols-3 gap-3">
              {barbers.map((b) => (
                <div className="aspect-[3/4] overflow-hidden" key={b.id}>
                  <UnsplashPhoto className="grayscale" image={barberPhoto[b.id]} sizes="(min-width: 1024px) 15vw, 33vw" />
                </div>
              ))}
            </div>
            <div>
              <h2 className={h2} id="usta-baslik">
                Üç koltuk, üç usta
              </h2>
              <p className="mt-4 max-w-[40ch] font-light">Kimde oturacağınızı sıraya girerken seçebilirsiniz; fark etmezse ilk boşalana geçersiniz.</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {barbers.map((b, i) => (
                  <li className={`flex items-center justify-between gap-3 p-4 ${i === 0 ? "bg-[#D0D0D0] text-[#141414]" : "bg-[#2C2C2C]"}`} key={b.id}>
                    <span>
                      <span className="block font-[family-name:var(--sk-display)] text-xl">{b.name}</span>
                      <span className="block text-sm font-light">{b.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#2C2C2C]">
          <div className={`${wrap} grid items-center gap-8 py-16 md:grid-cols-[minmax(0,1fr)_auto]`}>
            <h2 className={h2}>
              Dükkana
              <br />
              buyurun.
            </h2>
            <div className="aspect-[16/9] w-full max-w-md overflow-hidden md:w-96">
              <UnsplashPhoto className="grayscale" image={images.koltuk} sizes="384px" />
            </div>
          </div>
        </section>
      </main>

      <footer className={`${wrap} flex flex-wrap justify-between gap-3 py-8 text-xs text-[var(--sk-muted)]`}>
        <span>Sinekkaydı örnek bir işletmedir; adres ve telefon içermez.</span>
        <span>Fotoğraflar: Unsplash · {creditsOf(images).join(", ")}</span>
      </footer>
    </div>
  );
}
