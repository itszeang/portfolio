// Ferah & Ilgaz Hukuk Bürosu: a fictional law firm for the "hukuk ve
// danışmanlık" website demo. Written the way Turkish bar rules require a law
// firm site to be: informative only, no prices, no claims of superiority, no
// promised outcomes and no client testimonials. Text is kept in both
// languages side by side; `lawIn` picks one.

import type { Lang, Pair } from "@/lib/i18n";

export type AreaId = "is" | "aile" | "kira" | "ticaret" | "miras" | "tuketici";

const AREAS: { id: AreaId; name: Pair; covers: Pair<string[]> }[] = [
  {
    id: "is",
    name: { tr: "İş hukuku", en: "Employment law" },
    covers: {
      tr: ["İşe iade ve kıdem-ihbar tazminatı", "Fazla mesai ve ücret alacakları", "İş sözleşmesi hazırlama"],
      en: ["Reinstatement, severance and notice pay", "Unpaid overtime and wages", "Drafting employment contracts"],
    },
  },
  {
    id: "aile",
    name: { tr: "Aile hukuku", en: "Family law" },
    covers: {
      tr: ["Anlaşmalı ve çekişmeli boşanma", "Velayet ve nafaka", "Mal rejiminin tasfiyesi"],
      en: ["Uncontested and contested divorce", "Custody and maintenance", "Dividing marital property"],
    },
  },
  {
    id: "kira",
    name: { tr: "Kira ve gayrimenkul", en: "Tenancy and property" },
    covers: {
      tr: ["Kira bedeli tespiti ve tahliye", "Kira alacağı takibi", "Tapu ve kat mülkiyeti uyuşmazlıkları"],
      en: ["Rent reviews and eviction", "Recovering unpaid rent", "Title deed and flat ownership disputes"],
    },
  },
  {
    id: "ticaret",
    name: { tr: "Ticaret ve şirketler", en: "Commercial and company law" },
    covers: {
      tr: ["Şirket kuruluşu ve esas sözleşme", "Ticari sözleşmeler", "Alacak takibi ve icra"],
      en: ["Company formation and articles of association", "Commercial contracts", "Debt recovery and enforcement"],
    },
  },
  {
    id: "miras",
    name: { tr: "Miras hukuku", en: "Inheritance law" },
    covers: {
      tr: ["Mirasçılık belgesi", "Vasiyetname ve saklı pay", "Ortaklığın giderilmesi"],
      en: ["Certificate of inheritance", "Wills and reserved shares", "Partition of jointly inherited property"],
    },
  },
  {
    id: "tuketici",
    name: { tr: "Tüketici hukuku", en: "Consumer law" },
    covers: {
      tr: ["Ayıplı mal ve hizmet", "Abonelik ve banka uyuşmazlıkları", "Tüketici hakem heyeti başvuruları"],
      en: ["Faulty goods and services", "Subscription and bank disputes", "Applications to the consumer arbitration board"],
    },
  },
];

/** Plain-language situations a visitor recognises, mapped to an area. */
const SITUATIONS: { id: string; says: Pair; area: AreaId; means: Pair; bring: Pair<string[]> }[] = [
  {
    id: "isten-cikarildim",
    says: { tr: "İşten çıkarıldım", en: "I've been dismissed" },
    area: "is",
    means: {
      tr: "Fesih şekline ve kıdeminize göre işe iade ya da tazminat hakkınız doğabilir. Bazı başvurular için süreler kısadır; beklemeden danışmanız önemlidir.",
      en: "Depending on how you were dismissed and how long you worked there, you may be entitled to reinstatement or compensation. Some deadlines are short, so it's important to ask without waiting.",
    },
    bring: {
      tr: ["İş sözleşmesi", "Fesih bildirimi (yazılı ya da mesaj)", "Son birkaç aya ait maaş bordroları", "SGK hizmet dökümü"],
      en: ["Your employment contract", "The dismissal notice (a letter or a message)", "Payslips from the last few months", "Your SGK (social security) service record"],
    },
  },
  {
    id: "maasim-odenmiyor",
    says: { tr: "Maaşım ya da mesai ücretim ödenmiyor", en: "My wages or overtime aren't being paid" },
    area: "is",
    means: {
      tr: "Ödenmeyen ücret ve fazla mesai alacakları için arabuluculuk ve dava yolu değerlendirilir.",
      en: "For unpaid wages and overtime, mediation and a lawsuit are both considered.",
    },
    bring: {
      tr: ["Maaş bordroları ve banka dökümleri", "Çalışma saatlerini gösteren kayıtlar", "Varsa işverenle yazışmalar"],
      en: ["Payslips and bank statements", "Records showing your working hours", "Any messages with your employer"],
    },
  },
  {
    id: "bosanmak-istiyorum",
    says: { tr: "Boşanmak istiyorum", en: "I want a divorce" },
    area: "aile",
    means: {
      tr: "Tarafların anlaşıp anlaşmamasına göre süreç ve süre değişir; velayet, nafaka ve mal paylaşımı birlikte ele alınır.",
      en: "The process and how long it takes depend on whether you both agree; custody, maintenance and property are dealt with together.",
    },
    bring: {
      tr: ["Nüfus kayıt örneği", "Varsa evlilik öncesi/sonrası mal bilgileri", "Çocuklarla ilgili belgeler"],
      en: ["Your civil registry record", "Details of property from before and during the marriage", "Documents about the children"],
    },
  },
  {
    id: "kiracim-odemiyor",
    says: { tr: "Kiracım kirayı ödemiyor", en: "My tenant isn't paying the rent" },
    area: "kira",
    means: {
      tr: "Kira alacağının tahsili ve gerekirse tahliye için icra ya da dava yolu izlenebilir; ihtar süreleri önemlidir.",
      en: "Unpaid rent and, if needed, eviction can be pursued through enforcement or a lawsuit; the notice periods matter.",
    },
    bring: {
      tr: ["Kira sözleşmesi", "Ödeme dekontları", "Varsa gönderilmiş ihtarname"],
      en: ["The tenancy agreement", "Payment receipts", "Any formal notice already sent"],
    },
  },
  {
    id: "sirket-kuruyorum",
    says: { tr: "Şirket kuruyorum", en: "I'm setting up a company" },
    area: "ticaret",
    means: {
      tr: "Şirket türü, ortaklık payları ve esas sözleşme, ileride çıkabilecek anlaşmazlıkları baştan önler.",
      en: "Getting the company type, the partners' shares and the articles right prevents disputes later on.",
    },
    bring: {
      tr: ["Ortakların kimlik bilgileri", "Planlanan sermaye ve pay dağılımı", "Faaliyet konusu"],
      en: ["The partners' identity details", "Planned capital and share split", "What the company will do"],
    },
  },
  {
    id: "miras-paylasimi",
    says: { tr: "Miras paylaşımında anlaşamıyoruz", en: "We can't agree on sharing an inheritance" },
    area: "miras",
    means: {
      tr: "Mirasçılık belgesiyle başlayan süreçte paylaşım anlaşmayla ya da ortaklığın giderilmesi davasıyla çözülebilir.",
      en: "The process starts with a certificate of inheritance; the estate is then shared by agreement or through a partition case.",
    },
    bring: {
      tr: ["Veraset ilamı ya da mirasçılık belgesi", "Tapu ve banka bilgileri", "Varsa vasiyetname"],
      en: ["The certificate of inheritance", "Title deed and bank details", "The will, if there is one"],
    },
  },
  {
    id: "urun-bozuk-cikti",
    says: { tr: "Aldığım ürün bozuk çıktı, iade edilmiyor", en: "Something I bought is faulty and they won't take it back" },
    area: "tuketici",
    means: {
      tr: "Tutara göre tüketici hakem heyetine ya da tüketici mahkemesine başvurulabilir.",
      en: "Depending on the amount, you can apply to the consumer arbitration board or the consumer court.",
    },
    bring: {
      tr: ["Fatura ya da fiş", "Satıcıyla yazışmalar", "Ürünün durumunu gösteren fotoğraflar"],
      en: ["The invoice or receipt", "Messages with the seller", "Photos showing the fault"],
    },
  },
];

const LAWYERS = [
  { name: { tr: "Av. Selin Ferah", en: "Selin Ferah" }, focus: { tr: "İş hukuku, ticaret ve şirketler", en: "Employment, commercial and company law" }, note: { tr: "Kurucu ortak", en: "Founding partner" } },
  { name: { tr: "Av. Kerem Ilgaz", en: "Kerem Ilgaz" }, focus: { tr: "Aile, miras ve kira hukuku", en: "Family, inheritance and tenancy law" }, note: { tr: "Kurucu ortak", en: "Founding partner" } },
];

/** How a new matter starts: a real sequence, so it is numbered. */
const STEPS = [
  {
    name: { tr: "Ön görüşme", en: "First consultation" },
    text: {
      tr: "Durumunuzu dinliyor, hangi hukuki yolların mümkün olduğunu ve sürelerin ne olduğunu anlatıyoruz.",
      en: "We listen to your situation and explain which legal routes are open to you and what the deadlines are.",
    },
  },
  {
    name: { tr: "Değerlendirme", en: "Assessment" },
    text: {
      tr: "Belgelerinizi inceleyip izlenebilecek yolu, olası süreyi ve masraf kalemlerini yazılı olarak paylaşıyoruz.",
      en: "We review your documents and set out in writing the route we'd take, the likely timescale and the costs involved.",
    },
  },
  {
    name: { tr: "Vekâlet ve takip", en: "Power of attorney and follow-up" },
    text: {
      tr: "Birlikte karar verirseniz vekâletle süreci yürütüyor, her aşamada sizi bilgilendiriyoruz.",
      en: "If we decide together to go ahead, we take the matter on under a power of attorney and keep you informed at every stage.",
    },
  },
];

/** The firm's areas, situations, lawyers and steps in one language. */
export function lawIn(lang: Lang) {
  const areas = AREAS.map((a) => ({ id: a.id, name: a.name[lang], covers: a.covers[lang] }));
  return {
    areas,
    situations: SITUATIONS.map((s) => ({ id: s.id, says: s.says[lang], area: s.area, means: s.means[lang], bring: s.bring[lang] })),
    lawyers: LAWYERS.map((l) => ({ name: l.name[lang], focus: l.focus[lang], note: l.note[lang] })),
    steps: STEPS.map((s) => ({ name: s.name[lang], text: s.text[lang] })),
    areaName: (id: AreaId) => areas.find((a) => a.id === id)!.name,
  };
}
