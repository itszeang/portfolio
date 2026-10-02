import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DemoCard } from "@/components/demo-card";
import { ProjectCard } from "@/components/project-card";
import * as tr from "@/content";
import * as en from "@/content.en";
import { getDemos, getProjects, getSectors, getServicePages, getServices, servicePagePath } from "@/lib/content";
import { homeHref, type Lang } from "@/lib/i18n";

/**
 * One landing page per service, each aimed at a single search term (see
 * servicePages in content.ts). Plain server-rendered markup with no client
 * JavaScript of its own, so these pages load fast on phones. Turkish lives at
 * /hizmetler/<slug>, English at /en/services/<slug>.
 */

const COPY = {
  tr: {
    mainNav: "Ana menü",
    services: "Hizmetler",
    work: "Projeler",
    crumbs: "Konum",
    home: "Ana sayfa",
    quote: "Teklif iste",
    seeWork: "Projeleri gör",
    whatIDo: "Ne yapıyorum?",
    examples: "Örnek çalışmalar",
    examplesLead: "Kurgusal işletmeler için tasarlayıp geliştirdiğim, tarayıcıda açıp deneyebileceğin çalışan örnekler.",
    included: "Neler dahil?",
    audience: "Kimler için?",
    process: "Nasıl çalışıyoruz?",
    sample: "Örnek proje",
    faq: "Sık sorulan sorular",
    contactLead: "İhtiyacını kısaca yaz; kapsamı ve sonraki adımı birlikte netleştirelim.",
    others: "DİĞER HİZMETLER",
    subject: (h1: string) => `${h1} hakkında`,
    switchLabel: "English version",
    switchText: "EN",
  },
  en: {
    mainNav: "Main menu",
    services: "Services",
    work: "Work",
    crumbs: "Breadcrumb",
    home: "Home",
    quote: "Request a quote",
    seeWork: "See the work",
    whatIDo: "What I do",
    examples: "Sample work",
    examplesLead: "Working samples I designed and built for fictional businesses. Open them and try them in your browser.",
    included: "What's included",
    audience: "Who it's for",
    process: "How we work",
    sample: "Sample project",
    faq: "Frequently asked questions",
    contactLead: "Write a few lines about what you need; we'll pin down the scope and the next step together.",
    others: "OTHER SERVICES",
    subject: (h1: string) => `About: ${h1}`,
    switchLabel: "Türkçe sürüm",
    switchText: "TR",
  },
} as const;

const pageFor = (lang: Lang, slug: string) => getServicePages(lang).find((p) => p.slug === slug);

export const serviceSlugs = (lang: Lang) => getServicePages(lang).map((p) => ({ slug: p.slug }));

export function serviceMetadata(lang: Lang, slug: string): Metadata {
  const page = pageFor(lang, slug);
  if (!page) return {};
  const path = servicePagePath(lang, page.id);
  const title = `${page.title} | ${tr.person.name}`;
  return {
    title,
    description: page.description,
    alternates: { canonical: path, languages: { tr: servicePagePath("tr", page.id), en: servicePagePath("en", page.id), "x-default": servicePagePath("tr", page.id) } },
    openGraph: {
      title,
      description: page.description,
      url: path,
      siteName: tr.person.name,
      locale: lang === "en" ? "en_GB" : "tr_TR",
      type: "website",
      images: [{ url: tr.site.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: page.description },
  };
}

/** The service page for a slug in the language; undefined when there is none. */
export function ServicePageView({ lang, slug }: { lang: Lang; slug: string }) {
  const page = pageFor(lang, slug);
  if (!page) return null;
  const c = COPY[lang];
  const isEn = lang === "en";
  const home = homeHref(lang);
  const pages = getServicePages(lang);
  const service = getServices(lang).find((s) => s.id === page.id)!;
  const project = page.related ? getProjects(lang).find((p) => p.id === page.related) : undefined;
  const others = pages.filter((p) => p.slug !== page.slug);
  const examples = getDemos(lang).filter((d) => d.service === page.id);
  const steps = isEn ? en.approach.steps : tr.approach.steps;
  const contactHeading = isEn ? en.contact.heading : tr.contact.heading;
  const url = new URL(servicePagePath(lang, page.id), tr.site.url).toString();
  const mail = `mailto:${tr.contact.email}?subject=${encodeURIComponent(c.subject(page.h1))}`;
  const upper = (s: string) => (isEn ? s.toUpperCase() : s.toLocaleUpperCase("tr"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.h1,
        serviceType: page.keyword,
        description: page.description,
        url,
        provider: { "@id": `${tr.site.url}#person` },
        areaServed: { "@type": "Country", name: "Türkiye" },
        availableLanguage: ["tr", "en"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.home, item: new URL(home, tr.site.url).toString() },
          { "@type": "ListItem", position: 2, name: c.services, item: `${new URL(home, tr.site.url).toString()}#hizmetler` },
          { "@type": "ListItem", position: 3, name: page.h1, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white" lang={lang}>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link className="inline-flex min-h-11 items-center text-sm font-semibold tracking-[-0.02em]" href={home}>
          {tr.person.name}
        </Link>
        <nav aria-label={c.mainNav} className="flex items-center gap-5 text-sm">
          <Link className="hidden min-h-11 items-center text-white/68 transition-colors hover:text-white sm:inline-flex" href={`${home}#hizmetler`}>
            {c.services}
          </Link>
          <Link className="hidden min-h-11 items-center text-white/68 transition-colors hover:text-white sm:inline-flex" href={`${home}#projeler`}>
            {c.work}
          </Link>
          <Link
            aria-label={c.switchLabel}
            className="inline-flex min-h-11 items-center font-mono text-xs tracking-[0.08em] text-white/60 transition-colors hover:text-white"
            href={servicePagePath(isEn ? "tr" : "en", page.id)}
            hrefLang={isEn ? "tr" : "en"}
            lang={isEn ? "tr" : "en"}
          >
            {c.switchText}
          </Link>
          <a className="inline-flex min-h-11 items-center gap-1.5 font-medium" href={mail}>
            {isEn ? en.contact.cta : tr.contact.cta}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pt-10 pb-24 sm:px-8 sm:pt-16">
        <nav aria-label={c.crumbs} className="font-mono text-xs tracking-[0.04em] text-white/50">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition-colors hover:text-white" href={home}>
                {c.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className="transition-colors hover:text-white" href={`${home}#hizmetler`}>
                {c.services}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#ff85b3]">
              {page.h1}
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-balance text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.045em]">{page.h1}</h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-8 text-white/72">{page.lead}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d4186e] px-6 text-sm text-white shadow-[0_10px_34px_rgba(232,34,122,0.35)] transition-colors hover:bg-[#e8227a]"
            href={mail}
          >
            {c.quote}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <Link
            className="inline-flex min-h-11 items-center rounded-full border border-white/18 px-6 text-sm text-white/80 transition-colors hover:text-white"
            href={`${home}#projeler`}
          >
            {c.seeWork}
          </Link>
        </div>

        <section aria-labelledby="ne-yapiyorum" className="mt-20">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="ne-yapiyorum">
            {c.whatIDo}
          </h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-white/72">
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {examples.length > 0 && (
          <section aria-labelledby="ornekler" className="mt-16">
            <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="ornekler">
              {c.examples}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{c.examplesLead}</p>
            {page.id === "web" ? (
              // Websites grow by sector, so they are grouped under one.
              getSectors(lang)
                .map((s) => ({ s, list: examples.filter((d) => d.sector === s.id) }))
                .filter((g) => g.list.length > 0)
                .map(({ s, list }) => (
                  <div className="mt-6" key={s.id}>
                    <h3 className="font-mono text-xs tracking-[0.06em] text-white/50">{upper(s.name)}</h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      {list.map((d) => (
                        <DemoCard demo={d} key={d.slug} lang={lang} sizes="(min-width: 640px) 360px, 100vw" />
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {examples.map((d) => (
                  <DemoCard demo={d} key={d.slug} lang={lang} sizes="(min-width: 640px) 360px, 100vw" />
                ))}
              </div>
            )}
          </section>
        )}

        <section aria-labelledby="neler-dahil" className="mt-16">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="neler-dahil">
            {c.included}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-6 text-white/85" key={item}>
                <span aria-hidden="true" className="mr-2 text-[#ff85b3]">
                  ●
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="kimler-icin" className="mt-16">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="kimler-icin">
            {c.audience}
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-white/72">
            {page.audience.map((a) => (
              <li className="flex gap-3" key={a}>
                <span aria-hidden="true" className="text-[#ff85b3]">
                  →
                </span>
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="surec" className="mt-16">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="surec">
            {c.process}
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {steps.map((step, i) => (
              <li className="rounded-2xl border border-white/10 p-5" key={step.name}>
                <p className="font-mono text-xs tracking-[0.06em] text-[#ff85b3]">
                  {String(i + 1).padStart(2, "0")} · {step.name}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {project && (
          <section aria-labelledby="ornek-proje" className="mt-16">
            <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="ornek-proje">
              {c.sample}: {project.name}
            </h2>
            <p className="mt-5 text-base leading-8 text-white/72">{project.solution}</p>
            <div className="mt-6 sm:w-[calc(50%-0.5rem)]">
              <ProjectCard lang={lang} project={project} sizes="(min-width: 640px) 360px, 100vw" />
            </div>
          </section>
        )}

        <section aria-labelledby="sss" className="mt-16">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="sss">
            {c.faq}
          </h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {page.faq.map((f) => (
              <details className="group py-5" key={f.q}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  <h3>{f.q}</h3>
                  <span aria-hidden="true" className="text-[#ff85b3] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center sm:px-10">
          <h2 className="text-balance text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            {contactHeading[0]} <span className="text-[#ff85b3]">{contactHeading[1]}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-sm leading-7 text-white/65">{c.contactLead}</p>
          <a
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d4186e] px-6 text-sm text-white transition-colors hover:bg-[#e8227a]"
            href={mail}
          >
            {tr.contact.email}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </section>

        <nav aria-labelledby="diger-hizmetler" className="mt-20">
          <h2 className="font-mono text-xs tracking-[0.08em] text-white/50" id="diger-hizmetler">
            {c.others}
          </h2>
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  className="flex min-h-14 items-center justify-between gap-4 text-base transition-colors hover:text-[#ff85b3]"
                  href={servicePagePath(lang, o.id)}
                >
                  {o.h1}
                  <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-8 text-xs text-white/46 sm:px-8">
        <span>{tr.site.copyright}</span>
        <Link className="inline-flex min-h-11 items-center transition-colors hover:text-white" href={home}>
          {c.home}
        </Link>
      </footer>
    </div>
  );
}
