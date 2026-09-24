// Adapted from DavidHDev/rbp-portfolio (React Bits Pro portfolio template).
// License (template README): free to use in personal and commercial projects;
// the template itself may not be resold or redistributed.

import type { ReactNode } from "react";

type Entry = {
  school: string;
  degree: string;
  period: string;
  slug?: string;
  logo?: string;
};

const ENTRIES: Entry[] = [
  {
    school: "İzmir Bakırçay Üniversitesi",
    logo: "/logos/bakircay.webp",
    degree: "Yönetim Bilişim Sistemleri · İngilizce",
    period: "2021 – 2026",
  },
  {
    school: "Imperial College London",
    logo: "/logos/imperial.webp",
    degree: "Makine Öğrenmesi Matematiği",
    period: "2024",
  },
  {
    school: "DataCamp",
    logo: "/logos/datacamp.webp",
    degree: "OpenAI API ve Hugging Face",
    period: "2026",
  },
];

const ROW_HEIGHT = 64;

export function Education(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        Eğitim
      </h3>
      <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 relative rounded-4xl border p-2 sm:p-4">
        <ul className="flex flex-col gap-2">
          {ENTRIES.map((entry) => (
            <li
              key={`${entry.school}-${entry.period}`}
              className="bg-background border-foreground/5 flex items-center gap-4 rounded-3xl border p-2"
              style={{ minHeight: ROW_HEIGHT }}
            >
              <SchoolLogo entry={entry} />
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[18px]">
                  {entry.school}
                </span>
                <span className="text-foreground/65 mt-0.5 text-[14px] tracking-tight sm:text-[15px]">
                  {entry.degree}
                  <span className="text-foreground/30 mx-2">•</span>
                  <span className="text-foreground/55">{entry.period}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SchoolLogo({ entry }: { entry: Entry }): ReactNode {
  const initials = entry.school.charAt(0);
  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden ${
        entry.logo ? "ring-1 ring-white/10" : "border-foreground/15 border"
      }`}
      aria-hidden="true"
      style={{ borderRadius: 14 }}
    >
      {entry.logo ? (
        <img
          src={entry.logo}
          alt=""
          width={48}
          height={48}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : entry.slug ? (
        <img
          src={`https://cdn.simpleicons.org/${entry.slug}`}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
          draggable={false}
        />
      ) : (
        <span className="text-foreground/60 text-[18px] font-semibold tracking-tight">
          {initials}
        </span>
      )}
    </span>
  );
}
