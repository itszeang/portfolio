// Etüt Mimarlık: a fictional architecture office for the "mimarlık" website
// demo. Projects are invented; plans are drawn from these room lists (metres),
// so the site needs no stock photography.

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

export const projects: Project[] = [
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

/** The office's working sequence, in the Chamber of Architects' own terms. */
export const phases = [
  { name: "Keşif ve rölöve", text: "Yeri görür, mevcut durumu ölçüp çizeriz. Sizin nasıl yaşadığınızı dinleriz." },
  { name: "Avan proje", text: "İlk çizimler: planlar, kesitler ve kütle. Birlikte üzerinden geçer, düzeltiriz." },
  { name: "Uygulama projesi", text: "Ustanın kullanacağı ölçülü çizimler, detaylar ve malzeme listesi." },
  { name: "Ruhsat süreci", text: "Belediye başvurusu için gereken projeleri ve belgeleri hazırlarız." },
  { name: "Şantiye takibi", text: "Uygulamanın çizime uygun ilerlediğini düzenli ziyaretlerle kontrol ederiz." },
];

export const kinds: Kind[] = ["Yeni konut", "Restorasyon", "Daire yenileme", "İç mimari"];

export const area = (rooms: Room[]) => rooms.reduce((a, r) => a + r.w * r.h, 0);
export const m2 = (n: number) => `${n.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} m²`;
