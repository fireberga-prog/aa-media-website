import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useSpotlight } from "../hooks/usePointerEffects.js";

// 3-column bento grid. Children choose their own spans.
export default function Bento({ className = "", children }) {
  return (
    <div className={"grid auto-rows-[minmax(15rem,auto)] gap-4 md:grid-cols-3 " + className}>
      {children}
    </div>
  );
}

// tone: "mist" (soft gray) | "ink" (dark).
export function BentoCard({ tone = "mist", icon: Icon, title, className = "", children }) {
  const dark = tone === "ink";
  const spot = useSpotlight();
  return (
    <div
      ref={spot.ref}
      onPointerMove={spot.onPointerMove}
      className={
        "group relative flex flex-col overflow-hidden rounded-2xl p-7 sm:p-8 " +
        (dark ? "on-dark bg-ink text-white " : "bg-mist text-ink ") +
        className
      }
    >
      {/* Soft light that follows the cursor. */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), ${
            dark ? "rgba(212,255,63,0.14)" : "rgba(255,255,255,0.9)"
          }, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {Icon && (
        <span
          className={
            "relative inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:transform-none " +
            (dark ? "bg-white/10" : "bg-white")
          }
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <h3 className="relative mt-auto pt-10 font-heading text-2xl font-bold tracking-tight">{title}</h3>
      <div className={"relative mt-2 text-base leading-relaxed " + (dark ? "text-white/75" : "text-ink/70")}>
        {children}
      </div>
    </div>
  );
}

// A card that plays a muted preview clip on loop while it is on screen.
// Reduced-motion visitors see the still poster instead.
export function BentoVideoCard({ src, poster, srcSet, label, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    const v = ref.current?.querySelector("video");
    if (!v) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible, loaded]);

  return (
    <div ref={ref} className={"relative min-h-[26rem] overflow-hidden rounded-2xl bg-ink " + className}>
      <img
        src={poster}
        srcSet={srcSet}
        sizes="(min-width: 768px) 33vw, 100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!reduce && src && (
        <video
          src={loaded ? src : undefined}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
      )}
      {label && (
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-kicker text-ink backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent ring-1 ring-ink/60" aria-hidden="true" />
          {label}
        </span>
      )}
    </div>
  );
}
