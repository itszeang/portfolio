import type { MetadataRoute } from "next";
import { servicePages, site } from "@/content";
import { servicePagePath } from "@/lib/content";

// The home page plus one landing page per service, each in Turkish and
// English, with each language pointing at the other (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const abs = (path: string) => new URL(path, site.url).toString();
  const pair = (tr: string, en: string, priority: number) =>
    [tr, en].map((path) => ({
      url: abs(path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: { tr: abs(tr), en: abs(en) } },
    }));
  return [...pair("/", "/en", 1), ...servicePages.flatMap((p) => pair(servicePagePath("tr", p.id), servicePagePath("en", p.id), 0.8))];
}
