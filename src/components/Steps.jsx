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

// compact: smaller type and spacing, for the About page.
export default function Steps({ compact = false }) {
  return (
    <ol
      className={
        "grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4 " + (compact ? "gap-y-8" : "gap-y-10")
      }
    >
      {STEPS.map((s, i) => (
        <li key={s.title} className="border-t border-ink pt-5">
          <span
            className={
              "block font-heading font-bold leading-none tracking-tightest " +
              (compact ? "text-3xl" : "text-5xl sm:text-6xl")
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
      ))}
    </ol>
  );
}
