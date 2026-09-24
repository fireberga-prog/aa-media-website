import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

// The four-step process, shared by Home and About.
export const STEPS = [
  {
    title: "Meet",
    body: "Book a consultation and tell us about your business, goals, and target audience.",
  },
  {
    title: "Content planning",
    body: "Together we create a content strategy and filming schedule.",
  },
  {
    title: "Production",
    body: "We capture professional photos and videos that showcase your business.",
  },
  {
    title: "Delivery & growth",
    body: "Your content is posted and optimized to maximize engagement and reach.",
  },
];

// The line above each step fills in as you scroll, and each number lights up
// (accent chip) when its step is reached.
function StepLine({ progress, index }) {
  const start = index / STEPS.length;
  const scaleX = useTransform(progress, [start, start + 1 / STEPS.length], [0, 1]);
  return (
    <span className="absolute inset-x-0 top-0 h-[2px] bg-ink/15">
      <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX }} />
    </span>
  );
}

// compact: smaller type and spacing, for the About page.
export default function Steps({ compact = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const [reached, setReached] = useState(reduce ? STEPS.length : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduce) setReached(Math.min(STEPS.length, Math.floor(v * STEPS.length + 0.35)));
  });

  return (
    <ol
      ref={ref}
      className={"grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4 " + (compact ? "gap-y-8" : "gap-y-10")}
    >
      {STEPS.map((s, i) => {
        const on = reduce || reached > i;
        return (
          <li key={s.title} className="relative pt-5">
            {reduce ? (
              <span className="absolute inset-x-0 top-0 h-[2px] bg-ink" />
            ) : (
              <StepLine progress={scrollYProgress} index={i} />
            )}
            <span
              className={
                "inline-block rounded-lg px-1.5 font-heading font-bold leading-tight tracking-tightest transition-colors duration-300 " +
                (compact ? "text-3xl" : "text-5xl sm:text-6xl") +
                (on ? " bg-accent text-ink" : " bg-transparent text-ink/25")
              }
            >
              {i + 1}.
            </span>
            <h3
              className={
                "font-heading font-bold tracking-tight " +
                (compact ? "mt-4 text-lg" : "mt-6 text-xl sm:text-2xl")
              }
            >
              {s.title}
            </h3>
            <p className={"mt-2 leading-relaxed text-ink/70 " + (compact ? "text-[15px]" : "text-base")}>
              {s.body}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
