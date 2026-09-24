import { useState } from "react";
import { Plus } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle.js";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Steps from "../components/Steps.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { CONTACT_EMAIL, SocialLinks } from "../components/Social.jsx";

/* The team. `focus` sets how the photo is framed inside the card (CSS
   object-position); nudge it if a face sits too high or low. */
const TEAM = [
  { name: "Andrew", role: "Co-founder", photo: "/team/andrew.jpg", focus: "center top" },
  { name: "Alex", role: "Co-founder", photo: "/team/alex.jpg", focus: "center center" },
];

const FAQ = [
  {
    q: "How much does it cost?",
    a: "Pricing varies based on your needs and goals. We start with a complimentary trial video so you can experience our work before making any commitment. Additionally, we are passionate about supporting our community and offer free services to nonprofits and charitable organizations.",
  },
  {
    q: "What do you need from me to get started?",
    a: "Just bring your ideas. We'll listen to your goals, learn about your business, and work alongside you to create content that represents your brand.",
  },
  {
    q: "How fast will I see results?",
    a: "After meeting with you, we'll develop a content plan and usually begin filming within a week. Growing on social media takes consistency, and we'll work with you to create content that keeps your audience engaged.",
  },
  {
    q: "Which platforms do you cover?",
    a: "We're happy to work across any social media platform. We have the most experience with Instagram and TikTok, but our content can be adapted for Facebook, YouTube Shorts, LinkedIn, and more.",
  },
];

function TeamCard({ name, role, photo, focus }) {
  return (
    <figure className="group">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
        <img
          src={photo}
          alt={`${name}, ${role.toLowerCase()} of A&A Media`}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: focus }}
          className="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <span className="font-heading text-2xl font-bold tracking-tight">{name}</span>
        <span className="text-xs font-semibold uppercase tracking-kicker text-ink/70">{role}</span>
      </figcaption>
    </figure>
  );
}

function FaqItem({ id, question, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-mist">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-6 rounded-2xl px-6 py-5 text-left"
        >
          <span className="text-base font-semibold sm:text-lg">{question}</span>
          <span
            className={
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-[transform,background-color] duration-300 " +
              (open ? "rotate-45 bg-accent" : "bg-white")
            }
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </span>
        </button>
      </h3>
      <div id={id} className={"faq-panel " + (open ? "is-open" : "")}>
        <div className="faq-panel-inner">
          <p className="max-w-[65ch] px-6 pb-6 text-base text-ink/70">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  usePageTitle(
    "About us",
    "A&A Media is a creative media agency founded by two high school students. Meet the team and get in touch."
  );

  return (
    <>
      <header className="bg-white">
        <Container className="pb-8 pt-12 sm:pt-16">
          <Reveal>
            <SectionHeading as="h1" bold="About" serif="us." size="xl" />
          </Reveal>
        </Container>
      </header>

      {/* Story */}
      <section className="bg-white" aria-label="Our story">
        <Container className="grid gap-10 pb-16 sm:pb-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="font-heading text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-tight">
              A creative media agency founded by{" "}
              <span className="underline decoration-accent decoration-[0.18em] underline-offset-[0.12em] [text-decoration-skip-ink:none]">
                two high school students
              </span>
              .
            </p>
          </Reveal>
          <Reveal className="max-w-[60ch] space-y-5 text-lg text-ink/70 lg:col-span-7">
            <p>
              A&amp;A Media is a creative media agency founded by two high school students with a
              passion for storytelling, digital marketing, and making a positive impact in our
              community.
            </p>
            <p>
              Our mission is to help local nonprofits, charities, and small businesses grow their
              online presence through engaging short-form videos and social media content. We
              believe every organization has a story worth sharing, and our goal is to help those
              stories reach more people.
            </p>
            <p>
              By combining creativity with thoughtful strategy, we create content that not only
              looks professional but also helps organizations expand their reach, strengthen their
              brand, and connect with the communities they serve.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-fog">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <SectionHeading bold="The" serif="team." size="lg" />
          </Reveal>
          <Reveal className="mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 sm:gap-8">
            {TEAM.map((m) => (
              <TeamCard key={m.name} {...m} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* How we work */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <SectionHeading bold="How we" serif="work." size="lg" />
          </Reveal>
          <Reveal className="mt-12">
            <Steps compact />
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-fog">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading bold="Questions," serif="answered." size="lg" stacked />
          </Reveal>
          <Reveal className="space-y-3 lg:col-span-8">
            {FAQ.map((item, i) => (
              <FaqItem key={item.q} id={"faq-" + i} question={item.q}>
                {item.a}
              </FaqItem>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading bold="Get in" serif="touch." size="lg" />
            <p className="mt-6 text-lg text-ink/70">
              Tell us a bit about your business and we'll set up a call.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-block font-heading text-[clamp(1.125rem,2vw,1.5rem)] [overflow-wrap:anywhere] font-bold tracking-tight underline decoration-accent decoration-[3px] underline-offset-8 transition-colors hover:decoration-ink"
            >
              {CONTACT_EMAIL}
            </a>
            <SocialLinks className="mt-8" />
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
