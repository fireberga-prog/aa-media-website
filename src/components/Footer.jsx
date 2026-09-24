import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import { SerifItalic } from "./SectionHeading.jsx";
import { WordMark } from "./Nav.jsx";
import { CONTACT_EMAIL, SocialLinks } from "./Social.jsx";

const PAGES = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/about#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <Container className="pb-10 pt-16 sm:pt-20">
        <p className="font-heading text-[clamp(2.5rem,7vw,6rem)] font-bold leading-display tracking-tightest">
          Let's make something
          <br />
          <SerifItalic>worth watching.</SerifItalic>
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-10 inline-block font-heading [overflow-wrap:anywhere] text-[clamp(1.25rem,3.4vw,2.5rem)] font-medium tracking-tight underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent"
        >
          {CONTACT_EMAIL}
        </a>

        <div className="mt-16 flex flex-col gap-8 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] font-semibold">
              {PAGES.map((p) => (
                <li key={p.label}>
                  <Link to={p.to} className="text-white/75 transition-colors hover:text-white">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SocialLinks dark />
        </div>

        <div className="mt-8 flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <WordMark className="text-xs text-white/75" />
          <span>© {new Date().getFullYear()} A&amp;A Media.</span>
        </div>
      </Container>
    </footer>
  );
}
