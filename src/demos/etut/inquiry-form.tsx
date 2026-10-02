"use client";

import { type FormEvent, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { type Kind, etutIn, kinds } from "./data";

const COPY = {
  tr: {
    errKind: "Projenin türünü seçin.",
    errCity: "Projenin bulunduğu ili yazın.",
    errName: "Adınızı yazın.",
    errContact: "E-posta ya da 05XX XXX XX XX biçiminde telefon yazın.",
    received: "TALEP ALINDI · ÖRNEK",
    title: "Keşif için size döneceğiz",
    reply: (city: string, kind: string) =>
      `${city} için ${kind.toLocaleLowerCase("tr")} talebiniz alındı. Keşif gününü birlikte belirlemek için iki iş günü içinde arıyoruz. (Bu bir örnek sitedir; form hiçbir yere gönderilmedi.)`,
    again: "YENİ TALEP",
    kind: "Proje türü",
    city: "İl",
    size: "Yaklaşık alan",
    sizeNote: "(m², isteğe bağlı)",
    when: "Ne zaman başlamak istiyorsunuz?",
    whens: ["Hemen", "3-6 ay içinde", "6-12 ay içinde", "Henüz fikir aşamasında"],
    name: "Adınız",
    contact: "Telefon ya da e-posta",
    submit: "Keşif talep et",
  },
  en: {
    errKind: "Choose the type of project.",
    errCity: "Write the province the project is in.",
    errName: "Write your name.",
    errContact: "Write an email, or a Turkish phone number as 05XX XXX XX XX.",
    received: "REQUEST RECEIVED · SAMPLE",
    title: "We'll get back to you about a site visit",
    reply: (city: string, kind: string) =>
      `Your ${kind.toLowerCase()} request for ${city} has been received. We'll call within two working days to agree a day for the site visit. (This is a sample site; the form wasn't sent anywhere.)`,
    again: "NEW REQUEST",
    kind: "Project type",
    city: "Province",
    size: "Approximate area",
    sizeNote: "(m², optional)",
    when: "When would you like to start?",
    whens: ["Right away", "Within 3–6 months", "Within 6–12 months", "Still just an idea"],
    name: "Your name",
    contact: "Phone or email",
    submit: "Request a site visit",
  },
};

type Errors = Partial<Record<"kind" | "city" | "name" | "contact", string>>;

const mono = "font-[family-name:var(--etut-mono)] text-[11px] tracking-wide";
const field =
  "mt-2 min-h-12 w-full border-0 border-b bg-transparent px-0 text-[15px] outline-none focus:border-[var(--etut-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--etut-ink)]";

/** Site-visit request. A demo: nothing is sent anywhere. */
export function InquiryForm() {
  const lang = useLang();
  const c = COPY[lang];
  const { kindName } = etutIn(lang);
  const [kind, setKind] = useState<Kind | null>(null);
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [when, setWhen] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const x: Errors = {};
    if (!kind) x.kind = c.errKind;
    if (city.trim().length < 2) x.city = c.errCity;
    if (name.trim().length < 2) x.name = c.errName;
    const typed = contact.trim();
    if (!/^\S+@\S+\.\S+$/.test(typed) && !/^0?5\d{9}$/.test(typed.replace(/\D/g, ""))) x.contact = c.errContact;
    setErrors(x);
    if (!Object.keys(x).length) setSent(true);
  }

  const err = (k: keyof Errors) =>
    errors[k] && (
      <p className="mt-2 text-sm text-[var(--etut-red)]" id={`etut-${k}-err`}>
        {errors[k]}
      </p>
    );
  const border = (k: keyof Errors) => (errors[k] ? "border-[var(--etut-red)]" : "border-[var(--etut-ink)]/20");

  if (sent) {
    return (
      <div aria-live="polite" className="border-t border-[var(--etut-ink)] pt-5">
        <p className={`${mono} text-[var(--etut-red)]`}>{c.received}</p>
        <p className="mt-3 font-[family-name:var(--etut-display)] text-5xl leading-[0.95] font-bold tracking-[-0.05em]">{c.title}</p>
        <p className="mt-4 leading-7 text-[var(--etut-ink)]/80">
          {c.reply(city.trim(), kindName(kind!))}
        </p>
        <button className={`${mono} mt-6 underline underline-offset-4`} onClick={() => setSent(false)} type="button">
          {c.again}
        </button>
      </div>
    );
  }

  return (
    <form className="border-t border-[var(--etut-ink)] pt-5" noValidate onSubmit={submit}>
      <fieldset>
        <legend className="text-sm font-semibold">{c.kind}</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {kinds.map((k) => (
            <label
              className={`flex min-h-12 cursor-pointer items-center gap-2 border px-3 text-sm transition-colors has-[:checked]:border-[var(--etut-ink)] has-[:checked]:bg-[var(--etut-ink)] has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${errors.kind ? "border-[var(--etut-red)]" : "border-[var(--etut-ink)]/20"}`}
              key={k}
            >
              <input
                checked={kind === k}
                className="sr-only"
                name="etut-kind"
                onChange={() => {
                  setKind(k);
                  setErrors((v) => ({ ...v, kind: undefined }));
                }}
                type="radio"
                value={k}
              />
              {kindName(k)}
            </label>
          ))}
        </div>
        {err("kind")}
      </fieldset>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="etut-city">
            {c.city}
          </label>
          <input
            aria-describedby={errors.city ? "etut-city-err" : undefined}
            aria-invalid={!!errors.city}
            className={`${field} ${border("city")}`}
            id="etut-city"
            onChange={(e) => {
              setCity(e.target.value);
              setErrors((v) => ({ ...v, city: undefined }));
            }}
            placeholder="İzmir"
            value={city}
          />
          {err("city")}
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="etut-size">
            {c.size} <span className="font-normal text-[var(--etut-muted)]">{c.sizeNote}</span>
          </label>
          <input
            className={`${field} border-[var(--etut-ink)]/20`}
            id="etut-size"
            inputMode="numeric"
            onChange={(e) => setSize(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="120"
            value={size}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold" htmlFor="etut-when">
          {c.when}
        </label>
        <select className={`${field} border-[var(--etut-ink)]/20`} id="etut-when" onChange={(e) => setWhen(Number(e.target.value))} value={when}>
          {c.whens.map((o, i) => (
            <option key={o} value={i}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="etut-name">
            {c.name}
          </label>
          <input
            aria-describedby={errors.name ? "etut-name-err" : undefined}
            aria-invalid={!!errors.name}
            autoComplete="off"
            className={`${field} ${border("name")}`}
            id="etut-name"
            onChange={(e) => {
              setName(e.target.value);
              setErrors((v) => ({ ...v, name: undefined }));
            }}
            value={name}
          />
          {err("name")}
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="etut-contact">
            {c.contact}
          </label>
          <input
            aria-describedby={errors.contact ? "etut-contact-err" : undefined}
            aria-invalid={!!errors.contact}
            autoComplete="off"
            className={`${field} ${border("contact")}`}
            id="etut-contact"
            onChange={(e) => {
              setContact(e.target.value);
              setErrors((v) => ({ ...v, contact: undefined }));
            }}
            value={contact}
          />
          {err("contact")}
        </div>
      </div>

      <button
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--etut-ink)] px-6 font-bold text-white transition-colors hover:bg-[#333] sm:w-auto"
        type="submit"
      >
        {c.submit}
      </button>
    </form>
  );
}
