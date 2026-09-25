import type { MetadataRoute } from "next";
import { site } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: new URL(site.url).origin,
  };
}
