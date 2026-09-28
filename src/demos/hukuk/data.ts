// Ferah & Ilgaz Hukuk Bürosu: a fictional law firm for the "hukuk ve
// danışmanlık" website demo. Written the way Turkish bar rules require a law
// firm site to be: informative only, no prices, no claims of superiority, no
// promised outcomes and no client testimonials.

export type AreaId = "is" | "aile" | "kira" | "ticaret" | "miras" | "tuketici";

export const areas: { id: AreaId; name: string; covers: string[] }[] = [
  { id: "is", name: "İş hukuku", covers: ["İşe iade ve kıdem-ihbar tazminatı", "Fazla mesai ve ücret alacakları", "İş sözleşmesi hazırlama"] },
  { id: "aile", name: "Aile hukuku", covers: ["Anlaşmalı ve çekişmeli boşanma", "Velayet ve nafaka", "Mal rejiminin tasfiyesi"] },
  { id: "kira", name: "Kira ve gayrimenkul", covers: ["Kira bedeli tespiti ve tahliye", "Kira alacağı takibi", "Tapu ve kat mülkiyeti uyuşmazlıkları"] },
  { id: "ticaret", name: "Ticaret ve şirketler", covers: ["Şirket kuruluşu ve esas sözleşme", "Ticari sözleşmeler", "Alacak takibi ve icra"] },
  { id: "miras", name: "Miras hukuku", covers: ["Mirasçılık belgesi", "Vasiyetname ve saklı pay", "Ortaklığın giderilmesi"] },
  { id: "tuketici", name: "Tüketici hukuku", covers: ["Ayıplı mal ve hizmet", "Abonelik ve banka uyuşmazlıkları", "Tüketici hakem heyeti başvuruları"] },
];

/** Plain-language situations a visitor recognises, mapped to an area. */
export const situations: { id: string; says: string; area: AreaId; means: string; bring: string[] }[] = [
  {
    id: "isten-cikarildim",
    says: "İşten çıkarıldım",
    area: "is",
    means: "Fesih şekline ve kıdeminize göre işe iade ya da tazminat hakkınız doğabilir. Bazı başvurular için süreler kısadır; beklemeden danışmanız önemlidir.",
    bring: ["İş sözleşmesi", "Fesih bildirimi (yazılı ya da mesaj)", "Son birkaç aya ait maaş bordroları", "SGK hizmet dökümü"],
  },
  {
    id: "maasim-odenmiyor",
    says: "Maaşım ya da mesai ücretim ödenmiyor",
    area: "is",
    means: "Ödenmeyen ücret ve fazla mesai alacakları için arabuluculuk ve dava yolu değerlendirilir.",
    bring: ["Maaş bordroları ve banka dökümleri", "Çalışma saatlerini gösteren kayıtlar", "Varsa işverenle yazışmalar"],
  },
  {
    id: "bosanmak-istiyorum",
    says: "Boşanmak istiyorum",
    area: "aile",
    means: "Tarafların anlaşıp anlaşmamasına göre süreç ve süre değişir; velayet, nafaka ve mal paylaşımı birlikte ele alınır.",
    bring: ["Nüfus kayıt örneği", "Varsa evlilik öncesi/sonrası mal bilgileri", "Çocuklarla ilgili belgeler"],
  },
  {
    id: "kiracim-odemiyor",
    says: "Kiracım kirayı ödemiyor",
    area: "kira",
    means: "Kira alacağının tahsili ve gerekirse tahliye için icra ya da dava yolu izlenebilir; ihtar süreleri önemlidir.",
    bring: ["Kira sözleşmesi", "Ödeme dekontları", "Varsa gönderilmiş ihtarname"],
  },
  {
    id: "sirket-kuruyorum",
    says: "Şirket kuruyorum",
    area: "ticaret",
    means: "Şirket türü, ortaklık payları ve esas sözleşme, ileride çıkabilecek anlaşmazlıkları baştan önler.",
    bring: ["Ortakların kimlik bilgileri", "Planlanan sermaye ve pay dağılımı", "Faaliyet konusu"],
  },
  {
    id: "miras-paylasimi",
    says: "Miras paylaşımında anlaşamıyoruz",
    area: "miras",
    means: "Mirasçılık belgesiyle başlayan süreçte paylaşım anlaşmayla ya da ortaklığın giderilmesi davasıyla çözülebilir.",
    bring: ["Veraset ilamı ya da mirasçılık belgesi", "Tapu ve banka bilgileri", "Varsa vasiyetname"],
  },
  {
    id: "urun-bozuk-cikti",
    says: "Aldığım ürün bozuk çıktı, iade edilmiyor",
    area: "tuketici",
    means: "Tutara göre tüketici hakem heyetine ya da tüketici mahkemesine başvurulabilir.",
    bring: ["Fatura ya da fiş", "Satıcıyla yazışmalar", "Ürünün durumunu gösteren fotoğraflar"],
  },
];

export const lawyers = [
  { name: "Av. Selin Ferah", focus: "İş hukuku, ticaret ve şirketler", note: "Kurucu ortak" },
  { name: "Av. Kerem Ilgaz", focus: "Aile, miras ve kira hukuku", note: "Kurucu ortak" },
];

/** How a new matter starts: a real sequence, so it is numbered. */
export const steps = [
  { name: "Ön görüşme", text: "Durumunuzu dinliyor, hangi hukuki yolların mümkün olduğunu ve sürelerin ne olduğunu anlatıyoruz." },
  { name: "Değerlendirme", text: "Belgelerinizi inceleyip izlenebilecek yolu, olası süreyi ve masraf kalemlerini yazılı olarak paylaşıyoruz." },
  { name: "Vekâlet ve takip", text: "Birlikte karar verirseniz vekâletle süreci yürütüyor, her aşamada sizi bilgilendiriyoruz." },
];

export const areaName = (id: AreaId) => areas.find((a) => a.id === id)!.name;
