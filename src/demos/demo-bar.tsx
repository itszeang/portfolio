import Link from "next/link";
import type { Lang } from "@/lib/i18n";

/**
 * Thin strip above every demo: says plainly that the business is invented,
 * leads back to the service it demonstrates and switches language. Kept
 * neutral so it never reads as part of the demo's own design.
 */
export function DemoBar({ serviceHref, serviceName, lang = "tr", otherHref }: { serviceHref: string; serviceName: string; lang?: Lang; otherHref?: string }) {
  const en = lang === "en";
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-black px-4 py-2 text-center font-[family-name:var(--font-geist-sans)] text-[12px] leading-5 text-white/80"
      data-demo-bar=""
    >
      <span>
        <span className="text-white">{en ? "Sample project." : "Örnek proje."}</span>{" "}
        {en ? "This business isn't real; the content is for demonstration only." : "Bu işletme gerçek değil; içerik yalnızca örnek amaçlıdır."}{" "}
        <Link className="whitespace-nowrap text-[#ff85b3] underline-offset-2 hover:underline" href={serviceHref}>
          ← {serviceName} · Burak Alp Yahşi
        </Link>
      </span>
      {otherHref && (
        <Link
          className="whitespace-nowrap font-mono text-[11px] tracking-[0.08em] text-white/60 underline-offset-2 hover:text-white hover:underline"
          href={otherHref}
          hrefLang={en ? "tr" : "en"}
          lang={en ? "tr" : "en"}
        >
          {en ? "TÜRKÇE" : "ENGLISH"}
        </Link>
      )}
    </div>
  );
}
