// Etüt Mimarlık: a fictional architecture office for the "mimarlık" website
// demo. Projects are invented; plans are drawn from these room lists (metres),
// so the site needs no stock photography. Turkish is written inline; the
// English words are kept below and applied by `etutIn`.

import { type Lang, locale } from "@/lib/i18n";

export type Room = { name: string; x: number; y: number; w: number; h: number };
export type Kind = "Yeni konut" | "Restorasyon" | "Daire yenileme" | "İç mimari";

export type Project = {
  id: string;
  name: string;
  place: string;
  kind: Kind;
  year: number;
  story: string;
  width: number;
  depth: number;
  plan: Room[];
  before?: Room[];
};

const PROJECTS: Project[] = [
  {
    id: "yalikavak",
    name: "Taş ev restorasyonu",
    place: "Bodrum",
    kind: "Restorasyon",
    year: 2025,
    story: "Yedi küçük odaya bölünmüş tek katlı taş evin taşıyıcı duvarları korunarak iç bölmeleri açıldı; salon ve mutfak bahçeye bakan tek bir yaşam alanına dönüştü.",
    width: 12,
    depth: 8,
    before: [
      { name: "Salon", x: 0, y: 0, w: 5, h: 4 },
      { name: "Oda", x: 5, y: 0, w: 4, h: 4 },
      { name: "Oda", x: 9, y: 0, w: 3, h: 4 },
      { name: "Mutfak", x: 0, y: 4, w: 4, h: 4 },
      { name: "Banyo", x: 4, y: 4, w: 2, h: 4 },
      { name: "Hol", x: 6, y: 4, w: 3, h: 4 },
      { name: "Kiler", x: 9, y: 4, w: 3, h: 4 },
    ],
    plan: [
      { name: "Yaşam alanı", x: 0, y: 0, w: 7, h: 5 },
      { name: "Mutfak", x: 0, y: 5, w: 4, h: 3 },
      { name: "Banyo", x: 4, y: 5, w: 3, h: 3 },
      { name: "Yatak odası", x: 7, y: 0, w: 5, h: 4.5 },
      { name: "Çalışma", x: 7, y: 4.5, w: 5, h: 3.5 },
    ],
  },
  {
    id: "moda",
    name: "Apartman dairesi yenileme",
    place: "İstanbul, Kadıköy",
    kind: "Daire yenileme",
    year: 2025,
    story: "Üç yatak odalı dairede bir oda salona katılarak mutfak açıldı; kalan küçük oda çalışma odasına, koridor tarafı giyinme odası ve ebeveyn banyosuna ayrıldı.",
    width: 11,
    depth: 8,
    before: [
      { name: "Salon", x: 0, y: 0, w: 5, h: 5 },
      { name: "Mutfak", x: 5, y: 0, w: 3, h: 5 },
      { name: "Oda", x: 8, y: 0, w: 3, h: 5 },
      { name: "Oda", x: 0, y: 5, w: 4, h: 3 },
      { name: "Oda", x: 4, y: 5, w: 4, h: 3 },
      { name: "Banyo", x: 8, y: 5, w: 3, h: 3 },
    ],
    plan: [
      { name: "Salon ve açık mutfak", x: 0, y: 0, w: 8, h: 5 },
      { name: "Yatak odası", x: 8, y: 0, w: 3, h: 5 },
      { name: "Çalışma", x: 0, y: 5, w: 4, h: 3 },
      { name: "Giyinme", x: 4, y: 5, w: 2, h: 3 },
      { name: "Ebeveyn banyo", x: 6, y: 5, w: 2, h: 3 },
      { name: "Banyo", x: 8, y: 5, w: 3, h: 3 },
    ],
  },
  {
    id: "eskisehir",
    name: "Bahçeli müstakil konut",
    place: "Eskişehir",
    kind: "Yeni konut",
    year: 2024,
    story: "Dört kişilik bir aile için tek katlı konut. Gündüz ve gece bölümleri ayrıldı; yaşam alanı ve mutfak güneye, bahçeye açılıyor.",
    width: 13,
    depth: 9,
    plan: [
      { name: "Yaşam alanı", x: 0, y: 0, w: 6, h: 5 },
      { name: "Mutfak", x: 6, y: 0, w: 4, h: 5 },
      { name: "Kiler", x: 10, y: 0, w: 3, h: 2 },
      { name: "WC", x: 10, y: 2, w: 3, h: 3 },
      { name: "Yatak odası", x: 0, y: 5, w: 4.5, h: 4 },
      { name: "Çocuk odası", x: 4.5, y: 5, w: 4, h: 4 },
      { name: "Banyo", x: 8.5, y: 5, w: 2.5, h: 4 },
      { name: "Çamaşır", x: 11, y: 5, w: 2, h: 4 },
    ],
  },
  {
    id: "karakoy",
    name: "Ortak çalışma ofisi",
    place: "İstanbul, Karaköy",
    kind: "İç mimari",
    year: 2024,
    story: "Eski bir han katında 30 kişilik ofis. Sessiz çalışma ile toplantı ve telefon alanları ayrıldı, doğal ışık açık çalışma alanına bırakıldı.",
    width: 16,
    depth: 10,
    plan: [
      { name: "Açık çalışma", x: 0, y: 0, w: 10, h: 6 },
      { name: "Toplantı", x: 10, y: 0, w: 6, h: 4 },
      { name: "Telefon", x: 10, y: 4, w: 3, h: 2 },
      { name: "Mutfak", x: 13, y: 4, w: 3, h: 2 },
      { name: "Sessiz oda", x: 0, y: 6, w: 5, h: 4 },
      { name: "Karşılama", x: 5, y: 6, w: 6, h: 4 },
      { name: "Arşiv", x: 11, y: 6, w: 5, h: 4 },
    ],
  },
];

const PROJECT_EN: Record<string, Pick<Project, "name" | "place" | "story">> = {
  yalikavak: {
    name: "Stone house restoration",
    place: "Bodrum",
    story: "A single-storey stone house split into seven small rooms. The load-bearing walls were kept and the partitions opened up, turning the living room and kitchen into one living space facing the garden.",
  },
  moda: {
    name: "Apartment renovation",
    place: "Istanbul, Kadıköy",
    story: "In a three-bedroom flat, one room joined the living room to open up the kitchen; the small room left became a study, and the corridor side was split into a dressing room and an en suite.",
  },
  eskisehir: {
    name: "Detached house with a garden",
    place: "Eskişehir",
    story: "A single-storey house for a family of four. Day and night areas are kept apart; the living area and kitchen open south, onto the garden.",
  },
  karakoy: {
    name: "Shared office",
    place: "Istanbul, Karaköy",
    story: "A 30-person office on one floor of an old Ottoman han. Quiet work is kept apart from meetings and phone calls, and the daylight is left to the open office.",
  },
};

const ROOM_EN: Record<string, string> = {
  Salon: "Living room",
  Oda: "Room",
  Mutfak: "Kitchen",
  Banyo: "Bathroom",
  Hol: "Hall",
  Kiler: "Pantry",
  "Yaşam alanı": "Living area",
  "Yatak odası": "Bedroom",
  Çalışma: "Study",
  "Salon ve açık mutfak": "Living room and open kitchen",
  Giyinme: "Dressing",
  "Ebeveyn banyo": "En suite",
  WC: "WC",
  "Çocuk odası": "Child's room",
  Çamaşır: "Laundry",
  "Açık çalışma": "Open office",
  Toplantı: "Meeting",
  Telefon: "Phone",
  "Sessiz oda": "Quiet room",
  Karşılama: "Reception",
  Arşiv: "Archive",
};

/** The office's working sequence, in the Chamber of Architects' own terms. */
const PHASES = [
  {
    name: { tr: "Keşif ve rölöve", en: "Site visit and survey" },
    text: { tr: "Yeri görür, mevcut durumu ölçüp çizeriz. Sizin nasıl yaşadığınızı dinleriz.", en: "We see the place and measure and draw what's there. We listen to how you live." },
  },
  {
    name: { tr: "Avan proje", en: "Concept design" },
    text: { tr: "İlk çizimler: planlar, kesitler ve kütle. Birlikte üzerinden geçer, düzeltiriz.", en: "The first drawings: plans, sections and massing. We go through them together and revise." },
  },
  {
    name: { tr: "Uygulama projesi", en: "Construction drawings" },
    text: { tr: "Ustanın kullanacağı ölçülü çizimler, detaylar ve malzeme listesi.", en: "Dimensioned drawings, details and a materials list for the builders to work from." },
  },
  {
    name: { tr: "Ruhsat süreci", en: "Building permit" },
    text: { tr: "Belediye başvurusu için gereken projeleri ve belgeleri hazırlarız.", en: "We prepare the drawings and documents the municipality needs for the application." },
  },
  {
    name: { tr: "Şantiye takibi", en: "Site supervision" },
    text: { tr: "Uygulamanın çizime uygun ilerlediğini düzenli ziyaretlerle kontrol ederiz.", en: "Regular visits to check the work is following the drawings." },
  },
];

export const kinds: Kind[] = ["Yeni konut", "Restorasyon", "Daire yenileme", "İç mimari"];

const KIND_EN: Record<Kind, string> = {
  "Yeni konut": "New home",
  Restorasyon: "Restoration",
  "Daire yenileme": "Flat renovation",
  "İç mimari": "Interior design",
};

export const area = (rooms: Room[]) => rooms.reduce((a, r) => a + r.w * r.h, 0);

/** Projects, phases and labels in one language. A project's `kind` stays the Turkish key; `kindName` labels it. */
export function etutIn(lang: Lang) {
  const room = (r: Room): Room => (lang === "en" ? { ...r, name: ROOM_EN[r.name] ?? r.name } : r);
  return {
    projects: PROJECTS.map((p) =>
      lang === "en" ? { ...p, ...PROJECT_EN[p.id], plan: p.plan.map(room), before: p.before?.map(room) } : p,
    ),
    phases: PHASES.map((p) => ({ name: p.name[lang], text: p.text[lang] })),
    kindName: (k: Kind) => (lang === "en" ? KIND_EN[k] : k),
    m2: (n: number) => `${n.toLocaleString(locale(lang), { maximumFractionDigits: 1 })} m²`,
    fmt: (n: number) => n.toLocaleString(locale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  };
}
