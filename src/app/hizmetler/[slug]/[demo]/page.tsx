import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoMetadata, DemoPageView, demoParams } from "@/views/demo-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoParams("tr");
}

type Props = { params: Promise<{ slug: string; demo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, demo } = await params;
  return demoMetadata("tr", slug, demo);
}

export default async function DemoPage({ params }: Props) {
  const { slug, demo } = await params;
  const view = DemoPageView({ lang: "tr", slug, demo });
  if (!view) notFound();
  return view;
}
