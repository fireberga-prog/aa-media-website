import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

// Keep a value inside [min, max) so the row loops seamlessly.
function wrap(min, max, v) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

// One row of big type that scrolls sideways on its own, speeds up with how
// fast you scroll, and flips direction when you scroll back up.
function Row({ items, baseVelocity, serif = false }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const half = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {[...items, ...items].map((t, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              serif
                ? "whitespace-nowrap px-6 font-serif text-[clamp(2.25rem,6vw,5rem)] italic leading-none"
                : "whitespace-nowrap px-6 font-heading text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-none tracking-tightest " +
                  (i % 2 ? "text-outline" : "")
            }
          >
            {t}
          </span>
          <span className="h-3 w-3 shrink-0 rounded-full bg-accent ring-1 ring-ink/70 sm:h-4 sm:w-4" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden">
      <motion.div className="flex" style={{ x }}>
        {half(false)}
        {half(true)}
      </motion.div>
    </div>
  );
}

// Decorative band of what we make and where it goes. Reduced-motion
// visitors get the same words, standing still.
export default function ScrollTicker({ top, bottom }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div aria-hidden="true" className="overflow-hidden py-10">
        <p className="whitespace-nowrap px-4 font-heading text-4xl font-bold uppercase tracking-tightest">
          {top.join("  ·  ")}
        </p>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="select-none space-y-3 overflow-hidden py-12 sm:py-16">
      <Row items={top} baseVelocity={-2.5} />
      <Row items={bottom} baseVelocity={2} serif />
    </div>
  );
}
