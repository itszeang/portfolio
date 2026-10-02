import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceMetadata, ServicePageView, serviceSlugs } from "@/views/service-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs("tr");
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return serviceMetadata("tr", (await params).slug);
}

export default async function ServicePage({ params }: Props) {
  const view = ServicePageView({ lang: "tr", slug: (await params).slug });
  if (!view) notFound();
  return view;
}
