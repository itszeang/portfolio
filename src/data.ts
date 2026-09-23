export const projects = [
  {
    id: "reviewms",
    name: "ReviewMS",
    kind: "SaaS · Web + Mobil",
    description: "Fiziksel bir dokunuştan, dijital bir deneyime.",
    summary:
      "İşletmelerin NFC kartlarını, yönlendirmelerini ve etkileşimlerini tek yerden yönettiği platform.",
    role: "Ürün tasarımı ve uçtan uca geliştirme",
    tags: ["Çok kiracılı mimari", "Mobil uygulama", "Analitik"],
    url: "https://reviewms.com",
    label: "Ürünü ziyaret et",
    problem:
      "Fiziksel NFC kartlarının yönlendirmelerini ve kullanımını işletmeler için yönetilebilir kılmak.",
    solution:
      "Kartı değiştirmeden hedef bağlantıyı güncelleme, işletmeye özel erişim ve mobil yönetimi tek bir üründe birleştirdim.",
    details: [
      "Kart yönetimi ve yönlendirme",
      "Günlük ve haftalık etkileşim analitiği",
      "Web paneli ve mobil uygulama",
    ],
    status: "Web yayında",
  },
  {
    id: "boyut",
    name: "Boyut Atla",
    kind: "3D · Dijital deneyim",
    description: "Mekânın ötesine geç.",
    summary:
      "Fiziksel mekânları, tarayıcıdan keşfedilen 3D sanal turlara dönüştüren stüdyo.",
    role: "Ürün, web ve 3D deneyim",
    tags: ["WebGL", "Fotogrametri", "Sanal tur"],
    url: "https://boyutatla.com",
    label: "Siteyi ziyaret et",
    problem:
      "Bir mekânı ziyaret etmeden, odaları ve aralarındaki ilişkiyi deneyimleyebilmek.",
    solution:
      "360° kamera, LiDAR ve fotogrametri ile elde edilen mekânları web üzerinden gezilebilir deneyimler olarak sunuyorum.",
    details: [
      "3D dijital ikiz ve sanal tur",
      "Web sitesine gömülebilen deneyim",
      "Mobil için geometri ve doku optimizasyonu",
    ],
    status: "Web yayında",
  },
  {
    id: "scholar",
    name: "OfflineScholar",
    kind: "Yapay zekâ · Masaüstü",
    description: "Bilgi senin. Kontrol sende.",
    summary:
      "Kendi belgelerinle konuştuğun, yerel çalışan ve kaynak gösteren akademik asistan.",
    role: "Yapay zekâ, arayüz ve masaüstü paketleme",
    tags: ["Python", "RAG", "Tauri"],
    url: "https://github.com/itszeang/local-ai-academic-assistant",
    label: "Kaynak kodunu incele",
    problem:
      "Akademik belgeler arasında arama yaparken gizliliği ve kaynak izlenebilirliğini korumak.",
    solution:
      "Yerel modeller, hibrit arama ve atıflı yanıt üretimini birleştirdim. Yetersiz kanıt durumunda güvenli geri dönüşü akışın parçası yaptım.",
    details: [
      "BM25 + vektör arama + yeniden sıralama",
      "Soru-cevap, özet ve literatür taraması",
      "FastAPI, React, Tauri ve Ollama",
    ],
    status: "Kaynak kodu açık",
  },
  {
    id: "arkun",
    name: "ARKUN",
    kind: "ERP · Bitirme projesi",
    description: "Karmaşık üretim. Net bir sistem.",
    summary:
      "Savunma ve havacılık üretimi için izlenebilirlik ve kalite süreçlerine odaklanan ERP.",
    role: "Sistem tasarımı ve uçtan uca geliştirme",
    tags: ["Next.js", "Dijital ikiz", "İzlenebilirlik"],
    url: "https://arkunnext-gen.vercel.app",
    label: "Demoyu incele",
    problem:
      "Üretimde kalite, revizyon, kalibrasyon ve parça izlenebilirliğini birlikte ele almak.",
    solution:
      "Üretimin dijital ikizini temel alan modüler bir ERP bitirme projesi geliştirdim. Kalite uyumunu destekleyen kontroller ve iki dilli paneller tasarladım.",
    details: [
      "Kalibrasyon ve revizyon kontrolleri",
      "IIoT tabanlı parça izlenebilirliği",
      "Yapay zekâ destekli teklif modülü",
    ],
    status: "Demo yayında",
  },
];
export type Project = (typeof projects)[number];
export const experience = [
  {
    date: "ŞUB — HAZ 2026",
    place: "İzmir",
    company: "CTS Makina A.Ş.",
    role: "Tedarik Zinciri Yönetimi Stajyeri",
    description:
      "Tedarik zinciri süreçlerinde proje raporlama, veri analitiği ve Power BI ile performans göstergelerinin takibi.",
  },
  {
    date: "2023 — ARA 2025",
    place: "Uzaktan",
    company: "Yandex",
    role: "Arama Kalitesi Uzmanı → Ekip Lideri",
    description:
      "Arama kalitesi, sorgu niyeti ve veri doğruluğu. Uzmanlıktan ekip liderliğine uzanan süreçte performans takibi ve kalite raporlaması; uluslararası ekiplerle İngilizce çalışma.",
  },
  {
    date: "HAZ — TEM 2025",
    place: "Ankara",
    company: "Hagat Savunma Teknolojileri",
    role: "Proje Yönetimi Stajyeri",
    description:
      "Üretim operatörleri için web tabanlı ölçüm kayıt sistemi geliştirdim. HTML, CSS, JavaScript ve Firebase ile kâğıt formları dijital bir akışa taşıdım.",
  },
  {
    date: "HAZ — EYL 2023",
    place: "Maryland, ABD",
    company: "Winkler Pool Management",
    role: "Cankurtaran · Kültürel değişim programı",
    description:
      "Sertifikalı cankurtaran olarak sorumluluk, ilk yardım ve kültürlerarası iletişim deneyimi.",
  },
];
export const certificates = [
  ["Hugging Face ile Çalışma", "DataCamp · 2026"],
  ["OpenAI API ile İstem Mühendisliği", "DataCamp · 2026"],
  ["OpenAI API ile Çalışma", "DataCamp · 2026"],
  [
    "Makine Öğrenmesi Matematiği: Lineer Cebir",
    "Imperial College London · 2024",
  ],
  [
    "Makine Öğrenmesi Matematiği: Çok Değişkenli Analiz",
    "Imperial College London · 2024",
  ],
  ["Canias ERP", "Canias 4.0 Baltic · 2025"],
  ["RPA Geliştirici Temelleri", "UiPath Academy · 2025"],
  ["R ile Veri Bilimine Giriş", "BTK Akademi · 2024"],
  ["Web Geliştirme: HTML5, CSS3, JavaScript", "IBM · edX · 2024"],
];
