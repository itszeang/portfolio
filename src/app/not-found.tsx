import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı — Burak Alp Yahşi",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-6 text-center text-white">
      <p className="font-mono text-xs tracking-[0.2em] text-[#ff85b3]">404</p>
      <h1 className="mt-4 text-balance text-4xl font-medium tracking-[-0.035em] sm:text-6xl">
        Bu sayfa burada değil.
      </h1>
      <p className="mt-5 max-w-[42ch] text-base leading-7 text-white/60">
        Bağlantı değişmiş ya da hiç var olmamış olabilir.
      </p>
      <Link
        className="mt-10 inline-flex min-h-11 items-center rounded-full bg-[#d4186e] px-6 text-sm text-white transition-colors hover:bg-[#e8227a]"
        href="/"
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
