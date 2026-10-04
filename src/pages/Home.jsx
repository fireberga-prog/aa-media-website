import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Camera, CalendarCheck, Target, Trees } from "lucide-react";
import {
  allVideos,
  featuredVideos,
  getClient,
  posterSrcSet,
  previewFor,
  thumbFor,
  videosFor,
  visibleClients,
} from "../data/clients.js";
import usePageTitle from "../hooks/usePageTitle.js";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading, { Kicker, SerifItalic } from "../components/SectionHeading.jsx";
import FloatingMedia from "../components/FloatingMedia.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { useVideoModal } from "../components/VideoModal.jsx";
import Bento, { BentoCard, BentoVideoCard } from "../components/Bento.jsx";
import Steps from "../components/Steps.jsx";

const HERO_TAGS = ["Restaurants", "Nonprofits", "Short-form video"];

// Each video appears on Home at most once: "Recent work" gets the featured
// ones, "What you get" and the closing band each take one of the rest, and
// the hero's floating posters use whatever is left.
const featuredIds = new Set(featuredVideos.map((v) => v.id));
const otherVideos = allVideos.filter((v) => !featuredIds.has(v.id));
const bentoVideo = otherVideos[0] || allVideos[0];
const closingVideo = otherVideos[1] || allVideos[0];
const heroVideos = otherVideos.length > 2 ? otherVideos.slice(2) : allVideos;

// Split into words so each can rise in on a stagger.
const HERO_BOLD = ["Growing", "communities"];
const HERO_SERIF = ["through", "creative", "media."];

function Hero() {
  const reduce = useReducedMotion();
  // As the hero scrolls away, the headline block shrinks, sinks and fades.
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const exitScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const exitY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const posters = heroVideos.map(thumbFor).filter(Boolean);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.05 } },
  };
  const word = {
    // The overflow mask on each word does the reveal, so no opacity fade is
    // needed (text at opacity 0 would also delay Largest Contentful Paint).
    hidden: reduce ? { y: 0 } : { y: "110%" },
    show: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };
  const fadeUp = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0.001, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const Word = ({ children }) => (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span variants={word} className="inline-block">
        {children}
      </motion.span>
    </span>
  );

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <FloatingMedia posters={posters} tags={HERO_TAGS} />
      <Container className="relative flex min-h-[78svh] flex-col items-center justify-center pb-16 pt-12 text-center md:pb-24 md:pt-16">
        <motion.div
          style={reduce ? undefined : { scale: exitScale, y: exitY, opacity: exitOpacity }}
          className="w-full"
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center md:px-[12%]"
          >
            <h1 className="font-heading text-hero font-bold tracking-tightest">
              <span className="block">
                {HERO_BOLD.map((w, i) => (
                  <span key={w}>
                    <Word>{w}</Word>
                    {i < HERO_BOLD.length - 1 && " "}
                  </span>
                ))}
              </span>
              <SerifItalic className="block">
                {HERO_SERIF.map((w, i) => (
                  <span key={w}>
                    <Word>{w}</Word>
                    {i < HERO_SERIF.length - 1 && " "}
                  </span>
                ))}
              </SerifItalic>
            </h1>
            <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg text-ink/70">
              A&amp;A Media creates engaging content that helps organizations connect with more
              people online.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
            >
              <Button to="/work">See our work</Button>
              <Button to="/about" variant="link">
                About us
              </Button>
            </motion.div>

            {/* Small screens: a simple row of posters instead of floating tiles. */}
            <motion.div variants={fadeUp} className="mt-12 grid w-full grid-cols-3 gap-3 md:hidden" aria-hidden="true">
              {posters.slice(0, 3).map((src) => (
                <div key={src} className="aspect-[4/5] overflow-hidden rounded-xl bg-mist">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function ClientStrip() {
  const reduce = useReducedMotion();
  const names = visibleClients.map((c) => c.name);
  const Name = ({ children }) => (
    <span className="whitespace-nowrap font-heading text-lg font-bold tracking-tight text-ink/60 sm:text-xl">
      {children}
    </span>
  );

  return (
    <section aria-label="Clients" className="border-y border-hairline">
      {/* Desktop: one quiet row. */}
      <Container className="hidden items-center justify-center gap-x-12 gap-y-3 py-7 md:flex md:flex-wrap">
        <Kicker className="text-ink/70">Work for</Kicker>
        {names.map((n) => (
          <Name key={n}>{n}</Name>
        ))}
      </Container>

      {/* Mobile: a slow marquee (static and wrapped for reduced motion). */}
      <div className="py-6 md:hidden">
        <Kicker className="px-4 text-center text-ink/70">Work for</Kicker>
        {reduce ? (
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 px-4">
            {names.map((n) => (
              <Name key={n}>{n}</Name>
            ))}
          </div>
        ) : (
          <div className="mt-3 overflow-hidden">
            <div className="marquee__track">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0 gap-10 pr-10" aria-hidden={half === 1}>
                  {[...names, ...names].map((n, i) => (
                    <Name key={i}>{n}</Name>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedWork({ openVideo }) {
  const [first, ...rest] = featuredVideos;
  if (!first) return null;
  // Open the player on the clicked video, with arrows stepping through the
  // rest of that client's videos.
  const open = (v) => {
    const list = videosFor(getClient(v.clientSlug));
    openVideo(list, Math.max(0, list.findIndex((x) => x.id === v.id)));
  };
  const card = (v, size) => (
    <VideoCard
      key={v.id}
      video={v}
      client={getClient(v.clientSlug)}
      size={size}
      className={size === "lg" ? "h-full" : ""}
      onOpen={() => open(v)}
    />
  );

  return (
    <section className="bg-fog">
      <Container className="py-16 sm:py-24">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading bold="Recent" serif="work." size="xl" />
          <Button to="/work" variant="link" className="shrink-0">
            View all work
          </Button>
        </Reveal>

        {/* Phones and tablets: big card on top, then two per row. Desktop: big
            card on the left (2x2) with four cards beside it. */}
        <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className={"col-span-2" + (rest.length >= 2 ? " lg:row-span-2" : "")}>
            {card(first, "lg")}
          </div>
          {rest.map((v) => card(v, "md"))}
        </Reveal>
      </Container>
    </section>
  );
}

// Partnerships that are underway but have no published videos yet.
const UPCOMING = [
  {
    name: "Newton Tree Conservancy",
    category: "Nonprofit",
    body: "We're in the process of partnering with Newton Tree Conservancy, the nonprofit that has planted thousands of street trees across Newton, to share their work and grow their community online.",
  },
];

function WhatsNext() {
  if (!UPCOMING.length) return null;
  return (
    <section className="bg-ink text-white">
      <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-16">
        <Reveal>
          <Kicker className="mb-4 text-white/60">Coming soon</Kicker>
          <SectionHeading bold="What's" serif="next." size="xl" />
          <p className="mt-6 max-w-md text-lg text-white/70">
            New partnerships we're building right now. Their stories are on the way.
          </p>
        </Reveal>
        <Reveal className="grid gap-4">
          {UPCOMING.map((u) => (
            <article
              key={u.name}
              className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-ink">
                  <Trees className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-medium">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" aria-hidden="true" />
                  In progress
                </span>
                <span className="text-sm text-white/60">{u.category}</span>
              </div>
              <h3 className="mt-6 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {u.name}
              </h3>
              <p className="mt-3 leading-relaxed text-white/70">{u.body}</p>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function WhatYouGet() {
  const sample = bentoVideo;
  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-24">
        <Reveal>
          <SectionHeading bold="What you" serif="get." size="xl" />
        </Reveal>
        <Reveal>
          <Bento className="mt-12">
            <BentoCard icon={Camera} title="Content creation">
              Professional photos and short form videos that showcase your organization and tell
              your story.
            </BentoCard>
            {sample && (
              <BentoVideoCard
                src={previewFor(sample)}
                poster={sample.poster}
                srcSet={posterSrcSet(sample)}
                label={sample.clientName}
                className="md:row-span-2"
              />
            )}
            <BentoCard icon={CalendarCheck} title="Social media management">
              We plan, post, and manage your content to keep your social media active and
              engaging.
            </BentoCard>
            <BentoCard icon={Target} title="Content strategy">
              We work with you to develop a content plan that aligns with your goals and reaches
              your audience.
            </BentoCard>
            <BentoCard tone="ink" title="Made for every platform">
              <ul className="mt-2 flex flex-wrap gap-2">
                {["Instagram", "TikTok", "Facebook", "YouTube Shorts", "LinkedIn"].map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-white/20 px-3 py-1 text-sm font-medium text-white"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </BentoCard>
          </Bento>
        </Reveal>
      </Container>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-fog">
      <Container className="py-16 sm:py-24">
        <Reveal>
          <SectionHeading bold="How it" serif="works." size="xl" />
        </Reveal>
        <Reveal className="mt-10">
          <Steps />
        </Reveal>
      </Container>
    </section>
  );
}

function ClosingBand() {
  const sample = closingVideo;
  const poster = sample && thumbFor(sample);
  const reduce = useReducedMotion();
  // The two halves of the line slide in from opposite sides and meet as the
  // band scrolls into view; the round photo spins in between them.
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  const leftX = useTransform(scrollYProgress, [0, 1], ["-18%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  const spin = useTransform(scrollYProgress, [0, 1], [-160, 0]);
  const pop = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const m = (style) => (reduce ? undefined : style);

  return (
    <section ref={ref} className="overflow-hidden bg-white">
      <Container className="py-16 text-center sm:py-24">
        <Reveal>
          <h2 className="mx-auto max-w-4xl font-heading text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-display tracking-tightest">
            <motion.span className="inline-block" style={m({ x: leftX })}>
              Have a story
            </motion.span>{" "}
            {poster && (
              <motion.span
                className="inline-block h-[0.85em] w-[0.85em] overflow-hidden rounded-full bg-mist align-[-0.08em]"
                style={m({ rotate: spin, scale: pop })}
                aria-hidden="true"
              >
                <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />
              </motion.span>
            )}{" "}
            <motion.span className="inline-block" style={m({ x: rightX })}>
              <SerifItalic>worth telling?</SerifItalic>
            </motion.span>
          </h2>
          <div className="mt-10">
            <Button to="/about#contact">Get in touch</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default function Home() {
  usePageTitle(
    "",
    "A&A Media makes short-form video and social content for local restaurants and nonprofits. See our work."
  );
  const [openVideo, modal] = useVideoModal();

  return (
    <>
      <Hero />
      <ClientStrip />
      <FeaturedWork openVideo={openVideo} />
      <WhatsNext />
      <WhatYouGet />
      <HowItWorks />
      <ClosingBand />
      {modal}
    </>
  );
}
