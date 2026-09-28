import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { destinations, listings } from "./data";
import { SearchApp } from "./search-app";
import { display, esikVars, images, serif } from "./theme";

const it = "font-[family-name:var(--esik-serif)] font-normal italic tracking-[-0.02em]";
const h2 = "text-[clamp(2.4rem,5vw,4.2rem)] leading-[1] font-medium tracking-[-0.045em]";

const faq = [
  ["Aylık toplam nasıl hesaplanıyor?", "Kiralıkta kira, satılıkta seçtiğin peşinat, vade ve faizle hesaplanan kredi taksiti; üstüne aidat ve net alana göre tahmini fatura eklenir. Hepsi örnek değerlerdir."],
  ["Yol süreleri ne kadar doğru?", "Akşam trafiğinde toplu taşımayla ortalama süreler. Gerçek bir sitede bu veriyi bir harita servisinden canlı çekeriz."],
  ["EİDS doğrulaması ne demek?", "Elektronik İlan Doğrulama Sistemi: ilanın, e-Devlet üzerinden mülk sahibinin onayıyla yayınlandığını gösterir. Onaysız ilan yayınlamıyoruz."],
  ["Hizmet bedeli ne kadar?", "Taşınmaz Ticareti Hakkında Yönetmelik'teki üst sınırları aşmaz ve işlemden önce yazılı sözleşmeyle bildirilir. Yerinde görme ücretsizdir."],
];

/** Eşik Gayrimenkul's website: the "emlak" demo, built around its search. */
export function EsikSite() {
  const featured = listings[0];
  return (
    <div className={`${display.variable} ${serif.variable} min-h-[100dvh] bg-[var(--esik-bg)] font-[family-name:var(--esik-display)] text-[var(--esik-ink)] antialiased`} style={esikVars}>
      <section className="relative min-h-[92svh] overflow-hidden text-white">
        <div className="absolute inset-0">
          <UnsplashPhoto image={images.hero} priority sizes="100vw" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,26,.55),rgba(10,20,26,.05)_45%,rgba(10,20,26,.35))]" />

        <header className="relative flex items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <a className="text-2xl font-bold tracking-[-0.03em]" href="#">
            eşik
          </a>
          <nav aria-label="Eşik Gayrimenkul" className="hidden gap-9 text-[17px] font-medium sm:flex">
            <a className="hover:opacity-70" href="#ilanlar">
              İlanlar
            </a>
            <a className="hover:opacity-70" href="#nasil">
              Nasıl çalışıyoruz
            </a>
            <a className="hover:opacity-70" href="#sorular">
              Sorular
            </a>
          </nav>
          <a className="rounded-lg bg-white px-5 py-3 text-[15px] font-medium text-[var(--esik-ink)] hover:bg-[var(--esik-cream)]" href="#ilanlar">
            Ev ara
          </a>
        </header>

        <div className="relative px-5 sm:px-8">
          <div className="flex items-start justify-between gap-6 border-b border-white/30 pb-4 text-xs leading-4 font-medium">
            <p>
              İzmir&apos;de ev bulmana
              <br />
              yardım ediyoruz
            </p>
            <p>Karşıyaka · Bornova · Urla</p>
          </div>
          <h1 className="mt-4 text-[clamp(2.9rem,8.2vw,7.6rem)] leading-[0.95] font-medium tracking-[-0.055em]">
            Evin <span className={it}>gerçek</span> maliyetini gör
          </h1>
        </div>

        <div className="absolute inset-x-5 bottom-6 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
          <a className="rounded-lg bg-[var(--esik-ink)] px-5 py-3.5 text-[15px] font-medium hover:bg-black" href="#ilanlar">
            Tüm ilanları gör
          </a>
          <a className="hidden w-44 rounded-2xl border-2 border-white/80 bg-white p-2 text-[var(--esik-ink)] shadow-2xl sm:block" href="#ilanlar">
            <span className="block aspect-[4/3] overflow-hidden rounded-xl">
              <UnsplashPhoto image={images[featured.id as keyof typeof images]} sizes="176px" />
            </span>
            <span className="mt-2 block px-1 text-sm font-medium">{featured.rooms}, deniz manzaralı</span>
            <span className="block px-1 text-xs text-[var(--esik-muted)]">{featured.net} m² net</span>
            <span className="flex items-center justify-between px-1 pb-1 text-xs text-[var(--esik-muted)]">
              {featured.district} <ArrowDownRight aria-hidden="true" className="size-4 text-[var(--esik-ink)]" />
            </span>
          </a>
        </div>
      </section>

      <main>
        <section aria-labelledby="ilanlar-baslik" className="scroll-mt-4 px-5 pt-20 pb-24 sm:px-8" id="ilanlar">
          <p className="text-center text-sm text-[var(--esik-muted)]">İlanlar</p>
          <h2 className={`${h2} mt-2 text-center`} id="ilanlar-baslik">
            Aylık <span className={it}>toplamıyla</span> ilanlar
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-center text-[var(--esik-muted)]">
            Kira ya da kredi taksiti, aidat ve fatura tek bir rakamda. Her gün gittiğin yeri seç; her ilanın oraya kaç dakika olduğunu da görelim.
          </p>
          <div className="mx-auto mt-10 max-w-[1240px]">
            <SearchApp />
          </div>
        </section>

        <section aria-labelledby="nasil-baslik" className="scroll-mt-4 bg-[var(--esik-sky)] px-5 pt-24 pb-10 sm:px-8" id="nasil">
          <p className="text-center text-sm text-[var(--esik-muted)]">Nasıl çalışıyoruz</p>
          <h2 className={`${h2} mt-2 text-center`} id="nasil-baslik">
            Keşfet
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-center text-[var(--esik-muted)]">
            İzmir&apos;in semtlerini, fiyatlarını ve günlük yolunu biliyoruz. Ev seçerken yalnızca fiyata değil, her ay cebinden çıkacak paraya ve yolda geçecek zamana bakalım.
          </p>
          <div className="mx-auto mt-14 grid max-w-[1240px] gap-4 md:grid-cols-3">
            {(
              [
                [String(listings.length), "Doğrulanmış ilan", "Her biri EİDS ile, mülk sahibinin onayıyla.", "palmiye", "bg-white"],
                ["3 kalem", "Tek aylık rakam", "Kira ya da taksit, aidat ve fatura bir arada.", "salon", "bg-[#F3F7F8]"],
                [String(destinations.length), "Merkeze yol süresi", "Alsancak, Bornova, Karşıyaka ve Urla'ya dakika dakika.", "koy", "bg-[var(--esik-ink)] text-white"],
              ] as const
            ).map(([n, t, d, img, tone]) => (
              <div className={`relative grid min-h-60 grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] overflow-hidden rounded-2xl ${tone}`} key={t}>
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <p className="text-5xl font-medium tracking-[-0.05em]">{n}</p>
                    <p className="mt-1 text-sm font-medium">{t}</p>
                  </div>
                  <p className="text-sm opacity-70">{d}</p>
                </div>
                <div className="relative">
                  <UnsplashPhoto image={images[img]} sizes="(min-width: 768px) 15vw, 45vw" />
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 grid max-w-[1240px] grid-cols-2 gap-y-3 border-t border-[var(--esik-ink)]/15 py-6 text-[15px] sm:grid-cols-4">
            {["Kiralık", "Satılık", "Krediye uygun", "Tüm ilanlar"].map((t) => (
              <a className="flex items-center gap-2 hover:opacity-70" href="#ilanlar" key={t}>
                <ArrowDownRight aria-hidden="true" className="size-4" /> {t}
              </a>
            ))}
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8">
          <h2 className={`${h2} text-center`}>
            Ev seçimi <span className={it}>hesap</span> işidir
          </h2>
          <div className="mx-auto mt-12 aspect-[16/8] max-w-[1240px] overflow-hidden rounded-2xl">
            <UnsplashPhoto image={images.salon} sizes="(min-width: 1280px) 1240px, 100vw" />
          </div>
          <div className="mx-auto mt-8 grid max-w-[1240px] gap-6 text-[15px] text-[var(--esik-muted)] md:grid-cols-3">
            <p>
              <span className="font-medium text-[var(--esik-ink)]">Yerinde görme.</span> Görmek istediğin saati seç; danışman aynı gün arayıp teyit eder, gösterimde yanında olur.
            </p>
            <p>
              <span className="font-medium text-[var(--esik-ink)]">Kredi ön hesabı.</span> Peşinatı ve vadeyi değiştir, taksitin anında aylık toplama yansısın.
            </p>
            <p>
              <span className="font-medium text-[var(--esik-ink)]">Tapuya kadar.</span> Sözleşme, kredi ve tapu randevusu adımlarını birlikte takip ederiz.
            </p>
          </div>
        </section>

        <section aria-labelledby="sorular-baslik" className="scroll-mt-4 px-5 pb-24 sm:px-8" id="sorular">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <h2 className={h2} id="sorular-baslik">
              Aklına <span className={it}>takılanlar</span>
            </h2>
            <div className="border-t border-[var(--esik-line)]">
              {faq.map(([q, a]) => (
                <details className="group border-b border-[var(--esik-line)]" key={q}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-xl font-medium tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="pb-6 leading-7 text-[var(--esik-muted)]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden bg-[var(--esik-ink)] px-5 pt-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6">
          <p className="max-w-[18ch] text-[clamp(2rem,4vw,3.2rem)] leading-[1] font-medium tracking-[-0.045em]">
            <span className={it}>Senin</span> evin burada bir yerde.
          </p>
          <a className="rounded-lg bg-white px-5 py-3.5 text-[15px] font-medium text-[var(--esik-ink)] hover:bg-[var(--esik-cream)]" href="#ilanlar">
            İlanlara dön
          </a>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1240px] flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/60">
          <span>Örnek işletme. Taşınmaz ticareti yetki belgesi numarası bu örnek sitede gösterilmiyor; fiyatlar ve süreler örnektir.</span>
          <span>Fotoğraflar: Unsplash · {creditsOf(images).join(", ")}</span>
        </div>
        <p aria-hidden="true" className="mt-10 pb-[0.14em] text-center text-[clamp(6rem,25vw,22rem)] leading-[0.85] font-bold tracking-[-0.035em] text-white/10">
          eşik
        </p>
      </footer>
    </div>
  );
}
