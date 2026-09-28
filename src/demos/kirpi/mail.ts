// Kirpi Seramik: a fictional two-person pottery workshop in Avanos, and a
// simulated inbox assistant for the "yapay zekâ otomasyonu" demo. Each e-mail
// carries what the assistant understood, where it looked and a draft in two
// tones. Nothing is sent: approving a draft only stamps it as sent.

/** The four shelves the morning post is sorted onto. */
export type Tray = "hemen" | "hazir" | "karar" | "dokunma";
export const trays: { id: Tray; name: string; hint: string }[] = [
  { id: "hemen", name: "Hemen", hint: "Bugün sizin bakmanız gereken" },
  { id: "hazir", name: "Cevabı hazır", hint: "Okuyup gönderin" },
  { id: "karar", name: "Karar sizin", hint: "Fiyat ya da iş kararı gerekiyor" },
  { id: "dokunma", name: "Dokunmayın", hint: "Cevap gerekmiyor ya da tehlikeli" },
];

export type Mark = { text: string; action: "circle" | "underline" | "box" | "highlight" | "crossed-off" };

export type Mail = {
  id: string;
  from: string;
  address: string;
  subject: string;
  time: string;
  body: string[];
  attachment?: string;
  tray: Tray;
  note: string; // the assistant's one line on the envelope
  marks: Mark[];
  understood: string[];
  checked: { where: string; found: string }[];
  draft?: { samimi: string; resmi: string };
  phishing?: string[];
  opportunity?: number;
  escalate?: string;
  noReply?: string;
};

export const mails: Mail[] = [
  {
    id: "m1",
    from: "Deniz Kaya",
    address: "deniz.k@ornek-posta.com",
    subject: "Kupalardan ikisi kırık geldi",
    time: "08:12",
    body: [
      "Merhaba,",
      "Dün teslim alınan KS-10455 numaralı siparişimde 4 kupanın ikisi kırık çıktı. Arkadaşıma hediye olacaktı, gerçekten çok üzüldüm. Fotoğrafları ekliyorum.",
      "Ne yapabiliriz?",
      "Deniz",
    ],
    attachment: "kirik-kupalar.jpg",
    tray: "hemen",
    note: "2 kupa kırık · yenisi bugün çıksın",
    marks: [
      { text: "KS-10455", action: "circle" },
      { text: "4 kupanın ikisi kırık", action: "underline" },
      { text: "hediye", action: "highlight" },
    ],
    understood: ["İki kupa kargoda kırılmış; fotoğraf bunu gösteriyor.", "Hediye olacakmış, müşteri üzgün. Önce özür, sonra çözüm."],
    checked: [
      { where: "Sipariş defteri", found: "KS-10455 · 4 × Ege mavisi kupa · 26 Eylül'de teslim" },
      { where: "Raf sayımı", found: "Ege mavisi kupadan 23 adet var" },
    ],
    escalate: "Ayşe'ye de haber verdim; şikâyetleri o görmek istiyor.",
    draft: {
      samimi:
        "Merhaba Deniz,\n\nBunu duyduğumuza çok üzüldük, hele hediye olacakken. Kırılan iki kupanın yenilerini bugün özenle paketleyip kargoya veriyoruz; kırıkları geri göndermenize gerek yok. Takip numarası akşam size ulaşır.\n\nAnlayışınız için teşekkürler,\nKirpi Seramik",
      resmi:
        "Sayın Deniz Kaya,\n\nKS-10455 numaralı siparişinizde yaşanan hasar için özür dileriz. Kırılan iki ürünün yenisi bugün kargoya verilecektir; hasarlı ürünleri iade etmenize gerek yoktur. Kargo takip numarası gün içinde tarafınıza iletilecektir.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m2",
    from: "Mavi Kahve Kadıköy",
    address: "satinalma@mavikahve.example",
    subject: "Açılış için 120 adet logolu kupa",
    time: "08:40",
    body: [
      "Merhabalar,",
      "Kasım ortasında Kadıköy'de açacağımız kafe için logomuzun basılı olduğu 120 adet kupa düşünüyoruz. Fiyat ve teslim süresi hakkında bilgi alabilir miyiz?",
      "İyi çalışmalar,",
      "Selin Öztürk · Mavi Kahve",
    ],
    tray: "karar",
    note: "toptan teklif · ~18.000 ₺",
    opportunity: 18000,
    marks: [
      { text: "120 adet kupa", action: "circle" },
      { text: "Kasım ortasında", action: "underline" },
    ],
    understood: ["Yeni açılan bir kafe, logolu 120 kupa istiyor.", "Kasım ortasına yetişmesi gerekiyor.", "Liste fiyatıyla yaklaşık 18.000 ₺; indirimi siz belirleyin."],
    checked: [
      { where: "Fiyat listesi", found: "Logolu kupa 150 ₺ · 100 adet üstü %15 indirim yapılabiliyor" },
      { where: "Fırın takvimi", found: "Yeni toplu iş için en erken teslim 3 hafta" },
    ],
    draft: {
      samimi:
        "Merhaba Selin Hanım,\n\nAçılışınız için şimdiden hayırlı olsun! 120 adet logolu kupada birim fiyatımız 150 ₺, 100 adedin üzerinde %15 indirim uyguluyoruz. Üretim yaklaşık 3 hafta sürüyor; Kasım ortasına rahatça yetişir.\n\nLogonuzun vektör dosyasını (SVG ya da PDF) ve istediğiniz renkleri gönderirseniz size bir örnek görsel hazırlayalım.\n\nSevgiyle,\nKirpi Seramik",
      resmi:
        "Sayın Selin Öztürk,\n\nTalebiniz için teşekkür ederiz. Logolu kupalarda birim fiyatımız 150 ₺'dir; 100 adet üzeri siparişlerde %15 indirim uygulanmaktadır. Üretim süresi yaklaşık üç haftadır ve Kasım ortası teslim mümkündür.\n\nTeklifi netleştirmek için logonuzun vektör dosyasını ve renk tercihlerinizi iletmenizi rica ederiz.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m3",
    from: "Kirpi Seramik Destek",
    address: "guvenlik@kirpi-seramik-destek.co",
    subject: "[ACİL] Mağaza hesabınız 24 saat içinde kapatılacak",
    time: "07:55",
    body: [
      "Sayın satıcı,",
      "Hesabınızda olağandışı hareket tespit edildi. Hesabınızın kapatılmaması için 24 saat içinde aşağıdaki bağlantıdan kimliğinizi ve kart bilgilerinizi doğrulayın.",
      "HESABIMI DOĞRULA: hxxp://kirpi-seramik-destek.co/dogrula",
      "Güvenlik Ekibi",
    ],
    tray: "dokunma",
    note: "sahte · kart bilgisi istiyor",
    marks: [
      { text: "24 saat içinde", action: "underline" },
      { text: "kart bilgilerinizi", action: "box" },
      { text: "hxxp://kirpi-seramik-destek.co/dogrula", action: "crossed-off" },
    ],
    understood: ["Hesabı kapatmakla korkutup kart bilgisi istiyor."],
    checked: [{ where: "Alan adı kaydı", found: "kirpi-seramik-destek.co sizin değil; 3 gün önce alınmış" }],
    phishing: [
      "Gönderen adres sizin alan adınız değil.",
      "Kart bilgisi istiyor; hiçbir pazar yeri bunu e-postayla istemez.",
      "24 saat diyerek acele ettiriyor.",
    ],
  },
  {
    id: "m4",
    from: "Elif Yıldırım",
    address: "elif.yildirim@ornek-posta.com",
    subject: "Siparişim nerede?",
    time: "09:05",
    body: ["Merhaba, 21 Eylül'de verdiğim KS-10482 numaralı sipariş hâlâ gelmedi. Bilgi verebilir misiniz?", "Teşekkürler, Elif"],
    tray: "hazir",
    note: "bugün dağıtımda · takip no ekli",
    marks: [
      { text: "KS-10482", action: "circle" },
      { text: "hâlâ gelmedi", action: "underline" },
    ],
    understood: ["Siparişinin nerede olduğunu soruyor."],
    checked: [
      { where: "Sipariş defteri", found: "KS-10482 · 23 Eylül'de kargoya verildi" },
      { where: "Kargo takibi", found: "Bugün 08.30'da dağıtıma çıktı" },
    ],
    draft: {
      samimi:
        "Merhaba Elif,\n\nGüzel haber: siparişiniz bu sabah 08.30'da dağıtıma çıktı, bugün kapınızda olacak. Takip numaranız 7340 0012 8841.\n\nİyi günlerde kullanın,\nKirpi Seramik",
      resmi:
        "Sayın Elif Yıldırım,\n\nKS-10482 numaralı siparişiniz bugün saat 08.30'da dağıtıma çıkmıştır ve gün içinde teslim edilmesi beklenmektedir. Kargo takip numaranız: 7340 0012 8841.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m5",
    from: "Burak Demir",
    address: "burakdemir@ornek-posta.com",
    subject: "Servis tabağı iadesi",
    time: "09:18",
    body: ["Merhaba,", "KS-10391 siparişindeki servis tabağının rengi fotoğraftakinden oldukça farklı. İade etmek istiyorum, nasıl yapabilirim?", "Burak"],
    tray: "hazir",
    note: "14 gün içinde · iade kodu hazır",
    marks: [
      { text: "KS-10391", action: "circle" },
      { text: "rengi fotoğraftakinden oldukça farklı", action: "underline" },
    ],
    understood: ["Tabağı renk yüzünden iade etmek istiyor.", "Ürün kişiye özel değil, cayma hakkı var."],
    checked: [
      { where: "Sipariş defteri", found: "KS-10391 · 18 Eylül'de teslim · kişiye özel değil" },
      { where: "Cayma süresi", found: "Bugün 9. gün; 14 günlük süre içinde" },
      { where: "İade kodu", found: "KRP-4417 oluşturuldu" },
    ],
    draft: {
      samimi:
        "Merhaba Burak,\n\nRenk beklediğiniz gibi çıkmadığı için üzgünüz. İade kodunuz KRP-4417: tabağı kutusuyla anlaşmalı kargo şubesine bu kodla ücretsiz bırakabilirsiniz. Ürün bize ulaştıktan sonra ödemeniz en geç 14 gün içinde kartınıza iade edilir.\n\nKirpi Seramik",
      resmi:
        "Sayın Burak Demir,\n\nCayma hakkınızı kullanma talebiniz alınmıştır. İade kodunuz KRP-4417'dir; ürünü anlaşmalı kargo firmasına bu kodla ücretsiz teslim edebilirsiniz. Bedel, cayma bildiriminizden itibaren en geç 14 gün içinde ödeme yönteminize iade edilecektir.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m6",
    from: "Toprak Mimarlık",
    address: "muhasebe@toprakmimarlik.example",
    subject: "Kurumsal fatura rica ediyoruz",
    time: "09:31",
    body: ["Merhaba,", "KS-10470 siparişimizin faturasının şirketimiz adına kesilmesini rica ederiz. Unvan ve vergi bilgilerimiz ektedir.", "İyi çalışmalar"],
    attachment: "vergi-levhasi.pdf",
    tray: "hazir",
    note: "fatura şirket adına yenilenecek",
    marks: [
      { text: "KS-10470", action: "circle" },
      { text: "şirketimiz adına", action: "underline" },
    ],
    understood: ["Faturanın şirket adına yeniden kesilmesini istiyor; vergi bilgileri ekte."],
    checked: [{ where: "Sipariş defteri", found: "KS-10470 · bireysel e-Arşiv fatura kesilmiş, 3 gün önce" }],
    draft: {
      samimi: "Merhaba,\n\nVergi bilgilerinizi aldık, faturanızı bugün şirketiniz adına yeniden düzenleyip bu adrese gönderiyoruz.\n\nKirpi Seramik",
      resmi: "Sayın ilgili,\n\nİlettiğiniz vergi bilgileri doğrultusunda KS-10470 numaralı siparişinizin faturası bugün şirketiniz unvanına yeniden düzenlenerek tarafınıza gönderilecektir.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m7",
    from: "Pınar (Mutfak Günlükleri)",
    address: "pinar@mutfakgunlukleri.example",
    subject: "Tanıtım iş birliği teklifi",
    time: "10:02",
    body: ["Merhaba! Instagram'da 48 bin takipçili bir yemek sayfam var. Ürünlerinizi tariflerimde kullanıp tanıtmak isterim; karşılığında 5 set ürün rica ediyorum.", "Sevgiler, Pınar"],
    tray: "karar",
    note: "ürün karşılığı tanıtım · önce örnek iste",
    marks: [
      { text: "48 bin takipçili", action: "underline" },
      { text: "5 set ürün", action: "circle" },
    ],
    understood: ["Ürün karşılığında tanıtım öneriyor.", "Bu bir bütçe kararı; taslak yalnızca daha fazla bilgi istiyor."],
    checked: [],
    draft: {
      samimi: "Merhaba Pınar,\n\nİlginiz için çok teşekkürler! Karar vermeden önce medya kitinizi ve geçmiş iş birliklerinizden birkaç örnek paylaşabilir misiniz?\n\nSevgiler,\nKirpi Seramik",
      resmi: "Sayın Pınar Hanım,\n\nTeklifiniz için teşekkür ederiz. Değerlendirebilmemiz için medya kitinizi ve önceki iş birliklerinizden örnekleri iletmenizi rica ederiz.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m8",
    from: "Anadolu Kil Tedarik",
    address: "fatura@anadolukil.example",
    subject: "Eylül kil siparişi faturası",
    time: "10:20",
    body: ["Sayın Kirpi Seramik,", "25 Eylül tarihli 200 kg stoneware kil siparişinize ait e-fatura ektedir.", "İyi çalışmalar"],
    attachment: "AKT2026000000912.pdf",
    tray: "dokunma",
    note: "gider faturası · klasöre kondu",
    marks: [{ text: "200 kg stoneware kil", action: "underline" }],
    understood: ["Tedarikçiden gelen gider faturası."],
    checked: [{ where: "Muhasebe klasörü", found: "Gider faturaları / Eylül klasörüne kaydedildi" }],
    noReply: "Cevap gerekmiyor. Faturayı muhasebe klasörüne koydum.",
  },
];
