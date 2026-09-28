"use client";

import { type FormEvent, useState } from "react";
import { type Kind, kinds } from "./data";

type Errors = Partial<Record<"kind" | "city" | "name" | "contact", string>>;

const mono = "font-[family-name:var(--etut-mono)] text-[11px] tracking-wide";
const field =
  "mt-2 min-h-12 w-full border-0 border-b bg-transparent px-0 text-[15px] outline-none focus:border-[var(--etut-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--etut-ink)]";

/** Site-visit request. A demo: nothing is sent anywhere. */
export function InquiryForm() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [when, setWhen] = useState("3-6 ay içinde");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const x: Errors = {};
    if (!kind) x.kind = "Projenin türünü seçin.";
    if (city.trim().length < 2) x.city = "Projenin bulunduğu ili yazın.";
    if (name.trim().length < 2) x.name = "Adınızı yazın.";
    const c = contact.trim();
    if (!/^\S+@\S+\.\S+$/.test(c) && !/^0?5\d{9}$/.test(c.replace(/\D/g, ""))) x.contact = "E-posta ya da 05XX XXX XX XX biçiminde telefon yazın.";
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
        <p className={`${mono} text-[var(--etut-red)]`}>TALEP ALINDI · ÖRNEK</p>
        <p className="mt-3 font-[family-name:var(--etut-display)] text-5xl leading-[0.95] font-bold tracking-[-0.05em]">Keşif için size döneceğiz</p>
        <p className="mt-4 leading-7 text-[var(--etut-ink)]/80">
          {city.trim()} için {kind!.toLocaleLowerCase("tr")} talebiniz alındı. Keşif gününü birlikte belirlemek için iki iş günü
          içinde arıyoruz. (Bu bir örnek sitedir; form hiçbir yere gönderilmedi.)
        </p>
        <button className={`${mono} mt-6 underline underline-offset-4`} onClick={() => setSent(false)} type="button">
          YENİ TALEP
        </button>
      </div>
    );
  }

  return (
    <form className="border-t border-[var(--etut-ink)] pt-5" noValidate onSubmit={submit}>
      <fieldset>
        <legend className="text-sm font-semibold">Proje türü</legend>
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
              {k}
            </label>
          ))}
        </div>
        {err("kind")}
      </fieldset>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="etut-city">
            İl
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
            Yaklaşık alan <span className="font-normal text-[var(--etut-muted)]">(m², isteğe bağlı)</span>
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
          Ne zaman başlamak istiyorsunuz?
        </label>
        <select className={`${field} border-[var(--etut-ink)]/20`} id="etut-when" onChange={(e) => setWhen(e.target.value)} value={when}>
          {["Hemen", "3-6 ay içinde", "6-12 ay içinde", "Henüz fikir aşamasında"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="etut-name">
            Adınız
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
            Telefon ya da e-posta
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
        Keşif talep et
      </button>
    </form>
  );
}
