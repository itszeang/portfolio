"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Services as a monospace index. Hovering a row slides a white bar onto it
 * (blended with `difference`, so the text flips to black and the preview
 * under the bar shows as an inverted strip), and a preview panel follows the
 * pointer. Switching rows swaps the preview with a pixel-mosaic transition:
 * the next image opens inside the current one, starting as coarse blocks
 * and resolving to full detail.
 */

type Service = {
  id: string;
  name: string;
  description: string;
  includes: readonly string[];
};

type Art = { a: string; b: string; base: string; line: string; mark: string; tools: string };

// Generated artwork per service; no stock imagery. Colours stay in the
// site's pink family with one contrasting partner each.
const ART: Record<string, Art> = {
  ai: { a: "#7c5cff", b: "#ff3d8b", base: "#0d0718", line: "#ffb3d4", mark: "AI", tools: "Python · OpenAI · FastAPI" },
  web: { a: "#18c7b0", b: "#2a5cff", base: "#04121a", line: "#a8fff1", mark: "WEB", tools: "Next.js · React" },
  randevu: { a: "#ffb020", b: "#ff3b3b", base: "#1a0a04", line: "#ffe0a3", mark: "RDV", tools: "Next.js · TypeScript" },
  mobil: { a: "#e8227a", b: "#8a2bff", base: "#12041a", line: "#ffc2e6", mark: "APP", tools: "iOS · Android" },
  panel: { a: "#3dd6ff", b: "#43e08a", base: "#03141a", line: "#c4fff0", mark: "OPS", tools: "React · Python" },
};

const PREVIEW_W = 300;
const PREVIEW_H = 360;
const SWAP_MS = 560;

function monoFamily(): string {
  const v = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim();
  return v ? `${v}, ui-monospace, monospace` : "ui-monospace, monospace";
}

/** Paints one service's artwork: two light pools, a moiré of fine curves, grain and a mark. */
function paintArt(art: Art, w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w * dpr;
  c.height = h * dpr;
  const g = c.getContext("2d")!;
  g.scale(dpr, dpr);

  g.fillStyle = art.base;
  g.fillRect(0, 0, w, h);

  const pool = (x: number, y: number, r: number, color: string) => {
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  };
  pool(w * 0.22, h * 0.24, w * 0.95, art.a);
  pool(w * 0.85, h * 0.8, w * 0.9, art.b);

  // Fine sweeping curves; their near-parallel spacing produces the moiré.
  g.globalCompositeOperation = "overlay";
  g.strokeStyle = art.line;
  g.lineWidth = 0.6;
  for (let i = 0; i < 120; i++) {
    const t = i / 120;
    g.globalAlpha = 0.18 + 0.22 * Math.sin(t * Math.PI);
    g.beginPath();
    g.moveTo(-20, h * (0.1 + t * 1.1));
    g.bezierCurveTo(w * 0.3, h * (t * 0.9 - 0.2), w * 0.65, h * (t * 1.3), w + 20, h * (t * 0.8 - 0.1));
    g.stroke();
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";

  // Grain.
  const img = g.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 22;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);

  g.fillStyle = "rgba(255,255,255,0.88)";
  g.font = `600 ${Math.round(w * 0.2)}px ${monoFamily()}`;
  g.textBaseline = "alphabetic";
  g.fillText(art.mark, w * 0.08, h * 0.92);
  return c;
}

// Turkish uppercasing turns the "i" in borrowed English words into "İ"
// (iOS -> İOS). Uppercase in Turkish, then put those words back.
const LOANWORDS = ["iOS", "Android", "landing", "online", "page"];
function upper(text: string): string {
  let out = text.toLocaleUpperCase("tr");
  for (const w of LOANWORDS) out = out.replaceAll(w.toLocaleUpperCase("tr"), w.toUpperCase());
  return out;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Preview({ index, ids, visible }: { index: number | null; ids: string[]; visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artsRef = useRef<HTMLCanvasElement[]>([]);
  const shownRef = useRef<number | null>(null);
  const wasVisibleRef = useRef(false);
  const rafRef = useRef(0);
  const reduce = useReducedMotion();

  // Paint the artworks once fonts are ready, so the marks use Geist Mono.
  useEffect(() => {
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    document.fonts.ready.then(() => {
      if (cancelled) return;
      artsRef.current = ids.map((id) => paintArt(ART[id] ?? ART.ai, PREVIEW_W, PREVIEW_H, dpr));
    });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || index === null) return;
    const ctx = canvas.getContext("2d")!;
    const arts = artsRef.current;
    const next = arts[index];
    if (!next) return;
    if (canvas.width !== next.width) {
      canvas.width = next.width;
      canvas.height = next.height;
    }
    const W = canvas.width;
    const H = canvas.height;
    // Reappearing after the pointer left the list starts from blocks too.
    const prev = shownRef.current !== null && wasVisibleRef.current ? arts[shownRef.current] : null;
    shownRef.current = index;
    cancelAnimationFrame(rafRef.current);

    if (reduce) {
      ctx.drawImage(next, 0, 0);
      return;
    }

    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;
    const start = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / SWAP_MS);
      const e = easeOut(t);
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, W, H);
      if (prev) ctx.drawImage(prev, 0, 0);

      // The incoming image grows from a window inside the current one.
      const s = prev ? 0.52 + 0.48 * e : 0.86 + 0.14 * e;
      const rw = W * s;
      const rh = H * s;
      const rx = (W - rw) / 2;
      const ry = (H - rh) / 2;

      // Mosaic: shrink, then scale back up without smoothing.
      const block = Math.max(1, Math.round((1 - e) * 34 * (W / PREVIEW_W)));
      if (block > 1) {
        small.width = Math.max(1, Math.round(rw / block));
        small.height = Math.max(1, Math.round(rh / block));
        sctx.imageSmoothingEnabled = true;
        sctx.drawImage(next, 0, 0, small.width, small.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, rx, ry, rw, rh);
      } else {
        ctx.drawImage(next, rx, ry, rw, rh);
      }
      if (t < 1) rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index, reduce]);

  // Runs after the effect above, so during a swap it still holds the
  // previous render's visibility.
  useEffect(() => {
    wasVisibleRef.current = visible;
  }, [visible]);

  return (
    <canvas
      className="block h-full w-full"
      height={PREVIEW_H}
      ref={canvasRef}
      width={PREVIEW_W}
    />
  );
}

export function ServicesIndex({ services }: { services: readonly Service[] }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  const spring = reduce ? { duration: 0 } : { stiffness: 380, damping: 36, mass: 0.6 };
  const px = useSpring(useMotionValue(0), spring);
  const py = useSpring(useMotionValue(0), spring);
  const barY = useSpring(useMotionValue(0), reduce ? { duration: 0 } : { stiffness: 520, damping: 42 });
  const barH = useSpring(useMotionValue(0), reduce ? { duration: 0 } : { stiffness: 520, damping: 42 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const focusRow = useCallback(
    (i: number) => {
      const row = rowRefs.current[i];
      if (!row) return;
      const firstShow = active === null;
      barY.set(row.offsetTop);
      barH.set(row.offsetHeight);
      if (firstShow) {
        barY.jump(row.offsetTop);
        barH.jump(row.offsetHeight);
      }
      setActive(i);
    },
    [active, barH, barY],
  );

  const onMove = (e: React.PointerEvent) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (active === null) {
      px.jump(x);
      py.jump(y);
    } else {
      px.set(x);
      py.set(y);
    }
  };

  const ids = services.map((s) => s.id);
  const show = canHover && active !== null;

  return (
    <div
      className="relative"
      onPointerLeave={() => setActive(null)}
      onPointerMove={canHover ? onMove : undefined}
      ref={wrapRef}
    >
      <ul className="relative font-mono text-[12px] tracking-[0.06em] sm:text-[13px]">
        {services.map((s, i) => {
          const art = ART[s.id] ?? ART.ai;
          return (
            <li
              className="grid cursor-default gap-1 border-t border-white/10 px-3 py-4 text-white outline-none last:border-b md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.75fr)_minmax(0,1.6fr)] md:gap-6 md:border-t-0 md:py-3.5 md:last:border-b-0"
              key={s.id}
              onFocus={() => {
                const row = rowRefs.current[i];
                if (row) {
                  px.jump(row.offsetLeft + row.offsetWidth / 2);
                  py.jump(row.offsetTop + row.offsetHeight / 2);
                }
                focusRow(i);
              }}
              onBlur={() => setActive(null)}
              onPointerEnter={canHover ? () => focusRow(i) : undefined}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              tabIndex={canHover ? 0 : undefined}
            >
              <span className="font-medium">{upper(s.name)}</span>
              <span className="text-white/55 md:text-white">{art.tools.toUpperCase()}</span>
              <span className="text-white/70 md:text-white">{upper(s.includes.slice(0, 3).join(", "))}</span>
            </li>
          );
        })}
      </ul>

      {/* Preview follows the pointer; sits between the rows and the bar. */}
      <motion.div
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
        initial={false}
        style={{ x: px, y: py, width: PREVIEW_W, height: PREVIEW_H, translateX: "-50%", translateY: "-50%" }}
        transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Preview ids={ids} index={active} visible={show} />
      </motion.div>

      {/* White bar; `difference` turns the text black and inverts the preview strip. */}
      <motion.div
        animate={{ opacity: active !== null ? 1 : 0 }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-white mix-blend-difference"
        initial={false}
        style={{ y: barY, height: barH }}
        transition={{ duration: reduce ? 0 : 0.2 }}
      />
    </div>
  );
}
