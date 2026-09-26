"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BOOKING_PATH, dayNames, freeSlots, hhmm, hours, isoDay, loadBookings, services, staff } from "./data";

// Today's openings depend on the visitor's clock, so they are computed in the
// browser; the server renders a same-sized placeholder.
const subscribe = () => () => {};
const useNow = () => useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 60000), () => 0);

/** The next day that is open and still has time left, starting today. */
function nextOpenDay(now: Date) {
  for (let i = 0; i < 8; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const h = hours[d.getDay()];
    if (!h) continue;
    if (i === 0 && now.getHours() * 60 + now.getMinutes() > h.close - 90) continue;
    return { date: d, offset: i };
  }
  return null;
}

const picks = [
  { staffId: "ece", serviceId: "klasik-cilt" },
  { staffId: "selin", serviceId: "kas-tasarimi" },
  { staffId: "deniz", serviceId: "manikur" },
];

export function TodaySlots() {
  const minute = useNow();
  if (!minute) return <div aria-hidden="true" className="h-[292px] rounded-[28px] bg-[var(--nara-paper)]/60" />;

  const now = new Date(minute * 60000);
  const next = nextOpenDay(now);
  if (!next) return null;
  const bookings = loadBookings();
  const label = next.offset === 0 ? "Bugün" : next.offset === 1 ? "Yarın" : dayNames[next.date.getDay()];

  return (
    <div className="rounded-[28px] bg-[var(--nara-paper)] p-6 shadow-[0_30px_60px_-30px_rgba(43,24,48,0.35)] sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-[family-name:var(--nara-display)] text-2xl">{label} boş saatler</p>
        <p className="text-xs text-[var(--nara-muted)]">
          {next.date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
        </p>
      </div>
      <ul className="mt-5 space-y-4">
        {picks.map(({ staffId, serviceId }) => {
          const person = staff.find((s) => s.id === staffId)!;
          const service = services.find((s) => s.id === serviceId)!;
          const slots = freeSlots(next.date, staffId, service.minutes, bookings, now).slice(0, 4);
          return (
            <li key={staffId}>
              <p className="text-sm">
                <span className="font-semibold">{person.name}</span>
                <span className="text-[var(--nara-muted)]"> · {person.role}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {slots.length === 0 && <span className="text-sm text-[var(--nara-muted)]">Bu gün dolu.</span>}
                {slots.map((t) => (
                  <Link
                    className="inline-flex min-h-10 items-center rounded-full bg-[var(--nara-butter)] px-4 text-sm font-semibold tabular-nums text-[var(--nara-ink)] transition-colors hover:bg-[var(--nara-rose)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nara-rose)]"
                    href={`${BOOKING_PATH}?service=${service.id}&staff=${staffId}&day=${isoDay(next.date)}&time=${t}`}
                    key={t}
                  >
                    {hhmm(t)}
                  </Link>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-xs text-[var(--nara-muted)]">Saate dokun, randevun o saatle açılsın.</p>
    </div>
  );
}
