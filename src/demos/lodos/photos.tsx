// Photographs from Unsplash (Unsplash License: free to use, no permission
// needed). Served from Unsplash's own image CDN at the size each slot needs.

export const photos = {
  masa: { id: "photo-1608932586266-c627cb9e5e9d", alt: "Mum ışığında kurulmuş bir akşam masası", by: "Vladimir Gladkov" },
  meze: { id: "photo-1647772809798-f34d785c981c", alt: "Küçük tabaklarda onlarca meze", by: "Lala Azizli" },
  tepsi: { id: "photo-1620041328526-d0cf044a0739", alt: "Humus, acılı ezme ve yoğurtlu mezeler", by: "Filipp Romanovski" },
  gece: { id: "photo-1658416438375-1fde63cf7a30", alt: "Gece Galata'ya çıkan dar bir sokak", by: "Abdullah Al Mallah" },
  tezgah: { id: "photo-1579196479722-7471e7d04d98", alt: "Balıkçı tezgâhında Boğaz toriki", by: "Tolga Ahmetler" },
  salon: { id: "photo-1602232037779-30b01ac3c457", alt: "Loş ışıkta ahşap masalar", by: "Alessio Dandi" },
  balik: { id: "photo-1768322264423-4b0adf0cf31b", alt: "Izgara balık ve ahtapot", by: "Aleksandar Rusev" },
} as const;

export type PhotoKey = keyof typeof photos;

const src = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/** A responsive Unsplash photo that fills its box. */
export function Photo({ name, className = "", sizes, priority = false }: { name: PhotoKey; className?: string; sizes: string; priority?: boolean }) {
  const p = photos[name];
  return (
    // Unsplash's CDN already resizes and converts; a plain img with srcset is enough here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={p.alt}
      className={`h-full w-full object-cover ${className}`}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      src={src(p.id, 1200)}
      srcSet={[480, 800, 1200, 1800].map((w) => `${src(p.id, w)} ${w}w`).join(", ")}
    />
  );
}

export const credits = Object.values(photos)
  .map((p) => p.by)
  .filter((v, i, s) => s.indexOf(v) === i);
