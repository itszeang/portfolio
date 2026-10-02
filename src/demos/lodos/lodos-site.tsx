"use client";

import { Menu as MenuIcon, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { lodosIn, tray } from "./data";
import { credits, Photo, type PhotoKey } from "./photos";
import { forum, grotesk, siteVars } from "./site-theme";
import { MezeTray } from "./tray";
import type { Lang } from "@/lib/i18n";

// Each section of the page owns the photo and the big word on the left panel.
const SECTIONS: { id: string; word: { tr: string; en: string }; photo: PhotoKey; label: { tr: string; en: string } }[] = [
  { id: "giris", word: { tr: "Lodos", en: "Lodos" }, photo: "masa", label: { tr: "Giriş", en: "Welcome" } },
  { id: "menu", word: { tr: "Menü", en: "Menu" }, photo: "meze", label: { tr: "Menü", en: "Menu" } },
  { id: "tepsi", word: { tr: "Tepsi", en: "Tray" }, photo: "tepsi", label: { tr: "Tepsi", en: "Tray" } },
  { id: "geceler", word: { tr: "Geceler", en: "Nights" }, photo: "gece", label: { tr: "Geceler", en: "Nights" } },
  { id: "tezgah", word: { tr: "Tezgâh", en: "Counter" }, photo: "tezgah", label: { tr: "Tezgâh", en: "The counter" } },
  { id: "masa", word: { tr: "Masa", en: "Table" }, photo: "salon", label: { tr: "Masa ayırt", en: "Book a table" } },
];
const sectionsIn = (lang: Lang) => SECTIONS.map((s) => ({ ...s, word: s.word[lang], label: s.label[lang] }));

const COPY = {
  tr: {
    menuOpen: "Menüyü aç",
    menuClose: "Menüyü kapat",
    menu: "Menü",
    nights: "Geceler",
    book: "Masa ayırt",
    hours: "Kadıköy · Salı–Cumartesi 18.00–01.00",
    eyebrow: "Meyhane · Kadıköy · örnek işletme",
    h1: "Lodos eserse balıkçı denize çıkmaz. Biz sofrayı kurarız.",
    intro: "On dört masalık bir meyhane. Soğukları her sabah tezgâhta hazırlıyor, balığı günlük alıyoruz; akşam ne varsa tahtaya yazıyoruz.",
    seeMenu: "Menüye bak",
    menuHead: "MENÜ",
    menuGroup: "Menü bölümleri",
    atVenue: "Mekânda",
    menuNote: "Fiyatlar örnektir ve KDV dahildir. Servis, kuver ya da masa ücreti alınmaz.",
    setMenu: "Fix menü",
    trayHead: "Garson tepsiyi getirdi. Altısını siz seçin.",
    trayLead: "Seçiminizi şimdiden yapın, rezervasyonunuza not düşelim; geldiğinizde masada olsun.",
    nightsHead: "Haftanın geceleri",
    nightsLead: "Hafta sonu için en az üç gün önceden yer ayırtın. Hafta içi çoğu akşam kapıdan da masa bulunur.",
    crowd: (busy: number) => (busy >= 0.9 ? "Genelde dolu" : busy >= 0.6 ? "Kalabalık" : "Rahat"),
    counterHead: "Bugün tezgâhta",
    counterLead: "Lodos, 5 bofor. Tekneler limanda; tezgâhta dünden kalan balık olmaz.",
    byWeight: "Kilo fiyatı mekânda",
    tableHead: "Masanız hazır olsun.",
    tableLead: "Kişi sayısını ve saati seçin, salon planından masanızı gösterin. Adres ve yol tarifi onay mesajıyla gelir.",
    facts: [
      ["Saatler", "Salı–Cumartesi 18.00–01.00 · Pazar 13.00–23.00 · Pazartesi 18.00–24.00"],
      ["Gecikirseniz", "Masanızı 20 dakika tutarız. Yolda kaldıysanız mesaj atmanız yeter."],
      ["Kalabalık gruplar", "8 kişi ve üzeri için fix menü ve ön ödeme gerekir."],
      ["Fasıl geceleri", "Müzik 21.00'de başlar. Sessiz bir köşe isterseniz notta belirtin."],
    ],
    footer: "Lodos Meyhane örnek bir işletmedir; adres ve telefon içermez. İçecek menüsü yalnızca mekânda sunulur. 18 yaşından küçüklere alkollü içki satılmaz.",
    photos: "Fotoğraflar",
  },
  en: {
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menu: "Menu",
    nights: "Nights",
    book: "Book a table",
    hours: "Kadıköy · Tue–Sat 18:00–01:00",
    eyebrow: "Meyhane · Kadıköy · sample business",
    h1: "When the lodos blows, the fishermen stay ashore. We set the table.",
    intro: "A fourteen-table meyhane. We make the cold mezes at the counter every morning and buy fish daily; whatever we have that evening goes on the board.",
    seeMenu: "See the menu",
    menuHead: "MENU",
    menuGroup: "Menu sections",
    atVenue: "At the venue",
    menuNote: "Prices are examples and include VAT. No service, cover or table charge.",
    setMenu: "Set menu",
    trayHead: "The waiter brings the tray. You pick six.",
    trayLead: "Choose now and we'll note it on your booking, so it's on the table when you arrive.",
    nightsHead: "The week's nights",
    nightsLead: "Book at least three days ahead for the weekend. On most weeknights there's a table at the door.",
    crowd: (busy: number) => (busy >= 0.9 ? "Usually full" : busy >= 0.6 ? "Busy" : "Relaxed"),
    counterHead: "On the counter today",
    counterLead: "Lodos, force 5. The boats are in harbour; there's never yesterday's fish on our counter.",
    byWeight: "Priced by weight at the venue",
    tableHead: "Have your table ready.",
    tableLead: "Choose how many of you and the time, and point out your table on the floor plan. The address and directions come with the confirmation.",
    facts: [
      ["Hours", "Tue–Sat 18:00–01:00 · Sun 13:00–23:00 · Mon 18:00–24:00"],
      ["Running late", "We hold your table for 20 minutes. Stuck on the way? Just send a message."],
      ["Large groups", "Groups of 8 or more need the set menu and a deposit."],
      ["Fasıl nights", "Music starts at 21:00. If you'd like a quiet corner, say so in the note."],
    ],
    footer: "Lodos Meyhane is a sample business, with no address or phone number. The drinks menu is only available at the venue. No alcohol is served to under-18s.",
    photos: "Photos",
  },
};

// Plate colours for the menu thumbnails: the cold mezes use the tray's own colours.
const plate: Record<string, string> = {
  ...Object.fromEntries(tray.map((m) => [m.name, m.color])),
  "Paçanga böreği": "#D9A55B",
  "Kalamar tava": "#E3C99A",
  "Midye tava": "#B9894F",
  "Arnavut ciğeri": "#7A3B2E",
  "Kabak çiçeği dolması": "#E9B949",
  "Levrek ızgara": "#C9CFC4",
  "Çupra ızgara": "#D5CBB8",
  "İstavrit tava": "#A89F86",
  "Günün balığı": "#8FA3A8",
  "Kabak tatlısı": "#D9772B",
  "Mevsim meyve tabağı": "#C8452F",
  Helva: "#CDB48C",
};

export function LodosSite({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { menu, nights, reservePath: RESERVE_PATH, tl } = lodosIn(lang);
  const sections = sectionsIn(lang);
  const upper = (s: string) => (lang === "en" ? s.toUpperCase() : s.toLocaleUpperCase("tr"));
  // Dish names stay Turkish in both languages, so they always take Turkish capitals.
  const dish = (s: string) => s.toLocaleUpperCase("tr");
  const [active, setActive] = useState(sections[0]);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(menu[0].id);

  // Swap the left panel as sections scroll through the middle of the screen.
  useEffect(() => {
    const list = sectionsIn(lang);
    const els = list.map((s) => document.getElementById(s.id)).filter((x): x is HTMLElement => !!x);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(list.find((s) => s.id === hit.target.id) ?? list[0]);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  const category = menu.find((m) => m.id === cat)!;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${forum.variable} ${grotesk.variable} min-h-[100dvh] bg-[var(--ld-bg)] font-[family-name:var(--ld-body)] text-[var(--ld-text)] antialiased`}
        style={siteVars}
      >
        <div className="gap-4 p-3 sm:p-4 lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
          {/* Left: the photo panel with the section's word. */}
          <aside className="relative h-[78svh] min-h-[520px] overflow-hidden rounded-[18px] lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem-2.25rem)]">
            <AnimatePresence initial={false}>
              <motion.div animate={{ opacity: 1 }} className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key={active.photo} transition={{ duration: 0.7 }}>
                <Photo lang={lang} name={active.photo} priority={active.id === "giris"} sizes="(min-width: 1024px) 56vw, 100vw" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.45),transparent_28%,transparent_55%,rgba(0,0,0,.72))]" />

            <nav aria-label="Lodos Meyhane" className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-[14px] border border-[var(--ld-line)] bg-[#0B0C0B]/85 p-1.5 backdrop-blur sm:top-6 sm:left-6">
              <button
                aria-expanded={open}
                aria-label={open ? c.menuClose : c.menuOpen}
                className="grid size-10 place-items-center rounded-[9px] border border-[var(--ld-line)] hover:bg-white/5"
                onClick={() => setOpen((o) => !o)}
                type="button"
              >
                {open ? <X aria-hidden="true" className="size-4" /> : <MenuIcon aria-hidden="true" className="size-4" />}
              </button>
              <a className="px-3 font-[family-name:var(--ld-display)] text-2xl leading-none tracking-[0.06em]" href="#giris">
                LODOS
              </a>
              <a className="hidden px-3 text-xs tracking-[0.14em] uppercase hover:text-white sm:inline" href="#menu">
                {c.menu}
              </a>
              <a className="hidden px-3 text-xs tracking-[0.14em] uppercase hover:text-white sm:inline" href="#geceler">
                {c.nights}
              </a>
              <Link className="ml-1 inline-flex min-h-10 items-center rounded-[9px] border border-[var(--ld-line)] px-3.5 text-xs tracking-[0.14em] uppercase hover:bg-[var(--ld-text)] hover:text-[var(--ld-bg)]" href={RESERVE_PATH}>
                {c.book}
              </Link>
            </nav>
            {open && (
              <ul className="absolute top-20 left-4 z-10 w-56 rounded-[14px] border border-[var(--ld-line)] bg-[#0B0C0B]/95 p-2 backdrop-blur sm:top-24 sm:left-6">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a className="block rounded-[9px] px-3 py-2.5 font-[family-name:var(--ld-display)] text-xl tracking-[0.06em] uppercase hover:bg-white/5" href={`#${s.id}`} onClick={() => setOpen(false)}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <div aria-hidden="true" className="absolute bottom-6 left-6 overflow-hidden sm:bottom-10 sm:left-10">
              <AnimatePresence initial={false} mode="wait">
                <motion.p
                  animate={{ y: 0, opacity: 1 }}
                  className="font-[family-name:var(--ld-display)] text-[clamp(4rem,10.5vw,9.5rem)] leading-[0.82] tracking-[0.01em]"
                  exit={{ y: "-40%", opacity: 0 }}
                  initial={{ y: "60%", opacity: 0 }}
                  key={active.word}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {upper(active.word)}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="absolute right-0 bottom-0 hidden rounded-tl-[18px] bg-[var(--ld-bg)] px-5 pt-3 pb-4 text-[11px] tracking-[0.16em] uppercase sm:block">
              {c.hours}
            </p>
          </aside>

          {/* Right: the content. */}
          <main className="mt-4 space-y-4 lg:mt-0">
            <section className="scroll-mt-4 space-y-4" id="giris">
              <div className="rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10">
                <p className="text-[11px] tracking-[0.2em] text-[var(--ld-muted)] uppercase">{c.eyebrow}</p>
                <h1 className="mt-4 font-[family-name:var(--ld-display)] text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02]">{c.h1}</h1>
                <p className="mt-5 max-w-[46ch] leading-7 text-[var(--ld-muted)]">
                  {c.intro}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["#menu", "meze", c.seeMenu],
                    [RESERVE_PATH, "salon", c.book],
                  ] as const
                ).map(([href, ph, label]) => (
                  <Link className="group relative block aspect-[4/3] overflow-hidden rounded-[18px]" href={href} key={label}>
                    <Photo className="transition-transform duration-700 group-hover:scale-[1.04]" lang={lang} name={ph} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw" />
                    <span className="absolute right-0 bottom-0 flex items-center gap-2 rounded-tl-[16px] bg-[var(--ld-bg)] py-3 pr-5 pl-5 text-xs tracking-[0.16em] uppercase">
                      {label} <span aria-hidden="true">↗</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section aria-labelledby="menu-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="menu">
              <div className="flex items-center justify-center gap-4 text-[var(--ld-muted)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--ld-line)]" />
                <h2 className="font-[family-name:var(--ld-display)] text-3xl tracking-[0.08em] text-[var(--ld-text)]" id="menu-baslik">
                  {c.menuHead}
                </h2>
                <span aria-hidden="true" className="h-px w-10 bg-[var(--ld-line)]" />
              </div>
              <div aria-label={c.menuGroup} className="mt-6 flex flex-wrap justify-center gap-2" role="group">
                {menu.map((m) => (
                  <button
                    aria-pressed={cat === m.id}
                    className={`min-h-10 rounded-[9px] border px-3.5 text-xs tracking-[0.14em] uppercase transition-colors ${cat === m.id ? "border-[var(--ld-text)] bg-[var(--ld-text)] text-[var(--ld-bg)]" : "border-[var(--ld-line)] hover:border-[var(--ld-text)]"}`}
                    key={m.id}
                    onClick={() => setCat(m.id)}
                    type="button"
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              <ul className="mt-8 space-y-6">
                {category.items.map((it) => (
                  <li className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-4" key={it.name}>
                    <span aria-hidden="true" className="mt-0.5 grid size-13 place-items-center rounded-full bg-[#E9E6DD] shadow-[inset_0_0_0_4px_#F6F4EE,0_4px_10px_rgba(0,0,0,.5)]">
                      <span className="size-8 rounded-full" style={{ background: plate[it.name] ?? "#BBB" }} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-3">
                        <span className="font-[family-name:var(--ld-display)] text-xl tracking-[0.04em]">{dish(it.name)}</span>
                        <span aria-hidden="true" className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-[var(--ld-line)]" />
                        <span className="font-[family-name:var(--ld-display)] text-xl">{it.price ? tl(it.price) : c.atVenue}</span>
                      </span>
                      {it.note && <span className="mt-1 block text-sm leading-6 text-[var(--ld-muted)]">{it.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-center text-xs leading-5 text-[var(--ld-muted)]">{c.menuNote}</p>
            </section>

            <section aria-labelledby="tepsi-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="tepsi">
              <p className="text-[11px] tracking-[0.2em] text-[var(--ld-muted)] uppercase">{c.setMenu}</p>
              <h2 className="mt-3 font-[family-name:var(--ld-display)] text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]" id="tepsi-baslik">
                {c.trayHead}
              </h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-6 text-[var(--ld-muted)]">{c.trayLead}</p>
              <div className="mt-8">
                <MezeTray lang={lang} />
              </div>
            </section>

            <section aria-labelledby="geceler-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="geceler">
              <h2 className="font-[family-name:var(--ld-display)] text-[clamp(2rem,3.4vw,3rem)] leading-none" id="geceler-baslik">
                {c.nightsHead}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ld-muted)]">{c.nightsLead}</p>
              <ol className="@container mt-6 divide-y divide-[var(--ld-line)] border-y border-[var(--ld-line)]">
                {nights.map((n) => {
                  const filled = Math.round(n.busy * 10);
                  return (
                    <li className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 py-4 @[34rem]:grid-cols-[7.5rem_minmax(0,1fr)_auto]" key={n.day}>
                      <span className="font-[family-name:var(--ld-display)] text-lg tracking-[0.06em]">{upper(n.day)}</span>
                      <span className="text-sm">{n.what}</span>
                      <span className="col-start-2 flex items-center gap-3 @[34rem]:col-start-auto">
                        <span aria-hidden="true" className="flex gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <span className={`size-1.5 rounded-full ${i < filled ? "bg-[var(--ld-text)]" : "bg-[var(--ld-line)]"}`} key={i} />
                          ))}
                        </span>
                        <span className="w-24 text-xs text-[var(--ld-muted)]">{c.crowd(n.busy)}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section aria-labelledby="tezgah-baslik" className="scroll-mt-4 overflow-hidden rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)]" id="tezgah">
              <div className="aspect-[16/9]">
                <Photo lang={lang} name="balik" sizes="(min-width: 1024px) 44vw, 100vw" />
              </div>
              <div className="p-7 sm:p-10">
                <h2 className="font-[family-name:var(--ld-display)] text-[clamp(2rem,3.4vw,3rem)] leading-none" id="tezgah-baslik">
                  {c.counterHead}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--ld-muted)]">{c.counterLead}</p>
                <ul className="mt-6 divide-y divide-[var(--ld-line)]">
                  {menu
                    .find((m) => m.id === "balik")!
                    .items.map((f) => (
                      <li className="flex items-baseline justify-between gap-4 py-3" key={f.name}>
                        <span className="font-[family-name:var(--ld-display)] text-lg tracking-[0.04em]">{dish(f.name)}</span>
                        <span className="text-right text-sm text-[var(--ld-muted)]">{f.price ? tl(f.price) : c.byWeight}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="masa-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="masa">
              <h2 className="font-[family-name:var(--ld-display)] text-[clamp(2.2rem,4vw,3.6rem)] leading-none" id="masa-baslik">
                {c.tableHead}
              </h2>
              <p className="mt-4 max-w-[44ch] leading-7 text-[var(--ld-muted)]">{c.tableLead}</p>
              <Link
                className="mt-7 inline-flex min-h-12 items-center rounded-[10px] bg-[var(--ld-text)] px-7 text-xs font-semibold tracking-[0.16em] text-[var(--ld-bg)] uppercase hover:bg-white"
                href={RESERVE_PATH}
              >
                {c.book}
              </Link>
              <dl className="mt-10 grid gap-6 border-t border-[var(--ld-line)] pt-8 text-sm sm:grid-cols-2">
                {c.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-[family-name:var(--ld-display)] text-lg tracking-[0.06em] uppercase">{k}</dt>
                    <dd className="mt-1 leading-6 text-[var(--ld-muted)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <footer className="px-2 pt-4 pb-8 text-xs leading-5 text-[var(--ld-muted)]">
              <p>{c.footer}</p>
              <p className="mt-2">
                {c.photos}: Unsplash · {credits.join(", ")}.
              </p>
            </footer>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
