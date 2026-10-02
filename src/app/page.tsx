import type { Metadata } from "next";
import { HomePage } from "@/views/home";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { tr: "/", en: "/en", "x-default": "/" } },
};

export default function Home() {
  return <HomePage lang="tr" />;
}
