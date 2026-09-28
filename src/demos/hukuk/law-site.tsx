import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowRight } from "lucide-react";
import { lawyers, steps } from "./data";
import { AreaRows, ConsultForm, LawProvider, Routes } from "./law-interactive";
import { body, display, images, lawVars } from "./theme";

const eyebrow = "text-[11px] font-semibold tracking-[0.16em] text-[var(--law-oxblood)] uppercase";
const h2 = "font-[family-name:var(--law-display)] text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.08] font-light tracking-[-0.015em]";
const wrap = "mx-auto max-w-[1080px] px-5 sm:px-8";

const faq = [
  ["Ön görüşme ücretli mi?", "Avukatlık ücretleri Türkiye Barolar Birliği Avukatlık Asgari Ücret Tarifesi'nin altında olamaz. Görüşmenin ücreti ve süresi, görüşmeden önce size yazılı olarak bildirilir."],
  ["Formu göndermek aramızda avukatlık ilişkisi kurar mı?", "Hayır. Vekâletname verilip avukatlık sözleşmesi imzalanana kadar avukat-müvekkil ilişkisi kurulmaz. Formla yalnızca ön görüşme talep etmiş olursunuz."],
  ["Dava açmadan önce arabulucuya gitmek zorunlu mu?", "İş, ticaret, tüketici ve kira uyuşmazlıklarının önemli bir kısmında dava açmadan önce arabulucuya başvurmak zorunludur. Sizin durumunuzda zorunlu olup olmadığını ilk görüşmede birlikte kontrol ederiz."],
  ["Sonucu önceden söyleyebilir misiniz?", "Hiçbir avukat bir davanın sonucunu garanti edemez. Size izlenebilecek yolları, olası süreleri ve riskleri anlatırız; kararı birlikte veririz."],
];

const reading = [
  { tag: "İş hukuku", title: "İşten çıkarıldıysanız: süreler ve ilk adımlar", min: 6 },
  { tag: "Kira", title: "Kira artışında sınır nasıl hesaplanır", min: 4 },
  { tag: "Miras", title: "Mirasçılık belgesi nereden ve nasıl alınır", min: 3 },
];

/** Ferah & Ilgaz Hukuk Bürosu: the "hukuk ve danışmanlık" website demo. */
export function LawSite() {
  return (
    <div className={`${display.variable} ${body.variable} min-h-[100dvh] bg-[var(--law-paper)] font-[family-name:var(--law-body)] text-[var(--law-ink)] antialiased`} style={lawVars}>
      <LawProvider>
        <div className="bg-[var(--law-panel)]">
          <p className={`${wrap} flex justify-between gap-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-[var(--law-slate)] uppercase`}>
            <span>İş · Aile · Kira · Ticaret · Miras · Tüketici</span>
            <span className="hidden sm:inline">Hafta içi 09.00–18.00</span>
          </p>
        </div>

        <header className="sticky top-0 z-30 border-b border-[var(--law-line)] bg-[var(--law-paper)]/95 backdrop-blur">
          <div className={`${wrap} flex items-center justify-between gap-4 py-4`}>
            <a className="flex items-center gap-3" href="#">
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-[var(--law-oxblood)] font-[family-name:var(--law-display)] text-sm text-[var(--law-oxblood)] italic">
                F&amp;I
              </span>
              <span className="leading-none">
                <span className="block font-[family-name:var(--law-display)] text-xl tracking-[0.04em]">FERAH &amp; ILGAZ</span>
                <span className="mt-1 block text-[10px] font-semibold tracking-[0.2em] text-[var(--law-slate)] uppercase">Hukuk Bürosu</span>
              </span>
            </a>
            <nav aria-label="Ferah & Ilgaz" className="flex items-center gap-7 text-sm">
              <a className="hidden hover:text-[var(--law-oxblood)] md:inline" href="#durumlar">
                Durumunuz
              </a>
              <a className="hidden hover:text-[var(--law-oxblood)] md:inline" href="#alanlar">
                Çalışma alanları
              </a>
              <a className="hidden hover:text-[var(--law-oxblood)] md:inline" href="#avukatlar">
                Avukatlar
              </a>
              <a className="inline-flex min-h-11 items-center gap-2 bg-[var(--law-oxblood)] px-4 font-semibold text-white hover:bg-[var(--law-ink)]" href="#on-gorusme">
                Ön görüşme <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </nav>
          </div>
        </header>

        <main>
          <section className={`${wrap} grid items-center gap-12 pt-14 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:pt-20`}>
            <div>
              <p className={eyebrow}>Hukuk bürosu · İstanbul</p>
              <h1 className="mt-5 font-[family-name:var(--law-display)] text-[clamp(2.7rem,5.4vw,4.4rem)] leading-[1.02] font-light tracking-[-0.02em]">
                Hukuki sorununuzu anlatın; doğru adımı birlikte belirleyelim.
              </h1>
              <p className="mt-7 max-w-[46ch] text-lg leading-8 text-[var(--law-slate)]">
                Konunun hangi hukuk alanına girdiğini bilmeniz gerekmez. Size en yakın durumu seçin; ne anlama geldiğini ve ilk görüşmeye nasıl hazırlanacağınızı sade bir dille anlatalım.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <a className="inline-flex min-h-12 items-center gap-2 bg-[var(--law-oxblood)] px-6 font-semibold text-white hover:bg-[var(--law-ink)]" href="#on-gorusme">
                  Ön görüşme talep edin <ArrowRight aria-hidden="true" className="size-4" />
                </a>
                <a className="inline-flex min-h-12 items-center gap-2 border border-[var(--law-line)] px-6 font-semibold hover:border-[var(--law-ink)]" href="#durumlar">
                  Durumunuzu seçin <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>
              <p className="mt-8 max-w-sm border border-[var(--law-line)] bg-[var(--law-panel)] px-5 py-4 text-sm leading-6 text-[var(--law-slate)]">
                Süre, masraf ve ücret bilgisi vekâletten önce yazılı olarak verilir.
              </p>
            </div>
            <figure>
              <div className="aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
                <UnsplashPhoto image={images.hero} priority sizes="(min-width: 1024px) 55vw, 100vw" />
              </div>
              <figcaption className="mt-3 flex justify-between text-xs">
                <span className="font-semibold tracking-[0.14em] text-[var(--law-oxblood)] uppercase">Ferah &amp; Ilgaz Hukuk Bürosu</span>
                <span className="text-[var(--law-slate)]">İstanbul</span>
              </figcaption>
            </figure>
          </section>

          <section aria-labelledby="durumlar-baslik" className="scroll-mt-20 bg-[var(--law-panel)] py-24" id="durumlar">
            <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]`}>
              <div>
                <p className={eyebrow}>Durumla başlayın</p>
                <h2 className={`${h2} mt-4`} id="durumlar-baslik">
                  Yedi durum. Tek bir başlangıç yeri.
                </h2>
                <p className="mt-5 max-w-[36ch] leading-7 text-[var(--law-slate)]">
                  Size en yakın cümleyi açın. Hangi hukuk alanına girdiğini, neye dikkat etmeniz gerektiğini ve görüşmeye neleri getireceğinizi görürsünüz.
                </p>
              </div>
              <Routes />
            </div>
          </section>

          <section aria-labelledby="alanlar-baslik" className={`${wrap} grid scroll-mt-20 items-center gap-12 py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`} id="alanlar">
            <figure>
              <div className="aspect-[4/5] overflow-hidden">
                <UnsplashPhoto image={images.alanlar} sizes="(min-width: 1024px) 38vw, 100vw" />
              </div>
              <figcaption className="mt-3 text-xs text-[var(--law-slate)]">Her dosya bir belgeyle değil, bir kararla başlar.</figcaption>
            </figure>
            <div>
              <p className={eyebrow}>Çalışma alanları</p>
              <h2 className={`${h2} mt-4`} id="alanlar-baslik">
                Belgeler, rolleri anlaşıldığında işe yarar.
              </h2>
              <p className="mt-5 max-w-[48ch] leading-7 text-[var(--law-slate)]">
                Çalışmayı vereceğiniz karar etrafında kurarız. Başka bir uzmana ihtiyacınız varsa bunu açıkça söyler, kapsamı işe başlamadan netleştiririz.
              </p>
              <div className="mt-8">
                <AreaRows />
              </div>
            </div>
          </section>

          <section aria-labelledby="karsilastirma-baslik" className="bg-[var(--law-panel)] py-24">
            <div className={wrap}>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
                <div>
                  <p className={eyebrow}>Sade dille karşılaştırma</p>
                  <h2 className={`${h2} mt-4`} id="karsilastirma-baslik">
                    Arabuluculuk ve dava farklı sorulara cevap verir.
                  </h2>
                </div>
                <p className="leading-7 text-[var(--law-slate)]">Pek çok uyuşmazlıkta ikisi art arda gelir. Hangisiyle başlayacağınızı konunun türü ve kanundaki zorunluluklar belirler.</p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {[
                  ["Arabuluculuk", "Tarafları tarafsız bir arabulucuyla anlaşmaya davet eder.", "İş, ticaret, tüketici ve kira uyuşmazlıklarının çoğunda dava açmadan önce başvurmak zorunludur.", "Anlaşma sağlanamazsa dava yolu açık kalır."],
                  ["Dava", "Uyuşmazlığı mahkeme karara bağlar.", "Deliller, tanıklar ve bilirkişi incelemesiyle yürür; kararın ardından kanun yolları açıktır.", "Süre, dosyanın niteliğine ve mahkemenin iş yüküne göre değişir."],
                ].map(([t, lead, body, foot], i) => (
                  <article className={`border border-[var(--law-line)] p-7 ${i === 0 ? "bg-[var(--law-paper)]" : ""}`} key={t}>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--law-oxblood)] uppercase">{t}</p>
                    <h3 className="mt-3 font-[family-name:var(--law-display)] text-2xl leading-snug font-light">{lead}</h3>
                    <p className="mt-3 leading-7">{body}</p>
                    <p className="mt-5 border-t border-[var(--law-line)] pt-4 text-sm text-[var(--law-slate)]">{foot}</p>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-sm text-[var(--law-slate)]">Bu karşılaştırma genel bilgilendirmedir; somut durumunuz için hukuki görüş yerine geçmez.</p>
            </div>
          </section>

          <section aria-labelledby="avukatlar-baslik" className={`${wrap} grid scroll-mt-20 items-center gap-12 py-24 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]`} id="avukatlar">
            <div className="aspect-[4/5] overflow-hidden">
              <UnsplashPhoto image={images.avukatlar} sizes="(min-width: 1024px) 34vw, 100vw" />
            </div>
            <div>
              <p className={eyebrow}>Avukatlar</p>
              <h2 className={`${h2} mt-4`} id="avukatlar-baslik">
                Görüşmeyi gösteriş değil, vereceğiniz karar yönetir.
              </h2>
              <p className="mt-5 max-w-[50ch] leading-7 text-[var(--law-slate)]">
                Büroda iki avukat çalışır; dosyanızı baştan sona aynı kişi takip eder. Hangi avukatla çalışacağınızı ilk görüşmede konunuza göre birlikte belirleriz.
              </p>
              <dl className="mt-8 grid gap-x-8 border-t border-[var(--law-line)] sm:grid-cols-2">
                {lawyers.map((l) => (
                  <div className="border-b border-[var(--law-line)] py-5" key={l.name}>
                    <dt className="font-[family-name:var(--law-display)] text-2xl font-light">{l.name}</dt>
                    <dd className="mt-1 text-sm">
                      <span className="text-[11px] font-semibold tracking-[0.14em] text-[var(--law-oxblood)] uppercase">{l.note}</span>
                      <span className="mt-1 block text-[var(--law-slate)]">{l.focus}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs text-[var(--law-slate)]">İsimler ve unvanlar örnektir; gerçek kişilerle ilgisi yoktur.</p>
            </div>
          </section>

          <section aria-labelledby="surec-baslik" className="bg-[var(--law-panel)] py-24">
            <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]`}>
              <div>
                <p className={eyebrow}>Ön görüşme nasıl başlar</p>
                <h2 className={`${h2} mt-4`} id="surec-baslik">
                  Kapsam, çalışma başlamadan bellidir.
                </h2>
                <p className="mt-5 max-w-[36ch] leading-7 text-[var(--law-slate)]">İlk temas uygunluk ve sonraki adım içindir. Gizli belgelerinizi bu siteden göndermeniz gerekmez.</p>
              </div>
              <ol className="border-t border-[var(--law-line)]">
                {steps.map((s, i) => (
                  <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 border-b border-[var(--law-line)] py-6" key={s.name}>
                    <span className="pt-1.5 text-xs font-semibold text-[var(--law-slate)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-[family-name:var(--law-display)] text-[1.45rem] font-light">{s.name}</h3>
                      <p className="mt-2 leading-7">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section aria-labelledby="okuma-baslik" className={`${wrap} py-24`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={eyebrow}>Görüşmeden önce</p>
                <h2 className={`${h2} mt-4`} id="okuma-baslik">
                  Konuşmadan önce okumaya değer.
                </h2>
              </div>
              <p className="text-sm text-[var(--law-slate)]">Yazılar genel bilgilendirme içindir.</p>
            </div>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <article>
                <div className="aspect-[16/10] overflow-hidden">
                  <UnsplashPhoto image={images.kaynak} sizes="(min-width: 1024px) 56vw, 100vw" />
                </div>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-[var(--law-oxblood)] uppercase">Öne çıkan · Başlangıç</p>
                <h3 className="mt-2 font-[family-name:var(--law-display)] text-2xl font-light">Avukata gitmeden önce hangi belgeleri toplamalısınız?</h3>
                <p className="mt-2 max-w-[52ch] text-[var(--law-slate)]">Sözleşmeler, yazışmalar, dekontlar: ilk görüşmenin verimli geçmesi için elinizde olması gerekenlerin sade bir listesi.</p>
              </article>
              <ul className="border-t border-[var(--law-line)]">
                {reading.map((r) => (
                  <li className="border-b border-[var(--law-line)] py-6" key={r.title}>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--law-oxblood)] uppercase">
                      {r.tag} · {r.min} dk
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--law-display)] text-[1.35rem] leading-snug font-light">{r.title}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="ilke-baslik" className="bg-[var(--law-panel)] py-24">
            <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]`}>
              <div>
                <p className={eyebrow}>Nasıl iletişim kurarız</p>
                <h2 className={`${h2} mt-4`} id="ilke-baslik">
                  Açıklık bir hizmet standardıdır.
                </h2>
                <p className="mt-5 max-w-[36ch] leading-7 text-[var(--law-slate)]">
                  Bu sitede ödül, kazanılmış dava sayısı ya da müvekkil yorumu bulamazsınız. Avukatlık meslek kuralları buna izin vermez; biz de gerek görmüyoruz.
                </p>
              </div>
              <ol className="border-t border-[var(--law-line)]">
                {["Her belgenin ne işe yaradığını ve sınırını sade bir dille anlatırız.", "Hukuki kapsamı vergi, mali müşavirlik ve bilirkişilik konularından ayırırız.", "Ücret, masraf ve sonraki adımları vekâletten önce yazılı paylaşırız."].map((t, i) => (
                  <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 border-b border-[var(--law-line)] py-6" key={t}>
                    <span className="pt-1.5 text-xs font-semibold text-[var(--law-slate)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-[family-name:var(--law-display)] text-[1.35rem] leading-snug font-light">{t}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section aria-labelledby="sss-baslik" className={`${wrap} grid gap-12 py-24 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]`}>
            <div>
              <p className={eyebrow}>İlk sorular</p>
              <h2 className={`${h2} mt-4`} id="sss-baslik">
                Birkaç faydalı ayrım.
              </h2>
              <p className="mt-5 max-w-[36ch] text-sm leading-6 text-[var(--law-slate)]">Cevaplar genel bilgilendirmedir; kuralların sizin durumunuza nasıl uygulandığını bir avukat teyit etmelidir.</p>
            </div>
            <div className="border-t border-[var(--law-line)]">
              {faq.map(([q, a]) => (
                <details className="group border-b border-[var(--law-line)]" key={q}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-[family-name:var(--law-display)] text-[1.35rem] leading-snug font-light [&::-webkit-details-marker]:hidden">
                    {q}
                    <span aria-hidden="true" className="text-2xl text-[var(--law-oxblood)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-6 leading-7 text-[var(--law-slate)]">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="gorusme-baslik" className="scroll-mt-20 bg-[var(--law-oxblood)] py-24 text-white" id="on-gorusme">
            <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">Başlamak için</p>
                <h2 className="mt-4 font-[family-name:var(--law-display)] text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.08] font-light" id="gorusme-baslik">
                  Sorunuzu getirin. Bir sonraki adımı birlikte belirleyelim.
                </h2>
                <p className="mt-6 max-w-[40ch] leading-7 text-white/80">
                  İlk görüşme; konunuzun hangi alana girdiğini, sürelerin ne olduğunu ve hangi bilgilerin işe yarayacağını netleştirir.
                </p>
                <p className="mt-6 max-w-[40ch] text-sm leading-6 text-white/60">Form göndermek avukat-müvekkil ilişkisi kurmaz. Lütfen gizli ya da hassas bilgi göndermeyin.</p>
              </div>
              <ConsultForm />
            </div>
          </section>
        </main>

        <footer className="bg-[var(--law-panel)] py-16">
          <div className={`${wrap} grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]`}>
            <div>
              <p className="font-[family-name:var(--law-display)] text-2xl font-light">Ferah &amp; Ilgaz Hukuk Bürosu</p>
              <p className="mt-2 text-[var(--law-slate)]">Açık, yazılı, zamanında.</p>
              <p className="mt-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--law-oxblood)] uppercase">İstanbul</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--law-oxblood)] uppercase">Büro</p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["Durumunuz", "#durumlar"],
                  ["Çalışma alanları", "#alanlar"],
                  ["Avukatlar", "#avukatlar"],
                  ["Ön görüşme", "#on-gorusme"],
                ].map(([l, h]) => (
                  <li key={l}>
                    <a className="hover:text-[var(--law-oxblood)]" href={h}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--law-oxblood)] uppercase">Çalışma saatleri</p>
              <p className="mt-3 text-sm leading-6">
                Pazartesi–Cuma, 09.00–18.00
                <br />
                Görüşmeler randevuyla yapılır.
              </p>
            </div>
          </div>
          <div className={`${wrap} mt-12 flex flex-wrap justify-between gap-3 border-t border-[var(--law-line)] pt-6 text-xs text-[var(--law-slate)]`}>
            <span>Örnek büro; gerçek bir hukuk bürosu değildir. Genel bilgilendirme amaçlıdır, hukuki görüş değildir. Avukatlık Kanunu ve TBB Meslek Kuralları gereği reklam içermez.</span>
            <span>Fotoğraflar: Unsplash · {creditsOf(images).join(", ")}</span>
          </div>
        </footer>
      </LawProvider>
    </div>
  );
}
