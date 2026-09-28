// Lodos's dining room and its bookings, for the table-booking demo. Existing
// reservations are generated from the date, so every visitor sees the same
// room and Fridays really are fuller than Mondays (see `nights`).
import { nights, tray } from "./data";

export type Zone = "pencere" | "salon" | "fasil" | "sessiz" | "uzun";
export const zoneName: Record<Zone, string> = {
  pencere: "Pencere kenarı",
  salon: "Salon",
  fasil: "Fasıla yakın",
  sessiz: "Sessiz köşe",
  uzun: "Uzun masa",
};

/** A table on the plan: centre (x, y) and size in plan units (720 × 500). */
export type Table = { id: number; seats: number; min: number; zone: Zone; x: number; y: number; w: number; h: number; round?: boolean };

export const tables: Table[] = [
  { id: 1, seats: 2, min: 1, zone: "pencere", x: 100, y: 84, w: 44, h: 44, round: true },
  { id: 2, seats: 2, min: 1, zone: "pencere", x: 210, y: 84, w: 44, h: 44, round: true },
  { id: 3, seats: 2, min: 1, zone: "pencere", x: 320, y: 84, w: 44, h: 44, round: true },
  { id: 4, seats: 2, min: 1, zone: "pencere", x: 430, y: 84, w: 44, h: 44, round: true },
  { id: 5, seats: 4, min: 3, zone: "salon", x: 160, y: 200, w: 56, h: 56 },
  { id: 6, seats: 4, min: 3, zone: "salon", x: 290, y: 200, w: 56, h: 56 },
  { id: 7, seats: 4, min: 3, zone: "salon", x: 420, y: 200, w: 56, h: 56 },
  { id: 8, seats: 4, min: 3, zone: "salon", x: 160, y: 310, w: 56, h: 56 },
  { id: 9, seats: 4, min: 3, zone: "salon", x: 290, y: 310, w: 56, h: 56 },
  { id: 10, seats: 4, min: 3, zone: "salon", x: 420, y: 310, w: 56, h: 56 },
  { id: 11, seats: 6, min: 4, zone: "fasil", x: 620, y: 190, w: 96, h: 48 },
  { id: 12, seats: 6, min: 4, zone: "fasil", x: 620, y: 290, w: 96, h: 48 },
  { id: 13, seats: 10, min: 7, zone: "uzun", x: 300, y: 428, w: 300, h: 44 },
  { id: 14, seats: 2, min: 1, zone: "sessiz", x: 58, y: 255, w: 40, h: 40, round: true },
];

export const fits = (t: Table, party: number) => party >= t.min && party <= t.seats;
export const MAX_PARTY = 10;
export const GROUP = 8; // from here on: fixed menu and a deposit
export const DEPOSIT = 500;

/** A seating lasts two and a half hours; bookings start on the half hour. */
export const DURATION = 150;
export const SLOT = 30;

/** Opening hours in minutes after midnight (past midnight goes above 1440). `dow` as Date#getDay. */
export function hoursOf(dow: number) {
  if (dow === 0) return { open: 13 * 60, close: 23 * 60 };
  if (dow === 1) return { open: 18 * 60, close: 24 * 60 };
  return { open: 18 * 60, close: 25 * 60 };
}

export const hm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export type Res = { id: string; table: number; start: number; party: number; who: string; mine?: boolean };

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const guests = ["A. Y.", "M. K.", "S. D.", "E. T.", "B. Ö.", "C. A.", "D. Ş.", "G. E.", "H. U.", "İ. B.", "K. S.", "N. Ç."];

/** The bookings already in the book for a day. */
export function seedDay(iso: string, dow: number): Res[] {
  const { open, close } = hoursOf(dow);
  const busy = nights[(dow + 6) % 7].busy;
  const out: Res[] = [];
  for (const t of tables) {
    const r = rng(hash(`${iso}#${t.id}`));
    let at = open + Math.floor(r() * 3) * SLOT;
    while (at <= close - DURATION) {
      if (r() < busy * 0.75) {
        const party = t.min + Math.floor(r() * (t.seats - t.min + 1));
        out.push({ id: `${iso}-${t.id}-${at}`, table: t.id, start: at, party, who: guests[Math.floor(r() * guests.length)] });
        at += DURATION + SLOT * Math.floor(r() * 2);
      } else at += SLOT * (1 + Math.floor(r() * 2));
    }
  }
  return out;
}

export const isFree = (table: number, start: number, list: Res[]) =>
  !list.some((r) => r.table === table && r.start < start + DURATION && start < r.start + DURATION);

// --- Dates -------------------------------------------------------------------
const dayShort = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const dayLong = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export type Day = { iso: string; dow: number; short: string; long: string; date: number };

/** The next `count` days from `todayIso`, labelled for chips and the ticket. */
export function nextDays(todayIso: string, count: number): Day[] {
  const [y, m, d] = todayIso.split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const x = new Date(y, m - 1, d + i);
    const rel = i === 0 ? "Bugün" : i === 1 ? "Yarın" : null;
    return {
      iso: isoDay(x),
      dow: x.getDay(),
      date: x.getDate(),
      short: rel ?? `${dayShort[x.getDay()]} ${x.getDate()}`,
      long: `${x.getDate()} ${months[x.getMonth()]} ${dayLong[x.getDay()]}`,
    };
  });
}

/** Meze ids from the website's tray link, in tray order. */
export const trayFrom = (param: string | null) => {
  const ids = new Set((param ?? "").split(","));
  return tray.filter((m) => ids.has(m.id));
};
