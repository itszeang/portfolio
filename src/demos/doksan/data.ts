// Doksan Halı Saha: a fictional Bursa five-a-side (7'ye 7) venue for the
// "online randevu" demo. Hourly slots, a deposit (kapora) with a 24-hour
// cancellation rule, and weekly fixed slots for teams that play every week.
// Turkish is written inline; `doksanIn` gives the English side. Team names
// stay Turkish in both: they are the venue's real (made-up) regulars.

import type { Lang } from "@/lib/i18n";

export type PitchId = "acik" | "kapali";
export const pitches: { id: PitchId; name: string; note: string }[] = [
  { id: "acik", name: "Saha 1 · Açık", note: "Işıklı, 7'ye 7, yeni çim" },
  { id: "kapali", name: "Saha 2 · Kapalı", note: "Balon saha, yağmurda da oynanır" },
];

export const HOURS = [16, 17, 18, 19, 20, 21, 22, 23, 24];
export const KAPORA = 500;
export const FIXED_OFF = 0.1; // weekly fixed slot discount

/** Price per hour: evenings after work are the busiest and the dearest. */
export function priceOf(pitch: PitchId, hour: number) {
  const base = hour >= 19 && hour <= 22 ? 2000 : hour >= 23 ? 1600 : 1400;
  return pitch === "kapali" ? base + 200 : base;
}

export const hh = (h: number) => `${String(h % 24).padStart(2, "0")}:00`;
export const tl = (n: number, lang: Lang = "tr") =>
  lang === "en" ? `₺${Math.round(n).toLocaleString("en-GB")}` : `${Math.round(n).toLocaleString("tr-TR")} ₺`;

const teams = ["Salı Beyleri", "Mahalle United", "Kasap FC", "Emekliler Kulübü", "Ofis Karması", "Dostlar Gücü", "Yıldızspor", "Kuzeyin Aslanları", "Köfteciler", "Gece Kartalları"];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Taken = { team: string; fixed: boolean; paid: boolean };

/**
 * Who already has the pitch at this hour. Fixed (weekly) teams depend only on
 * the weekday, so they come back at the same hour every week.
 */
export function takenAt(iso: string, dow: number, pitch: PitchId, hour: number): Taken | null {
  const peak = hour >= 19 && hour <= 22;
  const weekend = dow === 0 || dow === 6;
  const fixedRoll = hash(`${dow}${pitch}${hour}`) % 100;
  if (peak && !weekend && fixedRoll < 45) return { team: teams[fixedRoll % teams.length], fixed: true, paid: true };
  const roll = hash(`${iso}${pitch}${hour}`) % 100;
  const chance = (peak ? 50 : 22) + (weekend ? 18 : 0);
  if (roll < chance) return { team: teams[(roll * 7) % teams.length], fixed: false, paid: roll % 5 !== 0 };
  return null;
}

// --- Dates -------------------------------------------------------------------
const dayShort = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const dayLong = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export type Day = { iso: string; dow: number; short: string; long: string; date: Date; offset: number };

const dayShortEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayLongEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (x: Date, lang: Lang) =>
  lang === "en" ? `${dayLongEn[x.getDay()]} ${x.getDate()} ${monthsEn[x.getMonth()]}` : `${x.getDate()} ${months[x.getMonth()]} ${dayLong[x.getDay()]}`;

export function week(todayIso: string, lang: Lang = "tr"): Day[] {
  const en = lang === "en";
  const [y, m, d] = todayIso.split("-").map(Number);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(y, m - 1, d + i);
    return {
      iso: isoDay(x),
      dow: x.getDay(),
      offset: i,
      date: x,
      short: i === 0 ? (en ? "Today" : "Bugün") : i === 1 ? (en ? "Tomorrow" : "Yarın") : `${(en ? dayShortEn : dayShort)[x.getDay()]} ${x.getDate()}`,
      long: longDate(x, lang),
    };
  });
}

/** "26 Eylül Cumartesi 21:00" for the moment `hours` before a match. */
export function before(day: Day, hour: number, hours: number, lang: Lang = "tr") {
  const t = new Date(day.date);
  t.setHours(hour - hours, 0, 0, 0);
  return `${longDate(t, lang)} ${hh(t.getHours())}`;
}

// --- Line-up -----------------------------------------------------------------
/** A 7-a-side 1-2-3-1 on a vertical pitch (x, y in a 200 × 300 box). */
export const positions = [
  { key: "kaleci", label: "Kaleci", x: 100, y: 268 },
  { key: "defans1", label: "Defans", x: 62, y: 212 },
  { key: "defans2", label: "Defans", x: 138, y: 212 },
  { key: "orta1", label: "Orta saha", x: 40, y: 148 },
  { key: "orta2", label: "Orta saha", x: 100, y: 158 },
  { key: "orta3", label: "Orta saha", x: 160, y: 148 },
  { key: "forvet", label: "Forvet", x: 100, y: 80 },
];

// --- English -----------------------------------------------------------------
const PITCH_EN: Record<PitchId, { name: string; note: string }> = {
  acik: { name: "Pitch 1 · Outdoor", note: "Floodlit, 7-a-side, new turf" },
  kapali: { name: "Pitch 2 · Indoor", note: "Air-dome pitch, playable in the rain too" },
};
const POSITION_EN: Record<string, string> = { Kaleci: "Goalkeeper", Defans: "Defender", "Orta saha": "Midfielder", Forvet: "Forward" };

/** Pitches, positions and dates in one language. */
export function doksanIn(lang: Lang) {
  const en = lang === "en";
  return {
    pitches: en ? pitches.map((p) => ({ ...p, ...PITCH_EN[p.id] })) : pitches,
    positions: en ? positions.map((p) => ({ ...p, label: POSITION_EN[p.label] })) : positions,
    tl: (n: number) => tl(n, lang),
  };
}
