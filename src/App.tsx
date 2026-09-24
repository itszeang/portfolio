// Tasarımsız iskelet: sitenin tüm içeriğini src/content.ts'den okuyup
// sade, semantik HTML olarak basar. Yeni tasarım bu yapının üzerine kurulur.
import {
  site,
  person,
  contact,
  socials,
  servicesIntro,
  services,
  projectsIntro,
  projects,
  otherWork,
  approach,
  experienceIntro,
  experience,
  education,
  certificates,
  stackIntro,
  stack,
  ui,
} from "./content";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function App() {
  return (
    <>
      <header>
        <nav aria-label="Ana menü">
          {ui.nav.map((n) => (
            <span key={n.id}>
              <a href={`#${n.id}`}>{n.label}</a> ·{" "}
            </span>
          ))}
          <a href="#iletisim">{contact.cta}</a>
        </nav>
      </header>

      <main>
        <section id="baslangic">
          <p>{person.greeting}</p>
          <h1>{person.headline.join(" ")}</h1>
          <p>
            {person.intro} {person.introSecondLine}
          </p>
          <p>{person.focusAreas.join(" · ")}</p>
        </section>

        <section id="hizmetler">
          <h2>
            {servicesIntro.title} {servicesIntro.subtitle}
          </h2>
          <p>{servicesIntro.lead}</p>
          {services.map((s) => {
            const example = projects.find((p) => p.id === s.project);
            return (
              <article key={s.id}>
                <h3>{s.name}</h3>
                <p>
                  <strong>{s.tagline}</strong>
                </p>
                <p>{s.description}</p>
                <ul>
                  {s.includes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <p>
                  {ui.servicesFor} {s.for}
                </p>
                <p>
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent(s.name + " hakkında")}`}
                  >
                    {ui.requestQuote}
                  </a>
                  {example && (
                    <>
                      {" "}
                      · {ui.exampleProject}: <a href={`#${example.id}`}>{example.name}</a>
                    </>
                  )}
                </p>
              </article>
            );
          })}
        </section>

        <section id="projeler">
          <h2>
            {projectsIntro.title} {projectsIntro.subtitle}
          </h2>
          <p>{projectsIntro.lead}</p>
          {projects.map((p) => (
            <article key={p.id} id={p.id}>
              <h3>{p.name}</h3>
              <p>
                {p.kind} · {p.status}
              </p>
              <p>
                <strong>{p.headline}</strong>
              </p>
              <p>{p.longSummary || p.summary}</p>
              <p>
                {ui.projectDialog.need}: {p.problem}
              </p>
              <p>
                {ui.projectDialog.approach}: {p.solution}
              </p>
              <p>
                {ui.projectDialog.role}: {p.role}
              </p>
              <ul>
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p>{p.tags.join(" · ")}</p>
              <p>
                {p.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " · "}
                    <a href={l.href} {...external}>
                      {l.label}
                    </a>
                  </span>
                ))}
              </p>
              {p.images.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={p.imageSize?.width}
                  height={p.imageSize?.height}
                  loading="lazy"
                />
              ))}
            </article>
          ))}
          <h3>{otherWork.title}</h3>
          <ul>
            {otherWork.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} {...external}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="yaklasim">
          <h2>
            {approach.title} {approach.subtitle}
          </h2>
          <p>{approach.lead}</p>
          <ol>
            {approach.steps.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong> — {s.headline} {s.text}
              </li>
            ))}
          </ol>
        </section>

        <section id="deneyim">
          <h2>
            {experienceIntro.title} {experienceIntro.subtitle}
          </h2>
          <p>{experienceIntro.lead}</p>
          {experience.map((e) => (
            <article key={e.company}>
              <h3>{e.company}</h3>
              <p>
                {e.role} · {e.date} · {e.place}
              </p>
              <p>{e.description}</p>
            </article>
          ))}
        </section>

        <section id="hakkimda">
          <h2>Hakkımda</h2>
          <p>{person.manifesto}</p>
          <p>{person.bio}</p>
          {person.languages.map((l) => (
            <p key={l.name}>
              {l.name} ({l.level}): {l.note}
            </p>
          ))}
          <h3>{stackIntro.title}</h3>
          {stack.map((s) => (
            <p key={s.area}>
              {s.area}: {s.items.join(", ")}
            </p>
          ))}
          <h3>{ui.credentials}</h3>
          <p>
            {education.school} — {education.program} ({education.years}).{" "}
            {education.gpa}. {education.note}
          </p>
          <ul>
            {certificates.map((c) => (
              <li key={c.name}>
                {c.name} — {c.provider}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer id="iletisim">
        <h2>{contact.heading.join(" ")}</h2>
        <p>{person.availability}</p>
        <p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a> ·{" "}
          <a href={contact.phoneHref}>{contact.phone}</a>
        </p>
        <p>
          {socials.map((s, i) => (
            <span key={s.href}>
              {i > 0 && " · "}
              <a href={s.href} {...external}>
                {s.label}
              </a>
            </span>
          ))}
        </p>
        <p>{site.copyright}</p>
      </footer>
    </>
  );
}
