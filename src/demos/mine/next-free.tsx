"use client";

import { CalendarDays } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useLang } from "@/lib/lang-context";
import { freeStarts, hm, isoDay, openDays, seedAppts } from "./data";

const subscribe = () => () => {};
const clientNow = () => {
  const d = new Date();
  return `${isoDay(d)}|${d.getHours() * 60 + d.getMinutes()}`;
};
const serverNow = () => null;

/** The next free check-up with Dt. Elif, from the same book the booking uses. */
export function NextFree() {
  const lang = useLang();
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  let label = "…";
  if (now) {
    const [iso, min] = now.split("|");
    for (const d of openDays(iso, 6, lang)) {
      const starts = freeStarts(d.dow, 30, seedAppts(d.iso, d.dow, "elif"), d.offset === 0 ? Number(min) + 60 : 0);
      if (starts.length) {
        label = `${d.short}, ${hm(starts[0])}`;
        break;
      }
    }
  }
  return (
    <a className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_30px_-12px_rgba(30,42,26,.35)] hover:bg-[var(--mine-bg)]" href="#randevu">
      <span className="grid size-9 place-items-center rounded-xl bg-[var(--mine-cobalt-soft)] text-[var(--mine-cobalt)]">
        <CalendarDays aria-hidden="true" className="size-4" />
      </span>
      <span>
        <span className="block text-xs text-[var(--mine-muted)]">{lang === "en" ? "Next free check-up" : "Sıradaki boş muayene"}</span>
        <span aria-live="polite" className="block font-medium">
          {label}
        </span>
      </span>
    </a>
  );
}
