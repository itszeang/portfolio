// Scripted "AI" for the Nara assistant demo. It is a rule-based matcher, not a
// model: it recognises a handful of intents and entities in Turkish or English,
// answers only from Nara's own data, and hands anything else to a person. Each
// reply also returns log lines for the "behind the scenes" panel.

import type { Lang } from "@/lib/i18n";
import { type Booking, freeSlots, hhmm, hours, isoDay, loadBookings, naraIn, saveBookings } from "./data";

export type LogKind = "niyet" | "kaynak" | "araç" | "eylem" | "devir";
/** `booked` marks the line written when a booking is created. */
export type LogLine = { kind: LogKind; text: string; booked?: boolean };
export type Chip = { label: string; value: string };
export type Reply = { text: string; chips?: Chip[]; log: LogLine[] };

export type State =
  | { stage: "idle" }
  | { stage: "pick-service" }
  | { stage: "pick-slot"; serviceId: string; day: string }
  | { stage: "ask-name"; serviceId: string; day: string; time: number };

/** Stored as the phone of bookings made in chat, so they can be found again. */
const VIA_ASSISTANT = "asistan üzerinden";

const norm = (s: string, lang: Lang) =>
  s
    .toLocaleLowerCase(lang === "en" ? "en" : "tr")
    .replace(/[^\p{L}\p{N}\s:]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

// Turkish matches inside words ("kaşlarım" holds "kaş"); English needs whole
// words, or "hi" would match "this".
const has = (t: string, words: string[], lang: Lang) =>
  words.some((w) => (lang === "en" ? new RegExp(`(^|\\s)${w}`).test(t) : t.includes(w)));

const WORDS = {
  tr: {
    services: [
      ["kas-laminasyonu", ["laminasyon"]],
      ["kirpik-lifting", ["kirpik"]],
      ["kas-tasarimi", ["kaş"]],
      ["hydrafacial", ["hydrafacial", "hidrafasiyal"]],
      ["leke-bakimi", ["leke"]],
      ["klasik-cilt", ["cilt"]],
      ["kalici-oje", ["kalıcı oje", "oje"]],
      ["pedikur", ["pedikür", "ayak"]],
      ["manikur", ["manikür", "tırnak"]],
    ] as [string, string[]][],
    today: "bugün",
    tomorrow: "yarın",
    weekend: "hafta sonu",
    otherDay: "başka gün",
    cancel: ["iptal", "vazgeç", "ertele"],
    stopName: ["iptal", "vazgeç"],
    booking: ["randevu", "yer var", "müsait", "boş", "gelmek", "rezervasyon", "yer bak", "evet"],
    price: ["fiyat", "ücret", "ne kadar", "kaç para", "kaç tl", "kaç lira"],
    priceList: "fiyat listesi",
    hours: ["saat kaç", "açık", "kapalı", "kaça kadar", "çalışma saat", "pazar", "hafta sonu"],
    address: ["adres", "nerede", "konum", "yol tarifi", "harita"],
    hello: ["merhaba", "selam", "iyi günler", "günaydın", "iyi akşamlar"],
    thanks: ["teşekkür", "sağ ol", "sağol", "eyvallah"],
    namePrefix: /^(ben|adım|ismim)\s+/i,
    timeChip: /^saat (\d+)$/,
  },
  en: {
    services: [
      ["kas-laminasyonu", ["lamination"]],
      ["kirpik-lifting", ["lash"]],
      ["kas-tasarimi", ["brow", "eyebrow"]],
      ["hydrafacial", ["hydrafacial", "hydra facial"]],
      ["leke-bakimi", ["pigment", "dark spot", "spots"]],
      ["klasik-cilt", ["facial", "skin"]],
      ["kalici-oje", ["gel"]],
      ["pedikur", ["pedicure", "feet", "foot"]],
      ["manikur", ["manicure", "nail"]],
    ] as [string, string[]][],
    today: "today",
    tomorrow: "tomorrow",
    weekend: "weekend",
    otherDay: "another day",
    cancel: ["cancel", "never mind", "postpone", "reschedule"],
    stopName: ["cancel", "never mind"],
    booking: ["book", "appointment", "available", "free", "slot", "space", "come in", "reservation", "yes", "look"],
    price: ["price", "cost", "how much", "charge", "fee"],
    priceList: "price list",
    hours: ["what time", "open", "close", "hours", "until", "sunday", "weekend"],
    address: ["address", "where", "location", "directions", "map"],
    hello: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    thanks: ["thank", "thanks", "cheers"],
    namePrefix: /^(i'm|i am|my name is|it's|this is|name)\s+/i,
    timeChip: /^time (\d+)$/,
  },
};

const SAY = {
  tr: {
    moved: (day: string) => `${day[0].toLocaleUpperCase("tr")}${day.slice(1)} dolu. `,
    offer: (who: string, day: string) => `${who} ${day} şu saatlerde müsait. Hangisi sana uyar?`,
    otherDayChip: "Başka gün",
    timeValue: (t: number) => `saat ${t}`,
    calendarLog: (who: string, day: string, m: number, n: number) => `Takvim sorgulandı: ${who}, ${day}, ${m} dk → ${n} boş saat`,
    allFull: "Önümüzdeki günler tamamen dolu görünüyor. Seni bekleme listesine alması için ekibe iletiyorum.",
    allFullLog: "Boş saat bulunamadı → ekibe aktarıldı",
    opening: "Merhaba, ben Nara'nın asistanıyım. Fiyatları söyleyebilir, boş saatlere bakıp randevunu oluşturabilirim. Nasıl yardımcı olayım?",
    openingChips: ["Kaş tasarımı ne kadar?", "Yarın cilt bakımı için yer var mı?", "Saat kaça kadar açıksınız?"],
    held: (time: string) => `${time} senin için ayrıldı. Randevuyu kimin adına oluşturayım?`,
    heldLog: (day: string, time: string) => `Saat geçici olarak tutuldu: ${day} ${time}`,
    booked: (name: string, day: string, time: string, service: string, who: string, price: string) =>
      `Tamam ${name}, ${day} ${time}'da ${service.toLocaleLowerCase("tr")} randevun oluşturuldu (${who}, ${price}). Bir gün önce hatırlatma göndereceğim.`,
    bookedLog: (who: string, time: string) => `Randevu oluşturuldu → işletme paneline yazıldı (${who}, ${time})`,
    reminderLog: "Hatırlatma planlandı: randevudan 24 saat önce",
    dropDraft: "Tamam, bu randevuyu oluşturmadım. Başka bir şey sormak istersen buradayım.",
    dropDraftLog: "Taslak randevu bırakıldı",
    cancelled: (day: string, time: string) => `${day} ${time} randevunu iptal ettim. Yeni bir saat istersen söylemen yeterli.`,
    cancelledLog: (day: string, time: string) => `Randevu iptal edildi → panelden kaldırıldı (${day} ${time})`,
    noneToCancel: "Bu sohbette oluşturulmuş bir randevun görünmüyor.",
    noneToCancelLog: "Takvimde bu müşteriye ait randevu arandı → yok",
    price: (service: string, price: string, m: number) => `${service} ${price}, yaklaşık ${m} dakika sürüyor. İstersen hemen boş saatlere bakayım.`,
    priceChips: (service: string) => [
      { label: "Evet, yer bak", value: `${service} için randevu` },
      { label: "Başka bir hizmet", value: "fiyat listesi" },
    ],
    priceLog: "Fiyat sorusu",
    priceSource: (service: string, price: string, m: number) => `Nara fiyat listesi → ${service}: ${price}, ${m} dk`,
    priceRanges: "Cilt bakımı 1.200–1.800 ₺, kaş ve kirpik 450–950 ₺, tırnak 500–700 ₺ arası. Hangisini merak ediyorsun?",
    priceAsk: (service: string) => `${service} ne kadar`,
    rangesLog: "Genel fiyat sorusu",
    rangesSource: "Nara fiyat listesi → kategori aralıkları",
    bookIntent: (service: string, day: string | null) => `Randevu isteği: ${service}${day ? `, ${day}` : ""}`,
    whichService: "Memnuniyetle. Hangi işlem için randevu istersin?",
    whichServiceLog: "Randevu isteği, hizmet belirtilmedi",
    pickedLog: (service: string) => `Hizmet seçildi: ${service}`,
    hours: (todayClose: string | null) =>
      `Salı–Cumartesi 10:00–20:00, Pazar 11:00–18:00 açığız; Pazartesi kapalıyız. ${todayClose ? `Bugün ${todayClose}'a kadar buradayız.` : "Bugün kapalıyız."}`,
    hoursLog: "Çalışma saatleri",
    hoursSource: "Nara çalışma saatleri tablosu",
    address: "Nara örnek bir işletme olduğu için adresi yok. Gerçek kurulumda burada konum pini ve yol tarifi bağlantısı gönderilir.",
    addressLog: "Konum sorusu",
    addressSource: "İşletme bilgileri → konum",
    hello: "Merhaba! Fiyat sorabilir ya da randevu isteyebilirsin.",
    helloLog: "Selamlama",
    thanks: "Rica ederim, görüşmek üzere!",
    thanksLog: "Teşekkür",
    unknown: "Bu konuda sana doğru bilgi veremem. Mesajını ekibe iletiyorum; çalışma saatleri içinde bir kişi buradan dönüş yapacak.",
    unknownLog: "Tanınmadı",
    handoffLog: "Kaynaklarda cevap yok → uydurmak yerine insana aktarıldı",
  },
  en: {
    moved: (day: string) => `${day[0].toUpperCase()}${day.slice(1)} is full. `,
    offer: (who: string, day: string) => `${who} is free at these times ${day}. Which suits you?`,
    otherDayChip: "Another day",
    timeValue: (t: number) => `time ${t}`,
    calendarLog: (who: string, day: string, m: number, n: number) => `Calendar checked: ${who}, ${day}, ${m} min → ${n} free times`,
    allFull: "The coming days look fully booked. I'm passing you to the team so they can put you on the waiting list.",
    allFullLog: "No free times found → passed to the team",
    opening: "Hi, I'm Nara's assistant. I can tell you prices, check free times and book you in. How can I help?",
    openingChips: ["How much is brow shaping?", "Any space for a facial tomorrow?", "What time are you open until?"],
    held: (time: string) => `${time} is held for you. Whose name should I book it under?`,
    heldLog: (day: string, time: string) => `Time held for now: ${day} ${time}`,
    booked: (name: string, day: string, time: string, service: string, who: string, price: string) =>
      `Done, ${name}: you're booked for a ${service.toLowerCase()} ${day} at ${time} (${who}, ${price}). I'll send a reminder the day before.`,
    bookedLog: (who: string, time: string) => `Booking created → written to the studio panel (${who}, ${time})`,
    reminderLog: "Reminder scheduled: 24 hours before",
    dropDraft: "OK, I haven't made that booking. I'm here if you'd like to ask anything else.",
    dropDraftLog: "Draft booking dropped",
    cancelled: (day: string, time: string) => `I've cancelled your booking ${day} at ${time}. Just say if you'd like a new time.`,
    cancelledLog: (day: string, time: string) => `Booking cancelled → removed from the panel (${day} ${time})`,
    noneToCancel: "I can't see a booking made in this chat.",
    noneToCancelLog: "Calendar searched for this customer's booking → none",
    price: (service: string, price: string, m: number) => `A ${service.toLowerCase()} is ${price} and takes about ${m} minutes. Shall I look at free times now?`,
    priceChips: (service: string) => [
      { label: "Yes, find a time", value: `book a ${service.toLowerCase()}` },
      { label: "Another service", value: "price list" },
    ],
    priceLog: "Price question",
    priceSource: (service: string, price: string, m: number) => `Nara price list → ${service}: ${price}, ${m} min`,
    priceRanges: "Facials are ₺1,200–1,800, brows and lashes ₺450–950, nails ₺500–700. Which one would you like to know about?",
    priceAsk: (service: string) => `how much is ${service.toLowerCase()}`,
    rangesLog: "General price question",
    rangesSource: "Nara price list → ranges by category",
    bookIntent: (service: string, day: string | null) => `Booking request: ${service}${day ? `, ${day}` : ""}`,
    whichService: "Happy to. What would you like to book?",
    whichServiceLog: "Booking request, no service given",
    pickedLog: (service: string) => `Service chosen: ${service}`,
    hours: (todayClose: string | null) =>
      `We're open Tuesday–Saturday 10:00–20:00 and Sunday 11:00–18:00, closed on Mondays. ${todayClose ? `Today we're here until ${todayClose}.` : "We're closed today."}`,
    hoursLog: "Opening hours",
    hoursSource: "Nara opening hours table",
    address: "Nara is a sample business, so it has no address. In a real setup, a location pin and a directions link would be sent here.",
    addressLog: "Location question",
    addressSource: "Business details → location",
    hello: "Hi! You can ask about prices or ask for a booking.",
    helloLog: "Greeting",
    thanks: "You're welcome, see you soon!",
    thanksLog: "Thanks",
    unknown: "I can't give you reliable information on that. I'm passing your message to the team; a person will reply here during opening hours.",
    unknownLog: "Not recognised",
    handoffLog: "No answer in the sources → handed to a person instead of guessing",
  },
};

function findService(t: string, lang: Lang) {
  const { services } = naraIn(lang);
  for (const [id, words] of WORDS[lang].services) if (has(t, words, lang)) return services.find((s) => s.id === id)!;
  return null;
}

function findDay(t: string, now: Date, lang: Lang): Date | null {
  const w = WORDS[lang];
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  if (t.includes(w.today)) return base;
  if (t.includes(w.tomorrow)) return new Date(base.getTime() + 86400000);
  const idx = naraIn(lang).dayNames.findIndex((d) => t.includes(d.toLocaleLowerCase(lang === "en" ? "en" : "tr")));
  if (idx >= 0) {
    const d = new Date(base);
    d.setDate(base.getDate() + ((idx - base.getDay() + 7) % 7 || 7));
    return d;
  }
  if (t.includes(w.weekend)) {
    const d = new Date(base);
    d.setDate(base.getDate() + ((6 - base.getDay() + 7) % 7 || 7));
    return d;
  }
  return null;
}

const staffFor = (serviceId: string, lang: Lang) => {
  const { services, staff } = naraIn(lang);
  const s = services.find((x) => x.id === serviceId)!;
  return staff.find((p) => p.category === s.category)!;
};

const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const dayLabel = (d: Date, now: Date, lang: Lang) => {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((day.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
  const names = naraIn(lang).dayNames;
  if (lang === "en") {
    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    return `on ${names[d.getDay()]} ${d.getDate()} ${d.toLocaleDateString("en-GB", { month: "long" })}`;
  }
  if (diff === 0) return "bugün";
  if (diff === 1) return "yarın";
  return `${d.getDate()} ${d.toLocaleDateString("tr-TR", { month: "long" })} ${names[d.getDay()]}`;
};

/** Offers up to three openings, starting from `from` and moving to later open days. */
function offerSlots(serviceId: string, fromAny: Date, now: Date, lang: Lang): Reply & { state: State } {
  const say = SAY[lang];
  // Whole days only: a time of day here would make "today" read as "tomorrow".
  const from = new Date(fromAny.getFullYear(), fromAny.getMonth(), fromAny.getDate());
  const service = naraIn(lang).services.find((s) => s.id === serviceId)!;
  const person = staffFor(serviceId, lang);
  const bookings = loadBookings();
  for (let i = 0; i < 10; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    const slots = freeSlots(d, person.id, service.minutes, bookings, now).slice(0, 3);
    if (!slots.length) continue;
    const moved = i > 0 ? say.moved(dayLabel(from, now, lang).replace(/^on /, "")) : "";
    return {
      text: `${moved}${say.offer(person.name, dayLabel(d, now, lang))}`,
      chips: [...slots.map((t) => ({ label: hhmm(t), value: say.timeValue(t) })), { label: say.otherDayChip, value: WORDS[lang].otherDay }],
      log: [{ kind: "araç", text: say.calendarLog(person.name, isoDay(d), service.minutes, slots.length) }],
      state: { stage: "pick-slot", serviceId, day: isoDay(d) },
    };
  }
  return { text: say.allFull, log: [{ kind: "devir", text: say.allFullLog }], state: { stage: "idle" } };
}

const serviceChips = (lang: Lang): Chip[] => {
  const { services } = naraIn(lang);
  return ["klasik-cilt", "kas-tasarimi", "kirpik-lifting", "manikur", "kalici-oje"].map((id) => {
    const name = services.find((s) => s.id === id)!.name;
    return { label: name, value: name };
  });
};

/** The assistant's first message in a language. */
export const openingFor = (lang: Lang): Reply => ({
  text: SAY[lang].opening,
  chips: SAY[lang].openingChips.map((q) => ({ label: q, value: q })),
  log: [],
});
export const opening = openingFor("tr");

export function respond(input: string, state: State, now = new Date(), lang: Lang = "tr"): Reply & { state: State } {
  const t = norm(input, lang);
  const w = WORDS[lang];
  const say = SAY[lang];
  const { services, tl } = naraIn(lang);

  // --- Mid-flow answers ---------------------------------------------------
  if (state.stage === "pick-slot") {
    const m = t.match(w.timeChip) ?? t.match(/(\d{1,2})[:.](\d{2})/);
    if (t.includes(w.otherDay)) {
      const next = fromIso(state.day);
      next.setDate(next.getDate() + 1);
      return offerSlots(state.serviceId, next, now, lang);
    }
    if (m) {
      const time = m.length === 2 ? Number(m[1]) : Number(m[1]) * 60 + Number(m[2]);
      return {
        text: say.held(hhmm(time)),
        log: [{ kind: "eylem", text: say.heldLog(state.day, hhmm(time)) }],
        state: { stage: "ask-name", serviceId: state.serviceId, day: state.day, time },
      };
    }
  }

  if (state.stage === "ask-name" && t.length >= 2 && !has(t, w.stopName, lang)) {
    const name = input.trim().replace(w.namePrefix, "").slice(0, 40);
    const service = services.find((s) => s.id === state.serviceId)!;
    const person = staffFor(state.serviceId, lang);
    const booking: Booking = {
      id: `${state.day}-${state.time}-${person.id}`,
      day: state.day,
      start: state.time,
      minutes: service.minutes,
      serviceId: service.id,
      staffId: person.id,
      name,
      phone: VIA_ASSISTANT,
    };
    saveBookings([...loadBookings().filter((b) => b.id !== booking.id), booking]);
    return {
      text: say.booked(name, dayLabel(fromIso(state.day), now, lang), hhmm(state.time), service.name, person.name, tl(service.price)),
      log: [
        { kind: "eylem", text: say.bookedLog(person.name, hhmm(state.time)), booked: true },
        { kind: "eylem", text: say.reminderLog },
      ],
      state: { stage: "idle" },
    };
  }

  if (has(t, w.cancel, lang)) {
    const mine = loadBookings().filter((b) => b.phone === VIA_ASSISTANT);
    if (state.stage !== "idle") return { text: say.dropDraft, log: [{ kind: "eylem", text: say.dropDraftLog }], state: { stage: "idle" } };
    if (mine.length) {
      const last = mine[mine.length - 1];
      saveBookings(loadBookings().filter((b) => b.id !== last.id));
      return {
        text: say.cancelled(dayLabel(fromIso(last.day), now, lang), hhmm(last.start)),
        log: [{ kind: "eylem", text: say.cancelledLog(last.day, hhmm(last.start)) }],
        state: { stage: "idle" },
      };
    }
    return { text: say.noneToCancel, log: [{ kind: "araç", text: say.noneToCancelLog }], state: { stage: "idle" } };
  }

  // --- Fresh intents --------------------------------------------------------
  const service = findService(t, lang);
  const day = findDay(t, now, lang);
  const wantsBooking = has(t, w.booking, lang) || !!day;
  const wantsPrice = has(t, w.price, lang);

  if (wantsPrice && service) {
    return {
      text: say.price(service.name, tl(service.price), service.minutes),
      chips: say.priceChips(service.name),
      log: [
        { kind: "niyet", text: say.priceLog },
        { kind: "kaynak", text: say.priceSource(service.name, tl(service.price), service.minutes) },
      ],
      state: { stage: "idle" },
    };
  }

  if (wantsPrice || t.includes(w.priceList)) {
    return {
      text: say.priceRanges,
      chips: serviceChips(lang).map((c) => ({ label: c.label, value: say.priceAsk(c.value) })),
      log: [
        { kind: "niyet", text: say.rangesLog },
        { kind: "kaynak", text: say.rangesSource },
      ],
      state: { stage: "idle" },
    };
  }

  if (wantsBooking && service) {
    const r = offerSlots(service.id, day ?? now, now, lang);
    return { ...r, log: [{ kind: "niyet", text: say.bookIntent(service.name, day ? dayLabel(day, now, lang) : null) }, ...r.log] };
  }

  if (wantsBooking || state.stage === "pick-service") {
    if (service) return offerSlots(service.id, now, now, lang);
    return { text: say.whichService, chips: serviceChips(lang), log: [{ kind: "niyet", text: say.whichServiceLog }], state: { stage: "pick-service" } };
  }

  if (service) {
    // A bare service name answers the "which one?" question.
    const r = offerSlots(service.id, now, now, lang);
    return { ...r, log: [{ kind: "niyet", text: say.pickedLog(service.name) }, ...r.log] };
  }

  if (has(t, w.hours, lang)) {
    const today = hours[now.getDay()];
    return {
      text: say.hours(today ? hhmm(today.close) : null),
      log: [
        { kind: "niyet", text: say.hoursLog },
        { kind: "kaynak", text: say.hoursSource },
      ],
      state: { stage: "idle" },
    };
  }

  if (has(t, w.address, lang)) {
    return {
      text: say.address,
      log: [
        { kind: "niyet", text: say.addressLog },
        { kind: "kaynak", text: say.addressSource },
      ],
      state: { stage: "idle" },
    };
  }

  if (has(t, w.hello, lang)) {
    return { ...openingFor(lang), text: say.hello, state: { stage: "idle" }, log: [{ kind: "niyet", text: say.helloLog }] };
  }

  if (has(t, w.thanks, lang)) {
    return { text: say.thanks, log: [{ kind: "niyet", text: say.thanksLog }], state: { stage: "idle" } };
  }

  // Anything the assistant can't answer from Nara's data goes to a person.
  return {
    text: say.unknown,
    log: [
      { kind: "niyet", text: say.unknownLog },
      { kind: "devir", text: say.handoffLog },
    ],
    state: { stage: "idle" },
  };
}
