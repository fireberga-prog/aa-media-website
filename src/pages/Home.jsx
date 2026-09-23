import { motion, useReducedMotion } from "framer-motion";
import { Camera, CalendarCheck, Target } from "lucide-react";
import {
  allVideos,
  featuredClients,
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

// Split into words so each can rise in on a stagger.
const HERO_BOLD = ["Growing", "communities"];
const HERO_SERIF = ["through", "creative", "media."];

function Hero() {
  const reduce = useReducedMotion();
  const posters = allVideos.map(thumbFor).filter(Boolean);

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
    <section className="relative overflow-hidden">
      <FloatingMedia posters={posters} tags={HERO_TAGS} />
      <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-20 text-center md:py-28">
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
  const [first, ...rest] = featuredClients;
  if (!first) return null;
  const tall = rest.length >= 2;

  return (
    <section className="bg-fog">
      <Container className="py-24 sm:py-32">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading bold="Recent" serif="work." size="xl" />
          <Button to="/work" variant="link" className="shrink-0">
            View all work
          </Button>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 md:grid-cols-3">
          <div className={"md:col-span-2" + (tall ? " md:row-span-2" : "")}>
            <VideoCard
              video={first.videos[0]}
              client={first}
              size="lg"
              className="h-full"
              onOpen={() => openVideo(videosFor(first), 0)}
            />
          </div>
          {rest.map((c) => (
            <VideoCard
              key={c.slug}
              video={c.videos[0]}
              client={c}
              onOpen={() => openVideo(videosFor(c), 0)}
            />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function WhatYouGet() {
  const sample = allVideos[0];
  return (
    <section className="bg-white">
      <Container className="py-24 sm:py-32">
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
      <Container className="py-24 sm:py-32">
        <Reveal>
          <SectionHeading bold="How it" serif="works." size="xl" />
        </Reveal>
        <Reveal className="mt-14">
          <Steps />
        </Reveal>
      </Container>
    </section>
  );
}

function ClosingBand() {
  const sample = allVideos[1] || allVideos[0];
  const poster = sample && thumbFor(sample);
  return (
    <section className="bg-white">
      <Container className="py-24 text-center sm:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-4xl font-heading text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-display tracking-tightest">
            Have a story{" "}
            {poster && (
              <span
                className="inline-block h-[0.85em] w-[0.85em] translate-y-[0.08em] overflow-hidden rounded-full bg-mist align-baseline"
                aria-hidden="true"
              >
                <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />
              </span>
            )}{" "}
            <SerifItalic>worth telling?</SerifItalic>
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
      <WhatYouGet />
      <HowItWorks />
      <ClosingBand />
      {modal}
    </>
  );
}
