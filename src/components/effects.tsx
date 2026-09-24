// Hero background effects and the pointer spotlight.
// ParticleVortex is adapted from the 21st.dev "Aether Vortex" component
// (accretion-disk mode only): rewritten for this project's plain-CSS stack,
// a transparent canvas so the grain gradient shows through, the site's
// data-theme switch, and reduced-motion / off-screen pausing.
import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

type Particle = {
  angle: number;
  radius: number;
  baseRadius: number;
  y: number;
  speed: number;
  mass: number;
  phase: number;
};

export function ParticleVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let w = 0, h = 0, raf = 0, t = 0;
    let visible = true, running = false;
    let dark = document.documentElement.dataset.theme !== "light";
    let particles: Particle[] = [];
    const m = { tx: 0, ty: 0, x: 0, y: 0, px: -1e4, py: -1e4 };

    const init = () => {
      const count = w < 700 ? 420 : 900;
      const spread = Math.min(w, h) * (w < 700 ? 0.42 : 0.48);
      particles = Array.from({ length: count }, () => {
        const radius = Math.random() * spread + 24;
        return {
          angle: Math.random() * Math.PI * 2,
          radius,
          baseRadius: radius,
          y: (Math.random() - 0.5) * 50,
          speed: Math.random() * 0.008 + 0.002,
          mass: Math.random() * 1.2 + 0.4,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const frame = (advance: boolean) => {
      if (advance) t += 0.005;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;
      // Fade the previous frame instead of painting over it, so trails
      // remain while the canvas stays transparent.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = advance ? "rgba(0,0,0,0.34)" : "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const cx = w * (w < 700 ? 0.5 : 0.7) + m.x;
      const cy = h * (w < 700 ? 0.72 : 0.5) + m.y;
      const tiltCos = Math.cos(0.6), tiltSin = Math.sin(0.6);
      const fov = 800, cameraZ = 600;
      const rgb = dark ? "236,232,255" : "38,34,64";

      for (const p of particles) {
        if (advance) {
          p.angle += p.speed * (100 / p.radius);
          p.radius += (p.baseRadius - p.radius) * 0.03;
          p.y = Math.sin(p.angle * 2 + t) * (p.baseRadius * 0.1) * Math.cos(p.phase + t);
        }
        const z = Math.sin(p.angle) * p.radius;
        const x = Math.cos(p.angle) * p.radius;
        const scale = fov / (cameraZ + z);
        if (scale < 0) continue;
        let sx = cx + x * scale;
        let sy = cy + (p.y * tiltCos - z * tiltSin) * scale;
        const dx = sx - m.px, dy = sy - m.py;
        const d = Math.hypot(dx, dy);
        let grow = 1, glow = 0;
        if (d < 120) {
          const f = (120 - d) / 120;
          sx += dx * f * 0.3;
          sy += dy * f * 0.3;
          grow = 1 + f * 1.5;
          glow = f * 0.5;
        }
        const alpha = Math.min(1, Math.max(0.1, Math.min(1, scale * 0.9)) * (dark ? 0.75 : 0.55) + glow);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.8, p.mass * scale * 1.1 * grow), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      frame(true);
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
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
      if (!running) frame(false);
    };
    const onMove = (e: PointerEvent) => {
      if (coarse || e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (y < 0 || y > r.height) return onLeave();
      m.px = x;
      m.py = y;
      m.tx = (x - r.width / 2) * 0.06;
      m.ty = (y - r.height / 2) * 0.06;
    };
    const onLeave = () => {
      m.tx = m.ty = 0;
      m.px = m.py = -1e4;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme !== "light";
      if (!running) frame(false);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <canvas ref={canvasRef} className="vortex" aria-hidden="true" />;
}

/** Pointer position for `.spotlight` surfaces (border + fill glow). */
export function useSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onMove = (e: PointerEvent) => {
      if (!fine.matches || !(e.target instanceof Element)) return;
      const spot = e.target.closest<HTMLElement>(".spotlight");
      if (!spot) return;
      const r = spot.getBoundingClientRect();
      spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
      spot.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}
