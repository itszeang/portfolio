// The site's content in a given language. Turkish is content.ts as it is;
// English lays the words from content.en.ts over the same structure, so
// links, images, colours and order always come from one place.
import * as tr from "@/content";
import * as en from "@/content.en";
import type { Demo, Project, Service, ServicePage } from "@/content";
import { servicesBase, type Lang } from "@/lib/i18n";

export function getServices(lang: Lang): Service[] {
  return tr.services.map((s) => (lang === "en" ? { ...s, ...en.services[s.id] } : s));
}

export function getServicePages(lang: Lang): ServicePage[] {
  return tr.servicePages.map((p) => (lang === "en" ? { ...p, ...en.servicePages[p.id], keyword: en.servicePages[p.id].h1.toLowerCase() } : p));
}

export function getDemos(lang: Lang): Demo[] {
  return tr.demos.map((d) => (lang === "en" ? { ...d, ...en.demos[d.slug] } : d));
}

export function getSectors(lang: Lang) {
  return tr.sectors.map((s) => (lang === "en" ? { ...s, name: en.sectors[s.id] } : s));
}

/** My own products that are switched on, in the language. */
export function getProjects(lang: Lang): Project[] {
  return tr.visibleProjects.map((p) => {
    if (lang === "tr") return p;
    const e = en.projects[p.id];
    return {
      ...p,
      ...e,
      links: p.links.map((l, i) => ({ ...l, label: e.links[i] ?? l.label })),
      siteImages: p.siteImages.map((img, i) => ({ ...img, alt: e.siteImages[i] ?? img.alt })),
    };
  });
}

/** A service's own page, e.g. /hizmetler/kurumsal-web-sitesi or /en/services/business-website. */
export function servicePagePath(lang: Lang, serviceId: string) {
  const page = getServicePages(lang).find((p) => p.id === serviceId);
  return page ? `${servicesBase(lang)}/${page.slug}` : lang === "en" ? "/en" : "/";
}

/** A demo's page in the language. */
export const demoPath = (lang: Lang, demo: Pick<Demo, "slug" | "service">) => `${servicePagePath(lang, demo.service)}/${demo.slug}`;

/** The same service page in the other language, matched by service id. */
export function counterpartServicePath(slug: string, from: Lang) {
  const page = getServicePages(from).find((p) => p.slug === slug);
  return page ? servicePagePath(from === "en" ? "tr" : "en", page.id) : undefined;
}
