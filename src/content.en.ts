// ============================================================================
//  English version of the site's text (/en). Same structure as content.ts:
//  whatever is not written here (links, images, colours, order) comes from
//  there, so only words live in this file.
// ============================================================================

export const site = {
  title: "Burak Alp Yahşi — Websites and AI Automation",
  description:
    "I build business websites, AI automations, online booking systems and mobile apps. From idea to design, from code to launch, in one pair of hands.",
  ogDescription: "SaaS, AI and digital products. Selected work, how I work and where I have worked.",
  language: "en",
};

export const hero = {
  lines: ["Your idea and a product", "are one click apart."],
  copy: "I build websites, AI automations and mobile apps.",
  copySecondLine: "With you from design to launch.",
  cta: "Tell me your idea",
};

export const person = {
  greeting: "Hi, I'm Burak Alp Yahşi",
  intro: "SaaS platforms, AI tools and digital products.",
  introSecondLine: "From idea to design, from code to launch.",
  bio: "I'm Burak. I studied Management Information Systems. I build interfaces with TypeScript and AI and data systems with Python. The question I keep coming back to: how can technology meet a real need better?",
  languages: [
    {
      name: "English",
      level: "B2+ (self-assessed)",
      note: "I did an English preparatory year and an English-taught degree, and lived and worked in the US on a Work and Travel programme.",
    },
  ],
  availability: "Open to new work",
  location: "Türkiye",
};

export const contact = {
  heading: ["Got an idea?", "Let's build it together."],
  cta: "Let's work together",
};

export const servicesIntro = {
  title: "I turn an idea into a",
  subtitle: "working product.",
};

export const services: Record<string, { name: string; tagline: string; description: string; includes: string[] }> = {
  ai: {
    name: "AI automation",
    tagline: "Hand the repetitive work to AI.",
    description: "Custom automations that connect your repeated workflows, your data and the tools you already use.",
    includes: ["WhatsApp and email reply assistants", "Reading invoices, forms and documents", "An assistant that answers from your own documents and cites them", "Spreadsheet, CRM and calendar integrations"],
  },
  web: {
    name: "Websites and web apps",
    tagline: "Sites that tell your brand's story and solve a real need.",
    description: "Business websites and landing pages that present the brand well, and web apps such as admin panels that solve a real need.",
    includes: ["Mobile-friendly business site and landing page", "WhatsApp, call and map links", "Basic SEO and link previews", "Domain and launch setup", "Admin panel and client portal"],
  },
  randevu: {
    name: "Booking systems",
    tagline: "Turn phone traffic into an online calendar.",
    description: "Systems that bring availability, bookings, reminders and management into one flow.",
    includes: ["Online booking page", "SMS or WhatsApp reminders", "Calendars per staff member and service", "Admin panel"],
  },
  mobil: {
    name: "Mobile apps",
    tagline: "Quick in the pocket, ready for daily use.",
    description: "Fast, clear mobile products for iOS and Android, ready for everyday use.",
    includes: ["iOS and Android", "Notifications", "Sign-up and profiles", "App store release"],
  },
};

export const projectsIntro = {
  title: "An idea is nice.",
  subtitle: "One that works is nicer.",
  lead: "Products I built end to end, starting from real needs.",
  examples: {
    title: "Sample work",
    lead: "My live product ReviewMS, plus websites, booking systems and AI assistants I designed and built for fictional businesses. Every sample opens and works in the browser.",
  },
};

export const projects: Record<
  string,
  {
    kind: string;
    status: string;
    headline: string;
    description: string;
    summary: string;
    longSummary: string;
    problem: string;
    solution: string;
    role: string;
    details: string[];
    tags: string[];
    links: string[];
    siteImages: string[];
  }
> = {
  reviewms: {
    kind: "SaaS · Web + Mobile",
    status: "Web live",
    headline: "A digital connection that starts with a tap.",
    description: "From a physical tap to a digital experience.",
    summary: "A platform where businesses manage their NFC cards, redirects and interactions in one place.",
    longSummary: "From NFC cards to mobile management: a platform for running a business's physical touchpoints digitally.",
    problem: "Making physical NFC cards' redirects and usage manageable for businesses.",
    solution: "I combined changing a card's destination without replacing it, per-business access and mobile management in one product.",
    role: "Product design and end-to-end development",
    details: ["Card management and redirects", "Daily and weekly engagement analytics", "Web panel and mobile app"],
    tags: ["Multi-tenant architecture", "Mobile app", "Analytics"],
    links: ["Visit the product"],
    siteImages: [
      "reviewms.com home page: Bir dokunuş. Ölçülebilir bir deneyim.",
      "reviewms.com: manage the touchpoint, not the card.",
      "reviewms.com: management and insight in one panel.",
      "reviewms.com: see what happens after every tap.",
      "reviewms.com: your card, your control.",
    ],
  },
};

export const otherWork = {
  title: "Other work",
  links: ["Sky-Cart — e-commerce", "More code on GitHub"],
};

export const approach = {
  steps: [
    { name: "Understand the problem", text: "I get to know the need, the user and the problem, and pin down what the solution should make easier." },
    { name: "Design the solution", text: "I design the user flow, the interface and the system's parts together." },
    { name: "Build the product", text: "I bring the interface, the data and the AI layers together." },
    { name: "Launch", text: "I ship the product, check how people use it and improve it with feedback." },
  ],
};

export const experience = [
  { company: "CTS Makina A.Ş.", role: "Supply Chain Management Intern", period: "Feb – Jun 2026" },
  { company: "Yandex", role: "Search Quality Specialist → Team Lead", period: "2023 – Dec 2025" },
  { company: "Hagat Savunma Teknolojileri", role: "Project Management Intern", period: "Jun – Jul 2025" },
  { company: "Winkler Pool Management", role: "Lifeguard · Cultural exchange programme", period: "Jun – Sep 2023" },
];

export const education = {
  title: "Education",
  entries: [
    { school: "İzmir Bakırçay University", degree: "Management Information Systems · English" },
    { school: "Imperial College London", degree: "Mathematics for Machine Learning" },
    { school: "DataCamp", degree: "OpenAI API and Hugging Face" },
  ],
};

export const skills = {
  title: "What I do",
  items: ["Product development", "AI automation", "RAG and document assistants", "Websites and web apps", "Mobile apps", "Booking systems", "Dashboards and internal tools", "Data analytics", "Interface design"],
};

export const ui = {
  nav: [
    { href: "#hizmetler", label: "Services" },
    { href: "#projeler", label: "Work" },
    { href: "#deneyim", label: "Experience" },
    { href: "#hakkimda", label: "About" },
  ],
  menuOpen: "Open menu",
  backToTop: "Back to top",
  toolbox: "Toolbox",
  resetChips: "Reset the chips",
  showMore: (n: number) => `Show ${n} more`,
  showLess: "Show less",
  cookies: "Cookie preferences",
};

export const servicePages: Record<
  string,
  {
    slug: string;
    title: string;
    description: string;
    h1: string;
    lead: string;
    body: string[];
    audience: string[];
    faq: { q: string; a: string }[];
  }
> = {
  web: {
    slug: "business-website",
    title: "Business Website Design and Development",
    description:
      "A fast, mobile-friendly business website that tells your brand's story. Design, SEO, domain and launch included; from idea to launch in one pair of hands.",
    h1: "Business website",
    lead: "A website that tells your brand's story, opens fast on a phone and can be found on Google. I take care of every step from design to launch.",
    body: [
      "A business website has one job: to tell a visitor within seconds what you do, why they can trust you and how to reach you. Instead of an off-the-shelf theme, I build a light, fast site designed around your business.",
      "The site comes with WhatsApp, phone and map links. It shows a proper preview when shared and is marked up so search engines can read it. Connecting the domain and going live are included.",
      "A business site, a landing page, or a web app such as an admin panel that brings orders, customers and stock onto one screen: we pin down the scope together in the first call.",
    ],
    audience: [
      "Businesses without a website, or with an outdated one",
      "Anyone who needs a landing page for a new product or service",
      "Brands that want to turn social media interest into site visits",
    ],
    faq: [
      { q: "What does the price of a website depend on?", a: "The number of pages, how much custom design it needs, content management and integrations such as booking, forms or payments. After hearing what you need, I share a clear scope and price." },
      { q: "Will the site work on mobile?", a: "Yes. I start the design on the phone; the site looks right and loads fast on every screen size." },
      { q: "Is SEO included?", a: "Basic SEO is: page titles and descriptions, a sitemap, structured data, link previews and Google Search Console setup." },
      { q: "Who handles the domain and launch?", a: "I connect the domain and put the site live. The domain stays registered in your name." },
      { q: "Do you also build admin panels or custom web apps?", a: "Yes. I move processes that run on Excel and paper forms into a web panel built for your team, with its own permissions. At Hagat Savunma Teknolojileri I digitised production measurement records this way." },
    ],
  },
  ai: {
    slug: "ai-automation",
    title: "AI Automation and WhatsApp Assistants",
    description:
      "Hand repetitive work to AI: WhatsApp and email reply assistants, invoice and document reading, CRM and calendar integrations.",
    h1: "AI automation",
    lead: "I hand the repetitive, by-hand work over to AI: assistants that answer customer messages, flows that read documents, tools that talk to each other.",
    body: [
      "The value of automation is giving your team its time back. First we find together which work repeats and where the time goes; then I build a flow that does that work and talks to your tools.",
      "Reply assistants for WhatsApp and email, flows that pull data out of incoming invoices and forms, and an assistant that works from your own documents and shows where its answer came from are a few examples. The flows connect to the tools you use, such as Google Sheets, a CRM or a calendar.",
      "I work with Python, OpenAI and FastAPI. I keep what the assistant knows and doesn't know under control, and make clear from the start where sensitive data goes.",
    ],
    audience: [
      "Businesses answering the same questions on WhatsApp and email all day",
      "Teams typing invoices, forms and documents into systems by hand",
      "Anyone who wants to bring scattered tools into one flow",
    ],
    faq: [
      { q: "How does WhatsApp automation work?", a: "I set up an assistant that answers incoming messages with the information and rules you define. Anything it doesn't know, or that needs a person, is passed to you or your team." },
      { q: "What if the AI gives wrong information?", a: "The assistant is set up to answer only from the sources you give it, and can show where its answer came from. When it isn't sure, it hands the question to a person." },
      { q: "What can it integrate with?", a: "Google Sheets, email, calendars, CRMs and most tools with an API. We list the tools you use in the first call." },
    ],
  },
  randevu: {
    slug: "online-booking-system",
    title: "Online Booking System Setup",
    description:
      "Turn phone traffic into an online calendar: a booking page, SMS or WhatsApp reminders, calendars per staff member and service, and an admin panel.",
    h1: "Online booking system",
    lead: "I build a booking system where customers see free times and book without calling you, and reminders go out on their own.",
    body: [
      "Managing appointments over the phone or by message takes time and leads to forgotten bookings. With an online booking system, availability, bookings and reminders come together in one flow.",
      "The customer picks a service and a staff member, sees the free times and books. A reminder goes out by SMS or WhatsApp before the appointment. And you see who is coming on which day in the admin panel.",
      "Rather than squeezing the system into a ready-made template, I build it around how the business works: service lengths, breaks, several staff members or branches included.",
    ],
    audience: [
      "Businesses that work by appointment, such as salons, beauty studios and clinics",
      "Freelancers who give consultations or lessons",
      "Teams tired of taking bookings over the phone",
    ],
    faq: [
      { q: "How are reminders sent?", a: "An automatic reminder goes out by SMS or WhatsApp at the time you choose before the appointment." },
      { q: "Can there be several staff members and services?", a: "Yes. Each staff member can have their own calendar and the services they offer." },
      { q: "Can it be added to my current website?", a: "Yes. The booking page can link from your current site or run as its own page on its own domain." },
    ],
  },
  mobil: {
    slug: "mobile-app-development",
    title: "Mobile App Development (iOS and Android)",
    description:
      "Fast, clear mobile apps for iOS and Android: notifications, sign-up and profiles, a web panel and the app store release included.",
    h1: "Mobile app development",
    lead: "I build fast, clear mobile apps for iOS and Android, ready for everyday use, all the way to the app store release.",
    body: [
      "A good mobile app is one where people find what they want in a few taps. I design the flow and the screens first, then build an app that behaves the same on iOS and Android.",
      "Sign-up and profiles, notifications and a web panel to manage the app are part of the project when needed. Getting the app live on the App Store and Google Play is on me too.",
      "With this approach I built a mobile app and web panel that manage NFC cards for ReviewMS.",
    ],
    audience: [
      "Businesses that want to serve customers through an app",
      "Start-ups testing an idea as a mobile product",
      "Teams taking a web product to mobile",
    ],
    faq: [
      { q: "What does the price of a mobile app depend on?", a: "The number of screens, features such as sign-up and payments, whether it needs a web panel, and integrations. We agree the scope first, then I share the price." },
      { q: "Are iOS and Android built separately?", a: "We decide by the project's needs. For most projects a single codebase that runs on both lowers the time and the upkeep." },
      { q: "Is the app store release included?", a: "Yes. The App Store and Google Play submission and release are included." },
    ],
  },
};

export const sectors: Record<string, string> = {
  guzellik: "Beauty and wellness",
  hukuk: "Law and consulting",
  insaat: "Architecture, construction and real estate",
  restoran: "Restaurants and cafés",
};

export const demos: Record<string, { name: string; kind: string; summary: string }> = {
  "lodos-meyhane": { name: "Lodos Meyhane", kind: "Restaurant website", summary: "A meyhane site where guests build their set menu's meze tray, with a QR menu and the week's busy nights." },
  "esik-emlak": { name: "Eşik Real Estate", kind: "Estate agency website", summary: "Listings ranked by true monthly cost and commute time, with a mortgage calculator." },
  "ferah-ilgaz-hukuk": { name: "Ferah & Ilgaz Law", kind: "Law firm website", summary: "Guides visitors to the right area of law in their own words, within the Turkish bar's advertising rules." },
  "doksan-hali-saha": { name: "Doksan Pitches", kind: "Football pitch booking", summary: "Hourly pitch hire, a deposit and a 24-hour cancellation rule, a regular-slot discount, then the line-up and each player's share." },
  "mine-dis": { name: "Mine Dental Clinic", kind: "Dental clinic booking system", summary: "Patients mark the aching tooth on a chart and get a slot by urgency; health details are taken only with explicit consent." },
  "etut-mimarlik": { name: "Etüt Architects", kind: "Architecture studio website", summary: "Tells projects through true-to-scale floor plans you can explore and a before/after slider." },
  "sinekkaydi-berber": { name: "Sinekkaydı Barbershop", kind: "Barbershop live queue and booking", summary: "Shows the shop's queue live, says when to set off, and books in three taps." },
  "lodos-masa": { name: "Lodos Table Booking", kind: "Restaurant table booking", summary: "Guests pick a table from the floor plan; the host sees every table of the night in one book." },
  "mizan-fatura": { name: "Mizan Invoice Reader", kind: "AI invoice reading", summary: "Reads the invoice and fills in the journal voucher; where it isn't sure, it writes in pencil and waits for you." },
  "kirpi-gelen-kutusu": { name: "Kirpi Inbox Assistant", kind: "Email sorting and reply drafts", summary: "Sorts email by priority, checks the order book to draft replies, and sets aside phishing and sales leads." },
  "pusula-el-kitabi": { name: "Pusula Handbook Assistant", kind: "Document assistant with sources", summary: "Answers questions about the staff handbook by highlighting the clause, and says so when the handbook doesn't cover it." },
  "nara-randevu": { name: "Nara Studio Booking", kind: "Online booking system", summary: "Pick a service, day and time to book; the studio gets a day calendar and occupancy view." },
  "nara-asistan": { name: "Nara Message Assistant", kind: "AI message assistant", summary: "Answers price questions, checks the calendar to book, and hands over to the team what it doesn't know." },
};
