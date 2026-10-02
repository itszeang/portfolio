import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoMetadata, DemoPageView, demoParams } from "@/views/demo-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoParams("en");
}

type Props = { params: Promise<{ slug: string; demo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, demo } = await params;
  return demoMetadata("en", slug, demo);
}

export default async function DemoPageEn({ params }: Props) {
  const { slug, demo } = await params;
  const view = DemoPageView({ lang: "en", slug, demo });
  if (!view) notFound();
  return view;
}
