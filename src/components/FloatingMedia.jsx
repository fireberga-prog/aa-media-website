import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Fixed spots around the edges of the hero, clear of the centered headline.
// `rate` is how far (px) the tile drifts up over the first ~700px of scroll.
const TILE_SPOTS = [
  { top: "6%", left: "3%", size: "w-24 lg:w-32", shape: "rounded-2xl", ratio: "aspect-square", rate: 120 },
  { top: "52%", left: "1%", size: "w-20 lg:w-28", shape: "rounded-full", ratio: "aspect-square", rate: 60 },
  { top: "76%", left: "14%", size: "w-20 lg:w-24", shape: "rounded-2xl", ratio: "aspect-[4/5]", rate: 180 },
  { top: "4%", left: "84%", size: "w-24 lg:w-28", shape: "rounded-full", ratio: "aspect-square", rate: 90 },
  { top: "42%", left: "88%", size: "w-20 lg:w-32", shape: "rounded-2xl", ratio: "aspect-[4/5]", rate: 150 },
  { top: "78%", left: "76%", size: "w-16 lg:w-24", shape: "rounded-2xl", ratio: "aspect-square", rate: 70 },
];

const TAG_SPOTS = [
  { top: "30%", left: "8%", rate: 90, tone: "bg-accent text-ink" },
  { top: "24%", left: "78%", rate: 130, tone: "bg-mist text-ink" },
  { top: "88%", left: "44%", rate: 40, tone: "bg-mist text-ink" },
];

function Drift({ rate, style, className, children }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, -rate]);
  return (
    <motion.div
      className={"absolute " + className}
      style={reduce ? style : { ...style, y }}
    >
      {children}
    </motion.div>
  );
}

// Decorative posters and pill tags that drift slowly around the hero headline.
export default function FloatingMedia({ posters = [], tags = [] }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {TILE_SPOTS.map((spot, i) => {
        const poster = posters[i % Math.max(posters.length, 1)];
        if (!poster) return null;
        return (
          <Drift
            key={"tile-" + i}
            rate={spot.rate}
            style={{ top: spot.top, left: spot.left }}
            className={spot.size}
          >
            <div className={"overflow-hidden bg-mist shadow-[0_10px_30px_rgba(10,10,10,0.08)] " + spot.shape + " " + spot.ratio}>
              <img src={poster} alt="" className="h-full w-full object-cover" />
            </div>
          </Drift>
        );
      })}
      {tags.slice(0, TAG_SPOTS.length).map((tag, i) => (
        <Drift
          key={"tag-" + tag}
          rate={TAG_SPOTS[i].rate}
          style={{ top: TAG_SPOTS[i].top, left: TAG_SPOTS[i].left }}
          className=""
        >
          <span
            className={
              "inline-block whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-kicker " +
              TAG_SPOTS[i].tone
            }
          >
            {tag}
          </span>
        </Drift>
      ))}
    </div>
  );
}
