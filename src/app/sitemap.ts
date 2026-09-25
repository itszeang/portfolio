import type { MetadataRoute } from "next";
import { servicePages, site } from "@/content";

// The home page plus one landing page per service.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: new URL("/", site.url).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...servicePages.map((p) => ({
      url: new URL(`/hizmetler/${p.slug}`, site.url).toString(),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
