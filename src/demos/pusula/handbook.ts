// Pusula Lojistik's employee handbook (fictional company) and a scripted
// question-answering engine over it. The legal rules quoted are from the
// Turkish Labour Act (4857); company rules are invented for the demo. There is
// a Turkish and an English edition; `ask` answers from the one it is given.

import type { Lang } from "@/lib/i18n";

export type Sentence = { id: string; text: string };
export type Para = { id: string; title: string; sentences: Sentence[]; keywords: string[] };
export type Section = { id: string; title: string; paras: Para[] };

const p = (id: string, title: string, keywords: string[], ...texts: string[]): Para => ({
  id,
  title,
  keywords,
  sentences: texts.map((text, i) => ({ id: `${id}${String.fromCharCode(97 + i)}`, text })),
});

const TR: Section[] = [
  {
    id: "1",
    title: "Çalışma saatleri ve fazla mesai",
    paras: [
      p(
        "1.1",
        "Çalışma saatleri",
        ["çalışma saati", "mesai saati", "kaçta", "giriş", "çıkış", "öğle arası", "haftalık"],
        "Ofis çalışma saatleri hafta içi 09.00 ile 18.00 arasıdır; bir saatlik öğle arası bu süreye dahil değildir.",
        "Haftalık çalışma süresi 45 saattir.",
        "Depo ve dağıtım ekiplerinin vardiya çizelgeleri her ayın 25'ine kadar ilan edilir.",
      ),
      p(
        "1.2",
        "Fazla çalışma",
        ["fazla mesai", "fazla çalışma", "mesai ücreti", "ek mesai", "overtime", "zamlı"],
        "Haftalık 45 saati aşan çalışma fazla çalışmadır ve yöneticinizin yazılı talebiyle yapılır.",
        "Fazla çalışmanın her saati için normal saat ücretinin yüzde elli fazlası ödenir (4857 sayılı İş Kanunu m. 41).",
        "Fazla çalışma için onayınız alınır ve bir yılda toplam 270 saati geçemez.",
        "Dilerseniz ücret yerine her fazla saat için bir saat otuz dakika serbest zaman kullanabilirsiniz.",
      ),
    ],
  },
  {
    id: "2",
    title: "İzinler",
    paras: [
      p(
        "2.1",
        "Yıllık ücretli izin",
        ["yıllık izin", "izin hakkı", "kaç gün izin", "tatil", "izin süresi", "kıdem"],
        "Deneme süresi dahil en az bir yıl çalışmış olan her çalışan yıllık ücretli izin hakkı kazanır.",
        "Kıdemi bir yıldan beş yıla kadar (beş yıl dahil) olanlara 14 gün, beş yıldan fazla on beş yıldan az olanlara 20 gün, on beş yıl ve fazla olanlara 26 gün izin verilir (İş Kanunu m. 53).",
        "18 yaşında ve daha küçük ya da 50 yaşında ve daha büyük çalışanların yıllık izni 20 günden az olamaz.",
      ),
      p(
        "2.2",
        "Yıllık izin nasıl istenir",
        ["izin talebi", "izin iste", "portal", "önceden", "izin nasıl"],
        "Yıllık izin talebinizi en az 15 gün önceden İK portalından girin.",
        "Talep ekip liderinizin onayından sonra kesinleşir; aynı ekipten iki kişinin aynı hafta izne çıkması planlamaya göre sınırlanabilir.",
      ),
      p(
        "2.3",
        "Mazeret izinleri",
        ["evlilik", "evleniyorum", "düğün", "ölüm", "vefat", "cenaze", "eşim doğum", "babalık", "doğum yaptı", "mazeret"],
        "Evlenmeniz, evlat edinmeniz ya da anne, baba, eş, kardeş veya çocuğunuzun ölümü halinde üç gün ücretli izin verilir.",
        "Eşinizin doğum yapması halinde beş gün ücretli izin verilir (İş Kanunu Ek m. 2).",
        "Bu izinler yıllık izninizden düşülmez; belgeyi döndüğünüz hafta İK'ya iletin.",
      ),
      p(
        "2.4",
        "Analık izni",
        ["analık", "doğum izni", "hamile", "gebelik", "doğum öncesi", "doğum sonrası"],
        "Doğumdan önce sekiz ve doğumdan sonra sekiz hafta olmak üzere toplam on altı hafta analık izni kullanılır; çoğul gebelikte doğum öncesine iki hafta eklenir (İş Kanunu m. 74).",
        "Hekim onayıyla doğumdan önceki üç haftaya kadar çalışabilir, kalan süreyi doğum sonrasına ekleyebilirsiniz.",
      ),
      p(
        "2.5",
        "Hastalık raporu",
        ["rapor", "hastalık", "hasta", "istirahat", "doktor raporu"],
        "Hekim raporunu aldığınız gün ekip liderinize haber verin ve raporu e-Devlet'e düştükten sonra İK portalına yükleyin.",
        "Raporun ilk iki gününün ücreti, SGK ödemesi beklenmeden şirket tarafından ödenir.",
      ),
    ],
  },
  {
    id: "3",
    title: "Uzaktan çalışma",
    paras: [
      p(
        "3.1",
        "Kimler, ne sıklıkla",
        ["uzaktan", "evden", "remote", "hibrit", "ofise gelmek"],
        "Ofis ekipleri haftada en fazla iki gün uzaktan çalışabilir; günler ekip liderinizle ay başında belirlenir.",
        "Depo, dağıtım ve müşteri teslim ekipleri işin niteliği gereği uzaktan çalışmaz.",
      ),
      p(
        "3.2",
        "Ekipman ve destek",
        ["ekipman", "bilgisayar", "laptop", "internet", "kulaklık", "monitör"],
        "Uzaktan çalışan her çalışana dizüstü bilgisayar ve kulaklık verilir.",
        "Ev internet gideri için aylık 500 TL destek bordroya eklenir.",
      ),
    ],
  },
  {
    id: "4",
    title: "Masraflar",
    paras: [
      p(
        "4.1",
        "Seyahat",
        ["seyahat", "yolculuk", "uçak", "otobüs", "tren", "taksi", "taksi masraf", "yol masrafı", "iş gezisi"],
        "İş seyahatlerinde öncelik tren ve otobüstür; 500 kilometreden uzak yolculuklarda ekonomi sınıfı uçak kullanılabilir.",
        "Taksi yalnızca 22.00 ile 06.00 arasında ya da taşınması gereken ekipman varsa karşılanır.",
      ),
      p(
        "4.2",
        "Yemek",
        ["yemek", "öğle yemeği", "akşam yemeği", "yemek kartı", "müşteri yemeği"],
        "Seyahatteyken günlük yemek harcaması en fazla 750 TL'ye kadar karşılanır.",
        "Müşteriyle yenen yemekler için önceden yöneticinizin onayı gerekir.",
      ),
      p(
        "4.3",
        "Fiş ve fatura",
        ["fiş", "fatura", "masraf formu", "yükleme", "geri ödeme", "masraf"],
        "Masraf belgeleri harcamadan sonraki 30 gün içinde masraf uygulamasına yüklenir.",
        "Fatura şirket unvanına kesilmelidir; kişi adına kesilen belgeler karşılanmaz.",
        "Onaylanan masraflar izleyen ayın maaşıyla ödenir.",
      ),
    ],
  },
  {
    id: "5",
    title: "Bilgi güvenliği",
    paras: [
      p(
        "5.1",
        "Hesaplar ve şifreler",
        ["şifre", "parola", "iki adımlı", "2fa", "hesap", "giriş yapamıyorum"],
        "Tüm şirket hesaplarında iki adımlı doğrulama zorunludur.",
        "Şifrenizi kimseyle, BT ekibiyle bile paylaşmayın; BT sizden hiçbir zaman şifre istemez.",
      ),
      p(
        "5.2",
        "Müşteri verisi",
        ["müşteri verisi", "kişisel veri", "kvkk", "usb", "dosya paylaşımı"],
        "Müşteri ve çalışan kişisel verileri yalnızca işin gerektirdiği kadar ve şirket sistemlerinde işlenir.",
        "Müşteri verisi USB belleğe ya da kişisel bulut hesaplarına kopyalanmaz.",
      ),
    ],
  },
];

/** The handbook in one language; both editions share section and clause numbers. */
export const handbookIn = (lang: Lang) => (lang === "en" ? EN : TR);
const parasIn = (lang: Lang) => handbookIn(lang).flatMap((s) => s.paras);
export const paraById = (id: string, lang: Lang = "tr") => parasIn(lang).find((x) => x.id === id)!;

// --- Engine ------------------------------------------------------------------
const norm = (s: string, lang: Lang = "tr") => s.toLocaleLowerCase(lang).replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

export type Cite = { para: string; sentences: string[] };
export type Answer = { text: string; cites: Cite[]; retrieved: { para: string; score: number }[]; unknown?: boolean };

/** Keyword overlap between a question and a paragraph; enough to rank passages for the demo. */
function score(q: string, para: Para, lang: Lang = "tr") {
  let s = 0;
  // Keywords must start a word, so "veri" does not match inside "veriyor".
  for (const k of para.keywords) if (` ${q}`.includes(` ${k}`)) s += k.includes(" ") ? 3 : 2;
  const words = new Set(q.split(" ").filter((w) => w.length > 3));
  const body = norm(para.sentences.map((x) => x.text).join(" ") + " " + para.title, lang);
  for (const w of words) if (body.includes(w.slice(0, Math.max(4, w.length - 2)))) s += 1;
  return s;
}

const num = (q: string, unit: RegExp) => {
  const m = q.match(new RegExp(`(\\d+)\\s*${unit.source}`));
  return m ? Number(m[1]) : null;
};

function askTr(question: string): Answer {
  const q = norm(question);
  const ranked = parasIn("tr")
    .map((x) => ({ para: x.id, score: score(q, x) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const top = ranked[0];
  // Shown as a 0–1 relevance; six points or more counts as a full match.
  const retrieved = ranked.map((r) => ({ ...r, score: Math.min(1, r.score / 6) }));

  // Yearly leave depends on seniority and age, so work it out.
  if (top?.para === "2.1" || (/yıllık izin|yıllık iznim|izin hakkım/.test(q) && top?.para !== "2.3" && top?.para !== "2.4")) {
    const years = num(q, /(yıl|sene)/);
    const age = num(q, /yaş/);
    const cites: Cite[] = [{ para: "2.1", sentences: ["2.1b"] }];
    if (years === null) {
      return {
        text: "Yıllık izniniz kıdeminize göre değişir: 1 ile 5 yıl arası (5 dahil) 14 gün, 5 yıldan fazla 15 yıldan az 20 gün, 15 yıl ve üzeri 26 gün. Kaç yıldır çalıştığınızı yazarsanız sizinkini hesaplarım.",
        cites,
        retrieved,
      };
    }
    if (years < 1) {
      return { text: "Yıllık izin hakkı bir yılı doldurunca doğar; deneme süresi bu bir yıla dahildir. Henüz bir yılınızı doldurmadıysanız yıllık izniniz başlamadı.", cites: [{ para: "2.1", sentences: ["2.1a"] }], retrieved };
    }
    let days = years <= 5 ? 14 : years < 15 ? 20 : 26;
    let note = years === 5 ? " Beş yıl bu dilime dahil; altıncı yılınızı doldurduğunuzda 20 güne çıkar." : "";
    if (age !== null && (age <= 18 || age >= 50) && days < 20) {
      days = 20;
      note += ` ${age} yaşında olduğunuz için süre 20 günden az olamaz.`;
      cites[0].sentences.push("2.1c");
    }
    return { text: `${years} yıllık kıdemle yıllık izniniz ${days} gün.${note} Talebi en az 15 gün önceden İK portalından girin.`, cites: [...cites, { para: "2.2", sentences: ["2.2a"] }], retrieved };
  }

  const answers: Record<string, { text: string; cites: Cite[] }> = {
    "1.1": { text: "Ofis saatleri hafta içi 09.00–18.00; bir saatlik öğle arası buna dahil değil. Haftalık çalışma süresi 45 saat.", cites: [{ para: "1.1", sentences: ["1.1a", "1.1b"] }] },
    "1.2": {
      text: "45 saati aşan her saat için normal saat ücretinizin yüzde elli fazlası ödenir. Fazla çalışma yöneticinizin yazılı talebi ve sizin onayınızla yapılır, yılda 270 saati geçemez. İsterseniz ücret yerine her saat için 1,5 saat serbest zaman kullanabilirsiniz.",
      cites: [{ para: "1.2", sentences: ["1.2a", "1.2b", "1.2c", "1.2d"] }],
    },
    "2.2": { text: "Talebi en az 15 gün önceden İK portalından girin; ekip liderinizin onayıyla kesinleşir.", cites: [{ para: "2.2", sentences: ["2.2a", "2.2b"] }] },
    "2.3": /eşim|babalık|doğum yap/.test(q)
      ? { text: "Eşinizin doğumu için beş gün ücretli izin alırsınız. Bu izin yıllık izninizden düşülmez; belgeyi döndüğünüz hafta İK'ya iletin.", cites: [{ para: "2.3", sentences: ["2.3b", "2.3c"] }] }
      : { text: "Evlilik, evlat edinme ya da birinci derece yakınınızın vefatında üç gün ücretli izin verilir. Yıllık izninizden düşülmez.", cites: [{ para: "2.3", sentences: ["2.3a", "2.3c"] }] },
    "2.4": { text: "Toplam 16 hafta analık izni var: doğumdan önce 8, sonra 8 hafta. Çoğul gebelikte doğum öncesine 2 hafta eklenir; hekim onayıyla doğuma 3 hafta kalana kadar çalışıp kalan süreyi sonraya aktarabilirsiniz.", cites: [{ para: "2.4", sentences: ["2.4a", "2.4b"] }] },
    "2.5": { text: "Raporu aldığınız gün ekip liderinize haber verin, e-Devlet'e düşünce İK portalına yükleyin. İlk iki günün ücretini şirket öder.", cites: [{ para: "2.5", sentences: ["2.5a", "2.5b"] }] },
    "3.1": { text: "Ofis ekiplerindeyseniz haftada en fazla iki gün evden çalışabilirsiniz; günleri ay başında ekip liderinizle belirlersiniz. Depo, dağıtım ve teslim ekipleri uzaktan çalışmaz.", cites: [{ para: "3.1", sentences: ["3.1a", "3.1b"] }] },
    "3.2": { text: "Uzaktan çalışanlara dizüstü bilgisayar ve kulaklık verilir; ev interneti için bordroya aylık 500 TL eklenir.", cites: [{ para: "3.2", sentences: ["3.2a", "3.2b"] }] },
    "4.1": /taksi/.test(q)
      ? { text: "Taksi yalnızca 22.00–06.00 arasında ya da yanınızda taşınması gereken ekipman varsa karşılanır. Diğer durumlarda toplu taşıma kullanın.", cites: [{ para: "4.1", sentences: ["4.1b"] }] }
      : { text: "Önce tren ve otobüs tercih edilir; 500 km'den uzak yolculuklarda ekonomi sınıfı uçak kullanabilirsiniz.", cites: [{ para: "4.1", sentences: ["4.1a"] }] },
    "4.2": { text: "Seyahatte günlük 750 TL'ye kadar yemek karşılanır. Müşteri yemekleri için önceden yönetici onayı gerekir.", cites: [{ para: "4.2", sentences: ["4.2a", "4.2b"] }] },
    "4.3": { text: "Belgeyi harcamadan sonraki 30 gün içinde masraf uygulamasına yükleyin; fatura şirket unvanına kesilmiş olmalı. Onaylanan masraf izleyen ayın maaşıyla ödenir.", cites: [{ para: "4.3", sentences: ["4.3a", "4.3b", "4.3c"] }] },
    "5.1": { text: "İki adımlı doğrulama zorunlu. Şifrenizi kimseyle paylaşmayın; BT ekibi sizden asla şifre istemez.", cites: [{ para: "5.1", sentences: ["5.1a", "5.1b"] }] },
    "5.2": { text: "Hayır. Müşteri verisi yalnızca şirket sistemlerinde işlenir; USB belleğe ya da kişisel buluta kopyalanmaz.", cites: [{ para: "5.2", sentences: ["5.2a", "5.2b"] }] },
  };

  if (top && top.score >= 2 && answers[top.para]) return { ...answers[top.para], retrieved };
  return {
    text: "El kitabında bununla ilgili bir bölüm bulamadım, o yüzden tahmin yürütmüyorum. İK ekibine ik@pusula.example adresinden sorabilirsiniz.",
    cites: [],
    retrieved,
    unknown: true,
  };
}

const SUGGESTIONS_TR = [
  "5 yıldır çalışıyorum, kaç gün yıllık iznim var?",
  "Eşim doğum yapacak, kaç gün izin alırım?",
  "Fazla mesai nasıl ödeniyor?",
  "Taksi masrafı karşılanıyor mu?",
  "Müşteri listesini USB'ye alabilir miyim?",
  "Şirket araç veriyor mu?",
];

// --- English edition -----------------------------------------------------------
// The same handbook, clause for clause, with the same numbering, so an answer
// in either language cites the same paragraph and sentence ids.

const EN: Section[] = [
  {
    id: "1",
    title: "Working hours and overtime",
    paras: [
      p(
        "1.1",
        "Working hours",
        ["working hours", "office hours", "what time", "start", "finish", "lunch break", "hours a week", "per week"],
        "Office hours are 09:00 to 18:00 on weekdays; the one-hour lunch break is not included in that time.",
        "The working week is 45 hours.",
        "Shift rotas for the warehouse and delivery teams are published by the 25th of each month.",
      ),
      p(
        "1.2",
        "Overtime",
        ["overtime", "extra hours", "overtime pay", "time off in lieu", "paid extra"],
        "Work beyond 45 hours a week is overtime and is done at your manager's written request.",
        "Each hour of overtime is paid at the normal hourly rate plus fifty per cent (Labour Act No. 4857, art. 41).",
        "Your consent is asked for overtime, and it cannot exceed 270 hours in a year.",
        "If you prefer, you can take one hour and thirty minutes off for each hour of overtime instead of pay.",
      ),
    ],
  },
  {
    id: "2",
    title: "Leave",
    paras: [
      p(
        "2.1",
        "Paid annual leave",
        ["annual leave", "leave entitlement", "holiday", "vacation", "seniority", "length of service"],
        "Every employee who has worked for at least one year, including the probation period, earns paid annual leave.",
        "Employees with one to five years' service (five included) get 14 days, more than five but less than fifteen years 20 days, and fifteen years or more 26 days (Labour Act, art. 53).",
        "Employees aged 18 or under, or 50 or over, get no less than 20 days of annual leave.",
      ),
      p(
        "2.2",
        "How to request annual leave",
        ["request leave", "leave request", "book leave", "book time off", "portal", "in advance", "how do i request"],
        "Enter your annual leave request on the HR portal at least 15 days in advance.",
        "The request is final once your team lead approves it; two people from the same team being off in the same week may be limited by planning.",
      ),
      p(
        "2.3",
        "Family and bereavement leave",
        ["getting married", "married", "wedding", "adopt", "death", "died", "passed away", "funeral", "bereavement", "wife", "husband", "spouse", "partner", "paternity"],
        "If you marry or adopt a child, or if your mother, father, spouse, sibling or child dies, you get three days of paid leave.",
        "If your wife gives birth, you get five days of paid leave (Labour Act, additional art. 2).",
        "This leave is not taken from your annual leave; send the document to HR in the week you return.",
      ),
      p(
        "2.4",
        "Maternity leave",
        ["maternity", "pregnant", "pregnancy", "before the birth", "after the birth"],
        "Maternity leave is sixteen weeks in total: eight weeks before the birth and eight weeks after; with a multiple pregnancy, two weeks are added before the birth (Labour Act, art. 74).",
        "With a doctor's approval you can work until three weeks before the birth and add the remaining time to after it.",
      ),
      p(
        "2.5",
        "Sick leave",
        ["sick", "ill", "illness", "sick note", "doctor", "medical report", "off sick"],
        "Tell your team lead on the day you get a doctor's report, and upload it to the HR portal once it appears on e-Devlet (the government portal).",
        "The first two days of a report are paid by the company, without waiting for the SGK (social security) payment.",
      ),
    ],
  },
  {
    id: "3",
    title: "Remote work",
    paras: [
      p(
        "3.1",
        "Who, and how often",
        ["remote", "from home", "work from home", "wfh", "hybrid", "come to the office"],
        "Office teams can work remotely up to two days a week; the days are agreed with your team lead at the start of the month.",
        "Warehouse, delivery and customer handover teams don't work remotely because of the nature of the job.",
      ),
      p(
        "3.2",
        "Equipment and support",
        ["equipment", "computer", "laptop", "internet", "headset", "monitor"],
        "Every employee who works remotely gets a laptop and a headset.",
        "A monthly ₺500 allowance for home internet is added to your payslip.",
      ),
    ],
  },
  {
    id: "4",
    title: "Expenses",
    paras: [
      p(
        "4.1",
        "Travel",
        ["travel", "trip", "journey", "flight", "fly", "plane", "bus", "train", "taxi", "cab", "business trip"],
        "On business trips, trains and buses come first; for journeys over 500 kilometres you can fly economy class.",
        "Taxis are covered only between 22:00 and 06:00, or when you have equipment to carry.",
      ),
      p(
        "4.2",
        "Meals",
        ["meal", "meals", "lunch", "dinner", "food", "meal card", "client dinner", "client lunch"],
        "While travelling, meals are covered up to ₺750 a day.",
        "Meals with clients need your manager's approval in advance.",
      ),
      p(
        "4.3",
        "Receipts and invoices",
        ["receipt", "invoice", "expense form", "expense claim", "upload", "reimburse", "reimbursement", "expenses"],
        "Expense documents are uploaded to the expenses app within 30 days of spending.",
        "Invoices must be made out to the company's name; documents in a personal name are not covered.",
        "Approved expenses are paid with the following month's salary.",
      ),
    ],
  },
  {
    id: "5",
    title: "Information security",
    paras: [
      p(
        "5.1",
        "Accounts and passwords",
        ["password", "two step", "2fa", "account", "log in", "login"],
        "Two-step verification is required on all company accounts.",
        "Don't share your password with anyone, not even the IT team; IT will never ask you for it.",
      ),
      p(
        "5.2",
        "Customer data",
        ["customer data", "customer list", "personal data", "kvkk", "usb", "file sharing"],
        "Personal data about customers and employees is processed only as far as the job needs, and only in company systems.",
        "Customer data is not copied to USB sticks or personal cloud accounts.",
      ),
    ],
  },
];

function askEn(question: string): Answer {
  const q = norm(question, "en");
  const ranked = parasIn("en")
    .map((x) => ({ para: x.id, score: score(q, x, "en") }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const top = ranked[0];
  const retrieved = ranked.map((r) => ({ ...r, score: Math.min(1, r.score / 6) }));

  // Yearly leave depends on seniority and age, so work it out.
  if (top?.para === "2.1" || (/annual leave|leave entitlement|how much leave|holiday|vacation/.test(q) && top?.para !== "2.3" && top?.para !== "2.4")) {
    const ageMatch = q.match(/(\d+)\s*(?:years?|yrs?)\s*old\b/) ?? q.match(/\b(?:i m|i am|aged|age)\s*(\d+)\b/);
    const yearsMatch = q.match(/(\d+)\s*(?:years?|yrs?)\b(?!\s*old)/);
    const age = ageMatch ? Number(ageMatch[1]) : null;
    const years = yearsMatch ? Number(yearsMatch[1]) : null;
    const cites: Cite[] = [{ para: "2.1", sentences: ["2.1b"] }];
    if (years === null) {
      return {
        text: "Your annual leave depends on your length of service: 14 days for 1 to 5 years (5 included), 20 days for more than 5 but less than 15 years, and 26 days for 15 years or more. Tell me how many years you've worked here and I'll work out yours.",
        cites,
        retrieved,
      };
    }
    if (years < 1) {
      return {
        text: "You earn annual leave once you've completed a year, and the probation period counts towards it. If you haven't completed a year yet, your annual leave hasn't started.",
        cites: [{ para: "2.1", sentences: ["2.1a"] }],
        retrieved,
      };
    }
    let days = years <= 5 ? 14 : years < 15 ? 20 : 26;
    let note = years === 5 ? " Five years still falls in this band; it goes up to 20 days once you complete your sixth year." : "";
    if (age !== null && (age <= 18 || age >= 50) && days < 20) {
      days = 20;
      note += ` As you're ${age}, it can't be less than 20 days.`;
      cites[0].sentences.push("2.1c");
    }
    const service = years === 1 ? "1 year's" : `${years} years'`;
    return {
      text: `With ${service} service, your annual leave is ${days} days.${note} Enter the request on the HR portal at least 15 days in advance.`,
      cites: [...cites, { para: "2.2", sentences: ["2.2a"] }],
      retrieved,
    };
  }

  const answers: Record<string, { text: string; cites: Cite[] }> = {
    "1.1": { text: "Office hours are 09:00–18:00 on weekdays; the one-hour lunch break isn't included. The working week is 45 hours.", cites: [{ para: "1.1", sentences: ["1.1a", "1.1b"] }] },
    "1.2": {
      text: "Each hour over 45 a week is paid at your normal hourly rate plus fifty per cent. Overtime is done at your manager's written request and with your consent, and can't go over 270 hours a year. If you prefer, you can take 1.5 hours off for each hour instead of pay.",
      cites: [{ para: "1.2", sentences: ["1.2a", "1.2b", "1.2c", "1.2d"] }],
    },
    "2.2": { text: "Enter the request on the HR portal at least 15 days in advance; it's final once your team lead approves it.", cites: [{ para: "2.2", sentences: ["2.2a", "2.2b"] }] },
    "2.3": /wife|spouse|partner|paternity|baby|birth/.test(q)
      ? { text: "You get five days of paid leave for your wife giving birth. It isn't taken from your annual leave; send the document to HR in the week you return.", cites: [{ para: "2.3", sentences: ["2.3b", "2.3c"] }] }
      : { text: "You get three days of paid leave if you marry or adopt, or if a close family member dies. It isn't taken from your annual leave.", cites: [{ para: "2.3", sentences: ["2.3a", "2.3c"] }] },
    "2.4": {
      text: "Maternity leave is 16 weeks in total: 8 before the birth and 8 after. With a multiple pregnancy, 2 weeks are added before the birth; with a doctor's approval you can work until 3 weeks before and move the rest to after.",
      cites: [{ para: "2.4", sentences: ["2.4a", "2.4b"] }],
    },
    "2.5": { text: "Tell your team lead on the day you get the report, and upload it to the HR portal once it appears on e-Devlet. The company pays the first two days.", cites: [{ para: "2.5", sentences: ["2.5a", "2.5b"] }] },
    "3.1": { text: "If you're in an office team, you can work from home up to two days a week; you agree the days with your team lead at the start of the month. Warehouse, delivery and handover teams don't work remotely.", cites: [{ para: "3.1", sentences: ["3.1a", "3.1b"] }] },
    "3.2": { text: "Remote workers get a laptop and a headset, and ₺500 a month for home internet is added to the payslip.", cites: [{ para: "3.2", sentences: ["3.2a", "3.2b"] }] },
    "4.1": /taxi|cab/.test(q)
      ? { text: "Taxis are covered only between 22:00 and 06:00, or if you have equipment to carry. Otherwise, use public transport.", cites: [{ para: "4.1", sentences: ["4.1b"] }] }
      : { text: "Trains and buses come first; for journeys over 500 km you can fly economy class.", cites: [{ para: "4.1", sentences: ["4.1a"] }] },
    "4.2": { text: "While travelling, meals are covered up to ₺750 a day. Client meals need your manager's approval in advance.", cites: [{ para: "4.2", sentences: ["4.2a", "4.2b"] }] },
    "4.3": { text: "Upload the document to the expenses app within 30 days of spending; the invoice must be in the company's name. Approved expenses are paid with the following month's salary.", cites: [{ para: "4.3", sentences: ["4.3a", "4.3b", "4.3c"] }] },
    "5.1": { text: "Two-step verification is required. Don't share your password with anyone; the IT team will never ask you for it.", cites: [{ para: "5.1", sentences: ["5.1a", "5.1b"] }] },
    "5.2": { text: "No. Customer data is processed only in company systems; it isn't copied to USB sticks or personal cloud storage.", cites: [{ para: "5.2", sentences: ["5.2a", "5.2b"] }] },
  };

  // English shares many short words across clauses, so a keyword has to match, not just a word in the text.
  const keyword = top && paraById(top.para, "en").keywords.some((k) => ` ${q}`.includes(` ${k}`));
  if (top && top.score >= 2 && keyword && answers[top.para]) return { ...answers[top.para], retrieved };
  return {
    text: "I couldn't find a section in the handbook about this, so I won't guess. You can ask the HR team at ik@pusula.example.",
    cites: [],
    retrieved,
    unknown: true,
  };
}

const SUGGESTIONS_EN = [
  "I've worked here 5 years. How many days of annual leave do I get?",
  "My wife is having a baby. How many days off do I get?",
  "How is overtime paid?",
  "Are taxi expenses covered?",
  "Can I copy the customer list to a USB stick?",
  "Does the company provide a car?",
];

/** Answers a question from the handbook in the page's language. */
export function ask(question: string, lang: Lang = "tr"): Answer {
  return lang === "en" ? askEn(question) : askTr(question);
}

export const suggestionsIn = (lang: Lang) => (lang === "en" ? SUGGESTIONS_EN : SUGGESTIONS_TR);
