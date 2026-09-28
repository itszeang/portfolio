import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { area, kinds, phases, projects } from "./data";
import { InquiryForm } from "./inquiry-form";
import { ProjectsExplorer } from "./plan-view";
import { display, etutVars, images, mono } from "./theme";

const label = "text-[13px] font-bold";
const giant = "font-[family-name:var(--etut-display)] text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.86] font-bold tracking-[-0.055em]";
const wrap = "px-5 sm:px-9";
const rule = "border-t border-[var(--etut-ink)]";

const services = [
  ["Yeni konut", "Arsadan anahtar teslime kadar müstakil ve küçük ölçekli konut projeleri."],
  ["Restorasyon", "Tescilli ya da eski yapılarda rölöve, restitüsyon ve restorasyon projeleri."],
  ["Daire yenileme", "Taşıyıcı sisteme dokunmadan plan değişikliği, ıslak hacim ve tesisat yenileme."],
  ["İç mimari", "Ofis, dükkân ve konut iç mekânları; mobilya ve aydınlatma tasarımı dahil."],
  ["Ruhsat projeleri", "Belediye başvurusu için mimari proje ve gerekli belgelerin hazırlanması."],
  ["Şantiye takibi", "Uygulamanın çizime uygun ilerlediğini düzenli ziyaretlerle denetleme."],
];

/** Etüt Mimarlık's website: the "mimarlık" demo. */
export function EtutSite() {
  const total = projects.reduce((n, p) => n + area(p.plan), 0);
  const stats = [
    ["Seçili proje", String(projects.length)],
    ["Çizilen alan, m²", String(Math.round(total))],
    ["Proje türü", String(kinds.length)],
    ["Ölçek", "1:100"],
    ["Onaysız başlanan iş", "0"],
  ];

  return (
    <div className={`${display.variable} ${mono.variable} min-h-[100dvh] bg-[var(--etut-paper)] font-[family-name:var(--etut-display)] text-[var(--etut-ink)] antialiased`} style={etutVars}>
      <header className={`${wrap} flex items-center justify-between gap-6 py-5`}>
        <a className="flex items-center gap-2 text-[13px] leading-tight font-bold" href="#">
          <span aria-hidden="true" className="size-6 bg-[var(--etut-ink)]" />
          <span>
            Etüt
            <br />
            Mimarlık
          </span>
        </a>
        <nav aria-label="Etüt Mimarlık" className="flex items-center gap-6 text-[13px] font-medium">
          <a className="hidden hover:underline sm:inline" href="#projeler">
            Projeler
          </a>
          <a className="hidden hover:underline sm:inline" href="#yaklasim">
            Yaklaşım
          </a>
          <a className="hidden hover:underline sm:inline" href="#hizmetler">
            Hizmetler
          </a>
          <a className="font-bold hover:underline" href="#talep">
            Keşif talebi <span aria-hidden="true" className="ml-1 inline-block size-2.5 bg-[var(--etut-ink)]" />
          </a>
        </nav>
      </header>

      <main>
        <section className={`${wrap} pt-20 pb-16 sm:pt-28`}>
          <div className="grid items-end gap-6 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
            <p aria-hidden="true" className={`${giant} hidden sm:block sm:text-right`}>
              1:100
            </p>
            <h1 className={giant}>
              Etüt
              <br />
              Mimarlık
            </h1>
          </div>

          <div className="mt-20 grid gap-8 text-[13px] leading-[1.35] sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="font-bold">İletişim</p>
              <p className="mt-3 font-bold">Ofis</p>
              <p>İstanbul, randevuyla</p>
              <p className="mt-3 font-bold">E-posta</p>
              <p className="underline">ofis@etut.example</p>
            </div>
            <p className="font-bold">Konut, restorasyon ve iç mimari. Ölçerek, dinleyerek, sade çizerek.</p>
            <div>
              <p className="font-bold">Kalıcı olsun</p>
              <p className="mt-3">Modaya göre değil, yıllarca kullanılacak şekilde çiziyoruz. Taşıyıcı sistemi, ışığı ve bakımı en baştan düşünürüz.</p>
            </div>
            <div>
              <p className="font-bold">Önce dinleriz</p>
              <p className="mt-3">Her proje bir sohbetle başlar: nasıl yaşadığınız, yerin ne sunduğu ve bütçenin sınırı. Çizim ondan sonra gelir.</p>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map(([k, v]) => (
              <div className={`${rule} pt-3`} key={k}>
                <dt className="text-[13px]">{k}</dt>
                <dd className="mt-8 font-[family-name:var(--etut-display)] text-[clamp(3.4rem,6vw,5.5rem)] leading-none font-bold tracking-[-0.06em]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${wrap} grid gap-8 pb-24 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]`}>
          <p className="max-w-[26ch] text-[13px] leading-[1.35] font-bold">
            “Planı çizmeden önce üç kez geldiler, sabah ve akşam ışığını ölçtüler. Şimdi mutfak tam güneş gördüğü yerde.”
            <span className="mt-3 block font-normal text-[var(--etut-muted)]">Örnek alıntı, uydurma bir müşteriden</span>
          </p>
          <div className="aspect-[16/9] overflow-hidden">
            <UnsplashPhoto className="grayscale" image={images.kapak} priority sizes="(min-width: 1024px) 70vw, 100vw" />
          </div>
        </section>

        <section aria-labelledby="projeler-baslik" className={`${wrap} scroll-mt-4 pb-24`} id="projeler">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="projeler-baslik">
              Projeler
            </h2>
            <p className="mt-6 max-w-[48ch] text-[13px] leading-[1.35]">Her projenin gerçek ölçekli planını açabilirsiniz. Yenileme projelerinde kaydırıcıyı sürükleyip önceki ve sonraki planı karşılaştırın.</p>
          </div>
          <div className="mt-12">
            <ProjectsExplorer />
          </div>
        </section>

        <section aria-labelledby="yaklasim-baslik" className={`${wrap} scroll-mt-4 pb-28`} id="yaklasim">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="yaklasim-baslik">
              Süreç
            </h2>
          </div>
          <ol className="mt-24 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {phases.map((p, i) => (
              <li key={p.name}>
                <p aria-hidden="true" className="font-[family-name:var(--etut-display)] text-[clamp(5rem,9vw,8rem)] leading-[0.8] font-bold tracking-[-0.06em]">
                  {i + 1}
                </p>
                <h3 className={`${label} mt-6`}>
                  <span className="sr-only">{i + 1}. </span>
                  {p.name}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.35]">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${wrap} grid gap-5 pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]`}>
          <div className="aspect-[4/5] overflow-hidden">
            <UnsplashPhoto className="grayscale" image={images.cizim} sizes="(min-width: 1024px) 36vw, 100vw" />
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <UnsplashPhoto className="grayscale" image={images.maket} sizes="(min-width: 1024px) 36vw, 100vw" />
          </div>
          <div className="flex flex-col justify-end text-[13px] leading-[1.35]">
            <p className="font-bold">Mimarlık bir deneyimdir.</p>
            <p className="mt-3">Bu deneyim projenin sonunda eklenemez; en baştan düşünülmelidir.</p>
            <ul className="mt-3 list-disc space-y-1 pl-4">
              <li>Sabah ışığının mutfağa nereden girdiği</li>
              <li>Bir ofisin dikkat dağıtmadan birlikte çalışmayı nasıl kolaylaştırdığı</li>
              <li>Bir avlunun kalabalık şehirde nasıl bir sessizlik yarattığı</li>
            </ul>
            <p className="mt-3 font-bold">Her kararı, sezgisel ve uzun ömürlü mekânlar için veririz.</p>
          </div>
        </section>

        <section aria-labelledby="hizmetler-baslik" className={`${wrap} scroll-mt-4 pb-28`} id="hizmetler">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="hizmetler-baslik">
              Hizmetler
            </h2>
          </div>
          <ul className="mt-16 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([t, d]) => (
              <li className={`${rule} pt-3 pb-10`} key={t}>
                <h3 className="font-[family-name:var(--etut-display)] text-3xl font-bold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 max-w-[38ch] text-[13px] leading-[1.35]">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="talep-baslik" className={`${wrap} grid scroll-mt-4 gap-10 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`} id="talep">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="talep-baslik">
              Keşif
            </h2>
            <p className="mt-8 max-w-[38ch] text-[13px] leading-[1.35]">
              Yerinizi görmeye gelelim. Birkaç bilgiyle başlayın; keşif için gün önerisiyle size döneriz. Ücret ve kapsam, çizime başlamadan yazılı olarak paylaşılır.
            </p>
            <div className="mt-10 aspect-[16/10] overflow-hidden">
              <UnsplashPhoto className="grayscale" image={images.merdiven} sizes="(min-width: 1024px) 44vw, 100vw" />
            </div>
          </div>
          <InquiryForm />
        </section>
      </main>

      <footer className={`${wrap} pb-8`}>
        <div className={`${rule} grid gap-6 pt-4 text-[13px] sm:grid-cols-3`}>
          <p className="font-bold">Etüt Mimarlık</p>
          <p>Örnek bir mimarlık ofisidir; projeler ve alıntı uydurmadır.</p>
          <p className="text-[var(--etut-muted)]">Fotoğraflar: Unsplash · {creditsOf(images).join(", ")}</p>
        </div>
        <p aria-hidden="true" className="mt-10 font-[family-name:var(--etut-display)] text-[clamp(6rem,27vw,26rem)] leading-[0.78] font-bold tracking-[-0.07em]">
          Etüt
        </p>
      </footer>
    </div>
  );
}
