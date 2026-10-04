import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SalonSite } from "@/teklif/salon-site";
import { salonById, salons, teklifId } from "@/teklif/salons";

// Personal sample sites for salons on the prospect list. Shared by link only:
// each path ends in a random key, so editing the name in a link leads to a
// 404 rather than another salon. Not in the sitemap, kept out of search engines.

export const dynamicParams = false;

export function generateStaticParams() {
  return salons.map((s) => ({ slug: teklifId(s) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const salon = salonById((await params).slug);
  if (!salon) return {};
  return {
    title: `${salon.name} — örnek web sitesi`,
    description: `${salon.name} için hazırlanmış örnek web sitesi ve online randevu.`,
    robots: { index: false, follow: false },
  };
}

export default async function TeklifPage({ params }: { params: Promise<{ slug: string }> }) {
  const salon = salonById((await params).slug);
  if (!salon) notFound();
  return <SalonSite salon={salon} />;
}
