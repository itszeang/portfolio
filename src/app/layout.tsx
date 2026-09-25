import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/fraunces";
import { Analytics, CONSENT_SCRIPT } from "@/components/analytics";
import { contact, person, site, socials } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: person.name, url: site.url }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.ogDescription,
    url: site.url,
    siteName: "Burak Alp Yahşi",
    locale: "tr_TR",
    type: "website",
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@itszeang", creator: "@itszeang" },
  // Search-engine ownership checks, from each engine's webmaster tool. Google's
  // is public anyway, so it lives here (public/google*.html verifies it too);
  // the others can be set as env vars in Vercel, unset ones are skipped.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "SbeLiA_GASCml8mkOis6gHdawydON-aST9dIMZxVWxo",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

// Tells search engines who the site is about, for richer results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}#website`,
      url: site.url,
      name: "Burak Alp Yahşi",
      inLanguage: site.language,
      publisher: { "@id": `${site.url}#person` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}#person`,
      name: person.name,
      url: site.url,
      image: new URL(site.ogImage, site.url).toString(),
      email: `mailto:${contact.email}`,
      jobTitle: "Ürün geliştirici",
      description: site.description,
      address: { "@type": "PostalAddress", addressCountry: "TR" },
      sameAs: socials.map((s) => s.href),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: CONSENT_SCRIPT sets data-consent on <html>
    // before React hydrates.
    <html className="dark" lang="tr" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {CONSENT_SCRIPT && <script dangerouslySetInnerHTML={{ __html: CONSENT_SCRIPT }} />}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
          type="application/ld+json"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
