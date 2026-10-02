import type { Widen } from "@/lib/i18n";

// ============================================================================
//  Sitenin tüm içeriği — tek kaynak.
//  Tasarım ne olursa olsun metinler, bağlantılar ve görseller buradan okunur.
//  Bir şeyi değiştirmek için yalnızca bu dosyayı düzenle.
// ============================================================================

// --- Site ve SEO ------------------------------------------------------------
export const site = {
  url: "https://www.burakalpyahsi.com/",
  // Arama sonucunda görünen başlık ve açıklama. Hizmet sayfalarının hedeflediği
  // kelimeler (kurumsal web sitesi, yapay zekâ otomasyonu...) burada da geçer.
  title: "Burak Alp Yahşi — Web Sitesi ve Yapay Zekâ Otomasyonu",
  description:
    "Kurumsal web sitesi, yapay zekâ otomasyonu, online randevu sistemi ve mobil uygulama geliştiriyorum. Fikirden tasarıma, koddan yayına tek elden.",
  ogDescription:
    "SaaS, yapay zekâ ve dijital deneyimler. Seçilmiş projeler, çalışma yaklaşımım ve deneyimlerim.",
  ogImage: "/og.png",
  language: "tr",
  copyright: "© 2026 Burak Alp Yahşi",
};

// --- Hero ---------------------------------------------------------------------
// Görseldeki birbirine uzanan iki ele bağlı: aradaki boşluk tek bir tık.
export const hero = {
  lines: ["Fikrinle ürün arasında", "bir tık var."],
  copy: "Web siteleri, yapay zekâ otomasyonları ve mobil uygulamalar geliştiriyorum.",
  copySecondLine: "Tasarımdan yayına kadar yanındayım.",
  cta: "Fikrini anlat",
};

// --- Kişi -------------------------------------------------------------------
export const person = {
  name: "Burak Alp Yahşi",
  shortName: "Burak",
  location: "Türkiye",
  greeting: "Merhaba, ben Burak Alp Yahşi",
  headline: ["Fikirleri", "hayata", "geçiriyorum."],
  intro: "SaaS platformları, yapay zekâ araçları ve dijital deneyimler.",
  introSecondLine: "Fikirden tasarıma, koddan yayına.",
  focusAreas: ["Ürün geliştirme", "Yapay zekâ", "Web & mobil"],
  manifesto:
    "İşin hem teknik hem ürün tarafını seviyorum. Bir problemi anlamak, çözümü tasarlamak ve gerçekten hayata geçirmek.",
  bio: "Ben Burak. Yönetim Bilişim Sistemleri mezunuyum. TypeScript ile arayüzler, Python ile yapay zekâ ve veri sistemleri geliştiriyorum. Merak ettiğim şey aynı: teknoloji, gerçek bir ihtiyacı nasıl daha iyi karşılar?",
  languages: [
    {
      name: "İngilizce",
      level: "B2+ (öz değerlendirme)",
      note: "İngilizce hazırlık ve İngilizce lisans eğitimi aldım. ABD’de Work and Travel programıyla çalışma ve günlük yaşam deneyimi edindim.",
    },
  ],
  availability: "İş birliklerine açığım",
};

// --- İletişim ve bağlantılar -----------------------------------------------
export const contact = {
  email: "hello@burakalpyahsi.com",
  phone: "+90 507 397 5060",
  phoneHref: "tel:+905073975060",
  heading: ["Bir fikrin mi var?", "Birlikte kuralım."],
  cta: "Birlikte çalışalım",
};

export const socials = [
  { label: "GitHub", handle: "burakalpyahsi", href: "https://github.com/burakalpyahsi" },
  { label: "GitHub (ikinci hesap)", handle: "itszeang", href: "https://github.com/itszeang" },
  { label: "X", handle: "@itszeang", href: "https://x.com/itszeang" },
  { label: "LinkedIn", handle: "burakalpyahsi", href: "https://www.linkedin.com/in/burakalpyahsi/" },
  { label: "Instagram", handle: "@burakalpyahsi", href: "https://www.instagram.com/burakalpyahsi/" },
];

// --- Hizmetler ----------------------------------------------------------------
export const servicesIntro = {
  title: "Fikri, çalışan bir ürüne",
  subtitle: "dönüştürüyorum.",
};

export const services = [
  {
    id: "ai",
    name: "Yapay zekâ otomasyonları",
    tagline: "Tekrarlayan işi yapay zekâya devret.",
    description:
      "Tekrarlanan iş akışlarını, veriyi ve kullandığınız araçları birbirine bağlayan özel otomasyonlar.",
    includes: [
      "WhatsApp ve e-posta yanıt asistanları",
      "Fatura, form ve belge okuma",
      "Kendi belgelerinle çalışan, kaynak gösteren asistan",
      "Tablo, CRM ve takvim entegrasyonları",
    ],
    project: null,
  },
  {
    id: "web",
    name: "Web siteleri ve web uygulamaları",
    tagline: "Markanı doğru anlatan, gerçek bir ihtiyacı çözen siteler.",
    description:
      "Markayı doğru anlatan kurumsal siteler, landing page'ler ve yönetim paneli gibi gerçek bir ihtiyacı çözen web uygulamaları.",
    includes: [
      "Mobil uyumlu kurumsal site ve landing page",
      "WhatsApp, arama ve harita bağlantıları",
      "Temel SEO ve paylaşım önizlemeleri",
      "Alan adı ve yayın kurulumu",
      "Yönetim paneli ve müşteri portalı",
    ],
    project: null,
  },
  {
    id: "randevu",
    name: "Randevu sistemleri",
    tagline: "Telefon trafiğini online takvime çevir.",
    description:
      "Müsaitlik, rezervasyon, hatırlatma ve yönetim süreçlerini tek akışta birleştiren sistemler.",
    includes: [
      "Online randevu sayfası",
      "SMS veya WhatsApp hatırlatmaları",
      "Personel ve hizmet bazlı takvim",
      "Yönetim paneli",
    ],
    project: null,
  },
  {
    id: "mobil",
    name: "Mobil uygulamalar",
    tagline: "Cepte hızlı, günlük kullanıma hazır.",
    description:
      "iOS ve Android için hızlı, anlaşılır ve günlük kullanıma hazır mobil ürün deneyimleri.",
    includes: ["iOS ve Android", "Bildirimler", "Üyelik ve profil", "Mağaza yayın süreci"],
    project: null,
  },
] as const;

// --- Projeler -----------------------------------------------------------------
export const projectsIntro = {
  title: "Fikir güzel.",
  subtitle: "Çalışanı daha güzel.",
  lead: "Gerçek ihtiyaçlardan yola çıkan, uçtan uca geliştirdiğim ürünler.",
  filters: ["Tümü", "SaaS & Web", "Yapay zekâ"],
  // Örnek çalışmalar ızgarası; görünür proje yokken bölümün tek içeriği budur.
  examples: {
    title: "Örnek çalışmalar",
    lead: "Yayındaki ürünüm ReviewMS ve kurgusal işletmeler için tasarlayıp geliştirdiğim siteler, randevu sistemleri, yapay zekâ asistanları. Örneklerin her biri tarayıcıda açılıp denenebilir.",
  },
};

export const projects = [
  {
    id: "reviewms",
    // false yapınca ana sayfadan, hizmet sayfalarından ve llms.txt'den kalkar.
    visible: true,
    // Ana sayfadaki örnek ızgarasında hangi süzgeçlerde ve kaçıncı sırada durduğu
    // (hem web sitesi hem mobil uygulaması olan bir ürün).
    grid: { services: ["web", "mobil"], position: 6 },
    name: "ReviewMS",
    kind: "SaaS · Web + Mobil",
    category: "SaaS & Web",
    featured: true,
    status: "Web yayında",
    headline: "Bir dokunuşla başlayan dijital bağlantı.",
    description: "Fiziksel bir dokunuştan, dijital bir deneyime.",
    summary:
      "İşletmelerin NFC kartlarını, yönlendirmelerini ve etkileşimlerini tek yerden yönettiği platform.",
    longSummary:
      "NFC kartlarından mobil yönetime. İşletmelerin fiziksel temas noktalarını dijital olarak yönettiği platform.",
    problem:
      "Fiziksel NFC kartlarının yönlendirmelerini ve kullanımını işletmeler için yönetilebilir kılmak.",
    solution:
      "Kartı değiştirmeden hedef bağlantıyı güncelleme, işletmeye özel erişim ve mobil yönetimi tek bir üründe birleştirdim.",
    role: "Ürün tasarımı ve uçtan uca geliştirme",
    details: [
      "Kart yönetimi ve yönlendirme",
      "Günlük ve haftalık etkileşim analitiği",
      "Web paneli ve mobil uygulama",
    ],
    tags: ["Çok kiracılı mimari", "Mobil uygulama", "Analitik"],
    links: [{ label: "Ürünü ziyaret et", href: "https://reviewms.com" }],
    // Gerçek uygulama ekranları (public/images). Ekran metinleri İngilizcedir.
    images: [
      { src: "/images/reviewms-1.webp", alt: "ReviewMS mobil uygulaması — Genel bakış" },
      { src: "/images/reviewms-2.webp", alt: "ReviewMS mobil uygulaması — Kartlarım" },
      { src: "/images/reviewms-3.webp", alt: "ReviewMS mobil uygulaması — Kart oluşturma" },
      { src: "/images/reviewms-4.webp", alt: "ReviewMS mobil uygulaması — Kart tarama" },
      { src: "/images/reviewms-5.webp", alt: "ReviewMS mobil uygulaması — Geri bildirim" },
      { src: "/images/reviewms-6.webp", alt: "ReviewMS mobil uygulaması — İçgörüler" },
    ],
    imageSize: { width: 520, height: 1127 },
    // reviewms.com'dan 1440×900 ekran görüntüleri (1200 px); ana sayfadaki
    // galeri kartı kaydırdıkça bunlar arasında geçer.
    siteImages: [
      { src: "/images/reviewms-site-1.webp", alt: "reviewms.com ana sayfası: Bir dokunuş. Ölçülebilir bir deneyim." },
      { src: "/images/reviewms-site-2.webp", alt: "reviewms.com: Kartı değil, temas noktasını yönetin." },
      { src: "/images/reviewms-site-3.webp", alt: "reviewms.com: Yönetim ve içgörü tek panelde." },
      { src: "/images/reviewms-site-4.webp", alt: "reviewms.com: Her dokunuşun devamını görün." },
      { src: "/images/reviewms-site-5.webp", alt: "reviewms.com: Kartınız sizde. Kontrolü de sizde." },
    ],
  },
];
export type Project = Widen<(typeof projects)[number]>;
export const visibleProjects = projects.filter((p) => p.visible);

export const otherWork = {
  title: "Diğer çalışmalar",
  summary: "Sky-Cart ve arayüz deneyleri",
  links: [
    { label: "Sky-Cart — E-ticaret", href: "https://github.com/burakalpyahsi/Sky-Cart" },
    { label: "Diğer kod çalışmaları", href: "https://github.com/burakalpyahsi?tab=repositories" },
  ],
};

// --- Çalışma yaklaşımı --------------------------------------------------------
export const approach = {
  title: "İyi fikirden,",
  subtitle: "iyi çalışan ürüne.",
  lead: "Ürünün her adımını düşünürüm. Çünkü bütün parçalar birbirine bağlı.",
  steps: [
    {
      name: "Problemi anla",
      headline: "Önce doğru soru.",
      text: "İhtiyacı, kullanıcıyı ve problemi anlarım. Çözümün neyi kolaylaştıracağını netleştiririm.",
    },
    {
      name: "Çözümü tasarla",
      headline: "Akışı görünür kıl.",
      text: "Kullanıcı akışını, arayüzü ve sistemin parçalarını birlikte tasarlarım.",
    },
    {
      name: "Ürünü geliştir",
      headline: "Fikri çalışan sisteme çevir.",
      text: "Arayüz, veri ve yapay zekâ katmanlarını bir araya getiririm.",
    },
    {
      name: "Yayına al",
      headline: "Gerçek hayata çıkar.",
      text: "Ürünü yayına alır, kullanım akışlarını kontrol eder ve geri bildirimle geliştiririm.",
    },
  ],
};

// --- Deneyim ------------------------------------------------------------------
export const experienceIntro = {
  title: "Farklı alanlar.",
  subtitle: "Ortak merak.",
  lead: "Veri, operasyon ve teknoloji arasında kurduğum bağlantılar.",
};

export const experience = [
  {
    date: "Şub — Haz 2026",
    place: "İzmir",
    company: "CTS Makina A.Ş.",
    role: "Tedarik Zinciri Yönetimi Stajyeri",
    description:
      "Tedarik zinciri süreçlerinde proje raporlama, veri analitiği ve Power BI ile performans göstergelerinin takibi.",
  },
  {
    date: "2023 — Ara 2025",
    place: "Uzaktan",
    company: "Yandex",
    role: "Arama Kalitesi Uzmanı → Ekip Lideri",
    description:
      "Arama kalitesi, sorgu niyeti ve veri doğruluğu. Uzmanlıktan ekip liderliğine uzanan süreçte performans takibi ve kalite raporlaması; uluslararası ekiplerle İngilizce çalışma.",
  },
  {
    date: "Haz — Tem 2025",
    place: "Ankara",
    company: "Hagat Savunma Teknolojileri",
    role: "Proje Yönetimi Stajyeri",
    description:
      "Üretim operatörleri için web tabanlı ölçüm kayıt sistemi geliştirdim. HTML, CSS, JavaScript ve Firebase ile kâğıt formları dijital bir akışa taşıdım.",
  },
  {
    date: "Haz — Eyl 2023",
    place: "Maryland, ABD",
    company: "Winkler Pool Management",
    role: "Cankurtaran · Kültürel değişim programı",
    description:
      "Sertifikalı cankurtaran olarak sorumluluk, ilk yardım ve kültürlerarası iletişim deneyimi.",
  },
];

// --- Eğitim ve sertifikalar ---------------------------------------------------
export const education = {
  school: "İzmir Bakırçay Üniversitesi",
  program: "Yönetim Bilişim Sistemleri · İngilizce Lisans",
  years: "2021 — 2026",
  gpa: "Genel not ortalaması: 3,21 / 4,00",
  note: "Mezun",
};

export const certificates = [
  { name: "Hugging Face ile Çalışma", provider: "DataCamp · 2026" },
  { name: "OpenAI API ile İstem Mühendisliği", provider: "DataCamp · 2026" },
  { name: "OpenAI API ile Çalışma", provider: "DataCamp · 2026" },
  { name: "Makine Öğrenmesi Matematiği: Lineer Cebir", provider: "Imperial College London · 2024" },
  { name: "Makine Öğrenmesi Matematiği: Çok Değişkenli Analiz", provider: "Imperial College London · 2024" },
  { name: "Canias ERP", provider: "Canias 4.0 Baltic · 2025" },
  { name: "RPA Geliştirici Temelleri", provider: "UiPath Academy · 2025" },
  { name: "R ile Veri Bilimine Giriş", provider: "BTK Akademi · 2024" },
  { name: "Web Geliştirme: HTML5, CSS3, JavaScript", provider: "IBM · edX · 2024" },
];

// --- Teknoloji ----------------------------------------------------------------
export const stackIntro = { title: "Fikre uygun teknoloji." };

export const stack = [
  { area: "Arayüz", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Zustand"] },
  {
    area: "Veri & Sunucu",
    items: ["Python", "FastAPI", "REST API", "SQLite", "Çok kiracılı mimari", "Yetkilendirme"],
  },
  {
    area: "Yapay zekâ",
    items: ["RAG", "Ollama", "OpenAI API", "Hugging Face", "FAISS", "ChromaDB", "BM25"],
  },
  { area: "Araçlar", items: ["Tauri", "Power BI", "Vercel", "Git", "JavaScript", "HTML & CSS"] },
];

// --- Arayüz yazıları (buton, bağlantı ve küçük etiketler) --------------------
export const ui = {
  skipLink: "Projelere geç",
  heroPrimary: "Projelerimi keşfet",
  heroSecondary: "Hizmetler",
  requestQuote: "Teklif iste",
  exampleProject: "Örnek",
  viewProject: "Projeyi incele",
  liveSite: "Canlı site",
  newTab: "(yeni sekmede açılır)",
  projectCount: "proje",
  projectDialog: { need: "İhtiyaç", approach: "Yaklaşımım", role: "Katkım" },
  servicesFor: "Kimler için:",
  stackLabel: "Araç kutum",
  credentials: "Eğitim & sertifikalar",
  copyEmail: "E-posta adresini kopyala",
  copied: "E-posta adresi kopyalandı.",
  copyFailed: "Kopyalanamadı. E-posta adresini seçerek kopyalayabilirsin.",
  backToTop: "Başa dön",
  themeLight: "Açık temaya geç",
  themeDark: "Koyu temaya geç",
  menuOpen: "Menüyü aç",
  menuClose: "Menüyü kapat",
  nav: [
    { id: "hizmetler", label: "Hizmetler" },
    { id: "projeler", label: "Projeler" },
    { id: "yaklasim", label: "Yaklaşımım" },
    { id: "deneyim", label: "Deneyim" },
    { id: "hakkimda", label: "Hakkımda" },
  ],
};

// --- Hizmet sayfaları (/hizmetler/...) -----------------------------------------
// Her hizmetin kendi sayfası; her sayfa tek bir aranan kelimeyi hedefler
// (Semrush, Türkiye verisi, Eylül 2026). `id`, yukarıdaki `services` ile eşleşir.
// Fiyat, süre gibi kesin rakamlar bilinçli olarak yazılmadı; eklemek istersen
// buraya ekle.
export const servicePages = [
  {
    id: "web",
    slug: "kurumsal-web-sitesi",
    keyword: "kurumsal web sitesi", // ~590 arama/ay, zorluk %8
    title: "Kurumsal Web Sitesi Yaptırma",
    description:
      "Markanı doğru anlatan, mobil uyumlu ve hızlı kurumsal web sitesi. Tasarım, SEO, alan adı ve yayın kurulumu dahil; fikirden yayına tek elden.",
    h1: "Kurumsal web sitesi",
    lead: "Markanı doğru anlatan, telefonda da hızlı açılan ve Google'da bulunabilen bir web sitesi. Tasarımdan yayına kadar her adımı ben üstleniyorum.",
    body: [
      "Bir kurumsal web sitesinin işi, ziyaretçiye birkaç saniye içinde ne yaptığını, neden güvenilir olduğunu ve seninle nasıl iletişime geçeceğini anlatmak. Hazır tema yerine işine göre tasarlanmış, hafif ve hızlı bir site kuruyorum.",
      "Site; WhatsApp, telefon ve harita bağlantılarıyla gelir. Paylaşıldığında düzgün bir önizleme görünür, arama motorlarının okuyabileceği şekilde işaretlenir. Alan adı bağlama ve yayına alma süreci de dahil.",
      "Kurumsal site, landing page ya da siparişleri, müşterileri ve stokları tek ekranda toplayan bir yönetim paneli gibi bir web uygulaması; kapsamı ilk görüşmede birlikte netleştiriyoruz.",
    ],
    audience: [
      "Web sitesi olmayan ya da sitesi güncel olmayan işletmeler",
      "Yeni bir ürün veya hizmet için landing page isteyenler",
      "Sosyal medyadan gelen ilgiyi siteye taşımak isteyen markalar",
    ],
    faq: [
      {
        q: "Web sitesi yaptırma fiyatı neye göre belirleniyor?",
        a: "Sayfa sayısı, özel tasarım ihtiyacı, içerik yönetimi ve entegrasyonlar (randevu, form, ödeme gibi) fiyatı belirler. İhtiyacını dinledikten sonra kapsamı ve fiyatı net olarak paylaşıyorum.",
      },
      {
        q: "Site mobil uyumlu olacak mı?",
        a: "Evet. Tasarıma telefondan başlıyorum; site her ekran boyutunda düzgün görünür ve hızlı açılır.",
      },
      {
        q: "SEO çalışması dahil mi?",
        a: "Temel SEO dahil: sayfa başlıkları ve açıklamaları, site haritası, yapısal veri, paylaşım önizlemeleri ve Google Search Console kurulumu.",
      },
      {
        q: "Alan adı ve yayın kurulumu kimde?",
        a: "Alan adını bağlama ve siteyi yayına alma işini ben yapıyorum. Alan adı senin adına kayıtlı kalır.",
      },
      {
        q: "Yönetim paneli ya da özel bir web uygulaması da yapıyor musun?",
        a: "Evet. Excel ve kâğıt formlarla yürüyen süreçleri, ekibine özel ve yetkilendirmeli bir web paneline taşıyorum. Hagat Savunma Teknolojileri'nde üretim ölçüm kayıtlarını bu şekilde dijitale taşıdım.",
      },
    ],
    related: "reviewms",
  },
  {
    id: "ai",
    slug: "yapay-zeka-otomasyonu",
    keyword: "yapay zeka otomasyon", // ~320 arama/ay, zorluk %19
    title: "Yapay Zekâ Otomasyonu ve WhatsApp Asistanı",
    description:
      "Tekrarlayan işleri yapay zekâya devret: WhatsApp ve e-posta yanıt asistanları, fatura ve belge okuma, CRM ve takvim entegrasyonları.",
    h1: "Yapay zekâ otomasyonu",
    lead: "Her gün elle yapılan, tekrarlayan işleri yapay zekâya devrediyorum: müşteri mesajlarını yanıtlayan asistanlar, belgeleri okuyan akışlar, birbirine bağlanan araçlar.",
    body: [
      "Otomasyonun değeri, ekibin zamanını geri vermesinde. Önce hangi işin tekrar ettiğini ve nerede zaman kaybedildiğini birlikte buluyoruz; sonra o işi yapan, senin araçlarınla konuşan bir akış kuruyorum.",
      "WhatsApp ve e-posta için yanıt asistanları, gelen fatura ve formlardan veri çıkaran akışlar, kendi belgelerinle çalışan ve cevabının kaynağını gösteren bir asistan bunlardan bazıları. Akışlar Google Sheets, CRM ve takvim gibi kullandığın araçlara bağlanır.",
      "Python, OpenAI ve FastAPI ile çalışıyorum. Asistanın neyi bilip neyi bilmediğini kontrol altında tutuyor, hassas verinin nereye gittiğini baştan netleştiriyorum.",
    ],
    audience: [
      "Gün boyu WhatsApp ve e-postada aynı soruları yanıtlayan işletmeler",
      "Fatura, form ve belgeleri elle sisteme giren ekipler",
      "Dağınık araçlarını tek bir akışta birleştirmek isteyenler",
    ],
    faq: [
      {
        q: "WhatsApp otomasyonu nasıl çalışıyor?",
        a: "Gelen mesajları, senin belirlediğin bilgi ve kurallarla yanıtlayan bir asistan kuruyorum. Asistanın bilmediği ya da insan gerektiren konular sana ya da ekibine aktarılır.",
      },
      {
        q: "Yapay zekâ yanlış bilgi verirse ne olur?",
        a: "Asistan yalnızca senin verdiğin kaynaklardan cevap verecek şekilde kuruluyor ve cevabının kaynağını gösterebiliyor. Emin olmadığı durumda soruyu bir insana devreder.",
      },
      {
        q: "Hangi araçlarla entegre olabilir?",
        a: "Google Sheets, e-posta, takvim, CRM'ler ve API'si olan çoğu araçla. Kullandığın araçları ilk görüşmede birlikte listeliyoruz.",
      },
    ],
    related: null,
  },
  {
    id: "randevu",
    slug: "online-randevu-sistemi",
    keyword: "online randevu sistemi",
    title: "Online Randevu Sistemi Kurulumu",
    description:
      "Telefon trafiğini online takvime çevir: randevu sayfası, SMS veya WhatsApp hatırlatmaları, personel ve hizmet bazlı takvim, yönetim paneli.",
    h1: "Online randevu sistemi",
    lead: "Müşterilerin sana telefon etmeden, uygun saati görüp randevu alabildiği; hatırlatmaların kendiliğinden gittiği bir randevu sistemi kuruyorum.",
    body: [
      "Randevuyu telefonla ya da mesajla yönetmek hem zaman alır hem de unutulan randevulara yol açar. Online randevu sistemiyle müsaitlik, rezervasyon ve hatırlatma tek akışta birleşir.",
      "Müşteri hizmeti ve personeli seçer, boş saatleri görür ve randevusunu alır. Randevudan önce SMS veya WhatsApp ile hatırlatma gider. Sen de hangi gün kimin geleceğini yönetim panelinden görürsün.",
      "Sistemi hazır bir kalıba sığdırmak yerine işletmenin çalışma şekline göre kuruyorum: hizmet süreleri, molalar, birden fazla personel ya da şube gibi ayrıntılar dahil.",
    ],
    audience: [
      "Kuaför, güzellik merkezi ve klinik gibi randevuyla çalışan işletmeler",
      "Danışmanlık ve eğitim veren serbest çalışanlar",
      "Telefonla randevu almaktan yorulan ekipler",
    ],
    faq: [
      {
        q: "Hatırlatmalar nasıl gönderiliyor?",
        a: "Randevudan önce, belirlediğin zamanda SMS veya WhatsApp üzerinden otomatik hatırlatma gider.",
      },
      {
        q: "Birden fazla personel ve hizmet olabilir mi?",
        a: "Evet. Her personelin kendi takvimi ve verebildiği hizmetler ayrı ayrı tanımlanabilir.",
      },
      {
        q: "Mevcut web siteme eklenebilir mi?",
        a: "Evet. Randevu sayfası mevcut sitene bağlanabilir ya da kendi alan adında ayrı bir sayfa olarak çalışabilir.",
      },
    ],
    related: null,
  },
  {
    id: "mobil",
    slug: "mobil-uygulama-gelistirme",
    keyword: "mobil uygulama yaptırma",
    title: "Mobil Uygulama Geliştirme (iOS ve Android)",
    description:
      "iOS ve Android için hızlı, anlaşılır mobil uygulamalar: bildirimler, üyelik ve profil, web paneli ve mağaza yayın süreci dahil.",
    h1: "Mobil uygulama geliştirme",
    lead: "iOS ve Android için hızlı, anlaşılır ve günlük kullanıma hazır mobil uygulamalar geliştiriyorum; mağazada yayına alınmasına kadar.",
    body: [
      "İyi bir mobil uygulama, kullanıcının aradığını birkaç dokunuşta bulabildiği uygulamadır. Önce akışı ve ekranları tasarlıyor, sonra iOS ve Android'de aynı deneyimi veren uygulamayı geliştiriyorum.",
      "Üyelik ve profil, bildirimler ve uygulamayı yönettiğin bir web paneli gerektiğinde projeye dahil. Uygulamanın App Store ve Google Play'de yayına alınma süreci de benden.",
      "ReviewMS'te bu yaklaşımla NFC kartlarını yöneten bir mobil uygulama ve web paneli geliştirdim.",
    ],
    audience: [
      "Müşterisine uygulama üzerinden hizmet vermek isteyen işletmeler",
      "Bir fikri mobil ürün olarak test etmek isteyen girişimler",
      "Web ürününü mobile taşımak isteyen ekipler",
    ],
    faq: [
      {
        q: "Mobil uygulama yaptırma fiyatı neye göre değişiyor?",
        a: "Ekran sayısı, üyelik ve ödeme gibi özellikler, web paneli ihtiyacı ve entegrasyonlar fiyatı belirler. Kapsamı birlikte netleştirdikten sonra fiyatı paylaşıyorum.",
      },
      {
        q: "iOS ve Android için ayrı ayrı mı geliştiriliyor?",
        a: "Projenin ihtiyacına göre karar veriyoruz. Çoğu projede iki platformda da çalışan tek bir kod tabanı süreyi ve bakım maliyetini düşürür.",
      },
      {
        q: "Mağazada yayına alma dahil mi?",
        a: "Evet. App Store ve Google Play başvuru ve yayın süreci dahil.",
      },
    ],
    related: "reviewms",
  },
] as const;
export type ServicePage = Widen<(typeof servicePages)[number]>;
export type Service = Widen<(typeof services)[number]>;

// --- Sektörler ------------------------------------------------------------------
// Web sitesi örnekleri sektöre göre gruplanır. Yeni bir sektörün ilk örneği
// eklendiğinde buraya da ekle; örneği olmayan sektör hiçbir yerde görünmez.
export const sectors = [
  { id: "guzellik", name: "Güzellik ve bakım" },
  { id: "hukuk", name: "Hukuk ve danışmanlık" },
  { id: "insaat", name: "İnşaat, mimarlık ve emlak" },
  { id: "restoran", name: "Restoran ve kafe" },
] as const;

// --- Örnek çalışmalar (demolar) -------------------------------------------------
// Her örnek, gösterdiği hizmetin sayfasında ve ana sayfadaki portföy ızgarasında
// bu sırayla listelenir; en güçlü görseller başta. Kart görseli:
// public/images/ornekler/<slug>.webp (1440×900 ekran görüntüsü, 1200 px).
// `frames` > 1 ise sayfanın aşağısından kareler de var: <slug>-2.webp … ve
// kart, ekranda yukarı çıktıkça site aşağı kayıyormuş gibi bunlara geçer.
// Adresi: /hizmetler/<hizmet sayfası>/<slug>. İşletmeler uydurmadır;
// her demo sayfasında bu açıkça yazar ve Google'da dizine eklenmez.
export const demos = [
  {
    slug: "lodos-meyhane",
    service: "web",
    name: "Lodos Meyhane",
    kind: "Restoran web sitesi",
    sector: "restoran",
    summary: "Fix menünün mezelerini tepsiden seçtiren, QR menüsü ve haftalık doluluğu olan meyhane sitesi.",
    accent: "#B3243B",
    surface: "#EDF1EF",
    frames: 5,
  },
  {
    slug: "esik-emlak",
    service: "web",
    name: "Eşik Gayrimenkul",
    kind: "Emlak ofisi web sitesi",
    sector: "insaat",
    summary: "İlanları aylık gerçek maliyet ve işe yol süresiyle sıralayan, kredi hesaplı emlak sitesi.",
    accent: "#6B7A2E",
    surface: "#F2D544",
    frames: 5,
  },
  {
    slug: "nara-studio",
    service: "web",
    name: "Nara Studio",
    kind: "Güzellik stüdyosu web sitesi",
    sector: "guzellik",
    summary: "Günün boş saatlerini gösteren, fiyat ve süreleri tek bakışta anlatan bir stüdyo sitesi.",
    accent: "#D9486F",
    surface: "#EAEFF1",
    frames: 5,
  },
  {
    slug: "ferah-ilgaz-hukuk",
    service: "web",
    name: "Ferah & Ilgaz Hukuk",
    kind: "Hukuk bürosu web sitesi",
    sector: "hukuk",
    summary: "Ziyaretçiyi kendi cümlesiyle doğru hukuk alanına yönlendiren, reklam yasağına uygun büro sitesi.",
    accent: "#6E1F2A",
    surface: "#FAFAF8",
    frames: 5,
  },
  {
    slug: "doksan-hali-saha",
    service: "randevu",
    name: "Doksan halı saha",
    kind: "Halı saha rezervasyonu",
    sector: "spor",
    summary: "Saatlik saha kiralama, kapora ve 24 saat iptal kuralı, sabit saat indirimi; maçtan sonra kadro ve kişi başı ücret.",
    accent: "#FF6A13",
    surface: "#1E8C45",
    frames: 5,
  },
  {
    slug: "mine-dis",
    service: "randevu",
    name: "Mine diş polikliniği",
    kind: "Diş kliniği randevu sistemi",
    sector: "saglik",
    summary: "Ağrıyan dişi şemada işaretletip aciliyete göre saat öneren, sağlık bilgisini açık rızayla alan randevu akışı.",
    accent: "#2D4BE0",
    surface: "#F2F4F9",
    frames: 5,
  },
  {
    slug: "etut-mimarlik",
    service: "web",
    name: "Etüt Mimarlık",
    kind: "Mimarlık ofisi web sitesi",
    sector: "insaat",
    summary: "Projeleri gerçek ölçekli, gezilebilir planlarla ve önce/sonra kaydırıcısıyla anlatan mimarlık sitesi.",
    accent: "#E4572E",
    surface: "#0E2A47",
    frames: 5,
  },
  {
    slug: "sinekkaydi-berber",
    service: "randevu",
    name: "Sinekkaydı berber",
    kind: "Berber canlı sıra ve randevu",
    sector: "guzellik",
    summary: "Dükkandaki sırayı canlı gösteren, sırası yaklaşınca yola çıkmayı söyleyen ve üç dokunuşta randevu alan berber uygulaması.",
    accent: "#E4412F",
    surface: "#CFE8DD",
    frames: 5,
  },
  {
    slug: "lodos-masa",
    service: "randevu",
    name: "Lodos masa rezervasyonu",
    kind: "Restoran masa rezervasyonu",
    sector: "restoran",
    summary: "Salon planından masa seçilen rezervasyon; işletme için gecenin tüm masalarını gösteren salon defteri.",
    accent: "#177E89",
    surface: "#1F3B34",
    frames: 1,
  },
  {
    slug: "mizan-fatura",
    service: "ai",
    name: "Mizan fatura okuyucu",
    kind: "Yapay zekâ ile fatura okuma",
    sector: "muhasebe",
    summary: "Faturayı okuyup mahsup fişini dolduran; emin olmadığı yeri kurşun kalemle yazıp onayınızı bekleyen ön muhasebe asistanı.",
    accent: "#1F3A93",
    surface: "#2C4234",
    frames: 1,
  },
  {
    slug: "kirpi-gelen-kutusu",
    service: "ai",
    name: "Kirpi gelen kutusu asistanı",
    kind: "E-posta sınıflandırma ve yanıt taslağı",
    sector: "eticaret",
    summary: "E-postaları önceliğe göre sıralayan, siparişe bakıp yanıt taslağı yazan, oltalamayı ve satış fırsatını ayıran asistan.",
    accent: "#C4A075",
    surface: "#A99F93",
    frames: 5,
  },
  {
    slug: "pusula-el-kitabi",
    service: "ai",
    name: "Pusula el kitabı asistanı",
    kind: "Kaynak gösteren belge asistanı",
    sector: "lojistik",
    summary: "Personel el kitabına sorulan soruyu ilgili maddeyi vurgulayarak cevaplayan, kitapta olmayanı uydurmayan asistan.",
    accent: "#2B4C9B",
    surface: "#E6D9BD",
    frames: 1,
  },
  {
    slug: "nara-randevu",
    service: "randevu",
    name: "Nara Studio randevu",
    kind: "Online randevu sistemi",
    sector: "guzellik",
    summary: "Hizmet, gün ve saat seçip randevu alma; işletme için günlük takvim ve doluluk paneli.",
    accent: "#D9486F",
    surface: "#EAEFF1",
    frames: 1,
  },
  {
    slug: "nara-asistan",
    service: "ai",
    name: "Nara mesaj asistanı",
    kind: "Yapay zekâ mesaj asistanı",
    sector: "guzellik",
    summary: "Fiyat soranlara cevap veren, takvime bakıp randevu oluşturan ve bilmediğini ekibe devreden asistan.",
    accent: "#9FB19A",
    surface: "#2B1830",
    frames: 1,
  },
] as const;
export type Demo = Widen<(typeof demos)[number]>;

// --- Arşiv: önceki tasarımlarda kullanılıp çıkarılan metinler -----------------
// Yeni tasarımda işine yararsa buradan al; kullanılmıyorsa silebilirsin.
export const archive = {
  heroBadges: ["Yeni fikirlere ve iş birliklerine açık", "Türkiye · dünyaya açık"],
  signoff: "Tasarımı düşünür. Sistemi kurar. Ürünü yayına alır.",
  note: ["İş + teknoloji.", "Fikir + uygulama.", "Merak hep aynı."],
  noteFooter: "Öğren. Üret. Geliştir.",
  learning: "Öğrenmeye devam.",
  reviewmsCard: "Bir dokunuş. Yeni bir bağlantı.",
  approachStageLabel: "Bir ürünün yolculuğu",
  aboutNoteLabel: "Not defteri / 2026",
  reviewmsKind: "SaaS platformu · web + mobil",
};
