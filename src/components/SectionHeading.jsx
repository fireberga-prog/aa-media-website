// The site's typographic signature: a heavy, tightly tracked sans phrase
// paired with a light serif italic phrase.
const SIZES = {
  hero: "text-hero",
  xl: "text-[clamp(2.75rem,7vw,6rem)]",
  lg: "text-[clamp(2.25rem,5vw,4rem)]",
  md: "text-[clamp(1.875rem,3.5vw,2.75rem)]",
};

export function SerifItalic({ className = "", children }) {
  return (
    <span className={"font-serif font-normal italic tracking-[-0.01em] " + className}>
      {children}
    </span>
  );
}

export function Kicker({ className = "", children }) {
  return (
    <span className={"block text-xs font-semibold uppercase tracking-kicker " + className}>
      {children}
    </span>
  );
}

export default function SectionHeading({
  as: Tag = "h2",
  kicker,
  bold,
  serif,
  size = "lg",
  stacked = false,
  align = "left",
  className = "",
}) {
  return (
    <div className={(align === "center" ? "text-center " : "") + className}>
      {kicker && <Kicker className="mb-4 text-ink/70">{kicker}</Kicker>}
      <Tag
        className={
          "font-heading font-bold leading-display tracking-tightest " + SIZES[size]
        }
      >
        {bold}
        {stacked ? <br /> : " "}
        <SerifItalic>{serif}</SerifItalic>
      </Tag>
    </div>
  );
}
