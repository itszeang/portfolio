// Adapted from DavidHDev/rbp-portfolio (React Bits Pro portfolio template).
// License (template README): free to use in personal and commercial projects;
// the template itself may not be resold or redistributed.

import type { ReactNode } from "react";

const SKILLS = [
  "Ürün geliştirme",
  "Yapay zekâ otomasyonları",
  "RAG ve belge asistanları",
  "Web siteleri ve uygulamaları",
  "Mobil uygulamalar",
  "Randevu sistemleri",
  "Dashboard ve iç araçlar",
  "Veri analitiği",
  "Arayüz tasarımı",
];

export function Skills(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        Neler yapıyorum
      </h3>
      <div className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-foreground/8 bg-background px-4 py-2 text-[14px] tracking-tight text-foreground/85 sm:text-[15px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
