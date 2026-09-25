import type { MetadataRoute } from "next";
import { site } from "@/content";

// Single-page site: the home page is the only URL worth indexing.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", site.url).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
