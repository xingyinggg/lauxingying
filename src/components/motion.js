import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenisInstance = null;
export const getLenis = () => lenisInstance;

/** Lenis smooth scroll for the whole document; anchors glide instead of jump. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, anchors: true }); // offset comes from section scroll-margin-top in index.css
    lenisInstance = lenis;
    let raf = requestAnimationFrame(function tick(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/**
 * Marks [data-reveal] and .mask-lines elements inside the page with .is-in
 * as they enter. Content is visible without JS; the hidden start state only
 * applies once <html> carries .js-reveal.
 */
export function useReveals(deps = []) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");
    const els = document.querySelectorAll("[data-reveal]:not(.is-in), .mask-lines:not(.is-in)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Heading split into masked lines that slide up in sequence. */
export function MaskLines({ lines, as: Tag = "h2", className = "", delay = 0, step = 90 }) {
  return (
    <Tag className={`mask-lines ${className}`}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <span style={{ "--d": `${delay + i * step}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Live Singapore clock, updated each minute. */
export function useSingaporeTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Singapore",
    }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/**
 * Cursor: a small ink dot that trails the pointer and swells into a
 * labelled mint-on-ink ring over anything carrying data-cursor="Label".
 */
export function Cursor() {
  const dot = useRef(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    const reduced = prefersReducedMotion();
    let raf;
    const tick = () => {
      const k = reduced ? 1 : 0.22;
      pos.x += (pos.tx - pos.x) * k;
      pos.y += (pos.ty - pos.y) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const move = (e) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      const t = e.target.closest && e.target.closest("[data-cursor], a, button");
      if (!t) return setLabel("");
      setLabel(t.dataset.cursor || "•");
    };
    const leave = () => {
      pos.tx = -100;
      pos.ty = -100;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  const big = label && label !== "•";
  const hover = label === "•";
  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[100] pointer-events-none"
      style={{ willChange: "transform" }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-ink text-mint flex items-center justify-center transition-[width,height,opacity] duration-500 ease-expo"
        style={{ width: big ? 88 : hover ? 36 : 10, height: big ? 88 : hover ? 36 : 10, opacity: hover ? 0.18 : 1 }}
      >
        <span
          className="label transition-opacity duration-300"
          style={{ opacity: big ? 1 : 0, fontSize: 10 }}
        >
          {big ? label : ""}
        </span>
      </div>
    </div>
  );
}

/**
 * Preloader: a count from 000 to 100 set wide and heavy, then the panel
 * lifts away. Once per session; skipped entirely under reduced motion.
 */
export function Preloader() {
  const [state, setState] = useState(() => {
    try {
      if (prefersReducedMotion() || sessionStorage.getItem("xy-loaded")) return "done";
    } catch (e) {
      /* storage unavailable: still show */
    }
    return "counting";
  });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (state !== "counting") return;
    const lenis = getLenis();
    lenis && lenis.stop();
    document.documentElement.classList.add("is-loading");
    const start = performance.now();
    const DUR = 1500;
    let raf = requestAnimationFrame(function step(now) {
      const p = Math.min(1, (now - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        setState("lifting");
        document.documentElement.classList.remove("is-loading");
        try {
          sessionStorage.setItem("xy-loaded", "1");
        } catch (e) {}
        setTimeout(() => {
          setState("done");
          const l = getLenis();
          l && l.start();
        }, 1100);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [state]);

  if (state === "done") return null;
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[90] bg-ink text-paper flex flex-col justify-between p-[var(--gutter)] transition-[clip-path] duration-[1000ms] ease-expo"
      style={{ clipPath: state === "lifting" ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
    >
      <div className="flex justify-between label text-paper/70">
        <span>Lau Xing Ying</span>
        <span>Portfolio 2026</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <span className="label text-mint pb-3">Loading the work</span>
        <span className="display-wide tabular-nums text-[clamp(96px,22vw,340px)] text-paper">
          {String(n).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
