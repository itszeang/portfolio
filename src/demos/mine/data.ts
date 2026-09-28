// Mine Ağız ve Diş Sağlığı Polikliniği: a fictional Ankara dental practice for
// the "online randevu" demo. Health services may not be advertised in Turkey,
// so there are no prices, promises or patient stories here: only visit types,
// durations and the practical questions a clinic asks before a visit.

export type DoctorId = "elif" | "mert" | "zeynep";
export type Doctor = { id: DoctorId; name: string; role: string; short: string; days: number[] };

/** `days` uses Date#getDay (0 = Sunday). */
export const doctors: Doctor[] = [
  { id: "elif", name: "Dt. Elif Karataş", short: "Dt. Elif", role: "Diş hekimi", days: [1, 2, 3, 4, 5, 6] },
  { id: "mert", name: "Uzm. Dt. Mert Aydoğan", short: "Uzm. Dt. Mert", role: "Endodonti uzmanı (kanal tedavisi)", days: [1, 3, 5] },
  { id: "zeynep", name: "Uzm. Dt. Zeynep Tunalı", short: "Uzm. Dt. Zeynep", role: "Pedodonti uzmanı (çocuk diş hekimliği)", days: [2, 4, 6] },
];

export type VisitId = "kontrol" | "temizlik" | "agri" | "kirik" | "kanal" | "cocuk";
export type Visit = { id: VisitId; name: string; hint: string; minutes: number; who: DoctorId[]; chart: "adult" | "child" | null; triage?: boolean };

export const visits: Visit[] = [
  { id: "kontrol", name: "Muayene ve kontrol", hint: "Uzun zamandır gitmediyseniz buradan başlayın.", minutes: 30, who: ["elif"], chart: null },
  { id: "temizlik", name: "Diş taşı temizliği", hint: "Muayeneyle birlikte yapılır.", minutes: 45, who: ["elif"], chart: null },
  { id: "agri", name: "Ağrı ya da hassasiyet", hint: "Birkaç soruyla ne kadar acil olduğuna bakalım.", minutes: 30, who: ["elif", "mert"], chart: "adult", triage: true },
  { id: "kirik", name: "Kırık diş ya da düşen dolgu", hint: "Hangi diş olduğunu işaretleyebilirsiniz.", minutes: 30, who: ["elif"], chart: "adult" },
  { id: "kanal", name: "Devam eden kanal tedavisi", hint: "Sonraki seansınız için.", minutes: 60, who: ["mert"], chart: "adult" },
  { id: "cocuk", name: "Çocuğum için", hint: "Çocuk diş hekimimiz bakar.", minutes: 30, who: ["zeynep"], chart: "child" },
];

// --- Teeth (FDI numbering) ---------------------------------------------------
const adultNames = ["orta kesici", "yan kesici", "köpek dişi", "1. küçük azı", "2. küçük azı", "1. büyük azı", "2. büyük azı", "20 yaş dişi"];
const childNames = ["orta kesici", "yan kesici", "köpek dişi", "1. süt azı", "2. süt azı"];
const quadrantName: Record<number, string> = { 1: "Sağ üst", 2: "Sol üst", 3: "Sol alt", 4: "Sağ alt", 5: "Sağ üst", 6: "Sol üst", 7: "Sol alt", 8: "Sağ alt" };

/** "Sağ üst 1. büyük azı" for 16. */
export function toothName(fdi: number) {
  const q = Math.floor(fdi / 10);
  const n = fdi % 10;
  return `${quadrantName[q]} ${(q > 4 ? childNames : adultNames)[n - 1]}`;
}

// --- Triage ------------------------------------------------------------------
export type Triage = {
  since: "bugun" | "gunler" | "haftalar" | null;
  pain: number;
  swelling: boolean | null;
  night: boolean | null;
  danger: boolean | null;
};
export const emptyTriage: Triage = { since: null, pain: 4, swelling: null, night: null, danger: null };

export type Urgency = "danger" | "urgent" | "endo" | "normal";
/** Not a diagnosis: only decides how soon, and with whom, to offer a slot. */
export function urgency(t: Triage): Urgency {
  if (t.danger) return "danger";
  if (t.swelling || t.pain >= 7) return "urgent";
  if (t.night) return "endo";
  return "normal";
}

// --- Health questions (special-category data: asked only with explicit consent) ---
export type HealthKey = "kan" | "alerji" | "hamile" | "kalp" | "diyabet" | "ilac";
export const healthQuestions: { key: HealthKey; q: string; detail?: string; adultOnly?: boolean; flag: string }[] = [
  { key: "kan", q: "Kan sulandırıcı ilaç kullanıyor musunuz?", flag: "Kanama riski: işlem öncesi ilacı sorun." },
  { key: "alerji", q: "Bilinen bir alerjiniz var mı?", detail: "Örneğin penisilin, lokal anestezi, lateks", flag: "Alerji" },
  { key: "hamile", q: "Hamile misiniz ya da olabilir misiniz?", adultOnly: true, flag: "Hamilelik: röntgen ve ilaç seçimine dikkat." },
  { key: "kalp", q: "Kalp hastalığınız ya da yüksek tansiyonunuz var mı?", flag: "Kalp / tansiyon: işlem öncesi tansiyon ölçülsün." },
  { key: "diyabet", q: "Diyabetiniz var mı?", flag: "Diyabet: randevu saatini öğüne göre ayarlayın." },
  { key: "ilac", q: "Düzenli kullandığınız başka bir ilaç var mı?", detail: "İlacın adı", flag: "Düzenli ilaç" },
];

// --- Schedule ----------------------------------------------------------------
export const BLOCK = 30;
/** Working hours in minutes; lunch 13:00–14:00 on weekdays. Sunday closed. */
export function hoursOf(dow: number) {
  if (dow === 0) return null;
  if (dow === 6) return { open: 10 * 60, close: 15 * 60, lunch: null };
  return { open: 9 * 60, close: 19 * 60, lunch: [13 * 60, 14 * 60] as const };
}
/** Kept free every weekday for patients in pain; offered only after triage. */
export const EMERGENCY = [9 * 60, 17 * 60 + 30];

export const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export type Appt = { id: string; doctor: DoctorId; day: string; start: number; minutes: number; visit: VisitId; who: string; mine?: boolean };

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

const initials = ["A. K.", "B. S.", "C. T.", "D. Y.", "E. Ö.", "F. A.", "G. B.", "H. Ç.", "İ. D.", "K. E."];

/** Appointments already in a doctor's book for a day, generated from the date. */
export function seedAppts(iso: string, dow: number, doctor: DoctorId): Appt[] {
  const h = hoursOf(dow);
  if (!h || !doctors.find((d) => d.id === doctor)!.days.includes(dow)) return [];
  const r = rng(hash(`${iso}#${doctor}`));
  const out: Appt[] = [];
  const pool = visits.filter((v) => v.who.includes(doctor));
  for (let t = h.open; t < h.close; ) {
    const v = pool[Math.floor(r() * pool.length)];
    const blocks = Math.ceil(v.minutes / BLOCK);
    const end = t + blocks * BLOCK;
    const clash = (h.lunch && t < h.lunch[1] && h.lunch[0] < end) || (dow !== 6 && EMERGENCY.some((e) => t <= e && e < end)) || end > h.close;
    if (!clash && r() < 0.55) {
      out.push({ id: `${iso}-${doctor}-${t}`, doctor, day: iso, start: t, minutes: v.minutes, visit: v.id, who: initials[Math.floor(r() * initials.length)] });
      t = end;
    } else t += BLOCK;
  }
  return out;
}

/** Start times where a visit of `minutes` fits between other appointments. */
export function freeStarts(dow: number, minutes: number, taken: Appt[], after = 0) {
  const h = hoursOf(dow);
  if (!h) return [];
  const blocks = Math.ceil(minutes / BLOCK);
  const out: number[] = [];
  for (let t = h.open; t + blocks * BLOCK <= h.close; t += BLOCK) {
    const end = t + blocks * BLOCK;
    if (t < after) continue;
    if (h.lunch && t < h.lunch[1] && h.lunch[0] < end) continue;
    if (dow !== 6 && EMERGENCY.some((e) => t <= e && e < end)) continue;
    if (taken.some((a) => a.start < end && t < a.start + a.minutes)) continue;
    out.push(t);
  }
  return out;
}

// --- Dates -------------------------------------------------------------------
const dayShort = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const dayLong = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export type Day = { iso: string; dow: number; short: string; long: string; offset: number };

/** The next `count` open days (Sunday skipped), starting today. */
export function openDays(todayIso: string, count: number): Day[] {
  const [y, m, d] = todayIso.split("-").map(Number);
  const out: Day[] = [];
  for (let i = 0; out.length < count; i++) {
    const x = new Date(y, m - 1, d + i);
    if (x.getDay() === 0) continue;
    out.push({
      iso: isoDay(x),
      dow: x.getDay(),
      offset: i,
      short: i === 0 ? "Bugün" : i === 1 ? "Yarın" : `${dayShort[x.getDay()]} ${x.getDate()}`,
      long: `${x.getDate()} ${months[x.getMonth()]} ${dayLong[x.getDay()]}`,
    });
  }
  return out;
}
