// Mizan: a simulated invoice reader for the "yapay zekâ otomasyonu" demo. No
// model runs here: every document carries the answer and a confidence per
// field, and the app plays the reading back, checks the numbers and waits for
// a person wherever the confidence is low. Companies and numbers are invented.
// The documents are Turkish invoices in both languages; `mizanIn` gives the
// English words for everything the app writes around them.

import type { Lang } from "@/lib/i18n";

export type FieldKey = "seller" | "vkn" | "no" | "date" | "matrah" | "kdv" | "total";
export const fieldLabel: Record<FieldKey, string> = {
  seller: "Satıcı",
  vkn: "Satıcı VKN",
  no: "Belge no",
  date: "Tarih",
  matrah: "Matrah",
  kdv: "KDV",
  total: "Toplam",
};
export const fieldOrder: FieldKey[] = ["seller", "vkn", "no", "date", "matrah", "kdv", "total"];
export const moneyFields: FieldKey[] = ["matrah", "kdv", "total"];

type Part = string | { field: FieldKey; text: string; blur?: number };
export type Line = { x: number; y: number; size: number; bold?: boolean; right?: boolean; center?: boolean; muted?: boolean; mono?: boolean; parts: Part[] };

export type Doc = {
  id: string;
  title: string;
  source: string;
  kind: "pdf" | "photo" | "receipt";
  lines: Line[];
  rules: number[]; // horizontal rules (y)
  stamp?: { x: number; y: number; text: string };
  fields: Record<FieldKey, { value: string; conf: number }>;
  rate: number; // KDV rate the reader found
  category: { name: string; conf: number };
};

/** Paper size in document units; everything on the page is placed in these. */
export const PAGE = { w: 420, h: 594 };

const fuelLines: Line[] = [
  { x: 24, y: 24, size: 15, bold: true, parts: [{ field: "seller", text: "YOL ENERJİ AKARYAKIT LTD. ŞTİ." }] },
  { x: 24, y: 46, size: 9, muted: true, parts: ["Organize Sanayi Bölgesi 3. Cadde · Bursa (örnek)"] },
  { x: 24, y: 60, size: 9, parts: ["Uludağ V.D. · VKN ", { field: "vkn", text: "9990001112" }] },
  { x: 396, y: 24, size: 12, bold: true, right: true, parts: ["e-ARŞİV FATURA"] },
  { x: 396, y: 46, size: 9, right: true, parts: ["Fatura No: ", { field: "no", text: "YOL2026000004812" }] },
  { x: 396, y: 60, size: 9, right: true, parts: ["Tarih: ", { field: "date", text: "22.09.2026" }, " 18:42"] },
  { x: 24, y: 88, size: 7.5, muted: true, mono: true, parts: ["ETTN 5f2c1a7e-0b44-4c1e-9a8d-2e61c0f3b9a1"] },
  { x: 24, y: 116, size: 8, muted: true, parts: ["SAYIN"] },
  { x: 24, y: 128, size: 10, bold: true, parts: ["Örnek Tasarım Ltd. Şti."] },
  { x: 24, y: 142, size: 9, parts: ["Nilüfer V.D. · VKN 9990002223"] },
  { x: 24, y: 180, size: 8, bold: true, parts: ["MAL / HİZMET"] },
  { x: 250, y: 180, size: 8, bold: true, right: true, parts: ["MİKTAR"] },
  { x: 320, y: 180, size: 8, bold: true, right: true, parts: ["BİRİM"] },
  { x: 396, y: 180, size: 8, bold: true, right: true, parts: ["TUTAR"] },
  { x: 24, y: 202, size: 9.5, parts: ["Motorin (UMS 10 ppm)"] },
  { x: 250, y: 202, size: 9.5, right: true, mono: true, parts: ["42,50 L"] },
  { x: 320, y: 202, size: 9.5, right: true, mono: true, parts: ["40,75"] },
  { x: 396, y: 202, size: 9.5, right: true, mono: true, parts: ["1.731,88"] },
  { x: 210, y: 434, size: 9, parts: ["Mal/hizmet toplamı"] },
  { x: 396, y: 434, size: 9.5, right: true, mono: true, parts: [{ field: "matrah", text: "1.731,88 ₺" }] },
  { x: 210, y: 452, size: 9, parts: ["Hesaplanan KDV (%20)"] },
  { x: 396, y: 452, size: 9.5, right: true, mono: true, parts: [{ field: "kdv", text: "346,38 ₺" }] },
  { x: 210, y: 476, size: 11, bold: true, parts: ["ÖDENECEK"] },
  { x: 396, y: 476, size: 12, bold: true, right: true, mono: true, parts: [{ field: "total", text: "2.078,26 ₺" }] },
  { x: 24, y: 556, size: 7.5, muted: true, parts: ["Bu belge e-Arşiv fatura yerine geçer. Örnek belgedir."] },
];

const fuelFields: Doc["fields"] = {
  seller: { value: "Yol Enerji Akaryakıt Ltd. Şti.", conf: 0.99 },
  vkn: { value: "9990001112", conf: 0.98 },
  no: { value: "YOL2026000004812", conf: 0.99 },
  date: { value: "22.09.2026", conf: 0.98 },
  matrah: { value: "1731.88", conf: 0.97 },
  kdv: { value: "346.38", conf: 0.97 },
  total: { value: "2078.26", conf: 0.99 },
};

export const docs: Doc[] = [
  {
    id: "akaryakit",
    title: "Yol Enerji · akaryakıt",
    source: "e-Arşiv PDF · e-posta",
    kind: "pdf",
    lines: fuelLines,
    rules: [194, 218, 424, 468],
    fields: fuelFields,
    rate: 20,
    category: { name: "Taşıt: akaryakıt", conf: 0.96 },
  },
  {
    id: "kirtasiye",
    title: "Kalem Ofis · kırtasiye",
    source: "e-Fatura · GİB portalı",
    kind: "pdf",
    stamp: { x: 262, y: 40, text: "ALINDI" },
    lines: [
      { x: 24, y: 24, size: 14, bold: true, parts: [{ field: "seller", text: "KALEM OFİS MALZEMELERİ A.Ş." }] },
      { x: 24, y: 46, size: 9, muted: true, parts: ["Atatürk Cad. · Eskişehir (örnek)"] },
      { x: 24, y: 60, size: 9, parts: ["Odunpazarı V.D. · VKN ", { field: "vkn", text: "9990004445" }] },
      { x: 396, y: 24, size: 12, bold: true, right: true, parts: ["e-FATURA"] },
      { x: 396, y: 46, size: 9, right: true, parts: ["Fatura No: ", { field: "no", text: "KLM2026000000377" }] },
      { x: 396, y: 60, size: 9, right: true, parts: ["Düzenleme: ", { field: "date", text: "19.09.2026", blur: 0.6 }] },
      { x: 24, y: 116, size: 8, muted: true, parts: ["SAYIN"] },
      { x: 24, y: 128, size: 10, bold: true, parts: ["Örnek Tasarım Ltd. Şti."] },
      { x: 24, y: 180, size: 8, bold: true, parts: ["MAL / HİZMET"] },
      { x: 250, y: 180, size: 8, bold: true, right: true, parts: ["MİKTAR"] },
      { x: 320, y: 180, size: 8, bold: true, right: true, parts: ["BİRİM"] },
      { x: 396, y: 180, size: 8, bold: true, right: true, parts: ["TUTAR"] },
      { x: 24, y: 202, size: 9.5, parts: ["A4 fotokopi kâğıdı (koli)"] },
      { x: 250, y: 202, size: 9.5, right: true, mono: true, parts: ["5"] },
      { x: 320, y: 202, size: 9.5, right: true, mono: true, parts: ["420,00"] },
      { x: 396, y: 202, size: 9.5, right: true, mono: true, parts: ["2.100,00"] },
      { x: 24, y: 222, size: 9.5, parts: ["Lazer toner, siyah"] },
      { x: 250, y: 222, size: 9.5, right: true, mono: true, parts: ["2"] },
      { x: 320, y: 222, size: 9.5, right: true, mono: true, parts: ["1.150,00"] },
      { x: 396, y: 222, size: 9.5, right: true, mono: true, parts: ["2.300,00"] },
      { x: 24, y: 242, size: 9.5, parts: ["Zımba teli, dosya, kalem"] },
      { x: 250, y: 242, size: 9.5, right: true, mono: true, parts: ["1"] },
      { x: 320, y: 242, size: 9.5, right: true, mono: true, parts: ["385,00"] },
      { x: 396, y: 242, size: 9.5, right: true, mono: true, parts: ["385,00"] },
      { x: 210, y: 434, size: 9, parts: ["Mal/hizmet toplamı"] },
      { x: 396, y: 434, size: 9.5, right: true, mono: true, parts: [{ field: "matrah", text: "4.785,00 ₺" }] },
      { x: 210, y: 452, size: 9, parts: ["Hesaplanan KDV (%20)"] },
      { x: 396, y: 452, size: 9.5, right: true, mono: true, parts: [{ field: "kdv", text: "957,00 ₺" }] },
      { x: 210, y: 476, size: 11, bold: true, parts: ["ÖDENECEK"] },
      { x: 396, y: 476, size: 12, bold: true, right: true, mono: true, parts: [{ field: "total", text: "5.742,00 ₺" }] },
      { x: 24, y: 556, size: 7.5, muted: true, parts: ["Örnek belgedir."] },
    ],
    rules: [194, 258, 424, 468],
    fields: {
      seller: { value: "Kalem Ofis Malzemeleri A.Ş.", conf: 0.98 },
      vkn: { value: "9990004445", conf: 0.97 },
      no: { value: "KLM2026000000377", conf: 0.96 },
      date: { value: "19.09.2026", conf: 0.81 },
      matrah: { value: "4785.00", conf: 0.95 },
      kdv: { value: "957.00", conf: 0.95 },
      total: { value: "5742.00", conf: 0.97 },
    },
    rate: 20,
    category: { name: "Ofis: kırtasiye", conf: 0.93 },
  },
  {
    id: "lokanta",
    title: "Lezzet Durağı · personel yemeği",
    source: "WhatsApp fotoğrafı",
    kind: "receipt",
    lines: [
      { x: 210, y: 70, size: 11, center: true, bold: true, mono: true, parts: [{ field: "seller", text: "LEZZET DURAĞI LOKANTASI" }] },
      { x: 210, y: 88, size: 8.5, center: true, mono: true, parts: ["ESKİŞEHİR (ÖRNEK)"] },
      { x: 210, y: 102, size: 8.5, center: true, mono: true, parts: ["SAKARYA V.D. ", { field: "vkn", text: "99900?3334", blur: 1.4 }] },
      { x: 118, y: 132, size: 8.5, mono: true, parts: ["TARİH: ", { field: "date", text: "24.09.2026", blur: 0.9 }] },
      { x: 118, y: 146, size: 8.5, mono: true, parts: ["FİŞ NO: ", { field: "no", text: "0047", blur: 0.8 }] },
      { x: 118, y: 176, size: 9, mono: true, parts: ["TAVUK SOTE X6"] },
      { x: 302, y: 176, size: 9, right: true, mono: true, parts: ["*1.800,00"] },
      { x: 118, y: 192, size: 9, mono: true, parts: ["PİLAV X6"] },
      { x: 302, y: 192, size: 9, right: true, mono: true, parts: ["*540,00"] },
      { x: 118, y: 208, size: 9, mono: true, parts: ["AYRAN X6"] },
      { x: 302, y: 208, size: 9, right: true, mono: true, parts: ["*300,00"] },
      { x: 118, y: 240, size: 9, mono: true, parts: ["TOPKDV"] },
      { x: 302, y: 240, size: 9, right: true, mono: true, parts: [{ field: "kdv", text: "*240,00", blur: 0.5 }] },
      { x: 118, y: 256, size: 9, mono: true, parts: ["KDV'SİZ"] },
      { x: 302, y: 256, size: 9, right: true, mono: true, parts: [{ field: "matrah", text: "*2.400,00", blur: 0.5 }] },
      { x: 118, y: 278, size: 11, bold: true, mono: true, parts: ["TOPLAM"] },
      { x: 302, y: 278, size: 11, bold: true, right: true, mono: true, parts: [{ field: "total", text: "*2.640,00" }] },
      { x: 210, y: 312, size: 7.5, center: true, mono: true, muted: true, parts: ["MALİ DEĞERİ YOKTUR · ÖRNEK"] },
    ],
    rules: [164, 226, 270],
    fields: {
      seller: { value: "Lezzet Durağı Lokantası", conf: 0.9 },
      vkn: { value: "99900?3334", conf: 0.58 },
      no: { value: "0047", conf: 0.74 },
      date: { value: "24.09.2026", conf: 0.79 },
      matrah: { value: "2400.00", conf: 0.86 },
      kdv: { value: "240.00", conf: 0.88 },
      total: { value: "2640.00", conf: 0.96 },
    },
    rate: 10,
    category: { name: "Yemek: personel", conf: 0.9 },
  },
  {
    id: "tekrar",
    title: "Yol Enerji · akaryakıt (tekrar)",
    source: "WhatsApp fotoğrafı",
    kind: "photo",
    lines: fuelLines,
    rules: [194, 218, 424, 468],
    fields: { ...fuelFields, seller: { ...fuelFields.seller, conf: 0.95 }, date: { ...fuelFields.date, conf: 0.92 } },
    rate: 20,
    category: { name: "Taşıt: akaryakıt", conf: 0.95 },
  },
];

// --- Bookkeeping (Tekdüzen Hesap Planı) --------------------------------------
export const expenseAccounts = [
  { code: "770", name: "Genel Yönetim Giderleri" },
  { code: "760", name: "Pazarlama Satış ve Dağıtım Giderleri" },
  { code: "740", name: "Hizmet Üretim Maliyeti" },
];
const ACCOUNT_EN: Record<string, string> = {
  "770": "General Administrative Expenses",
  "760": "Marketing, Sales and Distribution Expenses",
  "740": "Cost of Services",
  "191": "Deductible VAT",
  "320": "Suppliers",
  "100": "Cash",
  "102": "Banks",
};
export const accountName = (code: string, lang: Lang = "tr") =>
  lang === "en"
    ? (ACCOUNT_EN[code] ?? code)
    : (expenseAccounts.find((a) => a.code === code)?.name ?? { "191": "İndirilecek KDV", "320": "Satıcılar", "100": "Kasa", "102": "Bankalar" }[code] ?? code);

/** How each document is booked: the expense account the reader proposes, and what it was paid from. */
export const booking: Record<string, { expense: { code: string; conf: number }; pay: string; memo: string }> = {
  akaryakit: { expense: { code: "770", conf: 0.96 }, pay: "102", memo: "Şirket aracı akaryakıt" },
  kirtasiye: { expense: { code: "770", conf: 0.93 }, pay: "320", memo: "Ofis kırtasiye" },
  lokanta: { expense: { code: "770", conf: 0.9 }, pay: "100", memo: "Personel yemeği" },
  tekrar: { expense: { code: "770", conf: 0.95 }, pay: "102", memo: "Şirket aracı akaryakıt" },
};

export type JournalLine = { code: string; memo: string; debit: number; credit: number };
export type Posted = { no: number; date: string; doc: string; lines: JournalLine[]; by: "auto" | "you" };

/** Already in the journal before the demo starts. */
const START_JOURNAL: Posted[] = [
  {
    no: 1,
    date: "05.09.2026",
    doc: "ELK2026000118203",
    by: "auto",
    lines: [
      { code: "770", memo: "Elektrik, Eylül", debit: 1850, credit: 0 },
      { code: "191", memo: "KDV %20", debit: 370, credit: 0 },
      { code: "320", memo: "Ulusal Elektrik (örnek)", debit: 0, credit: 2220 },
    ],
  },
  {
    no: 2,
    date: "12.09.2026",
    doc: "HZN2026000093311",
    by: "auto",
    lines: [
      { code: "770", memo: "İnternet, Eylül", debit: 750, credit: 0 },
      { code: "191", memo: "KDV %20", debit: 150, credit: 0 },
      { code: "102", memo: "Hızlı Net (örnek)", debit: 0, credit: 900 },
    ],
  },
];

/** Two decimals: "1.731,88" in Turkish, "1,731.88" in English. */
export const money = (n: number, lang: Lang = "tr") =>
  n.toLocaleString(lang === "en" ? "en-GB" : "tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/** Reads an amount written either way back into a number. */
export const toNumber = (s: string, lang: Lang = "tr") => {
  const bare = s.replace(/\s|₺|\*/g, "");
  return lang === "en" ? Number(bare.replace(/,/g, "")) : Number(bare.replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
};

// --- English -----------------------------------------------------------------
const DOC_EN: Record<string, { title: string; source: string }> = {
  akaryakit: { title: "Yol Enerji · fuel", source: "e-Archive PDF · email" },
  kirtasiye: { title: "Kalem Ofis · stationery", source: "e-Invoice · tax office (GİB) portal" },
  lokanta: { title: "Lezzet Durağı · staff lunch", source: "WhatsApp photo" },
  tekrar: { title: "Yol Enerji · fuel (again)", source: "WhatsApp photo" },
};
const MEMO_EN: Record<string, string> = {
  akaryakit: "Company car fuel",
  kirtasiye: "Office stationery",
  lokanta: "Staff lunch",
  tekrar: "Company car fuel",
};
const JOURNAL_MEMO_EN: Record<string, string> = {
  "Elektrik, Eylül": "Electricity, September",
  "İnternet, Eylül": "Internet, September",
  "KDV %20": "VAT 20%",
  "Ulusal Elektrik (örnek)": "Ulusal Elektrik (sample)",
  "Hızlı Net (örnek)": "Hızlı Net (sample)",
};

/** The documents, accounts and opening journal in one language. */
export function mizanIn(lang: Lang) {
  const en = lang === "en";
  return {
    docs: en ? docs.map((d) => ({ ...d, ...DOC_EN[d.id] })) : docs,
    expenseAccounts: en ? expenseAccounts.map((a) => ({ ...a, name: ACCOUNT_EN[a.code] })) : expenseAccounts,
    memo: (id: string) => (en ? MEMO_EN[id] : booking[id].memo),
    vatMemo: (rate: number) => (en ? `VAT ${rate}%` : `KDV %${rate}`),
    startJournal: en ? START_JOURNAL.map((p) => ({ ...p, lines: p.lines.map((l) => ({ ...l, memo: JOURNAL_MEMO_EN[l.memo] ?? l.memo })) })) : START_JOURNAL,
    accountName: (code: string) => accountName(code, lang),
    money: (n: number) => money(n, lang),
    toNumber: (v: string) => toNumber(v, lang),
  };
}
