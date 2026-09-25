"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Google Analytics 4, loaded only after the visitor agrees (KVKK / GDPR):
 * nothing from Google is requested until "Kabul et" is pressed. The choice
 * is kept in localStorage; the footer's "Çerez tercihleri" reopens the banner.
 *
 * The measurement ID is public by nature (it ships in every page), so it lives
 * in code; NEXT_PUBLIC_GA_ID can still override it, e.g. for a test property.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-P3GSG48S0S";
const KEY = "analytics-consent";
const EVENT = "analytics-consent-change";

type Consent = "granted" | "denied" | "unset";

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

function write(v: Consent) {
  try {
    if (v === "unset") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, v);
  } catch {
    // Storage blocked (private mode): the choice lasts for this page only.
  }
  if (v === "unset") delete document.documentElement.dataset.consent;
  else document.documentElement.dataset.consent = v;
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// The banner ships in the static HTML ("unset" on the server) so it paints
// with the page. Waiting for JavaScript made it the page's largest late
// paint, pushing mobile LCP past 5 s. CONSENT_SCRIPT hides it before first
// paint for visitors who already chose.
const useConsent = () => useSyncExternalStore(subscribe, read, () => "unset" as Consent);

/** Inline, before the banner: mirrors a stored choice onto <html data-consent>. */
export const CONSENT_SCRIPT = GA_ID
  ? `try{var c=localStorage.getItem("${KEY}");if(c)document.documentElement.dataset.consent=c}catch(e){}`
  : null;

type Gtag = (...args: unknown[]) => void;

export function Analytics() {
  const consent = useConsent();

  // Contact clicks are the site's conversions; GA doesn't track mailto/tel
  // links on its own.
  useEffect(() => {
    if (!GA_ID || consent !== "granted") return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      const method = href.startsWith("mailto:") ? "email" : href.startsWith("tel:") ? "phone" : null;
      if (!method) return;
      (window as unknown as { gtag?: Gtag }).gtag?.("event", "generate_lead", { method });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  if (!GA_ID) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {consent === "unset" && (
        <div
          aria-label="Çerez tercihi"
          className="consent-banner fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-white/12 bg-black/80 p-5 text-sm leading-6 text-white/80 backdrop-blur-xl sm:flex-row sm:items-center"
          role="dialog"
        >
          <p className="flex-1">
            Siteyi nasıl kullandığını anlamak için Google Analytics çerezleri kullanmak istiyorum. İzin verir misin?
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              className="min-h-11 rounded-full border border-white/20 px-4 text-white/80 transition-colors hover:text-white"
              onClick={() => write("denied")}
              type="button"
            >
              Reddet
            </button>
            <button
              className="min-h-11 rounded-full bg-[#d4186e] px-4 text-white transition-colors hover:bg-[#e8227a]"
              onClick={() => write("granted")}
              type="button"
            >
              Kabul et
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that brings the consent banner back. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button
      className={className}
      onClick={() => {
        // Withdrawing consent must also stop GA; a reload drops the loaded script.
        const wasGranted = read() === "granted";
        write("unset");
        if (wasGranted) window.location.reload();
      }}
      type="button"
    >
      Çerez tercihleri
    </button>
  );
}
