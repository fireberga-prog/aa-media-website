import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Instagram } from "lucide-react";
import { coverFor, getClient, visibleClients } from "../data/clients.js";
import usePageTitle from "../hooks/usePageTitle.js";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading, { Kicker } from "../components/SectionHeading.jsx";
import ClientCard from "../components/ClientCard.jsx";
import { useVideoModal } from "../components/VideoModal.jsx";
import { ServiceTags, VideoGrid } from "./Work.jsx";
import NotFound from "./NotFound.jsx";

export default function ClientPage() {
  const { slug } = useParams();
  const client = getClient(slug);
  if (!client || client.videos.length === 0) return <NotFound />;
  // Keyed so switching between clients resets the page state.
  return <ClientView key={client.slug} client={client} />;
}

function ClientView({ client }) {
  usePageTitle(
    client.name,
    client.summary ||
      `${client.category} work by A&A Media for ${client.name}. Watch the videos.`
  );
  const [openVideo, modal] = useVideoModal();
  const cover = coverFor(client);
  const count = client.videos.length;
  const more = visibleClients.filter((c) => c.slug !== client.slug).slice(0, 3);

  return (
    <>
      <section className="bg-white">
        <Container className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All work
          </Link>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-mist md:mx-0 md:max-w-none">
              {cover && (
                <img
                  src={cover}
                  alt={`Still from ${client.name} video`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <Reveal>
              <Kicker className="text-ink/70">{client.category}</Kicker>
              <h1 className="mt-4 font-heading text-[clamp(2.75rem,6vw,5rem)] font-bold leading-display tracking-tightest">
                {client.name}
              </h1>
              {client.location && <p className="mt-4 text-lg text-ink/70">{client.location}</p>}
              {client.summary && (
                <p className="mt-5 max-w-[50ch] text-lg text-ink/70">{client.summary}</p>
              )}
              <ServiceTags services={client.services} className="mt-6" />
              <p className="mt-6 text-sm font-semibold text-ink/70">
                {count} {count === 1 ? "video" : "videos"}
              </p>
              {client.instagram && (
                <a
                  href={client.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 font-semibold underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  {client.name} on Instagram
                </a>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-fog" aria-labelledby="videos-heading">
        <Container className="py-16 sm:py-24">
          <h2 id="videos-heading" className="sr-only">
            Videos
          </h2>
          <div className="mx-auto max-w-4xl">
            <VideoGrid client={client} openVideo={openVideo} />
          </div>
        </Container>
      </section>

      {more.length > 0 && (
        <section className="bg-white">
          <Container className="py-20 sm:py-28">
            <Reveal>
              <SectionHeading bold="More" serif="work." size="lg" />
            </Reveal>
            <Reveal className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((c) => (
                <ClientCard key={c.slug} client={c} />
              ))}
            </Reveal>
            <Link
              to="/work"
              className="mt-12 inline-flex items-center gap-1.5 font-semibold underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all work
            </Link>
          </Container>
        </section>
      )}

      {modal}
    </>
  );
}
