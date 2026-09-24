import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMagnetic } from "../hooks/usePointerEffects.js";

// Small accent square that holds the arrow on primary buttons.
export function ArrowSquare({ className = "" }) {
  return (
    <span
      className={
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ink transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 " +
        className
      }
      aria-hidden="true"
    >
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </span>
  );
}

const VARIANTS = {
  primary:
    "group inline-flex items-center gap-4 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-[transform,background-color] duration-300 ease-out hover:bg-ink/85 motion-reduce:transition-none",
  secondary:
    "group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-base font-semibold text-ink transition-colors duration-200 hover:border-ink",
  link:
    "group inline-flex items-center gap-1.5 text-base font-semibold text-ink underline decoration-ink/25 underline-offset-[6px] transition-colors duration-200 hover:decoration-ink",
};

// variant: "primary" | "secondary" | "link".
// Renders a router <Link> with `to`, an <a> with `href`, otherwise a <button>.
export default function Button({ to, href, variant = "primary", className = "", children, ...rest }) {
  const cls = VARIANTS[variant] + " " + className;
  // Primary buttons lean toward the cursor.
  const magnetic = useMagnetic(0.2);
  if (variant === "primary") {
    rest = {
      ref: magnetic.ref,
      onPointerMove: magnetic.onPointerMove,
      onPointerLeave: magnetic.onPointerLeave,
      ...rest,
    };
  }
  const content = (
    <>
      <span>{children}</span>
      {variant === "primary" && <ArrowSquare />}
      {variant === "link" && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}
