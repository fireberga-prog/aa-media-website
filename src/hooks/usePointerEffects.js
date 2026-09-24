import { useCallback, useRef } from "react";

// Cursor effects only make sense with a real mouse, and never for visitors
// who prefer reduced motion.
export function pointerEffectsOn() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Tilts an element a few degrees toward the cursor and exposes the cursor
// position as --gx / --gy (percent) for a glare highlight.
export function useTilt(max = 5) {
  const ref = useRef(null);
  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse" || !pointerEffectsOn()) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    },
    [max]
  );
  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
  }, []);
  return { ref, onPointerMove, onPointerLeave };
}

// Pulls an element gently toward the cursor while hovered.
export function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse" || !pointerEffectsOn()) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    },
    [strength]
  );
  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
  }, []);
  return { ref, onPointerMove, onPointerLeave };
}
