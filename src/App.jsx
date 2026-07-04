import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { Video, TrendingUp, ArrowUp, Play, Volume2, VolumeX } from "lucide-react";
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

// Fade/slide-in as the element enters the viewport. Motion is opt-out via
// prefers-reduced-motion (handled in index.css — without it, .reveal has no
// hidden state, so content shows immediately).
function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
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
    <Tag ref={ref} className={"reveal " + className} {...rest}>
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

// Solid black button that inverts to a clean outline on hover.
function BookButton({ className = "", children = "Book a call" }) {
  return (
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
      <Container className="flex items-center justify-between py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("top");
          }}
          className="flex items-center"
        >
          <BrandLockup
            imgClass="h-11 w-auto sm:h-12"
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
  { text: "Short-form", bold: true },
  { text: "content" },
  { text: "that" },
  { text: "grows", bold: true },
  { text: "your" },
  { text: "social", bold: true },
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
      {/* Large, quiet peaks motif that slowly drifts — keeps the first screen alive. */}
      <PeaksMark className="hero-drift pointer-events-none absolute -right-16 top-4 h-72 w-[34rem] opacity-[0.05] sm:-right-10 sm:h-[30rem] sm:w-[44rem]" />
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
          <h1 className="font-heading text-[3.4rem] font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
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
                {i < HERO_WORDS.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl"
          >
            A&amp;A Media films promotional video and builds your social accounts
            — so your business gets seen.
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
const STATEMENT_LINE = "We make content that gets your business seen.";

function StatementBand() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-ink">
      <PeaksMark className="pointer-events-none absolute -right-10 -top-10 h-72 w-[34rem] opacity-[0.08] [stroke:#fff] sm:h-96 sm:w-[46rem]" />
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
        <Reveal className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
          <ServiceCard icon={Video} title="Short-form promo content">
            We film short, scroll-stopping promotional videos for your business —
            the kind that actually performs on Reels, TikTok, and Shorts.
          </ServiceCard>
          <ServiceCard icon={TrendingUp} title="Social media growth">
            We run and grow your social accounts — posting consistently and
            on-brand, so your reach and following climb over time.
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
  { title: "Lockhart", category: "Short-form video", video: "/work/reel-2.mp4", thumbnail: "/work/reel-2.jpg", href: undefined },
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
            preload="metadata"
            onTimeUpdate={loopFirstHalf}
          />
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
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
      <PeaksMark className="pointer-events-none absolute -right-24 top-24 h-80 w-[40rem] opacity-[0.04]" />
      {/* Wider container so the showcase feels immersive and anchors the page. */}
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading number="02">Our work</SectionHeading>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {/* [SUBHEAD PLACEHOLDER — one line about the kind of work you do] */}
          </p>
        </Reveal>
        <Reveal className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-12">
          {works.map((work, i) => (
            <WorkTile key={i} {...work} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

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

function HowItWorks() {
  return (
    <section className="border-t border-hairline">
      <Container className="py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="03">How it works</SectionHeading>
        </Reveal>
        <Reveal>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-10">
            {/* Connecting line draws itself in on scroll: vertical on mobile,
                horizontal on desktop. Aligned to the center of the 48px markers. */}
            <motion.span
              className="pointer-events-none absolute left-6 top-6 bottom-6 w-px origin-top bg-ink/20 md:hidden"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
            <motion.span
              className="pointer-events-none absolute top-6 left-[16.666%] right-[16.666%] hidden h-px origin-left bg-ink/20 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <Step number="01" title="Book a call">
              Tell us about your business and what you want from social.
            </Step>
            <Step number="02" title="We build your plan">
              We map out the content and posting strategy that fits your goals.
            </Step>
            <Step number="03" title="We film and grow">
              We create the content and run your accounts while you focus on your
              business.
            </Step>
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section className="relative overflow-hidden border-t border-hairline">
      <PeaksMark className="pointer-events-none absolute -left-20 bottom-0 h-64 w-96 opacity-[0.04] md:block" />
      <Container className="relative py-24 sm:py-32">
        <Reveal>
          <SectionHeading number="04">Who's behind A&amp;A</SectionHeading>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-ink/70">
            <p>
              A&amp;A Media is run by Alex and Andrew. We're a small, hands-on
              team — which means you work directly with the people making your
              content, not a faceless agency.
            </p>
            <p>
              We help businesses and nonprofits build a real online presence —
              creating the content and growing the accounts that put your work in
              front of the people who matter most.
            </p>
            {/* [ABOUT PLACEHOLDER — Alex & Andrew: add 1–2 real sentences on your
                background and why you started A&A. Do not invent anything.] */}
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
        <Reveal className="mt-12">
          <FaqItem question="How much does it cost?">
            There's no one-size-fits-all price, because there's no one-size-fits-all
            business. Your investment depends on your goals, your platforms, and the
            scope of content you need — and we'll tailor a package to fit. Book a
            call and we'll put real numbers in front of you.
          </FaqItem>
          <FaqItem question="Are there contracts?">
            We work on a minimum commitment, and for good reason: short-form content
            and social growth compound over time. A short runway lets us build real
            momentum for your brand instead of chasing a quick spike. We'll walk you
            through the specifics on our call.
          </FaqItem>
          <FaqItem question="What do you need from me to get started?">
            Just a conversation. Hop on a quick call or meeting with us, tell us about
            your business, and we'll handle the rest — mapping out your content,
            strategy, and every next step from there.
          </FaqItem>
          <FaqItem question="How fast will I see results?">
            We move fast. It takes roughly a week to get everything set up and the
            cameras rolling. From there, we create and post consistently — because
            steady, on-brand content is what builds lasting reach, not a one-off
            viral moment.
          </FaqItem>
          <FaqItem question="Which platforms do you cover?">
            We specialize in Instagram and TikTok — the two homes of short-form video,
            and where scroll-stopping content earns the most attention. That focus is
            exactly what lets us do it well.
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
              Short-form content and social media growth for businesses that
              want to be seen.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-ink/60 sm:items-end">
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
