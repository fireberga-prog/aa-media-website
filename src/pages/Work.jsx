import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categoryKey, videosFor, visibleClients } from "../data/clients.js";
import usePageTitle from "../hooks/usePageTitle.js";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading, { Kicker } from "../components/SectionHeading.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { useVideoModal } from "../components/VideoModal.jsx";

// Filter chips. `value` is what goes in the URL (?type=restaurant).
const FILTERS = [
  { value: "", label: "All" },
  { value: "restaurant", label: "Restaurants" },
  { value: "nonprofit", label: "Nonprofits" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// Vertical videos sit 3 across, horizontal ones 2 across.
export function VideoGrid({ client, openVideo }) {
  const list = videosFor(client);
  const vertical = list.filter((v) => v.orientation !== "horizontal");
  const horizontal = list.filter((v) => v.orientation === "horizontal");
  const card = (v) => (
    <VideoCard
      key={v.id}
      video={v}
      client={client}
      onOpen={() => openVideo(list, list.indexOf(v))}
    />
  );
  return (
    <div className="space-y-4">
      {vertical.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{vertical.map(card)}</div>
      )}
      {horizontal.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">{horizontal.map(card)}</div>
      )}
    </div>
  );
}

export function ServiceTags({ services, className = "" }) {
  if (!services?.length) return null;
  return (
    <ul className={"flex flex-wrap gap-2 " + className}>
      {services.map((s) => (
        <li key={s} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-ink ring-1 ring-hairline">
          {s}
        </li>
      ))}
    </ul>
  );
}

function ClientSection({ client, shaded, openVideo }) {
  const count = client.videos.length;
  return (
    <section
      id={client.slug}
      aria-labelledby={client.slug + "-name"}
      className={"work-section " + (shaded ? "bg-mist" : "bg-white")}
    >
      <Container className="grid gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <Kicker className="text-ink/70">{client.category}</Kicker>
            <h2
              id={client.slug + "-name"}
              className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] font-bold leading-display tracking-tightest"
            >
              {client.name}
            </h2>
            {client.location && <p className="mt-3 text-ink/70">{client.location}</p>}
            {client.summary && <p className="mt-4 max-w-[45ch] text-ink/70">{client.summary}</p>}
            <ServiceTags services={client.services} className="mt-5" />
            <p className="mt-5 text-sm font-semibold text-ink/70">
              {count} {count === 1 ? "video" : "videos"}
            </p>
            <Link
              to={`/work/${client.slug}`}
              className="group mt-4 inline-flex items-center gap-1.5 font-semibold underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink"
            >
              Open client page
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-8">
          <VideoGrid client={client} openVideo={openVideo} />
        </div>
      </Container>
    </section>
  );
}

export default function Work() {
  usePageTitle(
    "Our work",
    "Every A&A Media video, organized by the restaurants and nonprofits we made it with."
  );
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const [openVideo, modal] = useVideoModal();

  const type = FILTERS.some((f) => f.value === params.get("type")) ? params.get("type") : "";
  const shown = type
    ? visibleClients.filter((c) => categoryKey(c.category) === type)
    : visibleClients;

  function setType(value) {
    const next = new URLSearchParams(params);
    if (value) next.set("type", value);
    else next.delete("type");
    setParams(next, { replace: true });
  }

  return (
    <>
      <header className="bg-white">
        <Container className="pb-8 pt-12 sm:pt-16">
          <Reveal>
            <SectionHeading as="h1" bold="Our" serif="work." size="xl" />
            <p className="mt-6 max-w-xl text-lg text-ink/70">
              Every video, organized by the people we made it with.
            </p>
          </Reveal>

          <div role="group" aria-label="Filter by type" className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f.value === type;
              return (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setType(f.value)}
                  aria-pressed={active}
                  className={
                    "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors " +
                    (active ? "bg-accent text-ink" : "bg-mist text-ink/70 hover:text-ink")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Container>
      </header>

      {/* Jump nav: sticks under the main nav while scrolling. */}
      <nav
        aria-label="Clients"
        className="sticky top-16 z-40 border-y border-hairline bg-white/90 backdrop-blur-md"
      >
        <Container className="no-scrollbar flex gap-6 overflow-x-auto py-3">
          {shown.map((c) => (
            <a
              key={c.slug}
              href={"#" + c.slug}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(c.slug);
              }}
              className="whitespace-nowrap text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
            >
              {c.name}
            </a>
          ))}
        </Container>
      </nav>

      <LayoutGroup>
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((c, i) => (
            <motion.div
              key={c.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ClientSection client={c} shaded={i % 2 === 0} openVideo={openVideo} />
            </motion.div>
          ))}
        </AnimatePresence>
      </LayoutGroup>

      {shown.length === 0 && (
        <Container className="py-24 text-center text-ink/70">Nothing here yet.</Container>
      )}

      {modal}
    </>
  );
}
