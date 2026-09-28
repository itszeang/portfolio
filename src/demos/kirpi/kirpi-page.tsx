import { ArrowRight, BellRing, FileSpreadsheet, FolderOpen, Mail, Package, Plus, Truck } from "lucide-react";
import { KirpiApp } from "./kirpi-app";
import { mails, trays } from "./mail";
import { NightLog } from "./night-log";
import { Savings } from "./savings";
import { SortLink } from "./sort-link";
import { body, display, kpVars, mono } from "./theme";

const head = "font-[family-name:var(--kp-display)] font-semibold";
const h2 = `${head} text-[clamp(2.3rem,5vw,4rem)] leading-[0.98] tracking-[-0.02em]`;
const lead = "mt-5 max-w-[52ch] text-lg leading-8 text-[var(--kp-muted)]";
const primary = "inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--kp-ink)] px-6 font-semibold text-white transition-colors hover:bg-black";

const tools = [
  { icon: Mail, name: "E-posta kutusu", text: "Gmail, Outlook ya da alan adınızın e-postası. Okur ve taslak yazar; göndermek için onayınızı bekler." },
  { icon: FileSpreadsheet, name: "Sipariş defteri", text: "Google E-Tablolar ya da e-ticaret paneliniz. Sipariş numarasından ürünü, tarihi ve durumu bulur." },
  { icon: Truck, name: "Kargo takibi", text: "Paketin nerede olduğunu kargo firmasının takip sayfasından okur, cevaba ekler." },
  { icon: Package, name: "Stok ve fiyat listesi", text: "Değişim ve toptan tekliflerde raf sayımına ve fiyat listesine bakar." },
  { icon: FolderOpen, name: "Muhasebe klasörü", text: "Gelen faturaları ay ay klasörler; cevap gerekmeyen e-postayı kapatır." },
  { icon: BellRing, name: "Ekip notları", text: "Şikâyet ya da acil bir iş olduğunda ilgili kişiye not bırakır." },
];

const faq = [
  ["Asistan benim yerime e-posta gönderir mi?", "Hayır. Her cevap taslak olarak bekler; siz onaylamadan hiçbir şey gitmez. İsterseniz kargo durumu gibi kalıp cevaplar için sonradan otomatik gönderim açılabilir."],
  ["Oltalama e-postalarını nasıl anlıyor?", "Gönderen alan adına, bağlantının gittiği adrese ve aciliyet baskısına bakar. Şüpheli e-postaya cevap yazmaz, bağlantıyı açmaz ve nedenini size söyler."],
  ["Yanlış anlarsa ne olur?", "Taslağı düzeltip gönderirsiniz ya da “Ben yazarım” dersiniz. Emin olmadığı e-postayı zaten “Karar sizin” rafına koyar."],
  ["Müşteri bilgileri nereye gidiyor?", "Hangi verinin hangi hizmete gideceği kurulumda yazılı olarak belirlenir. Kişisel veriler yalnızca cevabı hazırlamak için ve KVKK'ya uygun şekilde işlenir."],
  ["Hangi e-posta hizmetleriyle çalışır?", "Gmail, Outlook ve IMAP destekleyen her e-posta hesabıyla."],
];

/** Kirpi Seramik's inbox assistant, presented like a product page with the product running inside it. */
export function KirpiPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-[100dvh] bg-[var(--kp-bg)] font-[family-name:var(--kp-body)] text-[var(--kp-ink)] antialiased`} style={kpVars}>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <a className="flex items-baseline gap-2" href="#">
          <span className={`${head} text-2xl tracking-[-0.03em]`}>Kirpi</span>
          <span className="hidden text-sm text-[var(--kp-muted)] sm:inline">seramik atölyesi · Avanos</span>
        </a>
        <nav aria-label="Kirpi" className="hidden items-center gap-7 text-[15px] md:flex">
          <a className="hover:text-[var(--kp-muted)]" href="#nasil">
            Nasıl çalışır
          </a>
          <a className="hover:text-[var(--kp-muted)]" href="#gece">
            Gece
          </a>
          <a className="hover:text-[var(--kp-muted)]" href="#hesap">
            Hesapla
          </a>
          <a className="hover:text-[var(--kp-muted)]" href="#sorular">
            Sorular
          </a>
        </nav>
        <SortLink className="inline-flex min-h-11 items-center rounded-full bg-[var(--kp-ink)] px-5 text-sm font-semibold text-white hover:bg-black">Postayı ayıkla</SortLink>
      </header>

      <main>
        <section className="px-5 pt-12 text-center sm:px-8 sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--kp-line)] px-3.5 py-1.5 text-[13px] text-[var(--kp-muted)]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--kp-glaze)]" />
            Asistan simülasyonu · gerçek e-posta gönderilmez
          </p>
          <h1 className={`${head} mx-auto mt-7 max-w-[15ch] text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.95] tracking-[-0.022em]`}>Sabah postası, siz uyanmadan ayıklanır.</h1>
          <p className="mx-auto mt-7 max-w-[50ch] text-lg leading-8 text-[var(--kp-muted)]">
            Kirpi Seramik&apos;e dün akşamdan beri sekiz e-posta geldi. Asistan hepsini okudu, sipariş defterine baktı ve cevapları yazdı. Hiçbiri siz onaylamadan gitmez.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <SortLink className={primary}>
              Postayı ayıkla <ArrowRight aria-hidden="true" className="size-4" />
            </SortLink>
            <a className="inline-flex min-h-12 items-center font-semibold underline decoration-[var(--kp-line)] decoration-2 underline-offset-[6px] hover:decoration-[var(--kp-ink)]" href="#gece">
              Gece ne yaptı?
            </a>
          </div>
        </section>

        <section aria-label="Canlı demo: gelen kutusu" className="relative mt-16 scroll-mt-4 px-3 sm:px-8" id="posta">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[-4%] h-[62%] max-h-[560px] bg-[radial-gradient(40%_60%_at_27%_55%,var(--kp-dawn),transparent_72%),radial-gradient(42%_62%_at_74%_45%,var(--kp-morning),transparent_72%)] opacity-90 blur-2xl"
          />
          <div className="relative mx-auto max-w-6xl">
            <KirpiApp />
          </div>
        </section>

        <section aria-labelledby="nasil-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-28 sm:px-8 sm:pt-36" id="nasil">
          <div className="max-w-3xl">
            <h2 className={h2} id="nasil-baslik">
              Her e-posta dört raftan birine.
            </h2>
            <p className={lead}>Asistan e-postayı okur, gerekirse sipariş defterine ve kargo takibine bakar, sonra rafına koyar. Rafı ne olursa olsun son söz sizde.</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trays.map((t) => {
              const list = mails.filter((m) => m.tray === t.id);
              return (
                <li className="flex flex-col rounded-3xl border border-[var(--kp-line)] p-6" key={t.id}>
                  <p className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: t.tone }} />
                      {t.name}
                    </span>
                    <span className="text-sm text-[var(--kp-muted)]">bu sabah {list.length}</span>
                  </p>
                  <p className="mt-4 text-[15px] leading-6">{t.hint}.</p>
                  <p className="mt-auto border-t border-[var(--kp-line)] pt-4 text-sm leading-6 text-[var(--kp-muted)]">
                    Örnek: <span className="text-[var(--kp-ink)]">{list[0].subject}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="gece-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-3 pt-28 sm:px-8 sm:pt-36" id="gece">
          <div className="max-w-3xl px-2 sm:px-0">
            <h2 className={h2} id="gece-baslik">
              Siz uyurken o çalışır.
            </h2>
            <p className={lead}>Gece gelen her e-posta geldiği dakika okundu ve rafına kondu. Saati ilerletip gecenin nasıl geçtiğine bakın.</p>
          </div>
          <div className="mt-12">
            <NightLog />
          </div>
        </section>

        <section aria-labelledby="hesap-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-3 pt-28 sm:px-8 sm:pt-36" id="hesap">
          <div className="max-w-3xl px-2 sm:px-0">
            <h2 className={h2} id="hesap-baslik">
              Sizin gelen kutunuzda ne eder?
            </h2>
            <p className={lead}>Kendi rakamlarınızı girin. Hesap kaba bir tahmindir; formülü sonucun altında.</p>
          </div>
          <div className="mt-12">
            <Savings />
          </div>
        </section>

        <section aria-labelledby="arac-baslik" className="mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-36">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <h2 className={h2} id="arac-baslik">
                Zaten kullandığınız araçlarla.
              </h2>
              <p className={lead}>Yeni bir program öğrenmeniz gerekmez. Asistan e-postanıza ve işi yürüttüğünüz yerlere bağlanır.</p>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {tools.map(({ icon: Icon, name, text }) => (
                <li className="border-t border-[var(--kp-line)] py-6" key={name}>
                  <p className="flex items-center gap-2.5 font-semibold">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} /> {name}
                  </p>
                  <p className="mt-2 text-[15px] leading-6 text-[var(--kp-muted)]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="soru-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-28 sm:px-8 sm:pt-36" id="sorular">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <h2 className={h2} id="soru-baslik">
              Aklınıza takılanlar
            </h2>
            <div className="border-b border-[var(--kp-line)]">
              {faq.map(([q, a]) => (
                <details className="group border-t border-[var(--kp-line)]" key={q}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <Plus aria-hidden="true" className="size-5 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="max-w-[60ch] pb-6 leading-7 text-[var(--kp-muted)]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-3 pt-28 pb-6 sm:px-8 sm:pt-36">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--kp-morning)_0%,#E7DCD8_55%,var(--kp-dawn)_100%)] px-6 py-20 text-center sm:py-28">
            <h2 className={`${head} mx-auto max-w-[16ch] text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[0.96] tracking-[-0.02em]`}>Güne ayıklanmış bir gelen kutusuyla başlayın.</h2>
            <SortLink className={`${primary} mt-9`}>
              Postayı ayıkla <ArrowRight aria-hidden="true" className="size-4" />
            </SortLink>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 px-5 py-10 text-sm text-[var(--kp-muted)] sm:px-8">
        <span className={`${head} text-xl text-[var(--kp-ink)]`}>Kirpi</span>
        <span className="max-w-[70ch]">Kirpi Seramik örnek bir işletmedir; kişiler, e-postalar ve sipariş numaraları uydurmadır. Asistan bir simülasyondur, hiçbir e-posta gönderilmez.</span>
      </footer>
    </div>
  );
}
