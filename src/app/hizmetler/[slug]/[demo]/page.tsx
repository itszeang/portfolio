import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demos, person, servicePages } from "@/content";
import { DemoBar } from "@/demos/demo-bar";
import { DemoView, demoSlugs } from "@/demos/registry";

/**
 * A live example of one service (/hizmetler/<service>/<demo>). Each demo
 * brings its own design; the DemoBar above it says the business is invented.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return demos.flatMap((d) => {
    const page = servicePages.find((p) => p.id === d.service);
    return page ? [{ slug: page.slug, demo: d.slug }] : [];
  });
}

type Props = { params: Promise<{ slug: string; demo: string }> };

function resolve(slug: string, demoSlug: string) {
  const demo = demos.find((d) => d.slug === demoSlug);
  const page = servicePages.find((p) => p.slug === slug);
  if (!demo || !page || page.id !== demo.service) return null;
  return { demo, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, demo } = await params;
  const r = resolve(slug, demo);
  if (!r) return {};
  return {
    title: `${r.demo.name} — örnek ${r.demo.kind.toLocaleLowerCase("tr")} | ${person.name}`,
    description: r.demo.summary,
    // Invented businesses shouldn't show up when someone searches for a real one.
    robots: { index: false, follow: true },
  };
}

export default async function DemoPage({ params }: Props) {
  const { slug, demo } = await params;
  const r = resolve(slug, demo);
  if (!r || !demoSlugs.has(r.demo.slug)) notFound();
  return (
    <>
      <DemoBar serviceHref={`/hizmetler/${r.page.slug}`} serviceName={r.page.h1} />
      <DemoView slug={r.demo.slug} />
    </>
  );
}
