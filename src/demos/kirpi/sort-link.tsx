"use client";

import type { ReactNode } from "react";
import { SORT_EVENT } from "./kirpi-app";

/** Jumps to the inbox and sorts it. Still a plain anchor without JavaScript. */
export function SortLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a className={className} href="#posta" onClick={() => window.dispatchEvent(new Event(SORT_EVENT))}>
      {children}
    </a>
  );
}
