"use client";

import { ArrowRight, Plus } from "lucide-react";
import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import { type AreaId, areaName, areas, situations } from "./data";

type Ctx = { situation: string | null; setSituation: (id: string) => void; area: AreaId | null; setArea: (a: AreaId | null) => void };
const LawCtx = createContext<Ctx | null>(null);
const useLaw = () => useContext(LawCtx)!;

/** Shares the visitor's chosen situation between the routes list and the form. */
export function LawProvider({ children }: { children: ReactNode }) {
  const [situation, setSit] = useState<string | null>(null);
  const [area, setArea] = useState<AreaId | null>(null);
  const setSituation = (id: string) => {
    setSit(id);
    setArea(situations.find((s) => s.id === id)?.area ?? null);
  };
  return <LawCtx.Provider value={{ situation, setSituation, area, setArea }}>{children}</LawCtx.Provider>;
}

/** The situations, numbered rows that open in place to show what the visitor needs to know. */
export function Routes() {
  const { situation, setSituation } = useLaw();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ol className="border-t border-[var(--law-line)]">
      {situations.map((s, i) => {
        const isOpen = open === s.id;
        return (
          <li className="border-b border-[var(--law-line)]" key={s.id}>
            <button
              aria-controls={`durum-${s.id}`}
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] items-baseline gap-x-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : s.id)}
              type="button"
            >
              <span className="text-xs font-semibold text-[var(--law-slate)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-[family-name:var(--law-display)] text-[1.45rem] leading-snug font-light group-hover:text-[var(--law-oxblood)]">{s.says}</span>
                <span className="mt-1 block text-sm text-[var(--law-slate)]">{areaName(s.area)}</span>
              </span>
              <ArrowRight aria-hidden="true" className={`size-4 self-center text-[var(--law-oxblood)] transition-transform ${isOpen ? "rotate-90" : "group-hover:translate-x-1"}`} />
            </button>
            {isOpen && (
              <div className="grid gap-6 pb-7 pl-[3.25rem] md:grid-cols-2" id={`durum-${s.id}`}>
                <p className="leading-7">{s.means}</p>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--law-oxblood)] uppercase">İlk görüşmeye getirin</p>
                  <ul className="mt-3 space-y-1.5 text-[15px]">
                    {s.bring.map((b) => (
                      <li className="flex gap-2.5" key={b}>
                        <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-[var(--law-oxblood)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="mt-5 inline-flex items-center gap-2 border-b border-[var(--law-oxblood)] pb-0.5 text-sm font-semibold text-[var(--law-oxblood)]"
                    href="#on-gorusme"
                    onClick={() => setSituation(s.id)}
                  >
                    {situation === s.id ? "Forma eklendi, forma git" : "Bu konuda ön görüşme talep edin"} <ArrowRight aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Practice areas as rows that open to list what each covers. */
export function AreaRows() {
  const [open, setOpen] = useState<AreaId | null>(null);
  return (
    <ul className="border-t border-[var(--law-line)]">
      {areas.map((a) => {
        const isOpen = open === a.id;
        return (
          <li className="border-b border-[var(--law-line)]" key={a.id}>
            <button
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 px-2 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : a.id)}
              type="button"
            >
              <span className="font-[family-name:var(--law-display)] text-xl font-light group-hover:text-[var(--law-oxblood)]">{a.name}</span>
              <Plus aria-hidden="true" className={`size-4 shrink-0 text-[var(--law-oxblood)] transition-transform ${isOpen ? "rotate-45" : ""}`} />
            </button>
            {isOpen && (
              <ul className="space-y-1.5 px-2 pb-5 text-[15px] text-[var(--law-slate)]">
                {a.covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

type Errors = Partial<Record<"name" | "contact" | "area" | "consent", string>>;

/** First-consultation request. A demo: nothing is sent anywhere. */
export function ConsultForm() {
  const { situation, area, setArea } = useLaw();
  const picked = situations.find((s) => s.id === situation);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const x: Errors = {};
    if (name.trim().length < 2) x.name = "Adınızı ve soyadınızı yazın.";
    const c = contact.trim();
    if (!/^\S+@\S+\.\S+$/.test(c) && !/^0?5\d{9}$/.test(c.replace(/\D/g, ""))) x.contact = "Geçerli bir e-posta ya da 05XX XXX XX XX biçiminde telefon yazın.";
    if (!area) x.area = "Konunun hangi alana girdiğini seçin; emin değilseniz en yakın olanı seçebilirsiniz.";
    if (!consent) x.consent = "Devam etmek için aydınlatma metnini onaylayın.";
    setErrors(x);
    if (Object.keys(x).length === 0) setSent(true);
  }

  const field = "mt-2 min-h-12 w-full border bg-white px-4 text-[15px] text-[var(--law-ink)] outline-none focus:border-[var(--law-oxblood)]";
  const err = (k: keyof Errors) =>
    errors[k] && (
      <p className="mt-2 text-sm text-[var(--law-oxblood)]" id={`law-${k}-err`}>
        {errors[k]}
      </p>
    );

  if (sent) {
    return (
      <div aria-live="polite" className="bg-[var(--law-paper)] p-8 text-[var(--law-ink)]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--law-oxblood)] uppercase">Talebiniz alındı</p>
        <p className="mt-3 font-[family-name:var(--law-display)] text-3xl font-light">Teşekkürler, {name.trim().split(" ")[0]}.</p>
        <p className="mt-3 leading-7 text-[var(--law-slate)]">
          {areaName(area!)} konusundaki ön görüşme talebiniz için bir iş günü içinde size ulaşılır. (Bu bir örnek sitedir; form hiçbir yere gönderilmedi.)
        </p>
        <button className="mt-6 text-sm font-semibold text-[var(--law-oxblood)] underline underline-offset-4" onClick={() => setSent(false)} type="button">
          Yeni talep oluştur
        </button>
      </div>
    );
  }

  return (
    <form className="bg-[var(--law-paper)] p-6 text-[var(--law-ink)] sm:p-8" noValidate onSubmit={submit}>
      {picked && (
        <p className="mb-6 border-l-2 border-[var(--law-oxblood)] bg-[var(--law-panel)] px-4 py-3 text-sm">
          Seçtiğiniz durum: <span className="font-semibold">{picked.says}</span>
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="law-name">
            Adınız ve soyadınız
          </label>
          <input
            aria-describedby={errors.name ? "law-name-err" : undefined}
            aria-invalid={!!errors.name}
            autoComplete="off"
            className={`${field} ${errors.name ? "border-[var(--law-oxblood)]" : "border-[var(--law-line)]"}`}
            id="law-name"
            onChange={(e) => {
              setName(e.target.value);
              setErrors((v) => ({ ...v, name: undefined }));
            }}
            value={name}
          />
          {err("name")}
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="law-contact">
            Telefon ya da e-posta
          </label>
          <input
            aria-describedby={errors.contact ? "law-contact-err" : undefined}
            aria-invalid={!!errors.contact}
            autoComplete="off"
            className={`${field} ${errors.contact ? "border-[var(--law-oxblood)]" : "border-[var(--law-line)]"}`}
            id="law-contact"
            onChange={(e) => {
              setContact(e.target.value);
              setErrors((v) => ({ ...v, contact: undefined }));
            }}
            value={contact}
          />
          {err("contact")}
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold" htmlFor="law-area">
          Konu
        </label>
        <select
          aria-describedby={errors.area ? "law-area-err" : undefined}
          aria-invalid={!!errors.area}
          className={`${field} ${errors.area ? "border-[var(--law-oxblood)]" : "border-[var(--law-line)]"}`}
          id="law-area"
          onChange={(e) => {
            setArea((e.target.value || null) as AreaId | null);
            setErrors((v) => ({ ...v, area: undefined }));
          }}
          value={area ?? ""}
        >
          <option value="">Seçin</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {err("area")}
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold" htmlFor="law-note">
          Kısaca durumunuz <span className="font-normal text-[var(--law-slate)]">(isteğe bağlı)</span>
        </label>
        <textarea className={`${field} min-h-28 border-[var(--law-line)] py-3`} id="law-note" maxLength={600} onChange={(e) => setNote(e.target.value)} value={note} />
        <p className="mt-2 text-xs text-[var(--law-slate)]">Kimlik numarası gibi hassas bilgileri buraya yazmayın; görüşmede konuşulur.</p>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6">
        <input
          aria-describedby={errors.consent ? "law-consent-err" : undefined}
          aria-invalid={!!errors.consent}
          checked={consent}
          className="mt-1 size-5 shrink-0 accent-[var(--law-oxblood)]"
          onChange={(e) => {
            setConsent(e.target.checked);
            setErrors((v) => ({ ...v, consent: undefined }));
          }}
          type="checkbox"
        />
        <span>Kişisel verilerimin yalnızca bu talebe dönüş yapılması amacıyla işlenmesine ilişkin aydınlatma metnini okudum.</span>
      </label>
      {err("consent")}

      <button className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--law-oxblood)] px-6 font-semibold text-white transition-colors hover:bg-[var(--law-ink)] sm:w-auto" type="submit">
        Ön görüşme talep edin <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </form>
  );
}
