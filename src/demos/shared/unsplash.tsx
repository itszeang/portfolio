// Photographs from Unsplash (Unsplash License: free to use, no permission
// needed), served from Unsplash's own image CDN at the size each slot needs.

export type UnsplashImage = { id: string; alt: string; by: string };

const src = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/** A responsive Unsplash photo that fills its box. */
export function UnsplashPhoto({ image, className = "", sizes, priority = false }: { image: UnsplashImage; className?: string; sizes: string; priority?: boolean }) {
  return (
    // Unsplash's CDN already resizes and converts; a plain img with srcset is enough here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={image.alt}
      className={`h-full w-full object-cover ${className}`}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      src={src(image.id, 1200)}
      srcSet={[480, 800, 1200, 1800].map((w) => `${src(image.id, w)} ${w}w`).join(", ")}
    />
  );
}

/** Photographer names for a footer credit line, without repeats. */
export const creditsOf = (images: Record<string, UnsplashImage>) =>
  Object.values(images)
    .map((p) => p.by)
    .filter((v, i, s) => s.indexOf(v) === i);
