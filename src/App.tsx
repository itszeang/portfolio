import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Menu,
  X,
  Copy,
  Check,
  Github,
  MapPin,
  Plus,
  Minus,
  GraduationCap,
  Code2,
  Layers3,
  Sparkles,
  Send,
  Mail,
  Phone as PhoneIcon,
  Globe,
  Bot,
  CalendarCheck,
  Nfc,
  Rocket,
} from "lucide-react";
import {
  BackgroundPaths,
  Reveal,
  ScrollPanel,
  TextReveal,
  Timeline,
  ease,
} from "./components/motion";
import {
  ReviewVisual,
  RoomVisual,
  ScholarVisual,
  ArkunVisual,
  Phone,
} from "./components/visuals";
import {
  ParticleVortex,
  ScrollProgress,
  useSpotlight,
} from "./components/effects";
import { Dock, XLogo } from "./components/dock";
import {
  projects,
  experience,
  certificates,
  services,
  type Project,
} from "./data";

const nav = [
  ["hizmetler", "Hizmetler"],
  ["projeler", "Projeler"],
  ["yaklasim", "Yaklaşımım"],
  ["deneyim", "Deneyim"],
  ["hakkimda", "Hakkımda"],
];
const visualMap: Record<string, () => ReactNode> = {
  reviewms: () => <ReviewVisual />,
  boyut: () => <RoomVisual />,
  scholar: () => <ScholarVisual />,
  arkun: () => <ArkunVisual />,
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label">{children}</div>;
}
function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={17} />
      <span className="sr-only"> (yeni sekmede açılır)</span>
    </a>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [shot, setShot] = useState(1);
  useEffect(() => {
    const d = ref.current;
    if (project) {
      setShot(1);
      d?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
        d?.close();
      };
    } else d?.close();
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="project-title"
    >
      <div className="dialog-inner">
        {project && (
          <>
            <div className="dialog-heading">
              <span className="mono">PROJE DOSYASI / {project.kind}</span>
              <button
                className="icon-button"
                onClick={onClose}
                aria-label="Proje detayını kapat"
              >
                <X />
              </button>
            </div>
            <h2 id="project-title">
              {project.name}
              <span>.</span>
            </h2>
            <p className="dialog-lead">{project.description}</p>
            <div className="dialog-grid">
              <div>
                <h3>İhtiyaç</h3>
                <p>{project.problem}</p>
                <h3>Yaklaşımım</h3>
                <p>{project.solution}</p>
                <h3>Katkım</h3>
                <p>{project.role}</p>
                <ul>
                  {project.details.map((d) => (
                    <li key={d}>
                      <Check size={15} />
                      {d}
                    </li>
                  ))}
                </ul>
                <External href={project.url} className="button button-blue">
                  {project.label}
                </External>
                {project.id === "arkun" && (
                  <External
                    href="https://github.com/burakalpyahsi/arkunnext-gen"
                    className="text-link"
                  >
                    Kaynak kodu
                  </External>
                )}
              </div>
              <div className={`dialog-visual ${project.id}`}>
                {project.id === "reviewms" ? (
                  <>
                    <Phone index={shot} />
                    <div className="gallery-controls">
                      <button
                        className="icon-button"
                        disabled={shot === 1}
                        onClick={() => setShot((s) => s - 1)}
                        aria-label="Önceki ekran"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <span className="mono" aria-live="polite">
                        {shot} / 6
                      </span>
                      <button
                        className="icon-button"
                        disabled={shot === 6}
                        onClick={() => setShot((s) => s + 1)}
                        aria-label="Sonraki ekran"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  visualMap[project.id]()
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

function Header() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Starts dark to match the prerendered HTML; the inline script in index.html
  // has already applied the stored theme, which is read after hydration.
  const [dark, setDark] = useState(true);
  const themeReady = useRef(false);
  useEffect(() => {
    if (!themeReady.current) return;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("portfolio-theme-v2", dark ? "dark" : "light");
    } catch {
      /* Storage is optional. */
    }
  }, [dark]);
  useEffect(() => {
    themeReady.current = true;
    setDark(document.documentElement.dataset.theme !== "light");
  }, []);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    nav.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <header className={scrolled || menu ? "header scrolled" : "header"}>
      <div className="shell header-inner">
        <nav
          id="main-nav"
          aria-label="Ana menü"
          className={menu ? "nav open" : "nav"}
        >
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setMenu(false)}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="nav-label">{label}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-button"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Açık temaya geç" : "Koyu temaya geç"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="#iletisim"
            className="header-contact"
            onClick={() => setMenu(false)}
          >
            Birlikte çalışalım <ArrowUpRight size={15} />
          </a>
          <button
            className="mobile-menu icon-button"
            aria-controls="main-nav"
            aria-expanded={menu}
            aria-label={menu ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ open }: { open: (p: Project) => void }) {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const selectedProjects = [projects[0], projects[2], projects[3]];
  const item = selectedProjects[selected];
  return (
    <div className="hero-stage">
    <div className="hero-bg" aria-hidden="true">
      <ParticleVortex />
      <div className="grain" />
    </div>
    <section id="baslangic" className="hero shell">
      <div className="hero-grid">
        <div className="hero-copy">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="hero-name"
          >
            Merhaba, ben Burak Alp Yahşi <span className="small-line" />
          </motion.div>
          <h1>
            {["Fikirleri", "hayata", "geçiriyorum."].map((line, i) => (
              <span className={`headline-line line-${i}`} key={line}>
                <motion.span
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08 + i * 0.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <Reveal delay={0.25}>
            <p className="hero-description">
              SaaS platformları, yapay zekâ araçları ve dijital deneyimler.
              <br className="desktop-br" /> Fikirden tasarıma, koddan yayına.
            </p>
            <div className="hero-buttons">
              <a className="button button-blue button-primary" href="#projeler">
                Projelerimi keşfet <ArrowDown size={18} />
              </a>
              <a className="text-link" href="#hizmetler">
                Hizmetler <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
        <motion.div
          className="hero-showcase glass spotlight"
          initial={reduce ? false : { opacity: 0, y: 35, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        >
          <div className="hero-art" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                className={`hero-art-inner ${item.id}`}
                initial={reduce ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -15 }}
                transition={{ duration: 0.3 }}
              >
                {selected === 0 ? <ReviewVisual hero /> : visualMap[item.id]()}
              </motion.div>
            </AnimatePresence>
            <button
              className="showcase-open"
              aria-label={`${item.name} projesini incele`}
              onClick={() => open(item)}
            >
              <ArrowUpRight size={22} />
            </button>
          </div>
          <div className="showcase-caption">
            <div>
              <strong>{item.name}</strong>
              <span>{item.kind}</span>
            </div>
          </div>
          <div className="showcase-tabs" aria-label="Öne çıkan proje seçimi">
            {selectedProjects.map((p, i) => (
              <button
                key={p.id}
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
              >
                {p.name}
                {selected === i && (
                  <motion.span layoutId="hero-tab" className="tab-line" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
}

const serviceIcons: Record<string, typeof Globe> = {
  web: Globe,
  ai: Bot,
  randevu: CalendarCheck,
  nfc: Nfc,
  urun: Rocket,
};

function Services({ open }: { open: (p: Project) => void }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next = active;
    if (e.key in keys) next = (active + keys[e.key] + services.length) % services.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = services.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <section id="hizmetler" className="services section shell">
      <Reveal>
        <SectionLabel>Hizmetler</SectionLabel>
        <div className="section-heading">
          <h2>
            Ne yapıyorum?
            <br />
            <span className="muted">İşine göre seç.</span>
          </h2>
          <p>
            Küçük bir siteden uçtan uca ürüne.
            <br />
            Hepsi tek elden, yayına kadar.
          </p>
        </div>
      </Reveal>
      <Reveal className="services-grid">
        <div
          className="service-tabs"
          role="tablist"
          aria-label="Hizmet kategorileri"
          aria-orientation="vertical"
          onKeyDown={onKey}
        >
          {services.map((sv, i) => {
            const Icon = serviceIcons[sv.id];
            const selected = i === active;
            return (
              <button
                key={sv.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`service-tab-${sv.id}`}
                aria-selected={selected}
                aria-controls={`service-panel-${sv.id}`}
                tabIndex={selected ? 0 : -1}
                className="service-tab"
                onClick={() => setActive(i)}
              >
                {selected && (
                  <motion.span
                    layoutId="service-pill"
                    className="service-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="service-tab-icon">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="service-tab-label">{sv.name}</span>
              </button>
            );
          })}
        </div>
        <div className="service-stage glass spotlight">
          {services.map((sv, i) => {
            const Icon = serviceIcons[sv.id];
            const example = sv.project
              ? projects.find((p) => p.id === sv.project)
              : undefined;
            return (
              <div
                key={sv.id}
                role="tabpanel"
                id={`service-panel-${sv.id}`}
                aria-labelledby={`service-tab-${sv.id}`}
                className="service-panel"
                hidden={i !== active}
              >
                <div className="service-head">
                  <span className="service-icon">
                    <Icon size={24} strokeWidth={1.6} />
                  </span>
                  <h3>{sv.name}</h3>
                </div>
                <p className="service-tagline">{sv.tagline}</p>
                <p className="service-description">{sv.description}</p>
                <ul className="service-includes">
                  {sv.includes.map((it) => (
                    <li key={it}>
                      <Check size={16} />
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="service-for">
                  <span>Kimler için:</span> {sv.for}
                </p>
                <div className="service-actions">
                  <a
                    className="button button-primary"
                    href={`mailto:hello@burakalpyahsi.com?subject=${encodeURIComponent(sv.name + " hakkında")}`}
                  >
                    Teklif iste <ArrowUpRight size={17} />
                  </a>
                  {example && (
                    <button className="text-link" onClick={() => open(example)}>
                      Örnek: {example.name} <ArrowUpRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function Projects({ open }: { open: (p: Project) => void }) {
  const [filter, setFilter] = useState("Tümü");
  const filters = ["Tümü", "SaaS & Web", "Yapay zekâ", "3D deneyim"];
  const visible = projects
    .slice(1)
    .filter(
      (p) =>
        filter === "Tümü" ||
        (filter === "Yapay zekâ" && p.id === "scholar") ||
        (filter === "3D deneyim" && p.id === "boyut") ||
        (filter === "SaaS & Web" && p.id === "arkun"),
    );
  return (
    <section id="projeler" className="projects section shell">
      <Reveal>
        <SectionLabel>Projeler</SectionLabel>
        <div className="section-heading">
          <h2>
            Fikir güzel.
            <br />
            <span className="muted">Çalışanı daha güzel.</span>
          </h2>
          <p>
            Gerçek ihtiyaçlardan yola çıkan,
            <br />
            uçtan uca geliştirdiğim ürünler.
          </p>
        </div>
        <div className="filter-row">
          <div className="filters" aria-label="Projeleri filtrele">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    className="filter-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="filter-label">{f}</span>
              </button>
            ))}
          </div>
          <span className="mono">
            {String(
              visible.length +
                (filter === "Tümü" || filter === "SaaS & Web" ? 1 : 0),
            ).padStart(2, "0")}{" "}
            PROJE
          </span>
        </div>
      </Reveal>
      <div className="project-list" aria-live="polite">
        {(filter === "Tümü" || filter === "SaaS & Web") && (
          <ScrollPanel>
            <article className="featured-project spotlight">
              <div className="featured-copy">
                <div className="project-top">
                  <span className="mono">/ 01</span>
                  <span className="project-status">
                    Web yayında
                  </span>
                </div>
                <div>
                  <span className="mono project-kind">
                    SAAS PLATFORMU · WEB + MOBİL
                  </span>
                  <h3>ReviewMS</h3>
                  <p className="featured-title">
                    Bir dokunuşla başlayan
                    <br />
                    dijital bağlantı.
                  </p>
                  <p className="project-summary">
                    NFC kartlarından mobil yönetime. İşletmelerin fiziksel temas
                    noktalarını dijital olarak yönettiği platform.
                  </p>
                  <div className="p-tags">
                    {projects[0].tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="project-bottom">
                  <button
                    className="button button-ink"
                    onClick={() => open(projects[0])}
                  >
                    Projeyi incele <ArrowUpRight size={17} />
                  </button>
                  <External href={projects[0].url} className="text-link">
                    Canlı site
                  </External>
                </div>
              </div>
              <div className="featured-art">
                <ReviewVisual />
              </div>
            </article>
          </ScrollPanel>
        )}
        <div className="project-grid">
          {visible.map((p) => (
            <Reveal key={p.id} className="project-card">
              <article className="glass spotlight">
                <button
                  className={`project-art ${p.id}`}
                  onClick={() => open(p)}
                  aria-label={`${p.name} projesinin detaylarını aç`}
                >
                  {visualMap[p.id]()}
                  <span className="project-art-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                </button>
                <div className="card-heading">
                  <h3>{p.name}</h3>
                  <span className="mono">0{projects.indexOf(p) + 1}</span>
                </div>
                <span className="mono card-kind">{p.kind}</span>
                <p>{p.summary}</p>
                <button className="text-link" onClick={() => open(p)}>
                  Projeyi incele <ArrowUpRight size={15} />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal>
        <details className="other-projects">
          <summary>
            <span>
              Diğer çalışmalar{" "}
              <small>Sky-Cart, yerel RAG ve arayüz deneyleri</small>
            </span>
            <Plus className="details-plus" size={22} />
          </summary>
          <div className="other-grid">
            <External href="https://github.com/burakalpyahsi/Sky-Cart">
              Sky-Cart — E-ticaret
            </External>
            <External href="https://github.com/itszeang/local-rag-backend">
              Yerel RAG altyapısı
            </External>
            <External href="https://github.com/burakalpyahsi?tab=repositories">
              Diğer kod çalışmaları
            </External>
          </div>
        </details>
      </Reveal>
    </section>
  );
}

function Approach() {
  const [step, setStep] = useState(0);
  const steps = [
    [
      "Önce doğru soru.",
      "İhtiyacı, kullanıcıyı ve problemi anlarım. Çözümün neyi kolaylaştıracağını netleştiririm.",
      "Problemi anla",
      Layers3,
    ],
    [
      "Akışı görünür kıl.",
      "Kullanıcı akışını, arayüzü ve sistemin parçalarını birlikte tasarlarım.",
      "Çözümü tasarla",
      Sparkles,
    ],
    [
      "Fikri çalışan sisteme çevir.",
      "Arayüz, veri ve yapay zekâ katmanlarını bir araya getiririm.",
      "Ürünü geliştir",
      Code2,
    ],
    [
      "Gerçek hayata çıkar.",
      "Ürünü yayına alır, kullanım akışlarını kontrol eder ve geri bildirimle geliştiririm.",
      "Yayına al",
      Send,
    ],
  ] as const;
  const Icon = steps[step][3];
  return (
    <section className="approach-wrap" id="yaklasim">
      <div className="shell section">
        <Reveal>
          <SectionLabel>Yaklaşımım</SectionLabel>
          <div className="section-heading">
            <h2>
              İyi fikirden,
              <br />
              <span>iyi çalışan ürüne.</span>
            </h2>
            <p>
              Ürünün her adımını düşünürüm.
              <br />
              Çünkü bütün parçalar birbirine bağlı.
            </p>
          </div>
        </Reveal>
        <div className="approach-grid">
          <div className="step-list">
            {steps.map((s, i) => (
              <button
                key={s[0]}
                className={i === step ? "step active" : "step"}
                onClick={() => setStep(i)}
                aria-expanded={i === step}
                aria-controls={`step-description-${i}`}
              >
                <span className="mono step-number">0{i + 1}</span>
                <div>
                  <h3>{s[2]}</h3>
                  <AnimatePresence initial={false}>
                    {i === step && (
                      <motion.p
                        id={`step-description-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        {s[1]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {i === step ? <Minus size={19} /> : <Plus size={19} />}
              </button>
            ))}
          </div>
          <div className="process-stage spotlight">
            <div className="process-stage-label mono">
              BİR ÜRÜNÜN YOLCULUĞU <span>0{step + 1} / 04</span>
            </div>
            <div className="process-orbits">
              <div />
              <div />
              <div />
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  className="process-icon"
                  initial={{ opacity: 0, scale: 0.85, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <Icon size={46} strokeWidth={1.25} />
                </motion.div>
              </AnimatePresence>
              <span className="process-satellite">✳</span>
            </div>
            <h3 aria-live="polite">{steps[step][0]}</h3>
            <div className="process-progress">
              {steps.map((_, i) => (
                <span key={i} className={i <= step ? "filled" : ""} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="deneyim" className="section shell experience-section">
      <div className="experience-intro">
        <Reveal>
          <SectionLabel>Deneyim</SectionLabel>
          <h2>
            Farklı alanlar.
            <br />
            <span className="muted">Ortak merak.</span>
          </h2>
          <p>
            Veri, operasyon ve teknoloji arasında
            <br />
            kurduğum bağlantılar.
          </p>
        </Reveal>
      </div>
      <Timeline>
        {experience.map((e, i) => (
          <Reveal key={e.company} className="experience-item" delay={i * 0.04}>
            <span className="timeline-dot" />
            <div className="exp-meta mono">
              <span>{e.date}</span>
              <span>{e.place}</span>
            </div>
            <h3>{e.company}</h3>
            <h4>{e.role}</h4>
            <p>{e.description}</p>
          </Reveal>
        ))}
      </Timeline>
    </section>
  );
}

function About() {
  const [stack, setStack] = useState(0);
  const stacks = [
    [
      "Arayüz",
      ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Zustand"],
    ],
    [
      "Veri & Sunucu",
      [
        "Python",
        "FastAPI",
        "REST API",
        "SQLite",
        "Çok kiracılı mimari",
        "Yetkilendirme",
      ],
    ],
    [
      "Yapay zekâ",
      [
        "RAG",
        "Ollama",
        "OpenAI API",
        "Hugging Face",
        "FAISS",
        "ChromaDB",
        "BM25",
      ],
    ],
    [
      "Araçlar",
      ["Tauri", "Power BI", "Vercel", "Git", "JavaScript", "HTML & CSS"],
    ],
  ] as const;
  return (
    <section className="about-wrap" id="hakkimda">
      <h2 className="sr-only">Hakkımda</h2>
      <div className="section shell">
        <Reveal>
          <SectionLabel>Hakkımda</SectionLabel>
        </Reveal>
        <div className="about-grid">
          <div>
            <TextReveal>
              İşin hem teknik hem ürün tarafını seviyorum. Bir problemi anlamak,
              çözümü tasarlamak ve gerçekten hayata geçirmek.
            </TextReveal>
            <Reveal>
              <p className="about-copy">
                Ben Burak. Yönetim Bilişim Sistemleri mezunuyum. TypeScript ile
                arayüzler, Python ile yapay zekâ ve veri sistemleri
                geliştiriyorum. Merak ettiğim şey aynı: teknoloji, gerçek bir
                ihtiyacı nasıl daha iyi karşılar?
              </p>
              <div className="language-info">
                <h3>İngilizce <span>B2+ (öz değerlendirme)</span></h3>
                <p>
                  İngilizce hazırlık ve İngilizce lisans eğitimi aldım.
                  ABD’de Work and Travel programıyla çalışma ve günlük yaşam
                  deneyimi edindim.
                </p>
              </div>
              <div className="about-signature">
                <span>Burak Alp Yahşi</span>
                <span className="mono">
                  <MapPin size={13} /> TÜRKİYE
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal className="about-note">
            <div className="note-top mono">
              NOT DEFTERİ / 2026 <span>✳</span>
            </div>
            <span className="note-mark" aria-hidden="true">
              b<span>.</span>
            </span>
            <p>
              İş + teknoloji.
              <br />
              Fikir + uygulama.
              <br />
              <span>Merak hep aynı.</span>
            </p>
            <div className="note-bottom mono">
              ÖĞREN. ÜRET. GELİŞTİR.
            </div>
          </Reveal>
        </div>
        <div className="skills-area">
          <div>
            <span className="mono eyebrow">ARAÇ KUTUM</span>
            <h3>
              Fikre uygun
              <br />
              teknoloji.
            </h3>
          </div>
          <div className="stack-interactive">
            <div className="stack-tabs" aria-label="Teknoloji alanı">
              {stacks.map(([name], i) => (
                <button
                  aria-pressed={stack === i}
                  key={name}
                  onClick={() => setStack(i)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="stack-tags" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stack}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {stacks[stack][1].map((t) => (
                    <span key={t}>
                      {t}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <Reveal>
          <details className="credentials">
            <summary>
              <span>
                <GraduationCap size={23} /> Eğitim & sertifikalar{" "}
                <small>Öğrenmeye devam.</small>
              </span>
              <Plus className="details-plus" size={22} />
            </summary>
            <div className="education">
              <div>
                <span className="mono">2021 — 2026</span>
                <h3>İzmir Bakırçay Üniversitesi</h3>
                <p>Yönetim Bilişim Sistemleri · İngilizce Lisans</p>
                <p>Genel not ortalaması: 3,21 / 4,00</p>
              </div>
              <span className="education-badge">
                Mezun · Bitirme projesi: ARKUN
              </span>
            </div>
            <div className="cert-grid">
              {certificates.map(([name, provider]) => (
                <div key={name}>
                  <h4>{name}</h4>
                  <span className="mono">{provider}</span>
                </div>
              ))}
            </div>
          </details>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText("hello@burakalpyahsi.com");
      setCopied("E-posta adresi kopyalandı.");
    } catch {
      setCopied("Kopyalanamadı. E-posta adresini seçerek kopyalayabilirsin.");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(""), 3500);
  }
  return (
    <footer id="iletisim" className="contact-wrap">
      <div className="shell contact">
        <div className="contact-top">
          <SectionLabel>İletişim</SectionLabel>
          <span className="availability">
            İş birliklerine açığım
          </span>
        </div>
        <div className="contact-flow" aria-hidden="true">
          <BackgroundPaths />
        </div>
        <Reveal>
          <h2>
            Bir fikrin mi var?
            <br />
            <a href="mailto:hello@burakalpyahsi.com">
              Birlikte kuralım.
              <ArrowUpRight />
            </a>
          </h2>
        </Reveal>
        <div className="contact-bottom">
          <div className="email-group">
            <a href="mailto:hello@burakalpyahsi.com">hello@burakalpyahsi.com</a>
            <button onClick={copy} aria-label="E-posta adresini kopyala">
              {copied.startsWith("E-posta") ? (
                <Check size={18} />
              ) : (
                <Copy size={18} />
              )}
            </button>
            <span className="copy-status" role="status">
              {copied}
            </span>
          </div>
          <Dock
            links={[
              {
                label: "GitHub",
                href: "https://github.com/burakalpyahsi",
                icon: <Github size={18} />,
                external: true,
              },
              {
                label: "X",
                href: "https://x.com/itszeang",
                icon: <XLogo size={16} />,
                external: true,
              },
              {
                label: "E-posta",
                href: "mailto:hello@burakalpyahsi.com",
                icon: <Mail size={18} />,
              },
              {
                label: "Telefon",
                href: "tel:+905073975060",
                icon: <PhoneIcon size={18} />,
              },
            ]}
          />
        </div>
        <div className="footer-line">
          <span>© 2026 Burak Alp Yahşi</span>
          <a href="#baslangic">
            Başa dön <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [project, setProject] = useState<Project | null>(null);
  useSpotlight();
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <a className="skip-link" href="#projeler">
        Projelere geç
      </a>
      <Header />
      <main>
        <Hero open={setProject} />
        <Services open={setProject} />
        <Projects open={setProject} />
        <Approach />
        <Experience />
        <About />
      </main>
      <Contact />
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </MotionConfig>
  );
}
