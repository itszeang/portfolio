"use client";

import type { CSSProperties } from "react";
import { type Doc, type FieldKey, PAGE } from "./data";

// Document units → container query units, so the page scales as one image.
const u = (n: number) => `${(n * 100) / PAGE.w}cqw`;

/**
 * An invoice as the reader sees it. `found` fields are highlighted; fields
 * under the confidence threshold are marked red; `active` is the one hovered
 * in the side panel.
 */
export function Paper({
  doc,
  found,
  flagged,
  active,
  scanning,
}: {
  doc: Doc;
  found: FieldKey[];
  flagged: FieldKey[];
  active: FieldKey | null;
  scanning: boolean;
}) {
  const layer: CSSProperties =
    doc.kind === "photo"
      ? { transform: "rotate(-3deg) scale(0.9)", filter: "contrast(1.06) brightness(0.96) sepia(0.08)" }
      : doc.kind === "receipt"
        ? { transform: "translateY(20%) rotate(2.2deg) scale(1.32)", filter: "sepia(0.18) contrast(0.95)" }
        : {};
  return (
    <div
      className={`@container relative w-full overflow-hidden rounded-[2px] font-[Arial,Helvetica,sans-serif] ${doc.kind === "pdf" ? "bg-white shadow-[0_1px_2px_rgba(11,18,32,0.08),0_16px_40px_-20px_rgba(11,18,32,0.35)]" : doc.kind === "photo" ? "bg-[#3B3E43]" : "bg-[linear-gradient(135deg,#7A5A40,#94704F_45%,#6E4F37)]"}`}
      style={{ aspectRatio: `${PAGE.w} / ${PAGE.h}` }}
    >
      <div className="absolute inset-0" style={layer}>
        {doc.kind === "photo" && <div className="absolute inset-0 bg-white shadow-2xl" />}
        {doc.kind === "receipt" && (
          <>
            <div
              className="absolute bg-[#FBFAF4] shadow-xl"
              style={{
                left: u(100),
                top: u(40),
                width: u(220),
                height: u(300),
                clipPath: "polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)",
              }}
            />
            {/* A coffee ring right where the tax number is printed. */}
            <div
              className="absolute rounded-full border-[0.9cqw] border-[#8B5A2B]/25"
              style={{ left: u(222), top: u(78), width: u(84), height: u(78) }}
            />
          </>
        )}
        {doc.rules.map((y) => (
          <div
            className="absolute h-px bg-[#0B1220]/15"
            key={y}
            style={doc.kind === "receipt" ? { left: u(112), width: u(196), top: u(y), borderTop: "1px dashed rgba(11,18,32,.35)", background: "none" } : { left: u(24), right: u(24), top: u(y) }}
          />
        ))}
        {doc.lines.map((l, i) => (
          <div
            className={`absolute leading-none whitespace-nowrap ${l.bold ? "font-bold" : ""} ${l.muted ? "text-[#5B6474]" : "text-[#1b2230]"} ${l.mono ? "font-[family-name:var(--mz-receipt)]" : ""}`}
            key={i}
            style={{
              top: u(l.y),
              fontSize: u(l.size),
              ...(l.right ? { right: u(PAGE.w - l.x) } : { left: u(l.x) }),
              ...(l.center ? { transform: "translateX(-50%)" } : {}),
            }}
          >
            {l.parts.map((p, j) => {
              if (typeof p === "string") return <span key={j}>{p}</span>;
              const on = found.includes(p.field);
              const low = on && flagged.includes(p.field);
              return (
                <span
                  className={`relative rounded-[0.5cqw] transition-[background-color,box-shadow] duration-300 ${
                    on ? (low ? "bg-[rgba(119,115,109,.16)] shadow-[0_0_0_0.3cqw_rgba(119,115,109,.7)]" : "bg-[rgba(31,58,147,.1)] shadow-[0_0_0_0.3cqw_rgba(31,58,147,.4)]") : ""
                  } ${active === p.field ? "shadow-[0_0_0_0.6cqw_var(--mz-ink)]" : ""}`}
                  data-field={p.field}
                  key={j}
                  style={p.blur ? { filter: `blur(${p.blur}px)` } : undefined}
                >
                  {p.text}
                </span>
              );
            })}
          </div>
        ))}
        {doc.stamp && (
          <div
            className="absolute rounded-[0.8cqw] border-[0.6cqw] border-[#C0262D]/70 px-[1.5cqw] py-[0.6cqw] font-bold tracking-[0.2em] text-[#C0262D]/70"
            style={{ left: u(doc.stamp.x), top: u(doc.stamp.y), fontSize: u(16), transform: "rotate(-12deg)" }}
          >
            {doc.stamp.text}
          </div>
        )}
      </div>
      {scanning && <div aria-hidden="true" className="mz-scan pointer-events-none absolute inset-x-0 h-[6cqw] bg-[linear-gradient(180deg,transparent,rgba(233,240,227,.8),transparent)]" />}
    </div>
  );
}
