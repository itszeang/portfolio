"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isEnglishPath } from "@/lib/i18n";

/** The 404 page, in English for missing addresses under /en. */
export function NotFoundBody() {
  const en = isEnglishPath(usePathname() ?? "");
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-6 text-center text-white" lang={en ? "en" : "tr"}>
      <p className="font-mono text-xs tracking-[0.2em] text-[#ff85b3]">404</p>
      <h1 className="mt-4 text-balance text-4xl font-medium tracking-[-0.035em] sm:text-6xl">{en ? "This page isn't here." : "Bu sayfa burada değil."}</h1>
      <p className="mt-5 max-w-[42ch] text-base leading-7 text-white/60">
        {en ? "The link may have changed, or it never existed." : "Bağlantı değişmiş ya da hiç var olmamış olabilir."}
      </p>
      <Link
        className="mt-10 inline-flex min-h-11 items-center rounded-full bg-[#d4186e] px-6 text-sm text-white transition-colors hover:bg-[#e8227a]"
        href={en ? "/en" : "/"}
      >
        {en ? "Back to the home page" : "Ana sayfaya dön"}
      </Link>
    </main>
  );
}
