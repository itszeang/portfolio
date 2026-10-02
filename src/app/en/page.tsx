import type { Metadata } from "next";
import { person, site as siteTr } from "@/content";
import { site } from "@/content.en";
import { HomePage } from "@/views/home";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/en", languages: { tr: "/", en: "/en", "x-default": "/" } },
  openGraph: {
    title: site.title,
    description: site.ogDescription,
    url: "/en",
    siteName: person.name,
    locale: "en_GB",
    type: "website",
    images: [{ url: siteTr.ogImage, width: 1200, height: 630 }],
  },
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
