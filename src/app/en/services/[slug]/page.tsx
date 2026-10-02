import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceMetadata, ServicePageView, serviceSlugs } from "@/views/service-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs("en");
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return serviceMetadata("en", (await params).slug);
}

export default async function ServicePageEn({ params }: Props) {
  const view = ServicePageView({ lang: "en", slug: (await params).slug });
  if (!view) notFound();
  return view;
}
