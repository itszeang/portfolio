import type { Metadata } from "next";
import { person } from "@/content";
import { DemoBar } from "@/demos/demo-bar";
import { DemoView, demoSlugs } from "@/demos/registry";
import { demoPath, getDemos, getServicePages } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";

/**
 * A live example of one service: /hizmetler/<service>/<demo> in Turkish and
 * /en/services/<service>/<demo> in English. Each demo brings its own design;
 * the DemoBar above it says the business is invented.
 */

function resolve(lang: Lang, slug: string, demoSlug: string) {
  const demo = getDemos(lang).find((d) => d.slug === demoSlug);
  const page = getServicePages(lang).find((p) => p.slug === slug);
  if (!demo || !page || page.id !== demo.service) return null;
  return { demo, page };
}

export function demoParams(lang: Lang) {
  const pages = getServicePages(lang);
  return getDemos(lang).flatMap((d) => {
    const page = pages.find((p) => p.id === d.service);
    return page ? [{ slug: page.slug, demo: d.slug }] : [];
  });
}

export function demoMetadata(lang: Lang, slug: string, demoSlug: string): Metadata {
  const r = resolve(lang, slug, demoSlug);
  if (!r) return {};
  const kind = lang === "en" ? r.demo.kind.toLowerCase() : r.demo.kind.toLocaleLowerCase("tr");
  return {
    title: lang === "en" ? `${r.demo.name} — sample ${kind} | ${person.name}` : `${r.demo.name} — örnek ${kind} | ${person.name}`,
    description: r.demo.summary,
    // Invented businesses shouldn't show up when someone searches for a real one.
    robots: { index: false, follow: true },
    alternates: { languages: { tr: demoPath("tr", r.demo), en: demoPath("en", r.demo) } },
  };
}

/** The demo page, or null when the slugs don't match a demo in this language. */
export function DemoPageView({ lang, slug, demo }: { lang: Lang; slug: string; demo: string }) {
  const r = resolve(lang, slug, demo);
  if (!r || !demoSlugs.has(r.demo.slug)) return null;
  return (
    <LangProvider lang={lang}>
      <div lang={lang}>
        <DemoBar lang={lang} otherHref={demoPath(lang === "en" ? "tr" : "en", r.demo)} serviceHref={demoPath(lang, r.demo).replace(/\/[^/]+$/, "")} serviceName={r.page.h1} />
        <DemoView lang={lang} slug={r.demo.slug} />
      </div>
    </LangProvider>
  );
}
