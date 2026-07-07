import { useRef, useCallback, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Wraps its children in a card that tilts in 3D toward the cursor,
 * with an optional glare sheen. Transform is written directly to the
 * DOM node (not via React state) so it stays smooth at 60fps.
 */
export default function Tilt({
  children,
  className = "",
  max = 8,
  scale = 1.02,
  glare = true,
  style = {},
}) {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const [reduced] = useState(prefersReducedMotion);

  const handleMove = useCallback(
    (e) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * max * 2;
      const rotateX = (0.5 - py) * max * 2;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      if (glare && glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.10), transparent 55%)`;
      }
    },
    [max, scale, glare, reduced],
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (glareRef.current) glareRef.current.style.background = "transparent";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative [transform-style:preserve-3d] transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={style}
    >
      {children}
      {glare && !reduced && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-[background] duration-150"
        />
      )}
    </div>
  );
}
