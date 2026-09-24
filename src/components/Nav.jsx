import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import Container from "./Container.jsx";
import { SocialLinks } from "./Social.jsx";

// Spelled-out brand name in thin, wide-tracked uppercase, matching the
// "MEDIA" lettering in the logo.
export function WordMark({ className = "" }) {
  return (
    <span
      className={
        "whitespace-nowrap font-heading font-light uppercase tracking-[0.3em] " + className
      }
    >
      A&amp;A&nbsp;Media
    </span>
  );
}

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

function DesktopLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        "relative px-1 py-2 text-[15px] font-semibold transition-colors " +
        (isActive ? "text-ink" : "text-ink/70 hover:text-ink")
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span
              className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent ring-1 ring-ink/80"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  // Reading progress line along the bottom of the nav.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={
        "sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md transition-colors duration-300 " +
        (scrolled ? "border-hairline" : "border-transparent")
      }
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-ink"
        style={{ scaleX: progress }}
      />
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="A&A Media home">
          {/* Real logo: public/aa-media-logo.png. Do not redraw or recolor. */}
          <img src="/aa-media-logo.png" alt="" className="h-12 w-auto mix-blend-multiply" width="48" height="48" />
          <WordMark className="text-sm" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <DesktopLink key={l.to} {...l} />
          ))}
          <Link
            to="/about#contact"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/85"
          >
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-white md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Container className="flex h-16 shrink-0 items-center justify-between">
              <Link to="/" className="flex items-center gap-3" aria-label="A&A Media home">
                <img src="/aa-media-logo.png" alt="" className="h-12 w-auto mix-blend-multiply" width="48" height="48" />
                <WordMark className="text-sm" />
              </Link>
              <button
                type="button"
                autoFocus
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </Container>
            <Container as="nav" aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 pb-16">
              {[...LINKS, { to: "/about#contact", label: "Contact" }].map(
                (l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      "flex items-center gap-4 py-2 font-heading text-5xl font-bold tracking-tightest " +
                      (isActive && l.to !== "/about#contact" ? "text-ink" : "text-ink/70")
                    }
                  >
                    {l.label}
                  </NavLink>
                )
              )}
              <SocialLinks className="mt-10" />
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
