import { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Camera,
  CalendarCheck,
  Target,
  Instagram,
  ArrowUp,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import ContactForm from "./components/ContactForm.jsx";
import PeaksMark from "./components/PeaksMark.jsx";

/* ---------- helpers ---------- */

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// Single max-width grid so every section aligns to one container.
function Container({ className = "", children }) {
  return (
    <div className={"mx-auto w-full max-w-5xl px-6 sm:px-8 " + className}>
      {children}
    </div>
  );
}

// Slim scroll-progress bar pinned above the header.
function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-ink"
      style={{ scaleX: reduce ? scrollYProgress : smoothed }}
      aria-hidden="true"
    />
  );
}

// Magnetic hover: the wrapped element leans gently toward the cursor and
// springs back on leave. Pointer-only; inert for reduced-motion visitors.
function Magnetic({ className = "", strength = 0.2, children }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  function onMouseMove(e) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      className={"inline-block " + className}
    >
      {children}
    </motion.span>
  );
}

// Low-opacity peaks motif with a gentle scroll parallax. Purely decorative;
// holds still for reduced-motion visitors.
function ParallaxPeaks({ className = "", markClassName = "", distance = 36 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { y }}
      className={"pointer-events-none absolute " + className}
      aria-hidden="true"
    >
      <PeaksMark className={"h-full w-full " + markClassName} />
    </motion.div>
  );
}

// Fade/slide-in as the element enters the viewport. With `stagger`, direct
// children cascade in one after another. Motion is opt-out via
// prefers-reduced-motion (handled in index.css — without it, .reveal has no
// hidden state, so content shows immediately).
function Reveal({ as: Tag = "div", className = "", stagger = false, children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={(stagger ? "reveal-stagger " : "reveal ") + className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Section opener: an oversized monochrome number + a bold mixed-case heading,
// with a small uppercase kicker to structure the whitespace.
function SectionHeading({ number, kicker, children }) {
  return (
    <div className="flex items-start gap-5 sm:gap-7">
      {number && (
        <span
          className="select-none font-heading text-5xl font-bold leading-none text-ink/10 sm:text-7xl"
          aria-hidden="true"
        >
          {number}
        </span>
      )}
      <div className="pt-1 sm:pt-2">
        {kicker && (
          <span className="block text-xs font-medium uppercase tracking-[0.22em] text-ink/50">
            {kicker}
          </span>
        )}
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {children}
        </h2>
      </div>
    </div>
  );
}

// Solid black button that inverts to a clean outline on hover, with a
// magnetic lean toward the cursor.
function BookButton({ className = "", children = "Book a call" }) {
  return (
    <Magnetic>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo("contact");
        }}
        className={
          "inline-flex items-center justify-center rounded-md border border-ink bg-ink px-7 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-white hover:text-ink " +
          className
        }
      >
        {children}
      </a>
    </Magnetic>
  );
}

// Spelled-out brand name in thin, wide-tracked uppercase — matches the
// "MEDIA" lettering in the logo so "A&A MEDIA" reads clearly beside the mark.
function WordMark({ className = "" }) {
  return (
    <span
      className={
        "whitespace-nowrap font-heading font-light uppercase tracking-[0.3em] " +
        className
      }
    >
      A&amp;A&nbsp;Media
    </span>
  );
}

// Original outline TikTok glyph drawn to match lucide's stroke style
// (lucide ships an Instagram icon but no TikTok one).
function TikTokIcon({ className = "", strokeWidth = 1.5 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 4v10.5a4.5 4.5 0 1 1-4.5-4.5" />
      <path d="M14 4a6 6 0 0 0 6 6" />
    </svg>
  );
}

// The real A&A profiles. Icon buttons invert to black on hover.
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aand.amedia/",
    Icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aa.media98",
    Icon: TikTokIcon,
  },
];

function SocialLinks({ className = "" }) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"A&A Media on " + label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white"
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}

// The real logo image (single source of truth) + the spelled-out wordmark.
function BrandLockup({ imgClass = "h-11 w-auto", textClass = "text-base" }) {
  return (
    <span className="flex items-center gap-3">
      {/* Real logo — public/aa-media-logo.png. Do not redraw or recolor. */}
      <img src="/aa-media-logo.png" alt="A&A Media" className={imgClass} />
      <WordMark className={textClass} />
    </span>
  );
}

/* ---------- sections ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-50 bg-white/85 backdrop-blur transition-shadow duration-300 " +
        (scrolled
          ? "border-b border-hairline shadow-[0_1px_12px_rgba(10,10,10,0.05)]"
          : "border-b border-transparent")
      }
    >
      <Container
        className={
          "flex items-center justify-between transition-[padding] duration-300 " +
          (scrolled ? "py-2.5" : "py-4")
        }
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("top");
          }}
          className="flex items-center"
        >
          <BrandLockup
            imgClass={
              "w-auto transition-all duration-300 " +
              (scrolled ? "h-9 sm:h-10" : "h-11 sm:h-12")
            }
            textClass="text-sm sm:text-base"
          />
        </a>
        <BookButton className="px-5 py-2.5 text-sm" />
      </Container>
    </header>
  );
}

// Headline split into words so each can stagger in. `bold` words carry extra
// weight for contrast — the copy itself is unchanged.
const HERO_WORDS = [
  { text: "Growing", bold: true },
  { text: "communities", bold: true },
  { text: "through" },
  { text: "creative", bold: true },
  { text: "media.", bold: true },
];

function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 },
    },
  };
  const word = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: "0.5em" },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const fadeUp = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Large, quiet peaks motif — slow drift + scroll parallax keeps the
          first screen alive without noise. */}
      <ParallaxPeaks
        className="-right-16 top-4 h-72 w-[34rem] opacity-[0.05] sm:-right-10 sm:h-[30rem] sm:w-[44rem]"
        markClassName="hero-drift"
        distance={48}
      />
      <Container className="relative flex min-h-[88vh] flex-col justify-center py-24 sm:min-h-[90vh] sm:py-32">
        <motion.div
          className="max-w-4xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Prominent brand lockup so visitors know the company within the
              first screen — the real logo + the spelled-out wordmark. */}
          <motion.div variants={fadeUp} className="mb-10 flex items-center gap-4 sm:mb-12">
            <img
              src="/aa-media-logo.png"
              alt="A&A Media"
              className="h-16 w-auto sm:h-24"
            />
            <WordMark className="text-lg text-ink sm:text-2xl" />
          </motion.div>
          <h1 className="font-heading text-[clamp(2.4rem,13.5vw,3.4rem)] font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            {HERO_WORDS.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className={
                    "inline-block " + (w.bold ? "text-ink" : "text-ink/55")
                  }
                >
                  {w.text}
                </motion.span>
                {i < HERO_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl"
          >
            A&amp;A Media creates engaging content that helps organizations
            connect with more people online.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-12">
            <BookButton className="px-9 py-4" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// Continuously scrolling band of keywords. Pure CSS loop; pauses on hover.
function Marquee() {
  const items = [
    "Short-form",
    "Reels",
    "TikTok",
    "Shorts",
    "Social growth",
    "Promo video",
  ];
  const Half = ({ ariaHidden }) => (
    <div className="marquee__half flex shrink-0" aria-hidden={ariaHidden}>
      {items.map((label, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 py-4 font-heading text-sm uppercase tracking-[0.28em] sm:text-base">
            {label}
          </span>
          <span className="text-ink/30" aria-hidden="true">
            &bull;
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee border-y border-hairline">
      <div className="marquee__track">
        <Half ariaHidden={false} />
        <Half ariaHidden={true} />
      </div>
    </div>
  );
}

// Full-width brand statement — a single punchy line in large type, framed by
// hairlines and a quiet peaks motif to fill space without clutter.
// Edit STATEMENT_LINE below; keep it a brand line, not a claim or number.
const STATEMENT_LINE = "Content that tells your story.";

function StatementBand() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-ink">
      <ParallaxPeaks
        className="-right-10 -top-10 h-72 w-[34rem] opacity-[0.08] sm:h-96 sm:w-[46rem]"
        markClassName="[stroke:#fff]"
        distance={28}
      />
      <Container className="relative py-20 sm:py-28">
        <Reveal>
          <p className="max-w-4xl font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {STATEMENT_LINE}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, children }) {
  return (
    <div className="group flex h-full flex-col rounded-lg border border-hairline p-8 transition-colors duration-300 hover:border-ink sm:p-10">
      <Icon
        className="h-8 w-8 text-ink transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <h3 className="mt-7 font-heading text-2xl font-bold tracking-tight">
        {title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-ink/70">{children}</p>
    </div>
  );
}

function WhatWeDo() {
  return (
    <section className="border-t border-hairline">
      <Container className="py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="01">What we do</SectionHeading>
        </Reveal>
        <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          <ServiceCard icon={Camera} title="Content creation">
            Professional photos and short form videos that showcase your
            organization and tell your story.
          </ServiceCard>
          <ServiceCard icon={CalendarCheck} title="Social media management">
            We plan, post, and manage your content to keep your social media
            active and engaging.
          </ServiceCard>
          <ServiceCard icon={Target} title="Content strategy">
            We work with you to develop a content plan that aligns with your
            goals and reaches your audience.
          </ServiceCard>
        </Reveal>
      </Container>
    </section>
  );
}

/* ----- Our work -----
   Toggle this to false to hide the whole section until you have real samples
   to show. Before launch, replace the placeholder items below with real work. */
const SHOW_WORK = true;

/* Add a real project by appending an object to this array — no markup changes
   needed. Tiles are vertical (9:16), built to hold short-form video.
   Fields:
     - title:     project name                              (string)
     - category:  short tag/label                           (string)
     - video:     optional path to a muted preview clip in /public, e.g.
                  "/work/project-1.mp4". When set, it plays on hover.
     - thumbnail: optional poster image in /public, e.g. "/work/project-1.jpg"
                  (used as the video poster, or shown on its own if no video)
     - href:      optional link out, e.g. a Reel/case-study URL  (string)
   Drop in a real clip with a single line, e.g.:
     { title: "Spring launch reel", category: "Short-form video",
       video: "/work/spring-launch.mp4", thumbnail: "/work/spring-launch.jpg",
       href: "https://..." }
   When neither video nor thumbnail is set, the tile shows the AA peaks mark.
   ---
   These three are PLACEHOLDERS — replace them with real work before launch. */
const works = [
  { title: "Cafe St. Petersburg", category: "Short-form video", video: "/work/reel-1.mp4", thumbnail: "/work/reel-1.jpg", href: undefined },
  { title: "Lockheart", category: "Short-form video", video: "/work/reel-2.mp4", thumbnail: "/work/reel-2.jpg", href: undefined },
  { title: "Centre Street Food Pantry", category: "Short-form video", video: "/work/centre-st-food-pantry.mp4", thumbnail: "/work/centre-st-food-pantry.jpg", href: undefined },
];

function WorkTile({ title, category, video, thumbnail, href }) {
  const videoRef = useRef(null);
  // Sound is off until the visitor turns it on with the speaker button.
  // (Browsers block audio until a real click — hovering alone doesn't count.)
  const [soundOn, setSoundOn] = useState(false);

  function playPreview() {
    const v = videoRef.current;
    if (v) {
      v.muted = !soundOn;
      v.play().catch(() => {});
    }
  }
  function stopPreview() {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }
  // Speaker toggle. The click is a valid user gesture, so turning sound on
  // here also starts playback with audio; afterwards, hover plays with sound.
  function toggleSound(e) {
    e.preventDefault();
    e.stopPropagation();
    const next = !soundOn;
    setSoundOn(next);
    const v = videoRef.current;
    if (v) {
      v.muted = !next;
      if (next) v.play().catch(() => {});
    }
  }
  // Loop only the first half of the clip for a tighter hover preview.
  function loopFirstHalf(e) {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration / 2) {
      v.currentTime = 0;
    }
  }

  const tile = (
    <div
      className="group relative block h-full overflow-hidden rounded-lg border border-hairline transition-colors duration-300 hover:border-ink"
      onMouseEnter={video ? playPreview : undefined}
      onMouseLeave={video ? stopPreview : undefined}
    >
      {/* Vertical 9:16 frame, sized for Reels / TikTok / Shorts. */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-white">
        {video ? (
          <video
            ref={videoRef}
            className="h-full w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            src={video}
            poster={thumbnail}
            muted
            loop
            playsInline
            preload="none"
            onTimeUpdate={loopFirstHalf}
          />
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="h-full w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          // Placeholder: AA peaks mark — no stock footage, ready for a real clip.
          <div className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <PeaksMark className="h-24 w-36 opacity-[0.12]" />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.18em] text-ink/40">
              <Play className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
              Preview
            </span>
          </div>
        )}

        {/* Sound toggle — clicking enables audio (a valid user gesture). */}
        {video && (
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? "Mute video" : "Play sound"}
            aria-pressed={soundOn}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white"
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        )}

        {/* Title overlay — slides up and reveals on hover. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-white/90 px-4 py-3 opacity-0 backdrop-blur transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-heading text-base font-bold tracking-tight">
              {title}
            </span>
            <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.14em] text-ink/50">
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Optional link out — leave href as "#" placeholder until you have a real URL.
  return href ? (
    <a href={href} className="block h-full">
      {tile}
    </a>
  ) : (
    tile
  );
}

function OurWork() {
  if (!SHOW_WORK) return null;
  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-hairline"
    >
      {/* Quiet peaks motif anchoring the showcase. */}
      <ParallaxPeaks
        className="-right-24 top-24 h-80 w-[40rem] opacity-[0.04]"
        distance={32}
      />
      {/* Wider container so the showcase feels immersive and anchors the page. */}
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading number="02">Our work</SectionHeading>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {/* [SUBHEAD PLACEHOLDER — one line about the kind of work you do] */}
          </p>
        </Reveal>
        <Reveal
          stagger
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-12"
        >
          {works.map((work, i) => (
            <WorkTile key={i} {...work} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ----- How it works -----
   One copy source for both renders: the pinned scroll sequence (desktop,
   motion welcome) and the plain stacked layout (mobile / reduced motion). */
const STEPS = [
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

function Step({ number, title, children }) {
  return (
    <li className="relative flex gap-6 md:block">
      {/* Numbered marker — sits above the connecting line (bg-white masks it). */}
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink bg-white font-heading text-lg font-bold">
        {number}
      </div>
      <div className="md:mt-7">
        <h3 className="font-heading text-xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-ink/70">{children}</p>
      </div>
    </li>
  );
}

// Plain layout: three steps joined by a thin line that draws itself in on
// scroll — vertical on mobile, horizontal on wider screens.
function HowItWorksStatic() {
  return (
    <section className="border-t border-hairline">
      <Container className="py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="03">How it works</SectionHeading>
        </Reveal>
        <Reveal>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
            {/* Connecting line, aligned to the center of the 48px markers. */}
            <motion.span
              className="pointer-events-none absolute left-6 top-6 bottom-6 w-px origin-top bg-ink/20 md:hidden"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
            <motion.span
              className="pointer-events-none absolute top-6 left-[12.5%] right-[12.5%] hidden h-px origin-left bg-ink/20 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {STEPS.map((s, i) => (
              <Step key={i} number={"0" + (i + 1)} title={s.title}>
                {s.body}
              </Step>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

// Pinned scroll sequence: the section is tall, the content stays fixed on
// screen, and scrolling through it draws the connecting line and lights up
// each step in turn. Transform/opacity only, so it stays smooth.
function HowItWorksPinned() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)));
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <section ref={ref} className="relative h-[280vh] border-t border-hairline">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container>
          <SectionHeading number="03">How it works</SectionHeading>
          <ol className="relative mt-16 grid grid-cols-4 gap-8">
            {/* Connecting line, drawn by scroll progress. */}
            <motion.span
              className="pointer-events-none absolute top-6 left-[12.5%] right-[12.5%] h-px origin-left bg-ink/25"
              style={{ scaleX: lineScale }}
              aria-hidden="true"
            />
            {STEPS.map((s, i) => (
              <li key={i} className="relative">
                <div
                  className={
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border bg-white font-heading text-lg font-bold transition-colors duration-500 " +
                    (active >= i
                      ? "border-ink text-ink"
                      : "border-ink/25 text-ink/30")
                  }
                >
                  {"0" + (i + 1)}
                </div>
                <div
                  className={
                    "mt-7 transition-opacity duration-500 " +
                    (active >= i ? "opacity-100" : "opacity-30")
                  }
                >
                  <h3 className="font-heading text-xl font-bold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ink/70">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </section>
  );
}

function HowItWorks() {
  const reduce = useReducedMotion();
  // Pin only on wider screens where the three steps sit side by side; phones
  // and reduced-motion visitors get the plain stacked layout.
  const [wide, setWide] = useState(
    () => window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce || !wide ? <HowItWorksStatic /> : <HowItWorksPinned />;
}

function About() {
  return (
    <section className="relative overflow-hidden border-t border-hairline">
      <ParallaxPeaks
        className="-left-20 bottom-0 h-64 w-96 opacity-[0.04]"
        distance={24}
      />
      <Container className="relative py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="04">Who's behind A&amp;A</SectionHeading>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-ink/70">
            <p>
              A&amp;A Media is a creative media agency founded by two high school
              students with a passion for storytelling, digital marketing, and
              making a positive impact in our community.
            </p>
            <p>
              Our mission is to help local nonprofits, charities, and small
              businesses grow their online presence through engaging short-form
              videos and social media content. We believe every organization has
              a story worth sharing, and our goal is to help those stories reach
              more people.
            </p>
            <p>
              By combining creativity with thoughtful strategy, we create content
              that not only looks professional but also helps organizations
              expand their reach, strengthen their brand, and connect with the
              communities they serve.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function FaqItem({ question, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline first:border-t">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-ink/60"
      >
        <span className="text-base font-medium sm:text-lg">{question}</span>
        <span
          className={
            "shrink-0 font-heading text-2xl font-light leading-none text-ink/40 transition-transform duration-300 " +
            (open ? "rotate-45" : "")
          }
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div className={"faq-panel " + (open ? "is-open" : "")}>
        <div className="faq-panel-inner">
          <div className="pb-6 text-base leading-relaxed text-ink/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section className="border-t border-hairline">
      <Container className="max-w-3xl py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="05">FAQ</SectionHeading>
        </Reveal>
        <Reveal stagger className="mt-12">
          <FaqItem question="How much does it cost?">
            Our pricing depends on your goals and the services you need. Before
            talking numbers, we offer a complimentary trial video so you can see
            the value we provide and determine if we're the right partner for
            your business.
          </FaqItem>
          <FaqItem question="What do you need from me to get started?">
            Just bring your ideas. We'll listen to your goals, learn about your
            business, and work alongside you to create content that represents
            your brand.
          </FaqItem>
          <FaqItem question="How fast will I see results?">
            After meeting with you, we'll develop a content plan and usually begin
            filming within a week. Growing on social media takes consistency, and
            we'll work with you to create content that keeps your audience
            engaged.
          </FaqItem>
          <FaqItem question="Which platforms do you cover?">
            We're happy to work across any social media platform. We have the most
            experience with Instagram and TikTok, but our content can be adapted
            for Facebook, YouTube Shorts, LinkedIn, and more.
          </FaqItem>
        </Reveal>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-hairline">
      <Container className="max-w-2xl py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="06">Ready to grow your socials?</SectionHeading>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Tell us a bit about your business and we'll set up a call.
          </p>
          <p className="mt-4 text-base text-ink/70">
            Or email us directly at{" "}
            <a
              href="mailto:officialaandamedia@gmail.com"
              className="link-underline font-medium text-ink"
            >
              officialaandamedia@gmail.com
            </a>
            .
          </p>
          <SocialLinks className="mt-6" />
          <div className="mt-12">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline">
      <Container className="py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BrandLockup imgClass="h-12 w-auto" textClass="text-base" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              Short-form content and social media growth for organizations.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-ink/60 sm:items-end">
            <SocialLinks className="self-start sm:self-end" />
            <a
              href="mailto:officialaandamedia@gmail.com"
              className="link-underline self-start text-ink/70 transition-colors hover:text-ink sm:self-end"
            >
              officialaandamedia@gmail.com
            </a>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("top");
              }}
              className="link-underline inline-flex items-center gap-1.5 self-start text-ink/50 transition-colors hover:text-ink sm:self-end"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-hairline pt-6 text-xs tracking-wide text-ink/50">
          © 2026 A&amp;A Media.
        </div>
      </Container>
    </footer>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="font-body">
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <WhatWeDo />
          <StatementBand />
          <OurWork />
          <HowItWorks />
          <About />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
