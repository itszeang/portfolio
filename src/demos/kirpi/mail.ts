// Kirpi Seramik: a fictional two-person pottery workshop in Avanos, and a
// simulated inbox assistant for the "yapay zekâ otomasyonu" demo. The mail came
// in between closing time and the next morning; each one carries what the
// assistant understood, where it looked and a draft in two tones. Nothing is
// sent: approving a draft only marks it as sent.

import type { Lang } from "@/lib/i18n";

/** The four shelves the morning post is sorted onto. */
export type Tray = "hemen" | "hazir" | "karar" | "dokunma";
export const trays: { id: Tray; name: string; hint: string; tone: string }[] = [
  { id: "hemen", name: "Hemen", hint: "Bugün sizin bakmanız gereken", tone: "#B45309" },
  { id: "hazir", name: "Cevabı hazır", hint: "Okuyup gönderin", tone: "#2F6B5E" },
  { id: "karar", name: "Karar sizin", hint: "Fiyat ya da iş kararı gerekiyor", tone: "#3949AB" },
  { id: "dokunma", name: "Dokunmayın", hint: "Cevap gerekmiyor ya da tehlikeli", tone: "#6E655E" },
];

/** Minutes after 18.00 the evening before, for placing a mail on the night log. */
export const nightMinute = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return ((h - 18 + 24) % 24) * 60 + m;
};

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
    time: "22:05",
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
    escalate: "Ayşe'ye not bıraktım; şikâyetleri sabah ilk o görüyor.",
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
    time: "08:10",
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
    time: "03:47",
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
    time: "07:58",
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
      { where: "Kargo takibi", found: "Bugünkü dağıtım listesinde; 08.30'da yola çıkıyor" },
    ],
    draft: {
      samimi:
        "Merhaba Elif,\n\nGüzel haber: siparişiniz bu sabah 08.30'da dağıtıma çıkıyor, bugün kapınızda olacak. Takip numaranız 7340 0012 8841.\n\nİyi günlerde kullanın,\nKirpi Seramik",
      resmi:
        "Sayın Elif Yıldırım,\n\nKS-10482 numaralı siparişiniz bugün saat 08.30'da dağıtıma çıkacak ve gün içinde teslim edilmesi beklenmektedir. Kargo takip numaranız: 7340 0012 8841.\n\nSaygılarımızla,\nKirpi Seramik",
    },
  },
  {
    id: "m5",
    from: "Burak Demir",
    address: "burakdemir@ornek-posta.com",
    subject: "Servis tabağı iadesi",
    time: "07:12",
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
    time: "07:40",
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
    time: "21:15",
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
    time: "18:40",
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

// --- English -----------------------------------------------------------------
// Avanos is full of visitors, so an English morning post is just as likely.
// Same mail, same shelves and same ids; marks quote the English wording.

const TRAY_EN: Record<Tray, { name: string; hint: string }> = {
  hemen: { name: "Now", hint: "Needs your eyes today" },
  hazir: { name: "Reply ready", hint: "Read it and send" },
  karar: { name: "Your call", hint: "Needs a price or business decision" },
  dokunma: { name: "Leave it", hint: "No reply needed, or dangerous" },
};

type MailText = Pick<Mail, "subject" | "body" | "note" | "marks" | "understood" | "checked"> &
  Partial<Pick<Mail, "from" | "attachment" | "draft" | "phishing" | "escalate" | "noReply">>;

const MAIL_EN: Record<string, MailText> = {
  m1: {
    subject: "Two of the mugs arrived broken",
    body: [
      "Hello,",
      "Two of the 4 mugs in my order KS-10455, delivered yesterday, arrived broken. They were a gift for a friend, so I'm really upset. I've attached photos.",
      "What can we do?",
      "Deniz",
    ],
    attachment: "broken-mugs.jpg",
    note: "2 mugs broken · send new ones today",
    marks: [
      { text: "Two of the 4 mugs", action: "underline" },
      { text: "KS-10455", action: "circle" },
      { text: "gift", action: "highlight" },
    ],
    understood: ["Two mugs broke in transit; the photo shows it.", "They were a gift and the customer is upset. Apologise first, then fix it."],
    checked: [
      { where: "Order book", found: "KS-10455 · 4 × Aegean blue mug · delivered 26 September" },
      { where: "Shelf count", found: "23 Aegean blue mugs in stock" },
    ],
    escalate: "I left a note for Ayşe; she sees complaints first thing in the morning.",
    draft: {
      samimi:
        "Hi Deniz,\n\nWe're so sorry to hear this, especially when they were a gift. We're carefully packing two new mugs and sending them today; there's no need to send the broken ones back. You'll get the tracking number this evening.\n\nThanks for your patience,\nKirpi Seramik",
      resmi:
        "Dear Deniz Kaya,\n\nWe apologise for the damage to your order KS-10455. Replacements for the two broken items will be dispatched today; there is no need to return the damaged items. The tracking number will be sent to you during the day.\n\nKind regards,\nKirpi Seramik",
    },
  },
  m2: {
    subject: "120 logo mugs for our opening",
    body: [
      "Hello,",
      "We're thinking of 120 mugs printed with our logo for the café we're opening in Kadıköy in mid-November. Could you tell us the price and lead time?",
      "Best wishes,",
      "Selin Öztürk · Mavi Kahve",
    ],
    note: "wholesale quote · ~₺18,000",
    marks: [
      { text: "120 mugs", action: "circle" },
      { text: "mid-November", action: "underline" },
    ],
    understood: ["A new café wants 120 mugs with its logo.", "It has to be ready by mid-November.", "About ₺18,000 at list price; the discount is your call."],
    checked: [
      { where: "Price list", found: "Logo mug ₺150 · up to 15% off over 100 pieces" },
      { where: "Kiln schedule", found: "Earliest delivery for a new batch is 3 weeks" },
    ],
    draft: {
      samimi:
        "Hi Selin,\n\nCongratulations on the opening! For 120 logo mugs our unit price is ₺150, and we take 15% off orders over 100. Production takes about 3 weeks, so mid-November is comfortably doable.\n\nIf you send your logo as a vector file (SVG or PDF) and the colours you'd like, we'll prepare a sample image for you.\n\nWarm wishes,\nKirpi Seramik",
      resmi:
        "Dear Selin Öztürk,\n\nThank you for your enquiry. Our unit price for logo mugs is ₺150; orders over 100 pieces receive a 15% discount. Production takes approximately three weeks, so delivery by mid-November is possible.\n\nTo finalise the quote, please send us your logo as a vector file and your colour preferences.\n\nKind regards,\nKirpi Seramik",
    },
  },
  m3: {
    from: "Kirpi Seramik Support",
    subject: "[URGENT] Your shop will be closed in 24 hours",
    body: [
      "Dear seller,",
      "Unusual activity has been detected on your account. To stop your account being closed, verify your identity and card details at the link below within 24 hours.",
      "VERIFY MY ACCOUNT: hxxp://kirpi-seramik-destek.co/dogrula",
      "Security Team",
    ],
    note: "fake · asks for card details",
    marks: [
      { text: "card details", action: "box" },
      { text: "within 24 hours", action: "underline" },
      { text: "hxxp://kirpi-seramik-destek.co/dogrula", action: "crossed-off" },
    ],
    understood: ["It threatens to close the account to get card details."],
    checked: [{ where: "Domain record", found: "kirpi-seramik-destek.co isn't yours; registered 3 days ago" }],
    phishing: ["The sender's address isn't your domain.", "It asks for card details; no marketplace asks for those by email.", "It rushes you with a 24-hour deadline."],
  },
  m4: {
    subject: "Where is my order?",
    body: ["Hello, my order KS-10482, placed on 21 September, still hasn't arrived. Could you let me know?", "Thanks, Elif"],
    note: "out for delivery today · tracking no. included",
    marks: [
      { text: "KS-10482", action: "circle" },
      { text: "still hasn't arrived", action: "underline" },
    ],
    understood: ["She's asking where her order is."],
    checked: [
      { where: "Order book", found: "KS-10482 · shipped 23 September" },
      { where: "Parcel tracking", found: "On today's delivery list; leaves at 08:30" },
    ],
    draft: {
      samimi: "Hi Elif,\n\nGood news: your order goes out for delivery at 08:30 this morning and will be with you today. Your tracking number is 7340 0012 8841.\n\nEnjoy it,\nKirpi Seramik",
      resmi:
        "Dear Elif Yıldırım,\n\nYour order KS-10482 will go out for delivery today at 08:30 and is expected to be delivered during the day. Your tracking number is 7340 0012 8841.\n\nKind regards,\nKirpi Seramik",
    },
  },
  m5: {
    subject: "Returning a serving plate",
    body: ["Hello,", "The colour of the serving plate in order KS-10391 is quite different from the photo. I'd like to return it; how do I do that?", "Burak"],
    note: "within 14 days · return code ready",
    marks: [
      { text: "KS-10391", action: "circle" },
      { text: "quite different from the photo", action: "underline" },
    ],
    understood: ["He wants to return the plate because of the colour.", "It isn't a personalised item, so the right of withdrawal applies."],
    checked: [
      { where: "Order book", found: "KS-10391 · delivered 18 September · not personalised" },
      { where: "Withdrawal period", found: "Today is day 9; within the 14 days" },
      { where: "Return code", found: "KRP-4417 created" },
    ],
    draft: {
      samimi:
        "Hi Burak,\n\nSorry the colour wasn't what you expected. Your return code is KRP-4417: you can drop the plate off in its box at a partner courier branch with this code, free of charge. Once it reaches us, your payment is refunded to your card within 14 days at the latest.\n\nKirpi Seramik",
      resmi:
        "Dear Burak Demir,\n\nYour request to exercise your right of withdrawal has been received. Your return code is KRP-4417; you can hand the item to our partner courier with this code free of charge. The amount will be refunded to your payment method within 14 days of your withdrawal notice at the latest.\n\nKind regards,\nKirpi Seramik",
    },
  },
  m6: {
    subject: "Company invoice, please",
    body: ["Hello,", "Could the invoice for our order KS-10470 be issued in our company's name? Our company name and tax details are attached.", "Best regards"],
    attachment: "tax-certificate.pdf",
    note: "invoice to be reissued to the company",
    marks: [
      { text: "KS-10470", action: "circle" },
      { text: "in our company's name", action: "underline" },
    ],
    understood: ["They want the invoice reissued in the company's name; the tax details are attached."],
    checked: [{ where: "Order book", found: "KS-10470 · personal e-Archive invoice issued 3 days ago" }],
    draft: {
      samimi: "Hello,\n\nWe've got your tax details and will reissue your invoice in your company's name today and send it to this address.\n\nKirpi Seramik",
      resmi: "Dear Sir or Madam,\n\nIn line with the tax details you provided, the invoice for order KS-10470 will be reissued in your company's name today and sent to you.\n\nKind regards,\nKirpi Seramik",
    },
  },
  m7: {
    subject: "A promotion partnership offer",
    body: ["Hello! I run a food page on Instagram with 48k followers. I'd love to use your products in my recipes and promote them; in return I'm asking for 5 sets of products.", "Love, Pınar"],
    note: "promotion for products · ask for examples first",
    marks: [
      { text: "48k followers", action: "underline" },
      { text: "5 sets of products", action: "circle" },
    ],
    understood: ["She's offering promotion in exchange for products.", "This is a budget decision; the draft only asks for more information."],
    checked: [],
    draft: {
      samimi: "Hi Pınar,\n\nThank you so much for getting in touch! Before we decide, could you share your media kit and a few examples of past collaborations?\n\nWarm wishes,\nKirpi Seramik",
      resmi: "Dear Pınar,\n\nThank you for your offer. So that we can consider it, please send us your media kit and examples of your previous collaborations.\n\nKind regards,\nKirpi Seramik",
    },
  },
  m8: {
    subject: "Invoice for the September clay order",
    body: ["Dear Kirpi Seramik,", "Please find attached the e-invoice for your order of 200 kg of stoneware clay dated 25 September.", "Best regards"],
    note: "expense invoice · filed",
    marks: [{ text: "200 kg of stoneware clay", action: "underline" }],
    understood: ["An expense invoice from a supplier."],
    checked: [{ where: "Accounts folder", found: "Saved to Expense invoices / September" }],
    noReply: "No reply needed. I've put the invoice in the accounts folder.",
  },
};

/** The morning post and its shelves in one language. */
export function kirpiIn(lang: Lang) {
  const en = lang === "en";
  return {
    mails: en ? mails.map((m) => ({ ...m, ...MAIL_EN[m.id] })) : mails,
    trays: en ? trays.map((t) => ({ ...t, ...TRAY_EN[t.id] })) : trays,
    /** "22.05" in Turkish, "22:05" in English. */
    clock: (t: string) => (en ? t : t.replace(":", ".")),
  };
}
