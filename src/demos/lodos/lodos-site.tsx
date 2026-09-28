"use client";

import { Menu as MenuIcon, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { menu, nights, RESERVE_PATH, tl, tray } from "./data";
import { credits, Photo, type PhotoKey } from "./photos";
import { forum, grotesk, siteVars } from "./site-theme";
import { MezeTray } from "./tray";

// Each section of the page owns the photo and the big word on the left panel.
const sections: { id: string; word: string; photo: PhotoKey; label: string }[] = [
  { id: "giris", word: "Lodos", photo: "masa", label: "Giriş" },
  { id: "menu", word: "Menü", photo: "meze", label: "Menü" },
  { id: "tepsi", word: "Tepsi", photo: "tepsi", label: "Tepsi" },
  { id: "geceler", word: "Geceler", photo: "gece", label: "Geceler" },
  { id: "tezgah", word: "Tezgâh", photo: "tezgah", label: "Tezgâh" },
  { id: "masa", word: "Masa", photo: "salon", label: "Masa ayırt" },
];

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

const crowd = (busy: number) => (busy >= 0.9 ? "Genelde dolu" : busy >= 0.6 ? "Kalabalık" : "Rahat");
const upper = (s: string) => s.toLocaleUpperCase("tr");

export function LodosSite() {
  const [active, setActive] = useState(sections[0]);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(menu[0].id);

  // Swap the left panel as sections scroll through the middle of the screen.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((x): x is HTMLElement => !!x);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(sections.find((s) => s.id === hit.target.id) ?? sections[0]);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const category = menu.find((c) => c.id === cat)!;

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
                <Photo name={active.photo} priority={active.id === "giris"} sizes="(min-width: 1024px) 56vw, 100vw" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.45),transparent_28%,transparent_55%,rgba(0,0,0,.72))]" />

            <nav aria-label="Lodos Meyhane" className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-[14px] border border-[var(--ld-line)] bg-[#0B0C0B]/85 p-1.5 backdrop-blur sm:top-6 sm:left-6">
              <button
                aria-expanded={open}
                aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
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
                Menü
              </a>
              <a className="hidden px-3 text-xs tracking-[0.14em] uppercase hover:text-white sm:inline" href="#geceler">
                Geceler
              </a>
              <Link className="ml-1 inline-flex min-h-10 items-center rounded-[9px] border border-[var(--ld-line)] px-3.5 text-xs tracking-[0.14em] uppercase hover:bg-[var(--ld-text)] hover:text-[var(--ld-bg)]" href={RESERVE_PATH}>
                Masa ayırt
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
              Kadıköy · Salı–Cumartesi 18.00–01.00
            </p>
          </aside>

          {/* Right: the content. */}
          <main className="mt-4 space-y-4 lg:mt-0">
            <section className="scroll-mt-4 space-y-4" id="giris">
              <div className="rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10">
                <p className="text-[11px] tracking-[0.2em] text-[var(--ld-muted)] uppercase">Meyhane · Kadıköy · örnek işletme</p>
                <h1 className="mt-4 font-[family-name:var(--ld-display)] text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02]">Lodos eserse balıkçı denize çıkmaz. Biz sofrayı kurarız.</h1>
                <p className="mt-5 max-w-[46ch] leading-7 text-[var(--ld-muted)]">
                  On dört masalık bir meyhane. Soğukları her sabah tezgâhta hazırlıyor, balığı günlük alıyoruz; akşam ne varsa tahtaya yazıyoruz.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["#menu", "meze", "Menüye bak"],
                    [RESERVE_PATH, "salon", "Masa ayırt"],
                  ] as const
                ).map(([href, ph, label]) => (
                  <Link className="group relative block aspect-[4/3] overflow-hidden rounded-[18px]" href={href} key={label}>
                    <Photo className="transition-transform duration-700 group-hover:scale-[1.04]" name={ph} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw" />
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
                  MENÜ
                </h2>
                <span aria-hidden="true" className="h-px w-10 bg-[var(--ld-line)]" />
              </div>
              <div aria-label="Menü bölümleri" className="mt-6 flex flex-wrap justify-center gap-2" role="group">
                {menu.map((c) => (
                  <button
                    aria-pressed={cat === c.id}
                    className={`min-h-10 rounded-[9px] border px-3.5 text-xs tracking-[0.14em] uppercase transition-colors ${cat === c.id ? "border-[var(--ld-text)] bg-[var(--ld-text)] text-[var(--ld-bg)]" : "border-[var(--ld-line)] hover:border-[var(--ld-text)]"}`}
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    type="button"
                  >
                    {c.name}
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
                        <span className="font-[family-name:var(--ld-display)] text-xl tracking-[0.04em]">{upper(it.name)}</span>
                        <span aria-hidden="true" className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-[var(--ld-line)]" />
                        <span className="font-[family-name:var(--ld-display)] text-xl">{it.price ? tl(it.price) : "Mekânda"}</span>
                      </span>
                      {it.note && <span className="mt-1 block text-sm leading-6 text-[var(--ld-muted)]">{it.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-center text-xs leading-5 text-[var(--ld-muted)]">Fiyatlar örnektir ve KDV dahildir. Servis, kuver ya da masa ücreti alınmaz.</p>
            </section>

            <section aria-labelledby="tepsi-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="tepsi">
              <p className="text-[11px] tracking-[0.2em] text-[var(--ld-muted)] uppercase">Fix menü</p>
              <h2 className="mt-3 font-[family-name:var(--ld-display)] text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]" id="tepsi-baslik">
                Garson tepsiyi getirdi. Altısını siz seçin.
              </h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-6 text-[var(--ld-muted)]">Seçiminizi şimdiden yapın, rezervasyonunuza not düşelim; geldiğinizde masada olsun.</p>
              <div className="mt-8">
                <MezeTray />
              </div>
            </section>

            <section aria-labelledby="geceler-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="geceler">
              <h2 className="font-[family-name:var(--ld-display)] text-[clamp(2rem,3.4vw,3rem)] leading-none" id="geceler-baslik">
                Haftanın geceleri
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ld-muted)]">Hafta sonu için en az üç gün önceden yer ayırtın. Hafta içi çoğu akşam kapıdan da masa bulunur.</p>
              <ol className="mt-6 divide-y divide-[var(--ld-line)] border-y border-[var(--ld-line)]">
                {nights.map((n) => {
                  const filled = Math.round(n.busy * 10);
                  return (
                    <li className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto]" key={n.day}>
                      <span className="font-[family-name:var(--ld-display)] text-lg tracking-[0.06em]">{upper(n.day)}</span>
                      <span className="text-sm">{n.what}</span>
                      <span className="col-start-2 flex items-center gap-3 sm:col-start-auto">
                        <span aria-hidden="true" className="flex gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <span className={`size-1.5 rounded-full ${i < filled ? "bg-[var(--ld-text)]" : "bg-[var(--ld-line)]"}`} key={i} />
                          ))}
                        </span>
                        <span className="w-24 text-xs text-[var(--ld-muted)]">{crowd(n.busy)}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section aria-labelledby="tezgah-baslik" className="scroll-mt-4 overflow-hidden rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)]" id="tezgah">
              <div className="aspect-[16/9]">
                <Photo name="balik" sizes="(min-width: 1024px) 44vw, 100vw" />
              </div>
              <div className="p-7 sm:p-10">
                <h2 className="font-[family-name:var(--ld-display)] text-[clamp(2rem,3.4vw,3rem)] leading-none" id="tezgah-baslik">
                  Bugün tezgâhta
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--ld-muted)]">Lodos, 5 bofor. Tekneler limanda; tezgâhta dünden kalan balık olmaz.</p>
                <ul className="mt-6 divide-y divide-[var(--ld-line)]">
                  {menu
                    .find((c) => c.id === "balik")!
                    .items.map((f) => (
                      <li className="flex items-baseline justify-between gap-4 py-3" key={f.name}>
                        <span className="font-[family-name:var(--ld-display)] text-lg tracking-[0.04em]">{upper(f.name)}</span>
                        <span className="text-right text-sm text-[var(--ld-muted)]">{f.price ? tl(f.price) : "Kilo fiyatı mekânda"}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="masa-baslik" className="scroll-mt-4 rounded-[18px] border border-[var(--ld-line)] bg-[var(--ld-panel)] p-7 sm:p-10" id="masa">
              <h2 className="font-[family-name:var(--ld-display)] text-[clamp(2.2rem,4vw,3.6rem)] leading-none" id="masa-baslik">
                Masanız hazır olsun.
              </h2>
              <p className="mt-4 max-w-[44ch] leading-7 text-[var(--ld-muted)]">Kişi sayısını ve saati seçin, salon planından masanızı gösterin. Adres ve yol tarifi onay mesajıyla gelir.</p>
              <Link
                className="mt-7 inline-flex min-h-12 items-center rounded-[10px] bg-[var(--ld-text)] px-7 text-xs font-semibold tracking-[0.16em] text-[var(--ld-bg)] uppercase hover:bg-white"
                href={RESERVE_PATH}
              >
                Masa ayırt
              </Link>
              <dl className="mt-10 grid gap-6 border-t border-[var(--ld-line)] pt-8 text-sm sm:grid-cols-2">
                {[
                  ["Saatler", "Salı–Cumartesi 18.00–01.00 · Pazar 13.00–23.00 · Pazartesi 18.00–24.00"],
                  ["Gecikirseniz", "Masanızı 20 dakika tutarız. Yolda kaldıysanız mesaj atmanız yeter."],
                  ["Kalabalık gruplar", "8 kişi ve üzeri için fix menü ve ön ödeme gerekir."],
                  ["Fasıl geceleri", "Müzik 21.00'de başlar. Sessiz bir köşe isterseniz notta belirtin."],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-[family-name:var(--ld-display)] text-lg tracking-[0.06em] uppercase">{k}</dt>
                    <dd className="mt-1 leading-6 text-[var(--ld-muted)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <footer className="px-2 pt-4 pb-8 text-xs leading-5 text-[var(--ld-muted)]">
              <p>Lodos Meyhane örnek bir işletmedir; adres ve telefon içermez. İçecek menüsü yalnızca mekânda sunulur. 18 yaşından küçüklere alkollü içki satılmaz.</p>
              <p className="mt-2">Fotoğraflar: Unsplash · {credits.join(", ")}.</p>
            </footer>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
