// Scripted "AI" for the Nara assistant demo. It is a rule-based matcher, not a
// model: it recognises a handful of Turkish intents and entities, answers only
// from Nara's own data, and hands anything else to a person. Each reply also
// returns log lines for the "behind the scenes" panel.

import {
  type Booking,
  dayNames,
  freeSlots,
  hhmm,
  hours,
  isoDay,
  loadBookings,
  saveBookings,
  services,
  staff,
  tl,
} from "./data";

export type LogKind = "niyet" | "kaynak" | "araç" | "eylem" | "devir";
export type LogLine = { kind: LogKind; text: string };
export type Chip = { label: string; value: string };
export type Reply = { text: string; chips?: Chip[]; log: LogLine[] };

export type State =
  | { stage: "idle" }
  | { stage: "pick-service" }
  | { stage: "pick-slot"; serviceId: string; day: string }
  | { stage: "ask-name"; serviceId: string; day: string; time: number };

const norm = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s:]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

const SERVICE_WORDS: [string, string[]][] = [
  ["kas-laminasyonu", ["laminasyon"]],
  ["kirpik-lifting", ["kirpik"]],
  ["kas-tasarimi", ["kaş"]],
  ["hydrafacial", ["hydrafacial", "hidrafasiyal"]],
  ["leke-bakimi", ["leke"]],
  ["klasik-cilt", ["cilt"]],
  ["kalici-oje", ["kalıcı oje", "oje"]],
  ["pedikur", ["pedikür", "ayak"]],
  ["manikur", ["manikür", "tırnak"]],
];

function findService(t: string) {
  for (const [id, words] of SERVICE_WORDS) if (has(t, words)) return services.find((s) => s.id === id)!;
  return null;
}

function findDay(t: string, now: Date): Date | null {
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  if (t.includes("bugün")) return base;
  if (t.includes("yarın")) return new Date(base.getTime() + 86400000);
  const idx = dayNames.findIndex((d) => t.includes(d.toLocaleLowerCase("tr")));
  if (idx >= 0) {
    const d = new Date(base);
    d.setDate(base.getDate() + (((idx - base.getDay()) + 7) % 7 || 7));
    return d;
  }
  if (t.includes("hafta sonu")) {
    const d = new Date(base);
    d.setDate(base.getDate() + (((6 - base.getDay()) + 7) % 7 || 7));
    return d;
  }
  return null;
}

const staffFor = (serviceId: string) => {
  const s = services.find((x) => x.id === serviceId)!;
  return staff.find((p) => p.category === s.category)!;
};

const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const dayLabel = (d: Date, now: Date) => {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((day.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
  if (diff === 0) return "bugün";
  if (diff === 1) return "yarın";
  return `${d.getDate()} ${d.toLocaleDateString("tr-TR", { month: "long" })} ${dayNames[d.getDay()]}`;
};

/** Offers up to three openings, starting from `from` and moving to later open days. */
function offerSlots(serviceId: string, fromAny: Date, now: Date): Reply & { state: State } {
  // Whole days only: a time of day here would make "today" read as "tomorrow".
  const from = new Date(fromAny.getFullYear(), fromAny.getMonth(), fromAny.getDate());
  const service = services.find((s) => s.id === serviceId)!;
  const person = staffFor(serviceId);
  const bookings = loadBookings();
  for (let i = 0; i < 10; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    const slots = freeSlots(d, person.id, service.minutes, bookings, now).slice(0, 3);
    if (!slots.length) continue;
    const moved = i > 0 ? `${dayLabel(from, now)[0].toLocaleUpperCase("tr")}${dayLabel(from, now).slice(1)} dolu. ` : "";
    return {
      text: `${moved}${person.name} ${dayLabel(d, now)} şu saatlerde müsait. Hangisi sana uyar?`,
      chips: [
        ...slots.map((t) => ({ label: hhmm(t), value: `saat ${t}` })),
        { label: "Başka gün", value: "başka gün" },
      ],
      log: [{ kind: "araç", text: `Takvim sorgulandı: ${person.name}, ${isoDay(d)}, ${service.minutes} dk → ${slots.length} boş saat` }],
      state: { stage: "pick-slot", serviceId, day: isoDay(d) },
    };
  }
  return {
    text: "Önümüzdeki günler tamamen dolu görünüyor. Seni bekleme listesine alması için ekibe iletiyorum.",
    log: [{ kind: "devir", text: "Boş saat bulunamadı → ekibe aktarıldı" }],
    state: { stage: "idle" },
  };
}

const serviceChips = (): Chip[] =>
  ["klasik-cilt", "kas-tasarimi", "kirpik-lifting", "manikur", "kalici-oje"].map((id) => ({
    label: services.find((s) => s.id === id)!.name,
    value: services.find((s) => s.id === id)!.name,
  }));

export const opening: Reply = {
  text: "Merhaba, ben Nara'nın asistanıyım. Fiyatları söyleyebilir, boş saatlere bakıp randevunu oluşturabilirim. Nasıl yardımcı olayım?",
  chips: [
    { label: "Kaş tasarımı ne kadar?", value: "Kaş tasarımı ne kadar?" },
    { label: "Yarın cilt bakımı için yer var mı?", value: "Yarın cilt bakımı için yer var mı?" },
    { label: "Saat kaça kadar açıksınız?", value: "Saat kaça kadar açıksınız?" },
  ],
  log: [],
};

export function respond(input: string, state: State, now = new Date()): Reply & { state: State } {
  const t = norm(input);

  // --- Mid-flow answers ---------------------------------------------------
  if (state.stage === "pick-slot") {
    const m = t.match(/^saat (\d+)$/) ?? t.match(/(\d{1,2})[:.](\d{2})/);
    if (t.includes("başka gün")) {
      const next = fromIso(state.day);
      next.setDate(next.getDate() + 1);
      return offerSlots(state.serviceId, next, now);
    }
    if (m) {
      const time = m.length === 2 ? Number(m[1]) : Number(m[1]) * 60 + Number(m[2]);
      return {
        text: `${hhmm(time)} senin için ayrıldı. Randevuyu kimin adına oluşturayım?`,
        log: [{ kind: "eylem", text: `Saat geçici olarak tutuldu: ${state.day} ${hhmm(time)}` }],
        state: { stage: "ask-name", serviceId: state.serviceId, day: state.day, time },
      };
    }
  }

  if (state.stage === "ask-name" && t.length >= 2 && !has(t, ["iptal", "vazgeç"])) {
    const name = input.trim().replace(/^(ben|adım|ismim)\s+/i, "").slice(0, 40);
    const service = services.find((s) => s.id === state.serviceId)!;
    const person = staffFor(state.serviceId);
    const booking: Booking = {
      id: `${state.day}-${state.time}-${person.id}`,
      day: state.day,
      start: state.time,
      minutes: service.minutes,
      serviceId: service.id,
      staffId: person.id,
      name,
      phone: "asistan üzerinden",
    };
    saveBookings([...loadBookings().filter((b) => b.id !== booking.id), booking]);
    return {
      text: `Tamam ${name}, ${dayLabel(fromIso(state.day), now)} ${hhmm(state.time)}'da ${service.name.toLocaleLowerCase("tr")} randevun oluşturuldu (${person.name}, ${tl(service.price)}). Bir gün önce hatırlatma göndereceğim.`,
      log: [
        { kind: "eylem", text: `Randevu oluşturuldu → işletme paneline yazıldı (${person.name}, ${hhmm(state.time)})` },
        { kind: "eylem", text: "Hatırlatma planlandı: randevudan 24 saat önce" },
      ],
      state: { stage: "idle" },
    };
  }

  if (has(t, ["iptal", "vazgeç", "ertele"])) {
    const mine = loadBookings().filter((b) => b.phone === "asistan üzerinden");
    if (state.stage !== "idle") {
      return { text: "Tamam, bu randevuyu oluşturmadım. Başka bir şey sormak istersen buradayım.", log: [{ kind: "eylem", text: "Taslak randevu bırakıldı" }], state: { stage: "idle" } };
    }
    if (mine.length) {
      const last = mine[mine.length - 1];
      saveBookings(loadBookings().filter((b) => b.id !== last.id));
      return {
        text: `${dayLabel(fromIso(last.day), now)} ${hhmm(last.start)} randevunu iptal ettim. Yeni bir saat istersen söylemen yeterli.`,
        log: [{ kind: "eylem", text: `Randevu iptal edildi → panelden kaldırıldı (${last.day} ${hhmm(last.start)})` }],
        state: { stage: "idle" },
      };
    }
    return { text: "Bu sohbette oluşturulmuş bir randevun görünmüyor.", log: [{ kind: "araç", text: "Takvimde bu müşteriye ait randevu arandı → yok" }], state: { stage: "idle" } };
  }

  // --- Fresh intents --------------------------------------------------------
  const service = findService(t);
  const day = findDay(t, now);
  const wantsBooking = has(t, ["randevu", "yer var", "müsait", "boş", "gelmek", "rezervasyon", "yer bak", "evet"]) || !!day;
  const wantsPrice = has(t, ["fiyat", "ücret", "ne kadar", "kaç para", "kaç tl", "kaç lira"]);

  if (wantsPrice && service) {
    return {
      text: `${service.name} ${tl(service.price)}, yaklaşık ${service.minutes} dakika sürüyor. İstersen hemen boş saatlere bakayım.`,
      chips: [
        { label: "Evet, yer bak", value: `${service.name} için randevu` },
        { label: "Başka bir hizmet", value: "fiyat listesi" },
      ],
      log: [
        { kind: "niyet", text: "Fiyat sorusu" },
        { kind: "kaynak", text: `Nara fiyat listesi → ${service.name}: ${tl(service.price)}, ${service.minutes} dk` },
      ],
      state: { stage: "idle" },
    };
  }

  if (wantsPrice || t.includes("fiyat listesi")) {
    return {
      text: "Cilt bakımı 1.200–1.800 ₺, kaş ve kirpik 450–950 ₺, tırnak 500–700 ₺ arası. Hangisini merak ediyorsun?",
      chips: serviceChips().map((c) => ({ label: c.label, value: `${c.value} ne kadar` })),
      log: [
        { kind: "niyet", text: "Genel fiyat sorusu" },
        { kind: "kaynak", text: "Nara fiyat listesi → kategori aralıkları" },
      ],
      state: { stage: "idle" },
    };
  }

  if (wantsBooking && service) {
    const r = offerSlots(service.id, day ?? now, now);
    return { ...r, log: [{ kind: "niyet", text: `Randevu isteği: ${service.name}${day ? `, ${dayLabel(day, now)}` : ""}` }, ...r.log] };
  }

  if (wantsBooking || state.stage === "pick-service") {
    if (service) return offerSlots(service.id, now, now);
    return {
      text: "Memnuniyetle. Hangi işlem için randevu istersin?",
      chips: serviceChips(),
      log: [{ kind: "niyet", text: "Randevu isteği, hizmet belirtilmedi" }],
      state: { stage: "pick-service" },
    };
  }

  if (service) {
    // A bare service name answers the "which one?" question.
    const r = offerSlots(service.id, now, now);
    return { ...r, log: [{ kind: "niyet", text: `Hizmet seçildi: ${service.name}` }, ...r.log] };
  }

  if (has(t, ["saat kaç", "açık", "kapalı", "kaça kadar", "çalışma saat", "pazar", "hafta sonu"])) {
    const today = hours[now.getDay()];
    return {
      text: `Salı–Cumartesi 10:00–20:00, Pazar 11:00–18:00 açığız; Pazartesi kapalıyız. ${today ? `Bugün ${hhmm(today.close)}'a kadar buradayız.` : "Bugün kapalıyız."}`,
      log: [
        { kind: "niyet", text: "Çalışma saatleri" },
        { kind: "kaynak", text: "Nara çalışma saatleri tablosu" },
      ],
      state: { stage: "idle" },
    };
  }

  if (has(t, ["adres", "nerede", "konum", "yol tarifi", "harita"])) {
    return {
      text: "Nara örnek bir işletme olduğu için adresi yok. Gerçek kurulumda burada konum pini ve yol tarifi bağlantısı gönderilir.",
      log: [{ kind: "niyet", text: "Konum sorusu" }, { kind: "kaynak", text: "İşletme bilgileri → konum" }],
      state: { stage: "idle" },
    };
  }

  if (has(t, ["merhaba", "selam", "iyi günler", "günaydın", "iyi akşamlar"])) {
    return { ...opening, text: "Merhaba! Fiyat sorabilir ya da randevu isteyebilirsin.", state: { stage: "idle" }, log: [{ kind: "niyet", text: "Selamlama" }] };
  }

  if (has(t, ["teşekkür", "sağ ol", "sağol", "eyvallah"])) {
    return { text: "Rica ederim, görüşmek üzere!", log: [{ kind: "niyet", text: "Teşekkür" }], state: { stage: "idle" } };
  }

  // Anything the assistant can't answer from Nara's data goes to a person.
  return {
    text: "Bu konuda sana doğru bilgi veremem. Mesajını ekibe iletiyorum; çalışma saatleri içinde bir kişi buradan dönüş yapacak.",
    log: [
      { kind: "niyet", text: "Tanınmadı" },
      { kind: "devir", text: "Kaynaklarda cevap yok → uydurmak yerine insana aktarıldı" },
    ],
    state: { stage: "idle" },
  };
}
