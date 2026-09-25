import { contact, person, projects, servicePages, services, site, socials } from "@/content";

// /llms.txt (llmstxt.org): a plain-Markdown summary for AI assistants and AI
// search. Built from content.ts so it never drifts from the page itself.
export const dynamic = "force-static";

export function GET() {
  const url = (hash: string) => new URL(hash, site.url).toString();
  const body = [
    `# ${person.name}`,
    "",
    `> ${site.description}`,
    "",
    `${person.bio} ${person.location} merkezli. ${person.availability}.`,
    "",
    "## Hizmetler",
    "",
    ...services.map((s) => {
      const page = servicePages.find((p) => p.id === s.id);
      const link = url(page ? `/hizmetler/${page.slug}` : "/#hizmetler");
      return `- [${s.name}](${link}): ${s.description} Kapsam: ${s.includes.join(", ")}.`;
    }),
    "",
    "## Projeler",
    "",
    ...projects.map((p) => {
      const link = p.links[0]?.href ?? url("/#projeler");
      return `- [${p.name}](${link}): ${p.summary} ${p.kind}. Rolüm: ${p.role}.`;
    }),
    "",
    "## İletişim",
    "",
    `- [E-posta](mailto:${contact.email}): ${contact.email}`,
    ...socials.map((s) => `- [${s.label}](${s.href}): ${s.handle}`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
