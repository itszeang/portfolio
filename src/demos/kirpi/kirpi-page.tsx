import { ArrowRight, BellRing, FileSpreadsheet, FolderOpen, Mail, Package, Plus, Truck } from "lucide-react";
import { KirpiApp } from "./kirpi-app";
import { kirpiIn } from "./mail";
import { NightLog } from "./night-log";
import { Savings } from "./savings";
import { SortLink } from "./sort-link";
import { body, display, kpVars, mono } from "./theme";
import type { Lang } from "@/lib/i18n";

const head = "font-[family-name:var(--kp-display)] font-semibold";
const h2 = `${head} text-[clamp(2.3rem,5vw,4rem)] leading-[0.98] tracking-[-0.02em]`;
const lead = "mt-5 max-w-[52ch] text-lg leading-8 text-[var(--kp-muted)]";
const primary = "inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--kp-ink)] px-6 font-semibold text-white transition-colors hover:bg-black";

const TOOL_ICONS = [Mail, FileSpreadsheet, Truck, Package, FolderOpen, BellRing];

const COPY = {
  tr: {
    sub: "seramik atölyesi · Avanos",
    nav: [
      ["Nasıl çalışır", "#nasil"],
      ["Gece", "#gece"],
      ["Hesapla", "#hesap"],
      ["Sorular", "#sorular"],
    ],
    sort: "Postayı ayıkla",
    pill: "Asistan simülasyonu · gerçek e-posta gönderilmez",
    h1: "Sabah postası, siz uyanmadan ayıklanır.",
    lead: "Kirpi Seramik'e dün akşamdan beri sekiz e-posta geldi. Asistan hepsini okudu, sipariş defterine baktı ve cevapları yazdı. Hiçbiri siz onaylamadan gitmez.",
    night: "Gece ne yaptı?",
    demo: "Canlı demo: gelen kutusu",
    howH2: "Her e-posta dört raftan birine.",
    howLead: "Asistan e-postayı okur, gerekirse sipariş defterine ve kargo takibine bakar, sonra rafına koyar. Rafı ne olursa olsun son söz sizde.",
    thisMorning: (n: number) => `bu sabah ${n}`,
    example: "Örnek:",
    nightH2: "Siz uyurken o çalışır.",
    nightLead: "Gece gelen her e-posta geldiği dakika okundu ve rafına kondu. Saati ilerletip gecenin nasıl geçtiğine bakın.",
    sumH2: "Sizin gelen kutunuzda ne eder?",
    sumLead: "Kendi rakamlarınızı girin. Hesap kaba bir tahmindir; formülü sonucun altında.",
    toolsH2: "Zaten kullandığınız araçlarla.",
    toolsLead: "Yeni bir program öğrenmeniz gerekmez. Asistan e-postanıza ve işi yürüttüğünüz yerlere bağlanır.",
    tools: [
      ["E-posta kutusu", "Gmail, Outlook ya da alan adınızın e-postası. Okur ve taslak yazar; göndermek için onayınızı bekler."],
      ["Sipariş defteri", "Google E-Tablolar ya da e-ticaret paneliniz. Sipariş numarasından ürünü, tarihi ve durumu bulur."],
      ["Kargo takibi", "Paketin nerede olduğunu kargo firmasının takip sayfasından okur, cevaba ekler."],
      ["Stok ve fiyat listesi", "Değişim ve toptan tekliflerde raf sayımına ve fiyat listesine bakar."],
      ["Muhasebe klasörü", "Gelen faturaları ay ay klasörler; cevap gerekmeyen e-postayı kapatır."],
      ["Ekip notları", "Şikâyet ya da acil bir iş olduğunda ilgili kişiye not bırakır."],
    ],
    faqH2: "Aklınıza takılanlar",
    faq: [
      ["Asistan benim yerime e-posta gönderir mi?", "Hayır. Her cevap taslak olarak bekler; siz onaylamadan hiçbir şey gitmez. İsterseniz kargo durumu gibi kalıp cevaplar için sonradan otomatik gönderim açılabilir."],
      ["Oltalama e-postalarını nasıl anlıyor?", "Gönderen alan adına, bağlantının gittiği adrese ve aciliyet baskısına bakar. Şüpheli e-postaya cevap yazmaz, bağlantıyı açmaz ve nedenini size söyler."],
      ["Yanlış anlarsa ne olur?", "Taslağı düzeltip gönderirsiniz ya da “Ben yazarım” dersiniz. Emin olmadığı e-postayı zaten “Karar sizin” rafına koyar."],
      ["Müşteri bilgileri nereye gidiyor?", "Hangi verinin hangi hizmete gideceği kurulumda yazılı olarak belirlenir. Kişisel veriler yalnızca cevabı hazırlamak için ve KVKK'ya uygun şekilde işlenir."],
      ["Hangi e-posta hizmetleriyle çalışır?", "Gmail, Outlook ve IMAP destekleyen her e-posta hesabıyla."],
    ],
    endH2: "Güne ayıklanmış bir gelen kutusuyla başlayın.",
    footer: "Kirpi Seramik örnek bir işletmedir; kişiler, e-postalar ve sipariş numaraları uydurmadır. Asistan bir simülasyondur, hiçbir e-posta gönderilmez.",
  },
  en: {
    sub: "pottery workshop · Avanos",
    nav: [
      ["How it works", "#nasil"],
      ["Overnight", "#gece"],
      ["Calculate", "#hesap"],
      ["Questions", "#sorular"],
    ],
    sort: "Sort the mail",
    pill: "Assistant simulation · no real email is sent",
    h1: "The morning post, sorted before you wake up.",
    lead: "Eight emails have come in to Kirpi Seramik since last night. The assistant has read them all, checked the order book and written the replies. None of them goes out until you approve it.",
    night: "What did it do overnight?",
    demo: "Live demo: inbox",
    howH2: "Every email onto one of four shelves.",
    howLead: "The assistant reads the email, checks the order book and parcel tracking if it needs to, then puts it on its shelf. Whatever the shelf, you have the last word.",
    thisMorning: (n: number) => `${n} this morning`,
    example: "Example:",
    nightH2: "It works while you sleep.",
    nightLead: "Every email that came in overnight was read and shelved the minute it arrived. Move the clock forward to see how the night went.",
    sumH2: "What would it save in your inbox?",
    sumLead: "Enter your own numbers. It's a rough estimate; the formula is under the result.",
    toolsH2: "With the tools you already use.",
    toolsLead: "There's no new program to learn. The assistant connects to your email and to the places where you already run the business.",
    tools: [
      ["Email inbox", "Gmail, Outlook or the email on your own domain. It reads and drafts, and waits for your approval before sending."],
      ["Order book", "Google Sheets or your online shop's panel. It finds the product, date and status from the order number."],
      ["Parcel tracking", "It reads where the parcel is from the courier's tracking page and adds it to the reply."],
      ["Stock and price list", "For replacements and wholesale quotes, it checks the shelf count and the price list."],
      ["Accounts folder", "It files incoming invoices month by month and closes emails that need no reply."],
      ["Team notes", "When there's a complaint or something urgent, it leaves a note for the right person."],
    ],
    faqH2: "Questions",
    faq: [
      ["Does the assistant send emails for me?", "No. Every reply waits as a draft; nothing goes out until you approve it. If you like, automatic sending can be switched on later for routine replies such as delivery updates."],
      ["How does it spot phishing emails?", "It looks at the sender's domain, where the link really goes and the pressure to act fast. It doesn't reply to a suspicious email or open its link, and it tells you why."],
      ["What if it gets something wrong?", "You correct the draft and send it, or choose “I'll write it”. Emails it isn't sure about already go on the “Your call” shelf."],
      ["Where does customer information go?", "Which data goes to which service is set out in writing during setup. Personal data is processed only to prepare the reply, in line with KVKK, Turkey's data protection law."],
      ["Which email services does it work with?", "Gmail, Outlook and any email account that supports IMAP."],
    ],
    endH2: "Start the day with a sorted inbox.",
    footer: "Kirpi Seramik is a sample business; the people, emails and order numbers are made up. The assistant is a simulation; no email is sent.",
  },
};

/** Kirpi Seramik's inbox assistant, presented like a product page with the product running inside it. */
export function KirpiPage({ lang = "tr" }: { lang?: Lang }) {
  const c = COPY[lang];
  const { mails, trays } = kirpiIn(lang);
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-[100dvh] bg-[var(--kp-bg)] font-[family-name:var(--kp-body)] text-[var(--kp-ink)] antialiased`} style={kpVars}>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <a className="flex items-baseline gap-2" href="#">
          <span className={`${head} text-2xl tracking-[-0.03em]`}>Kirpi</span>
          <span className="hidden text-sm text-[var(--kp-muted)] sm:inline">{c.sub}</span>
        </a>
        <nav aria-label="Kirpi" className="hidden items-center gap-7 text-[15px] md:flex">
          {c.nav.map(([l, h]) => (
            <a className="hover:text-[var(--kp-muted)]" href={h} key={h}>
              {l}
            </a>
          ))}
        </nav>
        <SortLink className="inline-flex min-h-11 items-center rounded-full bg-[var(--kp-ink)] px-5 text-sm font-semibold text-white hover:bg-black">{c.sort}</SortLink>
      </header>

      <main>
        <section className="px-5 pt-12 text-center sm:px-8 sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--kp-line)] px-3.5 py-1.5 text-[13px] text-[var(--kp-muted)]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--kp-glaze)]" />
            {c.pill}
          </p>
          <h1 className={`${head} mx-auto mt-7 max-w-[15ch] text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.95] tracking-[-0.022em]`}>{c.h1}</h1>
          <p className="mx-auto mt-7 max-w-[50ch] text-lg leading-8 text-[var(--kp-muted)]">{c.lead}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <SortLink className={primary}>
              {c.sort} <ArrowRight aria-hidden="true" className="size-4" />
            </SortLink>
            <a className="inline-flex min-h-12 items-center font-semibold underline decoration-[var(--kp-line)] decoration-2 underline-offset-[6px] hover:decoration-[var(--kp-ink)]" href="#gece">
              {c.night}
            </a>
          </div>
        </section>

        <section aria-label={c.demo} className="relative mt-16 scroll-mt-4 px-3 sm:px-8" id="posta">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[-4%] h-[62%] max-h-[560px] bg-[radial-gradient(40%_60%_at_27%_55%,var(--kp-dawn),transparent_72%),radial-gradient(42%_62%_at_74%_45%,var(--kp-morning),transparent_72%)] opacity-90 blur-2xl"
          />
          <div className="relative mx-auto max-w-6xl">
            <KirpiApp />
          </div>
        </section>

        <section aria-labelledby="nasil-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-28 sm:px-8 sm:pt-36" id="nasil">
          <div className="max-w-3xl">
            <h2 className={h2} id="nasil-baslik">
              {c.howH2}
            </h2>
            <p className={lead}>{c.howLead}</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trays.map((t) => {
              const list = mails.filter((m) => m.tray === t.id);
              return (
                <li className="flex flex-col rounded-3xl border border-[var(--kp-line)] p-6" key={t.id}>
                  <p className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: t.tone }} />
                      {t.name}
                    </span>
                    <span className="text-sm text-[var(--kp-muted)]">{c.thisMorning(list.length)}</span>
                  </p>
                  <p className="mt-4 text-[15px] leading-6">{t.hint}.</p>
                  <p className="mt-auto border-t border-[var(--kp-line)] pt-4 text-sm leading-6 text-[var(--kp-muted)]">
                    {c.example} <span className="text-[var(--kp-ink)]">{list[0].subject}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="gece-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-3 pt-28 sm:px-8 sm:pt-36" id="gece">
          <div className="max-w-3xl px-2 sm:px-0">
            <h2 className={h2} id="gece-baslik">
              {c.nightH2}
            </h2>
            <p className={lead}>{c.nightLead}</p>
          </div>
          <div className="mt-12">
            <NightLog />
          </div>
        </section>

        <section aria-labelledby="hesap-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-3 pt-28 sm:px-8 sm:pt-36" id="hesap">
          <div className="max-w-3xl px-2 sm:px-0">
            <h2 className={h2} id="hesap-baslik">
              {c.sumH2}
            </h2>
            <p className={lead}>{c.sumLead}</p>
          </div>
          <div className="mt-12">
            <Savings />
          </div>
        </section>

        <section aria-labelledby="arac-baslik" className="mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-36">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <h2 className={h2} id="arac-baslik">
                {c.toolsH2}
              </h2>
              <p className={lead}>{c.toolsLead}</p>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {c.tools.map(([name, text], i) => {
                const Icon = TOOL_ICONS[i];
                return (
                  <li className="border-t border-[var(--kp-line)] py-6" key={name}>
                    <p className="flex items-center gap-2.5 font-semibold">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} /> {name}
                    </p>
                    <p className="mt-2 text-[15px] leading-6 text-[var(--kp-muted)]">{text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section aria-labelledby="soru-baslik" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-28 sm:px-8 sm:pt-36" id="sorular">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <h2 className={h2} id="soru-baslik">
              {c.faqH2}
            </h2>
            <div className="border-b border-[var(--kp-line)]">
              {c.faq.map(([q, a]) => (
                <details className="group border-t border-[var(--kp-line)]" key={q}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <Plus aria-hidden="true" className="size-5 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="max-w-[60ch] pb-6 leading-7 text-[var(--kp-muted)]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-3 pt-28 pb-6 sm:px-8 sm:pt-36">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--kp-morning)_0%,#E7DCD8_55%,var(--kp-dawn)_100%)] px-6 py-20 text-center sm:py-28">
            <h2 className={`${head} mx-auto max-w-[16ch] text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[0.96] tracking-[-0.02em]`}>{c.endH2}</h2>
            <SortLink className={`${primary} mt-9`}>
              {c.sort} <ArrowRight aria-hidden="true" className="size-4" />
            </SortLink>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 px-5 py-10 text-sm text-[var(--kp-muted)] sm:px-8">
        <span className={`${head} text-xl text-[var(--kp-ink)]`}>Kirpi</span>
        <span className="max-w-[70ch]">{c.footer}</span>
      </footer>
    </div>
  );
}
