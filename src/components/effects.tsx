// Interactive surfaces: cursor-reactive dot field, pointer spotlight/tilt/magnet
// delegation, scroll progress and an infinite marquee. All effects respect
// prefers-reduced-motion and pause when off screen or in a background tab.
import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

function readColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(full.slice(0, 6), 16);
  return Number.isNaN(n) ? [240, 241, 233] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Dot grid that swells, brightens and parts around the pointer. */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const GAP = 26;
    const RADIUS = 170;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, running = false;
    let ink: [number, number, number] = [240, 241, 233];
    let accent: [number, number, number] = [139, 162, 255];
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    let t0 = performance.now();

    const readTheme = () => {
      ink = hexToRgb(readColor("--ink", "#f0f1e9"));
      accent = hexToRgb(readColor("--blue", "#8ba2ff"));
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now());
    };
    const draw = (now: number) => {
      // Ease the pointer; with no pointer (touch/idle) drift along a slow Lissajous path.
      if (!pointer.active) {
        const t = (now - t0) / 1000;
        pointer.tx = w * (0.62 + 0.26 * Math.sin(t * 0.23));
        pointer.ty = h * (0.45 + 0.3 * Math.sin(t * 0.31 + 1.2));
      }
      if (pointer.x < -9000) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      ctx.clearRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, RADIUS * 1.9);
      glow.addColorStop(0, `rgba(${accent.join(",")},0.16)`);
      glow.addColorStop(1, `rgba(${accent.join(",")},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      const ox = (w % GAP) / 2, oy = (h % GAP) / 2;
      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) {
          const dx = x - pointer.x, dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          const k = d < RADIUS ? 1 - d / RADIUS : 0;
          const e = k * k * (3 - 2 * k); // smoothstep
          const push = e * 9;
          const px = x + (d > 0 ? (dx / d) * push : 0);
          const py = y + (d > 0 ? (dy / d) * push : 0);
          const r = 0.9 + e * 1.6;
          const c = e > 0.02 ? accent.map((a, i) => Math.round(ink[i] + (a - ink[i]) * e)) : ink;
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.13 + e * 0.75})`;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onMove = (e: PointerEvent) => {
      if (coarse || e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= -40 && y >= -40 && x <= r.width + 40 && y <= r.height + 40;
      pointer.active = inside;
      if (inside) { pointer.tx = x; pointer.ty = y; }
    };
    const onLeave = () => { pointer.active = false; t0 = performance.now() - 4000; };

    readTheme();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => { readTheme(); if (!running) draw(performance.now()); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    start();
    return () => {
      stop();
      ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}

/**
 * One delegated pointer listener drives three effects via CSS custom properties:
 * .spotlight (border + fill glow at --mx/--my), .tilt (3D tilt via --rx/--ry)
 * and .magnetic (pulls toward the pointer via --tx/--ty).
 */
export function usePointerEffects() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    const reset = (el: HTMLElement | null, props: string[]) =>
      el && props.forEach((p) => el.style.removeProperty(p));
    const onMove = (e: PointerEvent) => {
      if (!fine.matches) return;
      const target = e.target instanceof Element ? e.target : null;
      const spot = target?.closest<HTMLElement>(".spotlight");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (reduce.matches) return;
      const t = target?.closest<HTMLElement>(".tilt") ?? null;
      if (t !== tilt) { reset(tilt, ["--rx", "--ry"]); tilt = t; }
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        t.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
        t.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
      }
      const m = target?.closest<HTMLElement>(".magnetic") ?? null;
      if (m !== magnet) { reset(magnet, ["--tx", "--ty"]); magnet = m; }
      if (m) {
        const r = m.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        m.style.setProperty("--tx", `${(x * 0.22).toFixed(1)}px`);
        m.style.setProperty("--ty", `${(y * 0.3).toFixed(1)}px`);
      }
    };
    const onLeave = () => {
      reset(tilt, ["--rx", "--ry"]); reset(magnet, ["--tx", "--ty"]);
      tilt = magnet = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function Marquee({ items }: { items: readonly string[] }) {
  // Reduced motion is handled in CSS so the prerendered markup stays identical.
  const row = (hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t}>
          {t}
          <i>✳</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
