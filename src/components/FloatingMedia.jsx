import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { pointerEffectsOn } from "../hooks/usePointerEffects.js";

// Fixed spots around the edges of the hero, clear of the centered headline.
// `rate`: how far (px) the tile drifts up over the first ~700px of scroll.
// `depth`: how far (px) it shifts toward the cursor. Different values on each
// tile give a sense of depth.
const TILE_SPOTS = [
  { top: "6%", left: "3%", size: "w-24 lg:w-32", shape: "rounded-2xl", ratio: "aspect-square", rate: 120, depth: 28 },
  { top: "52%", left: "1%", size: "w-20 lg:w-28", shape: "rounded-full", ratio: "aspect-square", rate: 60, depth: 14 },
  { top: "74%", left: "14%", size: "w-20 lg:w-24", shape: "rounded-2xl", ratio: "aspect-[4/5]", rate: 180, depth: 36 },
  { top: "4%", left: "84%", size: "w-24 lg:w-28", shape: "rounded-full", ratio: "aspect-square", rate: 90, depth: 20 },
  { top: "42%", left: "88%", size: "w-20 lg:w-32", shape: "rounded-2xl", ratio: "aspect-[4/5]", rate: 150, depth: 32 },
  { top: "76%", left: "76%", size: "w-16 lg:w-24", shape: "rounded-2xl", ratio: "aspect-square", rate: 70, depth: 18 },
];

// The last tag sits along the bottom edge, below the buttons, and drifts
// down (negative rate) so it never rides up into them.
const TAG_SPOTS = [
  { style: { top: "30%", left: "8%" }, rate: 90, depth: 22, tone: "bg-accent text-ink" },
  { style: { top: "24%", left: "78%" }, rate: 130, depth: 26, tone: "bg-mist text-ink" },
  { style: { bottom: "3%", left: "50%" }, rate: -30, depth: 10, tone: "bg-mist text-ink", center: true },
];

// `side`: -1 for items on the left, 1 on the right. As you scroll away from
// the hero they spread outward and tilt, like the hero is opening up.
function Drift({ rate, depth, side = 0, mouseX, mouseY, style, className = "", children }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollShift = useTransform(scrollY, [0, 700], [0, -rate]);
  const spread = useTransform(scrollY, [0, 700], [0, side * (40 + depth * 2)]);
  const rotate = useTransform(scrollY, [0, 700], [0, side * (depth / 3)]);
  const x = useTransform([spread, mouseX], ([s, m]) => s + m * depth);
  const y = useTransform([scrollShift, mouseY], ([s, m]) => s + m * depth);
  return (
    <motion.div
      className={"absolute " + className}
      style={reduce ? style : { ...style, x, y, rotate }}
    >
      {children}
    </motion.div>
  );
}

// Decorative posters and pill tags that drift slowly around the hero headline
// with scroll, and shift toward the cursor as it moves.
export default function FloatingMedia({ posters = [], tags = [] }) {
  // Cursor position across the window, from -1 to 1, smoothed with a spring.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const mouseY = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!pointerEffectsOn()) return;
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {TILE_SPOTS.map((spot, i) => {
        const poster = posters[i % Math.max(posters.length, 1)];
        if (!poster) return null;
        return (
          <Drift
            key={"tile-" + i}
            rate={spot.rate}
            depth={spot.depth}
            side={parseFloat(spot.left) < 50 ? -1 : 1}
            mouseX={mouseX}
            mouseY={mouseY}
            style={{ top: spot.top, left: spot.left }}
            className={spot.size}
          >
            <div
              className={
                "overflow-hidden bg-mist shadow-[0_10px_30px_rgba(10,10,10,0.08)] " +
                spot.shape +
                " " +
                spot.ratio
              }
            >
              <img src={poster} alt="" className="h-full w-full object-cover" />
            </div>
          </Drift>
        );
      })}
      {tags.slice(0, TAG_SPOTS.length).map((tag, i) => {
        const spot = TAG_SPOTS[i];
        return (
          <Drift
            key={"tag-" + tag}
            rate={spot.rate}
            depth={spot.depth}
            side={spot.center ? 0 : parseFloat(spot.style.left) < 50 ? -1 : 1}
            mouseX={mouseX}
            mouseY={mouseY}
            style={spot.style}
          >
            <span
              className={
                "inline-block whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-kicker " +
                spot.tone +
                (spot.center ? " -translate-x-1/2" : "")
              }
            >
              {tag}
            </span>
          </Drift>
        );
      })}
    </div>
  );
}
