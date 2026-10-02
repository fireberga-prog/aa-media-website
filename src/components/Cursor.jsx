import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { pointerEffectsOn } from "../hooks/usePointerEffects.js";

// A labeled accent bubble that follows the mouse over anything with
// data-cursor="Label" (video cards say "Play", client cards say "View") and
// is hidden everywhere else. Mouse only; hidden for touch screens and reduced
// motion. The normal cursor stays visible.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });

  useEffect(() => {
    const check = () => setEnabled(pointerEffectsOn());
    check();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const last = { x: -1, y: -1 };
    const update = (el) => {
      const labeled = el?.closest("[data-cursor]");
      setLabel(labeled ? labeled.getAttribute("data-cursor") : "");
    };
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      last.x = e.clientX;
      last.y = e.clientY;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      update(e.target instanceof Element ? e.target : null);
    };
    // Scrolling moves the page under a still mouse, so re-check what the
    // cursor is over.
    const onScroll = () => {
      if (last.x < 0) return;
      update(document.elementFromPoint(last.x, last.y));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const shown = visible && label !== "";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-[#D4FF3F] text-ink shadow-[0_8px_24px_rgba(10,10,10,0.25)]"
        style={{ translateX: "-50%", translateY: "-50%", width: 88, height: 88 }}
        initial={false}
        animate={{
          opacity: shown ? 1 : 0,
          scale: shown ? (pressed ? 0.85 : 1) : 0.3,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="text-xs font-bold uppercase tracking-kicker"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
