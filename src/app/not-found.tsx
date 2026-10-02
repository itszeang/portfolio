import type { Metadata } from "next";
import { NotFoundBody } from "@/components/not-found-body";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Page not found — Burak Alp Yahşi",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundBody />;
}
