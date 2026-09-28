// Lodos Meyhane: a fictional Kadıköy meyhane for the "restoran" website demo
// and the table-booking demo. Food only: Turkish law (4250, TAPDK rules)
// restricts promoting alcohol, so drinks are listed at the venue, not online.

export type Meze = { id: string; name: string; note: string; color: string; accent?: string };

/** Tonight's cold mezes, as they sit on the waiter's tray. */
export const tray: Meze[] = [
  { id: "fava", name: "Fava", note: "Zeytinyağı ve dereotuyla", color: "#E8C547", accent: "#6E8B3D" },
  { id: "haydari", name: "Haydari", note: "Süzme yoğurt, nane, sarımsak", color: "#F4F2EA", accent: "#6E8B3D" },
  { id: "ezme", name: "Acılı ezme", note: "Közlenmiş biber ve domates", color: "#C8452F", accent: "#4F7A3A" },
  { id: "saksuka", name: "Şakşuka", note: "Patlıcan, kabak, domates sos", color: "#D9772B" },
  { id: "borulce", name: "Deniz börülcesi", note: "Limon ve zeytinyağıyla", color: "#5E8A3A" },
  { id: "patlican", name: "Patlıcan salatası", note: "Közde, közün kokusuyla", color: "#8A6A4F" },
  { id: "lakerda", name: "Lakerda", note: "Kırmızı soğanla", color: "#D98C8C" },
  { id: "muhammara", name: "Muhammara", note: "Ceviz ve nar ekşisi", color: "#A8432A", accent: "#E7D3A8" },
  { id: "topik", name: "Topik", note: "Nohut, soğan, tahin; Kadıköy usulü", color: "#C9B58C", accent: "#7A4A2A" },
];

export const FIX_MEZE = 6;
export const FIX_PRICE = 2400; // per person: 6 cold + 2 hot mezes, fruit

export type MenuItem = { name: string; note?: string; price: number };
export const menu: { id: string; name: string; items: MenuItem[] }[] = [
  {
    id: "soguk",
    name: "Soğuklar",
    items: tray.map((m, i) => ({ name: m.name, note: m.note, price: [220, 240, 200, 240, 260, 240, 380, 260, 280][i] })),
  },
  {
    id: "ara",
    name: "Ara sıcaklar",
    items: [
      { name: "Paçanga böreği", note: "Pastırma ve kaşar", price: 360 },
      { name: "Kalamar tava", note: "Tarator ile", price: 480 },
      { name: "Midye tava", price: 420 },
      { name: "Arnavut ciğeri", note: "Sumaklı soğanla", price: 440 },
      { name: "Kabak çiçeği dolması", note: "Mevsiminde", price: 380 },
    ],
  },
  {
    id: "balik",
    name: "Balık",
    items: [
      { name: "Levrek ızgara", note: "Porsiyon", price: 950 },
      { name: "Çupra ızgara", note: "Porsiyon", price: 900 },
      { name: "İstavrit tava", note: "Mevsiminde", price: 650 },
      { name: "Günün balığı", note: "Tezgâhtan seçilir, kilo fiyatı mekânda", price: 0 },
    ],
  },
  {
    id: "tatli",
    name: "Tatlı ve meyve",
    items: [
      { name: "Kabak tatlısı", note: "Tahin ve ceviz", price: 240 },
      { name: "Mevsim meyve tabağı", note: "İki kişilik", price: 320 },
      { name: "Helva", note: "Dondurmalı", price: 260 },
    ],
  },
];

/** This week's nights. `busy` is how full the tables usually are (0–1). */
export const nights = [
  { day: "Pazartesi", what: "Sessiz akşam", busy: 0.35 },
  { day: "Salı", what: "Rebetiko akşamı", busy: 0.6 },
  { day: "Çarşamba", what: "Sessiz akşam", busy: 0.45 },
  { day: "Perşembe", what: "Fasıl", busy: 0.85 },
  { day: "Cuma", what: "Kadıköy şarkıları", busy: 0.95 },
  { day: "Cumartesi", what: "Fasıl", busy: 1 },
  { day: "Pazar", what: "Öğle sofrası 13:00'ten", busy: 0.55 },
];

export const todayBoard = ["taze lakerda", "istavrit tava", "kabak çiçeği dolması", "deniz börülcesi", "közde patlıcan", "topik", "kabak tatlısı"];

export const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;

export const RESERVE_PATH = "/hizmetler/online-randevu-sistemi/lodos-masa";
export const SITE_PATH = "/hizmetler/kurumsal-web-sitesi/lodos-meyhane";
