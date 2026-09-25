import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { approach, contact, person, projects, servicePages, services, site } from "@/content";

/**
 * One landing page per service, each aimed at a single search term (see
 * servicePages in content.ts). Plain server-rendered markup with no client
 * JavaScript of its own, so these pages load fast on phones.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const pageFor = (slug: string) => servicePages.find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pageFor((await params).slug);
  if (!page) return {};
  const path = `/hizmetler/${page.slug}`;
  const title = `${page.title} | ${person.name}`;
  return {
    title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: page.description,
      url: path,
      siteName: person.name,
      locale: "tr_TR",
      type: "website",
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: page.description },
  };
}

export default async function ServicePage({ params }: Props) {
  const page = pageFor((await params).slug);
  if (!page) notFound();
  const service = services.find((s) => s.id === page.id)!;
  const project = page.related ? projects.find((p) => p.id === page.related) : undefined;
  const others = servicePages.filter((p) => p.slug !== page.slug);
  const url = new URL(`/hizmetler/${page.slug}`, site.url).toString();
  const mail = `mailto:${contact.email}?subject=${encodeURIComponent(`${page.h1} hakkında`)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.h1,
        serviceType: page.keyword,
        description: page.description,
        url,
        provider: { "@id": `${site.url}#person` },
        areaServed: { "@type": "Country", name: "Türkiye" },
        availableLanguage: "tr",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: site.url },
          { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${site.url}#hizmetler` },
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
    <div className="min-h-[100dvh] bg-black text-white">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link className="inline-flex min-h-11 items-center text-sm font-semibold tracking-[-0.02em]" href="/">
          {person.name}
        </Link>
        <nav aria-label="Ana menü" className="flex items-center gap-5 text-sm">
          <Link className="hidden min-h-11 items-center text-white/68 transition-colors hover:text-white sm:inline-flex" href="/#hizmetler">
            Hizmetler
          </Link>
          <Link className="hidden min-h-11 items-center text-white/68 transition-colors hover:text-white sm:inline-flex" href="/#projeler">
            Projeler
          </Link>
          <a className="inline-flex min-h-11 items-center gap-1.5 font-medium" href={mail}>
            {contact.cta}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pt-10 pb-24 sm:px-8 sm:pt-16">
        <nav aria-label="Konum" className="font-mono text-xs tracking-[0.04em] text-white/50">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition-colors hover:text-white" href="/">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className="transition-colors hover:text-white" href="/#hizmetler">
                Hizmetler
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#ff85b3]">
              {page.h1}
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-balance text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.045em]">
          {page.h1}
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-8 text-white/72">{page.lead}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d4186e] px-6 text-sm text-white shadow-[0_10px_34px_rgba(232,34,122,0.35)] transition-colors hover:bg-[#e8227a]"
            href={mail}
          >
            Teklif iste
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <Link
            className="inline-flex min-h-11 items-center rounded-full border border-white/18 px-6 text-sm text-white/80 transition-colors hover:text-white"
            href="/#projeler"
          >
            Projeleri gör
          </Link>
        </div>

        <section aria-labelledby="ne-yapiyorum" className="mt-20">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="ne-yapiyorum">
            Ne yapıyorum?
          </h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-white/72">
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="neler-dahil" className="mt-16">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="neler-dahil">
            Neler dahil?
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
            Kimler için?
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
            Nasıl çalışıyoruz?
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {approach.steps.map((step, i) => (
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
              Örnek proje: {project.name}
            </h2>
            <p className="mt-5 text-base leading-8 text-white/72">
              {project.summary} {project.solution}
            </p>
            {project.links[0] && (
              <a
                className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm text-[#ff85b3] transition-colors hover:text-white"
                href={project.links[0].href}
                rel="noreferrer"
                target="_blank"
              >
                {project.links[0].label}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            )}
          </section>
        )}

        <section aria-labelledby="sss" className="mt-16">
          <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl" id="sss">
            Sık sorulan sorular
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
            {contact.heading[0]} <span className="text-[#ff85b3]">{contact.heading[1]}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-sm leading-7 text-white/65">
            İhtiyacını kısaca yaz; kapsamı ve sonraki adımı birlikte netleştirelim.
          </p>
          <a
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d4186e] px-6 text-sm text-white transition-colors hover:bg-[#e8227a]"
            href={mail}
          >
            {contact.email}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </section>

        <nav aria-labelledby="diger-hizmetler" className="mt-20">
          <h2 className="font-mono text-xs tracking-[0.08em] text-white/50" id="diger-hizmetler">
            DİĞER HİZMETLER
          </h2>
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  className="flex min-h-14 items-center justify-between gap-4 text-base transition-colors hover:text-[#ff85b3]"
                  href={`/hizmetler/${o.slug}`}
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
        <span>{site.copyright}</span>
        <Link className="inline-flex min-h-11 items-center transition-colors hover:text-white" href="/">
          Ana sayfa
        </Link>
      </footer>
    </div>
  );
}
