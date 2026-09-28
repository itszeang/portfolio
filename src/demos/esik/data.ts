// Eşik Gayrimenkul: a fictional İzmir real-estate office for the "emlak"
// website demo. Listings, prices and commute times are invented but kept in a
// believable range; every figure on screen is labelled as an example.

export type Deal = "Satılık" | "Kiralık";

export type Listing = {
  id: string;
  title: string;
  district: string;
  deal: Deal;
  rooms: string;
  net: number;
  gross: number;
  floor: number;
  floors: number;
  age: number;
  price: number; // sale price, or monthly rent
  dues: number; // aidat, monthly
  heating: string;
  credit: boolean;
  features: string[];
};

export const listings: Listing[] = [
  { id: "E-2107", title: "Deniz manzaralı 3+1", district: "Karşıyaka", deal: "Satılık", rooms: "3+1", net: 125, gross: 145, floor: 6, floors: 8, age: 4, price: 7_950_000, dues: 1_800, heating: "Doğalgaz kombi", credit: true, features: ["Asansör", "Otopark", "Balkon"] },
  { id: "E-2104", title: "Kampüse yürüme mesafesinde 2+1", district: "Bornova", deal: "Kiralık", rooms: "2+1", net: 85, gross: 100, floor: 2, floors: 4, age: 12, price: 21_000, dues: 600, heating: "Doğalgaz kombi", credit: false, features: ["Eşyasız", "Balkon"] },
  { id: "E-2099", title: "Bahçe katı 2+1", district: "Urla", deal: "Satılık", rooms: "2+1", net: 95, gross: 110, floor: 0, floors: 2, age: 2, price: 6_400_000, dues: 900, heating: "Klima", credit: true, features: ["Bahçe", "Site içi", "Havuz"] },
  { id: "E-2096", title: "Yenilenmiş 1+1", district: "Alsancak", deal: "Kiralık", rooms: "1+1", net: 55, gross: 65, floor: 3, floors: 5, age: 35, price: 24_000, dues: 400, heating: "Klima", credit: false, features: ["Eşyalı", "Merkezi konum"] },
  { id: "E-2092", title: "Aile için geniş 4+1", district: "Buca", deal: "Satılık", rooms: "4+1", net: 160, gross: 185, floor: 4, floors: 6, age: 9, price: 6_900_000, dues: 1_200, heating: "Doğalgaz kombi", credit: true, features: ["Asansör", "Otopark", "Ebeveyn banyo"] },
  { id: "E-2088", title: "Metroya yakın 3+1", district: "Göztepe", deal: "Kiralık", rooms: "3+1", net: 110, gross: 130, floor: 5, floors: 10, age: 6, price: 33_000, dues: 1_500, heating: "Merkezi sistem", credit: false, features: ["Asansör", "Kapıcı", "Otopark"] },
  { id: "E-2083", title: "Yatırımlık stüdyo", district: "Bornova", deal: "Satılık", rooms: "1+0", net: 38, gross: 48, floor: 1, floors: 7, age: 3, price: 2_650_000, dues: 700, heating: "Klima", credit: true, features: ["Site içi", "Güvenlik"] },
  { id: "E-2079", title: "Çarşıya yakın 2+1", district: "Karşıyaka", deal: "Kiralık", rooms: "2+1", net: 90, gross: 105, floor: 1, floors: 5, age: 18, price: 23_500, dues: 500, heating: "Doğalgaz kombi", credit: false, features: ["Balkon", "Eşyasız"] },
];

export const destinations = ["Alsancak", "Bornova", "Karşıyaka", "Urla"] as const;
export type Destination = (typeof destinations)[number];

/** Rush-hour minutes, public transport, from district to destination (example values). */
const COMMUTE: Record<string, Record<Destination, number>> = {
  Karşıyaka: { Alsancak: 25, Bornova: 30, Karşıyaka: 8, Urla: 60 },
  Bornova: { Alsancak: 22, Bornova: 8, Karşıyaka: 30, Urla: 65 },
  Urla: { Alsancak: 55, Bornova: 65, Karşıyaka: 60, Urla: 8 },
  Alsancak: { Alsancak: 6, Bornova: 22, Karşıyaka: 25, Urla: 55 },
  Buca: { Alsancak: 30, Bornova: 25, Karşıyaka: 40, Urla: 70 },
  Göztepe: { Alsancak: 15, Bornova: 25, Karşıyaka: 30, Urla: 45 },
};
export const commute = (district: string, to: Destination) => COMMUTE[district]?.[to] ?? 45;

export type Loan = { down: number; months: number; rate: number }; // down as share, rate monthly %
export const defaultLoan: Loan = { down: 0.3, months: 120, rate: 2.79 };

/** Standard annuity instalment. */
export function instalment(price: number, loan: Loan) {
  const p = price * (1 - loan.down);
  const r = loan.rate / 100;
  return r === 0 ? p / loan.months : (p * r) / (1 - (1 + r) ** -loan.months);
}

/** Rough utilities by net area (example: 32 ₺/m² a month). */
export const utilities = (net: number) => Math.round(net * 32);

export function monthly(l: Listing, loan: Loan) {
  const base = l.deal === "Kiralık" ? l.price : instalment(l.price, loan);
  return { base: Math.round(base), dues: l.dues, utilities: utilities(l.net), total: Math.round(base + l.dues + utilities(l.net)) };
}

export const tl = (n: number) => `${Math.round(n).toLocaleString("tr-TR")} ₺`;
export const short = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} milyon ₺` : tl(n));

/** "Bornova'ya", "Alsancak'a": the Turkish dative suffix with vowel harmony. */
export function toPlace(name: string) {
  const vowels = [...name.toLocaleLowerCase("tr")].filter((c) => "aeıioöuü".includes(c));
  const last = vowels[vowels.length - 1] ?? "a";
  const suffix = "aıou".includes(last) ? "a" : "e";
  const endsInVowel = "aeıioöuü".includes(name.toLocaleLowerCase("tr").slice(-1));
  return `${name}'${endsInVowel ? "y" : ""}${suffix}`;
}
