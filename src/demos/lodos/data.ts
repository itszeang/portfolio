// Lodos Meyhane: a fictional Kadıköy meyhane for the "restoran" website demo
// and the table-booking demo. Food only: Turkish law (4250, TAPDK rules)
// restricts promoting alcohol, so drinks are listed at the venue, not online.
// English keeps the dishes' Turkish names, as meyhane menus for visitors do,
// and explains them underneath.
import { locale, type Lang } from "@/lib/i18n";

export type Meze = { id: string; name: string; note: string; color: string; accent?: string };

const TRAY: (Omit<Meze, "note"> & { note: { tr: string; en: string } })[] = [
  { id: "fava", name: "Fava", note: { tr: "Zeytinyağı ve dereotuyla", en: "Broad bean purée with olive oil and dill" }, color: "#E8C547", accent: "#6E8B3D" },
  { id: "haydari", name: "Haydari", note: { tr: "Süzme yoğurt, nane, sarımsak", en: "Strained yoghurt, mint and garlic" }, color: "#F4F2EA", accent: "#6E8B3D" },
  { id: "ezme", name: "Acılı ezme", note: { tr: "Közlenmiş biber ve domates", en: "Spicy roasted pepper and tomato" }, color: "#C8452F", accent: "#4F7A3A" },
  { id: "saksuka", name: "Şakşuka", note: { tr: "Patlıcan, kabak, domates sos", en: "Aubergine and courgette in tomato sauce" }, color: "#D9772B" },
  { id: "borulce", name: "Deniz börülcesi", note: { tr: "Limon ve zeytinyağıyla", en: "Samphire with lemon and olive oil" }, color: "#5E8A3A" },
  { id: "patlican", name: "Patlıcan salatası", note: { tr: "Közde, közün kokusuyla", en: "Aubergine roasted over the coals, smoky" }, color: "#8A6A4F" },
  { id: "lakerda", name: "Lakerda", note: { tr: "Kırmızı soğanla", en: "Cured bonito with red onion" }, color: "#D98C8C" },
  { id: "muhammara", name: "Muhammara", note: { tr: "Ceviz ve nar ekşisi", en: "Walnut and pomegranate molasses" }, color: "#A8432A", accent: "#E7D3A8" },
  { id: "topik", name: "Topik", note: { tr: "Nohut, soğan, tahin; Kadıköy usulü", en: "Chickpea, onion and tahini, the Kadıköy way" }, color: "#C9B58C", accent: "#7A4A2A" },
];

export const FIX_MEZE = 6;
export const FIX_PRICE = 2400; // per person: 6 cold + 2 hot mezes, fruit

export type MenuItem = { name: string; note?: string; price: number };
type Item = { name: string; note?: { tr: string; en: string }; price: number };

const MENU: { id: string; name: { tr: string; en: string }; items: Item[] }[] = [
  {
    id: "soguk",
    name: { tr: "Soğuklar", en: "Cold mezes" },
    items: TRAY.map((m, i) => ({ name: m.name, note: m.note, price: [220, 240, 200, 240, 260, 240, 380, 260, 280][i] })),
  },
  {
    id: "ara",
    name: { tr: "Ara sıcaklar", en: "Hot starters" },
    items: [
      { name: "Paçanga böreği", note: { tr: "Pastırma ve kaşar", en: "Pastırma and kaşar cheese in pastry" }, price: 360 },
      { name: "Kalamar tava", note: { tr: "Tarator ile", en: "Fried squid with tarator" }, price: 480 },
      { name: "Midye tava", note: { tr: "", en: "Fried mussels with tarator" }, price: 420 },
      { name: "Arnavut ciğeri", note: { tr: "Sumaklı soğanla", en: "Albanian-style liver with sumac onions" }, price: 440 },
      { name: "Kabak çiçeği dolması", note: { tr: "Mevsiminde", en: "Stuffed courgette flowers, in season" }, price: 380 },
    ],
  },
  {
    id: "balik",
    name: { tr: "Balık", en: "Fish" },
    items: [
      { name: "Levrek ızgara", note: { tr: "Porsiyon", en: "Grilled sea bass, per portion" }, price: 950 },
      { name: "Çupra ızgara", note: { tr: "Porsiyon", en: "Grilled sea bream, per portion" }, price: 900 },
      { name: "İstavrit tava", note: { tr: "Mevsiminde", en: "Fried horse mackerel, in season" }, price: 650 },
      { name: "Günün balığı", note: { tr: "Tezgâhtan seçilir, kilo fiyatı mekânda", en: "Catch of the day: pick it at the counter, priced by weight" }, price: 0 },
    ],
  },
  {
    id: "tatli",
    name: { tr: "Tatlı ve meyve", en: "Dessert and fruit" },
    items: [
      { name: "Kabak tatlısı", note: { tr: "Tahin ve ceviz", en: "Candied pumpkin, tahini and walnuts" }, price: 240 },
      { name: "Mevsim meyve tabağı", note: { tr: "İki kişilik", en: "Seasonal fruit plate for two" }, price: 320 },
      { name: "Helva", note: { tr: "Dondurmalı", en: "Tahini halva with ice cream" }, price: 260 },
    ],
  },
];

/** This week's nights. `busy` is how full the tables usually are (0–1). */
const NIGHTS = [
  { day: { tr: "Pazartesi", en: "Monday" }, what: { tr: "Sessiz akşam", en: "Quiet evening" }, busy: 0.35 },
  { day: { tr: "Salı", en: "Tuesday" }, what: { tr: "Rebetiko akşamı", en: "Rebetiko night" }, busy: 0.6 },
  { day: { tr: "Çarşamba", en: "Wednesday" }, what: { tr: "Sessiz akşam", en: "Quiet evening" }, busy: 0.45 },
  { day: { tr: "Perşembe", en: "Thursday" }, what: { tr: "Fasıl", en: "Fasıl: live Turkish music" }, busy: 0.85 },
  { day: { tr: "Cuma", en: "Friday" }, what: { tr: "Kadıköy şarkıları", en: "Songs of Kadıköy" }, busy: 0.95 },
  { day: { tr: "Cumartesi", en: "Saturday" }, what: { tr: "Fasıl", en: "Fasıl: live Turkish music" }, busy: 1 },
  { day: { tr: "Pazar", en: "Sunday" }, what: { tr: "Öğle sofrası 13:00'ten", en: "Sunday lunch from 13:00" }, busy: 0.55 },
];

const BOARD = {
  tr: ["taze lakerda", "istavrit tava", "kabak çiçeği dolması", "deniz börülcesi", "közde patlıcan", "topik", "kabak tatlısı"],
  en: ["fresh lakerda", "fried horse mackerel", "stuffed courgette flowers", "samphire", "fire-roasted aubergine", "topik", "candied pumpkin"],
};

const PATHS = {
  tr: { reserve: "/hizmetler/online-randevu-sistemi/lodos-masa", site: "/hizmetler/kurumsal-web-sitesi/lodos-meyhane" },
  en: { reserve: "/en/services/online-booking-system/lodos-masa", site: "/en/services/business-website/lodos-meyhane" },
};

/** Everything language-dependent about Lodos, in one language. */
export function lodosIn(lang: Lang) {
  const tray: Meze[] = TRAY.map((m) => ({ ...m, note: m.note[lang] }));
  const menu = MENU.map((c) => ({ id: c.id, name: c.name[lang], items: c.items.map((it) => ({ name: it.name, note: it.note?.[lang] || undefined, price: it.price })) }));
  const nights = NIGHTS.map((n) => ({ day: n.day[lang], what: n.what[lang], busy: n.busy }));
  // Turkish writes "2.400 ₺"; English "₺2,400".
  const tl = (n: number) => (lang === "en" ? `₺${n.toLocaleString(locale(lang))}` : `${n.toLocaleString("tr-TR")} ₺`);
  return { tray, menu, nights, todayBoard: BOARD[lang], tl, reservePath: PATHS[lang].reserve, sitePath: PATHS[lang].site };
}

// The Turkish set, under the names the booking demo already uses.
const tr = lodosIn("tr");
export const tray = tr.tray;
export const menu = tr.menu;
export const nights = tr.nights;
export const todayBoard = tr.todayBoard;
export const tl = tr.tl;
export const RESERVE_PATH = tr.reservePath;
export const SITE_PATH = tr.sitePath;
