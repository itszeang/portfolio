// Two languages: Turkish at the site root (the original URLs stay as they are)
// and English under /en. Text that differs per language is kept side by side
// as { tr, en } wherever it lives, and picked with `t`.

export type Lang = "tr" | "en";
export const LANGS: readonly Lang[] = ["tr", "en"];

/** A piece of content in both languages. */
export type Pair<T = string> = { tr: T; en: T };

/** Picks the language's side of a { tr, en } pair. */
export const t = <T>(pair: Pair<T>, lang: Lang): T => pair[lang];

/** Locale for number and date formatting. */
export const locale = (lang: Lang) => (lang === "en" ? "en-GB" : "tr-TR");

/** The home page for a language. */
export const homeHref = (lang: Lang) => (lang === "en" ? "/en" : "/");

/** The path of the services section, which is `hizmetler` in Turkish. */
export const servicesBase = (lang: Lang) => (lang === "en" ? "/en/services" : "/hizmetler");

/** True for a pathname under /en. */
export const isEnglishPath = (path: string) => path === "/en" || path.startsWith("/en/");

/** A content type with its literal strings loosened, so both languages fit it. */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: Widen<T[K]> }
          : T;
