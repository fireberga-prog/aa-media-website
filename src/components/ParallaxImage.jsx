import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// An image that drifts slightly inside its frame as the page scrolls, like
// looking through a window. The frame (className) sets size and shape.
export default function ParallaxImage({ className = "", imgClassName = "", amount = 8, style, ...img }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <div ref={ref} className={"overflow-hidden " + className}>
      <motion.img
        {...img}
        style={reduce ? style : { ...style, y, scale: 1 + (amount * 2.4) / 100 }}
        className={"h-full w-full object-cover " + imgClassName}
      />
    </div>
  );
}
