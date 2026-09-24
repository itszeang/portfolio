// Layout adapted from DavidHDev/rbp-portfolio's /about page (React Bits Pro
// portfolio template; free for personal and commercial use per its README).
// Copy is the portfolio's own, from src/content.ts.
import { ScrollFocus } from "@/components/motion/scroll-focus";
import { Education } from "@/components/rbp/education";
import { Experience } from "@/components/rbp/experience";
import { PolaroidStrip } from "@/components/rbp/polaroid-strip";
import { Skills } from "@/components/rbp/skills";
import { Stack } from "@/components/rbp/stack";
import { person } from "@/content";
import type { ReactNode } from "react";

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

export function AboutSection(): ReactNode {
  const language = person.languages[0];
  return (
    <div className="flex flex-col">
      <section className="mx-auto w-full max-w-312 pt-16 sm:pt-24" data-background-hue="-45" id="hakkimda">
        <ScrollFocus>
          <PolaroidStrip />
        </ScrollFocus>

        <div className="mx-auto w-full max-w-160 px-2 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
          <ScrollFocus>
            <div className="rounded-4xl border border-foreground/5 bg-foreground/3 p-8 sm:p-12">
              <h2 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
                Merhaba! Ben{" "}
                <span className="border-b border-foreground/30 pb-0.5">{person.name}</span>.
              </h2>
              <div className="mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[18px]">
                <p>
                  <Strong>Yönetim Bilişim Sistemleri</Strong> mezunuyum. TypeScript ile arayüzler,
                  Python ile <Strong>yapay zekâ ve veri sistemleri</Strong> geliştiriyorum. Merak
                  ettiğim şey hep aynı: teknoloji, gerçek bir ihtiyacı nasıl daha iyi karşılar?
                </p>
                <p>
                  İşin hem <Strong>teknik</Strong> hem <Strong>ürün</Strong> tarafını seviyorum. Bir
                  problemi anlamak, çözümü tasarlamak ve onu gerçekten{" "}
                  <Strong>hayata geçirmek</Strong>.
                </p>
                <p>
                  {language.name} seviyem {language.level}. {language.note}
                </p>
              </div>
            </div>
          </ScrollFocus>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-2 pb-16 sm:px-6 sm:pb-24" data-background-hue="-108" id="deneyim">
        <div className="flex flex-col gap-10">
          <ScrollFocus>
            <Experience />
          </ScrollFocus>
          <ScrollFocus>
            <Education />
          </ScrollFocus>
          <ScrollFocus>
            <Skills />
          </ScrollFocus>
          <ScrollFocus>
            <Stack />
          </ScrollFocus>
        </div>
      </section>
    </div>
  );
}
