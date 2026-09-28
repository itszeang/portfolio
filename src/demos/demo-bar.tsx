import Link from "next/link";

/**
 * Thin strip above every demo: says plainly that the business is invented and
 * leads back to the service it demonstrates. Kept neutral so it never reads as
 * part of the demo's own design.
 */
export function DemoBar({ serviceHref, serviceName }: { serviceHref: string; serviceName: string }) {
  return (
    <div
      className="bg-black px-4 py-2 text-center font-[family-name:var(--font-geist-sans)] text-[12px] leading-5 text-white/80"
      data-demo-bar=""
    >
      <span className="text-white">Örnek proje.</span> Bu işletme gerçek değil; içerik yalnızca örnek amaçlıdır.{" "}
      <Link className="whitespace-nowrap text-[#ff85b3] underline-offset-2 hover:underline" href={serviceHref}>
        ← {serviceName} · Burak Alp Yahşi
      </Link>
    </div>
  );
}
