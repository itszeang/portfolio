// ============================================================================
//  Sitenin tüm içeriği — tek kaynak.
//  Tasarım ne olursa olsun metinler, bağlantılar ve görseller buradan okunur.
//  Bir şeyi değiştirmek için yalnızca bu dosyayı düzenle.
// ============================================================================

// --- Site ve SEO ------------------------------------------------------------
export const site = {
  url: "https://www.burakalpyahsi.com/",
  title: "Burak Alp Yahşi — Fikirden ürüne",
  description:
    "Burak Alp Yahşi. Fikirleri çalışan ürünlere dönüştürüyorum. SaaS platformları, yapay zekâ araçları ve dijital deneyimler.",
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
];

// --- Hizmetler ----------------------------------------------------------------
export const servicesIntro = {
  title: "Fikri, çalışan bir ürüne",
  subtitle: "dönüştürüyorum.",
  lead: "Claude ve Codex destekli geliştirme süreciyle hızlı prototip, temiz uygulama ve ölçülebilir sonuç.",
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
      "Markayı doğru anlatan kurumsal siteler, landing page'ler ve gerçek bir ihtiyacı çözen web ürünleri.",
    includes: [
      "Mobil uyumlu kurumsal site ve landing page",
      "WhatsApp, arama ve harita bağlantıları",
      "Temel SEO ve paylaşım önizlemeleri",
      "Alan adı ve yayın kurulumu",
    ],
    project: "boyut",
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
    project: "reviewms",
  },
  {
    id: "panel",
    name: "İç araçlar ve dashboardlar",
    tagline: "Operasyonu görünür kıl.",
    description:
      "Operasyonları görünür kılan yönetim panelleri, veri ekranları ve ekibe özel üretkenlik araçları.",
    includes: ["Yönetim panelleri", "Veri ekranları ve raporlama", "Yetkilendirme", "Ekibe özel araçlar"],
    project: null,
  },
] as const;

// --- Projeler -----------------------------------------------------------------
export const projectsIntro = {
  title: "Fikir güzel.",
  subtitle: "Çalışanı daha güzel.",
  lead: "Gerçek ihtiyaçlardan yola çıkan, uçtan uca geliştirdiğim ürünler.",
  filters: ["Tümü", "SaaS & Web", "Yapay zekâ", "3D deneyim"],
};

export const projects = [
  {
    id: "reviewms",
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
  },
  {
    id: "boyut",
    name: "Boyut Atla",
    kind: "3D · Dijital deneyim",
    category: "3D deneyim",
    featured: false,
    status: "Web yayında",
    headline: "Mekânın ötesine geç.",
    description: "Mekânın ötesine geç.",
    summary:
      "Fiziksel mekânları, tarayıcıdan keşfedilen 3D sanal turlara dönüştüren stüdyo.",
    longSummary: "",
    problem:
      "Bir mekânı ziyaret etmeden, odaları ve aralarındaki ilişkiyi deneyimleyebilmek.",
    solution:
      "360° kamera, LiDAR ve fotogrametri ile elde edilen mekânları web üzerinden gezilebilir deneyimler olarak sunuyorum.",
    role: "Ürün, web ve 3D deneyim",
    details: [
      "3D dijital ikiz ve sanal tur",
      "Web sitesine gömülebilen deneyim",
      "Mobil için geometri ve doku optimizasyonu",
    ],
    tags: ["WebGL", "Fotogrametri", "Sanal tur"],
    links: [{ label: "Siteyi ziyaret et", href: "https://www.boyutatla.com" }],
    images: [],
    imageSize: null,
  },
];
export type Project = (typeof projects)[number];

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
