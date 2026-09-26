// Nara Studio: a fictional beauty studio used for two demos (its website and
// its booking app). Everything here is made up and labelled as a demo on screen.

export type Category = "cilt" | "kas" | "tirnak";

export const categories: { id: Category; name: string; note: string }[] = [
  { id: "cilt", name: "Cilt bakımı", note: "Cildinin ihtiyacına göre, önce kısa bir analizle." },
  { id: "kas", name: "Kaş ve kirpik", note: "Yüzüne göre çizilen, doğal duran şekiller." },
  { id: "tirnak", name: "Tırnak", note: "Hijyenik, tek kullanımlık setlerle." },
];

export type Service = { id: string; category: Category; name: string; minutes: number; price: number };

export const services: Service[] = [
  { id: "klasik-cilt", category: "cilt", name: "Klasik cilt bakımı", minutes: 60, price: 1200 },
  { id: "hydrafacial", category: "cilt", name: "Hydrafacial", minutes: 45, price: 1800 },
  { id: "leke-bakimi", category: "cilt", name: "Leke bakımı", minutes: 75, price: 1650 },
  { id: "kas-tasarimi", category: "kas", name: "Kaş tasarımı", minutes: 30, price: 450 },
  { id: "kas-laminasyonu", category: "kas", name: "Kaş laminasyonu", minutes: 45, price: 750 },
  { id: "kirpik-lifting", category: "kas", name: "Kirpik lifting", minutes: 60, price: 950 },
  { id: "manikur", category: "tirnak", name: "Manikür", minutes: 45, price: 500 },
  { id: "kalici-oje", category: "tirnak", name: "Kalıcı oje", minutes: 60, price: 650 },
  { id: "pedikur", category: "tirnak", name: "Pedikür", minutes: 60, price: 700 },
];

export type Staff = { id: string; name: string; role: string; category: Category };

export const staff: Staff[] = [
  { id: "ece", name: "Ece", role: "Cilt bakım uzmanı", category: "cilt" },
  { id: "selin", name: "Selin", role: "Kaş ve kirpik uzmanı", category: "kas" },
  { id: "deniz", name: "Deniz", role: "Tırnak uzmanı", category: "tirnak" },
];

/** Opening hours per weekday (0 = Sunday). null = closed. */
export const hours: ({ open: number; close: number } | null)[] = [
  { open: 11 * 60, close: 18 * 60 },
  null,
  { open: 10 * 60, close: 20 * 60 },
  { open: 10 * 60, close: 20 * 60 },
  { open: 10 * 60, close: 20 * 60 },
  { open: 10 * 60, close: 20 * 60 },
  { open: 10 * 60, close: 20 * 60 },
];

export const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
export const dayShort = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;
export const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Deterministic "already booked" pattern, so the calendar looks lived-in and
// the same slot stays busy between visits.
function noise(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

export type Booking = {
  id: string;
  day: string;
  start: number;
  minutes: number;
  serviceId: string;
  staffId: string;
  name: string;
  phone: string;
};

/**
 * Free start times (minutes after midnight) on a 30-minute grid for one staff
 * member, leaving room for the whole treatment before closing.
 */
export function freeSlots(date: Date, staffId: string, minutes: number, bookings: Booking[], now = new Date()) {
  const h = hours[date.getDay()];
  if (!h) return [];
  const day = isoDay(date);
  const isToday = day === isoDay(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const taken = bookings.filter((b) => b.day === day && b.staffId === staffId);
  const out: number[] = [];
  for (let t = h.open; t + minutes <= h.close; t += 30) {
    if (isToday && t <= nowMin + 30) continue;
    let busy = false;
    for (let s = t; s < t + minutes; s += 30) if (noise(`${day}|${staffId}|${s}`) < 0.38) busy = true;
    if (taken.some((b) => t < b.start + b.minutes && b.start < t + minutes)) busy = true;
    if (!busy) out.push(t);
  }
  return out;
}

/** Half-hour blocks already taken by the demo's invented customers (panel view). */
export function sampleBusy(date: Date, staffId: string) {
  const h = hours[date.getDay()];
  if (!h) return [];
  const day = isoDay(date);
  const out: number[] = [];
  for (let t = h.open; t < h.close; t += 30) if (noise(`${day}|${staffId}|${t}`) < 0.38) out.push(t);
  return out;
}

export const BOOKINGS_KEY = "nara-demo-bookings";

export function loadBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBookings(list: Booking[]) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  } catch {
    // Storage blocked: the booking lives for this page view only.
  }
}

export const BOOKING_PATH = "/hizmetler/online-randevu-sistemi/nara-randevu";
export const SITE_PATH = "/hizmetler/kurumsal-web-sitesi/nara-studio";
