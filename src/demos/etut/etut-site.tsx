import { creditsOf, UnsplashPhoto } from "@/demos/shared/unsplash";
import { area, etutIn, kinds } from "./data";
import { InquiryForm } from "./inquiry-form";
import { ProjectsExplorer } from "./plan-view";
import { display, etutVars, images, mono } from "./theme";
import { type Lang, locale } from "@/lib/i18n";

const label = "text-[13px] font-bold";
const giant = "font-[family-name:var(--etut-display)] text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.86] font-bold tracking-[-0.055em]";
const wrap = "px-5 sm:px-9";
const rule = "border-t border-[var(--etut-ink)]";

const COPY = {
  tr: {
    nav: [
      ["Projeler", "#projeler"],
      ["Yaklaşım", "#yaklasim"],
      ["Hizmetler", "#hizmetler"],
    ],
    navCta: "Keşif talebi",
    contact: "İletişim",
    office: "Ofis",
    officeText: "İstanbul, randevuyla",
    email: "E-posta",
    tagline: "Konut, restorasyon ve iç mimari. Ölçerek, dinleyerek, sade çizerek.",
    lastTitle: "Kalıcı olsun",
    lastText: "Modaya göre değil, yıllarca kullanılacak şekilde çiziyoruz. Taşıyıcı sistemi, ışığı ve bakımı en baştan düşünürüz.",
    listenTitle: "Önce dinleriz",
    listenText: "Her proje bir sohbetle başlar: nasıl yaşadığınız, yerin ne sunduğu ve bütçenin sınırı. Çizim ondan sonra gelir.",
    stats: ["Seçili proje", "Çizilen alan, m²", "Proje türü", "Ölçek", "Onaysız başlanan iş"],
    quote: "“Planı çizmeden önce üç kez geldiler, sabah ve akşam ışığını ölçtüler. Şimdi mutfak tam güneş gördüğü yerde.”",
    quoteNote: "Örnek alıntı, uydurma bir müşteriden",
    projects: "Projeler",
    projectsLead: "Her projenin gerçek ölçekli planını açabilirsiniz. Yenileme projelerinde kaydırıcıyı sürükleyip önceki ve sonraki planı karşılaştırın.",
    process: "Süreç",
    expTitle: "Mimarlık bir deneyimdir.",
    expText: "Bu deneyim projenin sonunda eklenemez; en baştan düşünülmelidir.",
    expList: [
      "Sabah ışığının mutfağa nereden girdiği",
      "Bir ofisin dikkat dağıtmadan birlikte çalışmayı nasıl kolaylaştırdığı",
      "Bir avlunun kalabalık şehirde nasıl bir sessizlik yarattığı",
    ],
    expEnd: "Her kararı, sezgisel ve uzun ömürlü mekânlar için veririz.",
    services: "Hizmetler",
    serviceList: [
      ["Yeni konut", "Arsadan anahtar teslime kadar müstakil ve küçük ölçekli konut projeleri."],
      ["Restorasyon", "Tescilli ya da eski yapılarda rölöve, restitüsyon ve restorasyon projeleri."],
      ["Daire yenileme", "Taşıyıcı sisteme dokunmadan plan değişikliği, ıslak hacim ve tesisat yenileme."],
      ["İç mimari", "Ofis, dükkân ve konut iç mekânları; mobilya ve aydınlatma tasarımı dahil."],
      ["Ruhsat projeleri", "Belediye başvurusu için mimari proje ve gerekli belgelerin hazırlanması."],
      ["Şantiye takibi", "Uygulamanın çizime uygun ilerlediğini düzenli ziyaretlerle denetleme."],
    ],
    visit: "Keşif",
    visitLead: "Yerinizi görmeye gelelim. Birkaç bilgiyle başlayın; keşif için gün önerisiyle size döneriz. Ücret ve kapsam, çizime başlamadan yazılı olarak paylaşılır.",
    disclaimer: "Örnek bir mimarlık ofisidir; projeler ve alıntı uydurmadır.",
    photos: "Fotoğraflar",
  },
  en: {
    nav: [
      ["Projects", "#projeler"],
      ["Approach", "#yaklasim"],
      ["Services", "#hizmetler"],
    ],
    navCta: "Request a site visit",
    contact: "Contact",
    office: "Office",
    officeText: "Istanbul, by appointment",
    email: "Email",
    tagline: "Homes, restoration and interiors. Measured, listened to, drawn simply.",
    lastTitle: "Made to last",
    lastText: "We draw for years of use, not for fashion. Structure, light and upkeep are thought through from the start.",
    listenTitle: "We listen first",
    listenText: "Every project starts with a conversation: how you live, what the place offers and where the budget ends. Drawing comes after that.",
    stats: ["Selected projects", "Area drawn, m²", "Project types", "Scale", "Jobs started without sign-off"],
    quote: "“They came three times before drawing the plan and measured the morning and evening light. Now the kitchen is exactly where the sun is.”",
    quoteNote: "A sample quote from a made-up client",
    projects: "Projects",
    projectsLead: "You can open each project's plan at true scale. On renovations, drag the slider to compare the plan before and after.",
    process: "Process",
    expTitle: "Architecture is an experience.",
    expText: "That experience can't be added at the end of a project; it has to be thought of from the start.",
    expList: [
      "Where the morning light comes into the kitchen",
      "How an office makes working together easier without distraction",
      "What kind of quiet a courtyard creates in a crowded city",
    ],
    expEnd: "We make every decision for spaces that feel natural and last.",
    services: "Services",
    serviceList: [
      ["New homes", "Detached and small-scale housing, from the plot to handing over the keys."],
      ["Restoration", "Surveys, reconstruction studies and restoration projects for listed or old buildings."],
      ["Flat renovation", "Layout changes, bathrooms, kitchens and services renewed without touching the structure."],
      ["Interior design", "Offices, shops and homes, including furniture and lighting design."],
      ["Permit drawings", "The architectural drawings and documents the municipality needs for a permit."],
      ["Site supervision", "Regular visits to check the work is following the drawings."],
    ],
    visit: "Visit",
    visitLead: "Let us come and see your place. Start with a few details and we'll come back with a day for the visit. Fees and scope are shared in writing before any drawing begins.",
    disclaimer: "A sample architecture office; the projects and the quote are made up.",
    photos: "Photos",
  },
};

/** Etüt Mimarlık's website: the "mimarlık" demo. */
export function EtutSite({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { projects, phases } = etutIn(lang);
  const total = projects.reduce((n, p) => n + area(p.plan), 0);
  const values = [String(projects.length), Math.round(total).toLocaleString(locale(lang)), String(kinds.length), "1:100", "0"];
  const stats = c.stats.map((k, i) => [k, values[i]]);

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
          {c.nav.map(([l, h]) => (
            <a className="hidden hover:underline sm:inline" href={h} key={h}>
              {l}
            </a>
          ))}
          <a className="font-bold hover:underline" href="#talep">
            {c.navCta} <span aria-hidden="true" className="ml-1 inline-block size-2.5 bg-[var(--etut-ink)]" />
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
              <p className="font-bold">{c.contact}</p>
              <p className="mt-3 font-bold">{c.office}</p>
              <p>{c.officeText}</p>
              <p className="mt-3 font-bold">{c.email}</p>
              <p className="underline">ofis@etut.example</p>
            </div>
            <p className="font-bold">{c.tagline}</p>
            <div>
              <p className="font-bold">{c.lastTitle}</p>
              <p className="mt-3">{c.lastText}</p>
            </div>
            <div>
              <p className="font-bold">{c.listenTitle}</p>
              <p className="mt-3">{c.listenText}</p>
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
            {c.quote}
            <span className="mt-3 block font-normal text-[var(--etut-muted)]">{c.quoteNote}</span>
          </p>
          <div className="aspect-[16/9] overflow-hidden">
            <UnsplashPhoto className="grayscale" image={images.kapak} lang={lang} priority sizes="(min-width: 1024px) 70vw, 100vw" />
          </div>
        </section>

        <section aria-labelledby="projeler-baslik" className={`${wrap} scroll-mt-4 pb-24`} id="projeler">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="projeler-baslik">
              {c.projects}
            </h2>
            <p className="mt-6 max-w-[48ch] text-[13px] leading-[1.35]">{c.projectsLead}</p>
          </div>
          <div className="mt-12">
            <ProjectsExplorer />
          </div>
        </section>

        <section aria-labelledby="yaklasim-baslik" className={`${wrap} scroll-mt-4 pb-28`} id="yaklasim">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="yaklasim-baslik">
              {c.process}
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
            <UnsplashPhoto className="grayscale" image={images.cizim} lang={lang} sizes="(min-width: 1024px) 36vw, 100vw" />
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <UnsplashPhoto className="grayscale" image={images.maket} lang={lang} sizes="(min-width: 1024px) 36vw, 100vw" />
          </div>
          <div className="flex flex-col justify-end text-[13px] leading-[1.35]">
            <p className="font-bold">{c.expTitle}</p>
            <p className="mt-3">{c.expText}</p>
            <ul className="mt-3 list-disc space-y-1 pl-4">
              {c.expList.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mt-3 font-bold">{c.expEnd}</p>
          </div>
        </section>

        <section aria-labelledby="hizmetler-baslik" className={`${wrap} scroll-mt-4 pb-28`} id="hizmetler">
          <div className={`${rule} pt-5`}>
            <h2 className={giant} id="hizmetler-baslik">
              {c.services}
            </h2>
          </div>
          <ul className="mt-16 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.serviceList.map(([t, d]) => (
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
              {c.visit}
            </h2>
            <p className="mt-8 max-w-[38ch] text-[13px] leading-[1.35]">{c.visitLead}</p>
            <div className="mt-10 aspect-[16/10] overflow-hidden">
              <UnsplashPhoto className="grayscale" image={images.merdiven} lang={lang} sizes="(min-width: 1024px) 44vw, 100vw" />
            </div>
          </div>
          <InquiryForm />
        </section>
      </main>

      <footer className={`${wrap} pb-8`}>
        <div className={`${rule} grid gap-6 pt-4 text-[13px] sm:grid-cols-3`}>
          <p className="font-bold">Etüt Mimarlık</p>
          <p>{c.disclaimer}</p>
          <p className="text-[var(--etut-muted)]">
            {c.photos}: Unsplash · {creditsOf(images).join(", ")}
          </p>
        </div>
        <p aria-hidden="true" className="mt-10 font-[family-name:var(--etut-display)] text-[clamp(6rem,27vw,26rem)] leading-[0.78] font-bold tracking-[-0.035em]">
          Etüt
        </p>
      </footer>
    </div>
  );
}
