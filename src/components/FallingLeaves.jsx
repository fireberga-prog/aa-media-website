import { isThanksgivingSeason } from "../data/season.js";

// A few autumn leaves drifting down behind the Home hero during the
// Thanksgiving season. Pure CSS animation; hidden for reduced motion.
const LEAVES = [
  { left: "6%", size: 22, delay: "-7s", dur: "13s", color: "#D9822B" },
  { left: "18%", size: 16, delay: "-4s", dur: "11s", color: "#B5452B" },
  { left: "31%", size: 20, delay: "-8s", dur: "14s", color: "#E0A030" },
  { left: "47%", size: 14, delay: "-2s", dur: "12s", color: "#C8642A" },
  { left: "62%", size: 24, delay: "-6s", dur: "15s", color: "#B5452B" },
  { left: "75%", size: 18, delay: "-1s", dur: "12s", color: "#E0A030" },
  { left: "88%", size: 20, delay: "-9s", dur: "13s", color: "#D9822B" },
  { left: "95%", size: 14, delay: "-5s", dur: "11s", color: "#C8642A" },
];

function Leaf({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2c1 2.5 3 3 4.5 2.5-.3 1.8.5 3 2.5 3.5-1.5 1-1.8 2.3-1 4 1.8-.2 2.8.4 3 1.5-2 .6-3.3 2-3.5 4-1.6-.9-3-.8-4.5.5V22h-2v-4c-1.5-1.3-2.9-1.4-4.5-.5-.2-2-1.5-3.4-3.5-4 .2-1.1 1.2-1.7 3-1.5.8-1.7.5-3-1-4 2-.5 2.8-1.7 2.5-3.5C9 5 11 4.5 12 2z" />
    </svg>
  );
}

export default function FallingLeaves() {
  if (!isThanksgivingSeason()) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="falling-leaf"
          style={{ left: l.left, animationDelay: l.delay, animationDuration: l.dur }}
        >
          <Leaf color={l.color} size={l.size} />
        </span>
      ))}
    </div>
  );
}
