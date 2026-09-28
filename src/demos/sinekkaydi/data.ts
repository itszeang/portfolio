// Sinekkaydı: a fictional Eskişehir barbershop for the "canlı sıra" demo. The
// queue is a small simulation: every tick is one minute, chairs free up as
// cuts finish and waiting customers sit in the first chair that suits them.

export type ServiceId = "sac" | "sakal" | "sacsakal" | "cocuk" | "ense";
export const services: { id: ServiceId; name: string; minutes: number; price: number }[] = [
  { id: "sac", name: "Saç kesimi", minutes: 30, price: 350 },
  { id: "sakal", name: "Sakal", minutes: 15, price: 200 },
  { id: "sacsakal", name: "Saç ve sakal", minutes: 45, price: 500 },
  { id: "cocuk", name: "Çocuk kesimi", minutes: 20, price: 250 },
  { id: "ense", name: "Ense ve yanlar", minutes: 10, price: 120 },
];
export const minutesOf = (s: ServiceId) => services.find((x) => x.id === s)!.minutes;
export const serviceName = (s: ServiceId) => services.find((x) => x.id === s)!.name;

export type BarberId = "huseyin" | "kaan" | "deniz";
export const barbers: { id: BarberId; name: string; note: string }[] = [
  { id: "huseyin", name: "Usta Hüseyin", note: "Klasik kesim, ustura" },
  { id: "kaan", name: "Kaan", note: "Fade, modern kesimler" },
  { id: "deniz", name: "Deniz", note: "Sakal, çocuklar" },
];
export const barberName = (b: BarberId) => barbers.find((x) => x.id === b)!.name;

export type Ticket = { no: number; name: string; service: ServiceId; pref: BarberId | null; mine?: boolean };
export type Chair = { barber: BarberId; ticket: Ticket | null; left: number };
/** `mineNo` is the visitor's own ticket, recorded by `join` so it can never go stale. */
export type Shop = { minute: number; chairs: Chair[]; queue: Ticket[]; nextNo: number; last: { no: number; barber: BarberId } | null; done: number[]; mineNo: number | null };

export const initialShop = (): Shop => ({
  minute: 0,
  chairs: [
    { barber: "huseyin", ticket: { no: 41, name: "Murat", service: "sacsakal", pref: "huseyin" }, left: 18 },
    { barber: "kaan", ticket: { no: 42, name: "Emre", service: "sac", pref: null }, left: 6 },
    { barber: "deniz", ticket: { no: 43, name: "Can", service: "sakal", pref: null }, left: 11 },
  ],
  queue: [
    { no: 44, name: "Onur", service: "sac", pref: null },
    { no: 45, name: "Selim", service: "sacsakal", pref: "huseyin" },
  ],
  nextNo: 46,
  last: null,
  done: [],
  mineNo: null,
});

/** Seat waiting customers in free chairs: the first in line whose barber choice fits. */
function seat(s: Shop): Shop {
  let queue = s.queue;
  let last = s.last;
  const chairs = s.chairs.map((c) => {
    if (c.ticket) return c;
    const i = queue.findIndex((t) => !t.pref || t.pref === c.barber);
    if (i < 0) return c;
    const t = queue[i];
    queue = [...queue.slice(0, i), ...queue.slice(i + 1)];
    last = { no: t.no, barber: c.barber };
    return { ...c, ticket: t, left: minutesOf(t.service) };
  });
  return { ...s, chairs, queue, last };
}

const walkIns: [string, ServiceId][] = [
  ["Burak", "sac"],
  ["Tolga", "sakal"],
  ["Serkan", "sacsakal"],
  ["Umut", "ense"],
  ["Arda", "sac"],
  ["Efe", "cocuk"],
];

/** One minute passes. With `walkIns`, someone new comes through the door every nine minutes. */
export function tick(s: Shop, withWalkIns = true): Shop {
  const minute = s.minute + 1;
  let done = s.done;
  const chairs = s.chairs.map((c) => {
    if (!c.ticket) return c;
    if (c.left - 1 > 0) return { ...c, left: c.left - 1 };
    done = [...done, c.ticket.no];
    return { ...c, ticket: null, left: 0 };
  });
  let queue = s.queue;
  let nextNo = s.nextNo;
  if (withWalkIns && minute % 9 === 0) {
    const [name, service] = walkIns[(minute / 9) % walkIns.length];
    queue = [...queue, { no: nextNo, name, service, pref: null }];
    nextNo += 1;
  }
  return seat({ ...s, minute, chairs, queue, nextNo, done });
}

/** The barber finishes early and calls the next customer. */
export function finish(s: Shop, barber: BarberId): Shop {
  let done = s.done;
  const chairs = s.chairs.map((c) => {
    if (c.barber !== barber || !c.ticket) return c;
    done = [...done, c.ticket.no];
    return { ...c, ticket: null, left: 0 };
  });
  return seat({ ...s, chairs, done });
}

export function join(s: Shop, t: Omit<Ticket, "no">): [Shop, number] {
  const no = s.nextNo;
  return [seat({ ...s, queue: [...s.queue, { ...t, no }], nextNo: no + 1, mineNo: t.mine ? no : s.mineNo }), no];
}

export function leave(s: Shop, no: number): Shop {
  return { ...s, queue: s.queue.filter((t) => t.no !== no), mineNo: s.mineNo === no ? null : s.mineNo };
}

/** Minutes until ticket `no` sits down (0 when already seated), assuming nobody new arrives. */
export function etaOf(s: Shop, no: number): number | null {
  let x = s;
  for (let m = 0; m < 600; m++) {
    if (x.chairs.some((c) => c.ticket?.no === no)) return m;
    if (!x.queue.some((t) => t.no === no)) return null;
    x = tick(x, false);
  }
  return null;
}

/** How long a new customer would wait for this service and barber choice. */
export const previewEta = (s: Shop, service: ServiceId, pref: BarberId | null) => {
  const [x, no] = join(s, { name: "", service, pref });
  return etaOf(x, no) ?? 0;
};

// --- Appointments ------------------------------------------------------------
export const OPEN = 10 * 60;
export const CLOSE = 21 * 60 + 30;
export const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Whether a barber already has someone booked at `t` on day `iso` (fixed per date). */
export const booked = (iso: string, barber: BarberId, t: number) => hash(`${iso}${barber}${t}`) % 100 < 48;

export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  return isoDay(new Date(y, m - 1, d + n));
};

export const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;
