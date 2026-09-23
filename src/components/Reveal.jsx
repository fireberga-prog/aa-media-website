import { motion, useReducedMotion } from "framer-motion";

// Fades a block up 16px as it enters the viewport. Reduced-motion visitors
// get the content immediately, fully visible, with no transform.
export default function Reveal({ as = "div", className = "", delay = 0, children, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
