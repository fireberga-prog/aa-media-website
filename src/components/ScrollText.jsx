import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function Word({ progress, range, serif, children }) {
  // Starts at 45% so even unlit words keep readable contrast (light and dark).
  const opacity = useTransform(progress, range, [0.45, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={serif ? "font-serif font-normal italic tracking-[-0.01em]" : ""}>
        {children}
      </motion.span>{" "}
    </>
  );
}

// Text whose words light up one by one as it scrolls through the screen.
// `parts`: [{ text: "Let's make something" }, { text: "worth watching.", serif: true, br: true }]
// `offset`: when the reveal starts/ends (see framer-motion useScroll). Text
// near the bottom of the page needs an earlier range so it fully lights up.
export default function ScrollText({
  as: Tag = "p",
  parts,
  className = "",
  offset = ["start 0.9", "end 0.55"],
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });

  const words = parts.flatMap((p, pi) =>
    p.text.split(" ").map((w, wi) => ({ w, serif: p.serif, br: p.br && wi === 0 && pi > 0 }))
  );
  const n = words.length;

  return (
    <Tag ref={ref} className={className}>
      {words.map(({ w, serif, br }, i) => (
        <span key={i}>
          {br && <br />}
          {reduce ? (
            <>
              <span className={serif ? "font-serif font-normal italic tracking-[-0.01em]" : ""}>{w}</span>{" "}
            </>
          ) : (
            <Word progress={scrollYProgress} range={[i / n, (i + 1) / n]} serif={serif}>
              {w}
            </Word>
          )}
        </span>
      ))}
    </Tag>
  );
}
