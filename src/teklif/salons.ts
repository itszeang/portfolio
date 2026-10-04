import data from "./salons.json";

/** One salon from the prospect list, with what its sample site needs. */
export type Salon = {
  slug: string;
  id: string;
  name: string;
  short: string;
  area: string;
  mahalle: string;
  addr: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  rating: number | null;
  reviews: number;
  offer: "randevu" | "kart";
  level: string;
  kinds: string[];
  instagram: string;
  rival: { name: string; rating: number | null; reviews: number } | null;
  day?: number;
  /** Random part of the link, so other salons pages cannot be guessed from a name. */
  key: string;
  /** The salon's Google Maps record, when one matched its name and address. */
  google: { query: string; placeId: string | null; name: string; addr: string; rating: number | null; reviews: number } | null;
};

export const salons = data as Salon[];
/** The page path segment: readable name plus the random key. */
export const teklifId = (s: Salon) => `${s.slug}-${s.key}`;
export const salonById = (id: string) => salons.find((s) => teklifId(s) === id);
