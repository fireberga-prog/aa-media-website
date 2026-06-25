import ContactForm from "./components/ContactForm.jsx";
import PeaksMark from "./components/PeaksMark.jsx";

function scrollToContact(e) {
  e.preventDefault();
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function BookButton({ className = "" }) {
  return (
    <a
      href="#contact"
      onClick={scrollToContact}
      className={
        "inline-block rounded-md bg-ink px-6 py-3 text-base font-medium text-white transition hover:bg-ink/85 " +
        className
      }
    >
      Book a call
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center">
          {/* Logo image — drop your file at /public/logo.png */}
          <img src="/logo.png" alt="A&A Media" className="h-9 w-auto sm:h-10" />
        </a>
        <BookButton className="px-5 py-2.5 text-sm" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Large, subtle peaks accent */}
      <PeaksMark className="pointer-events-none absolute -right-10 -top-6 h-48 w-80 opacity-[0.06] sm:h-72 sm:w-[28rem]" />
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-light uppercase leading-tight tracking-wide sm:text-5xl">
            Short-form content that grows your social media.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            A&amp;A Media films promotional video and builds your social accounts
            — so your business gets seen.
          </p>
          <div className="mt-10">
            <BookButton className="px-8 py-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ title, children }) {
  return (
    <div>
      <h3 className="font-heading text-lg uppercase tracking-wide">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-ink/70">{children}</p>
    </div>
  );
}

function WhatWeDo() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="font-heading text-2xl uppercase tracking-wide sm:text-3xl">
          What we do
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          <Pillar title="Short-form promo content">
            We film short, scroll-stopping promotional videos for your business —
            the kind that actually performs on Reels, TikTok, and Shorts.
          </Pillar>
          <Pillar title="Social media growth">
            We run and grow your social accounts — posting consistently and
            on-brand, so your reach and following climb over time.
          </Pillar>
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, children }) {
  return (
    <div>
      <div className="font-heading text-4xl font-light text-ink/30">{number}</div>
      <h3 className="mt-4 font-heading text-lg uppercase tracking-wide">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-ink/70">{children}</p>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="font-heading text-2xl uppercase tracking-wide sm:text-3xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-12">
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
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="font-heading text-2xl uppercase tracking-wide sm:text-3xl">
          Who's behind A&amp;A
        </h2>
        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-ink/70">
          <p>
            A&amp;A Media is run by Alex and Andrew. We're a small, hands-on team
            — which means you work directly with the people making your content,
            not a faceless agency.
          </p>
          {/* [ABOUT PLACEHOLDER — Alex & Andrew: add 1–2 real sentences on your
              background and why you started A&A. Do not invent anything.] */}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, children }) {
  return (
    <details className="group border-b border-hairline py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-base font-medium">{question}</span>
        <span className="font-heading text-xl text-ink/40 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 text-base leading-relaxed text-ink/70">{children}</div>
    </details>
  );
}

function Faq() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="font-heading text-2xl uppercase tracking-wide sm:text-3xl">
          FAQ
        </h2>
        <div className="mt-10">
          <FaqItem question="How much does it cost?">
            {/* [PLACEHOLDER — real pricing] */}
          </FaqItem>
          <FaqItem question="Are there contracts?">
            {/* [PLACEHOLDER — real answer] */}
          </FaqItem>
          <FaqItem question="What do you need from me to get started?">
            {/* [PLACEHOLDER — e.g. account access, brand info] */}
          </FaqItem>
          <FaqItem question="How fast will I see results?">
            {/* [PLACEHOLDER — honest answer, no guarantees] */}
          </FaqItem>
          <FaqItem question="Which platforms do you cover?">
            {/* [PLACEHOLDER — confirm; likely Instagram, TikTok, YouTube Shorts, Facebook] */}
          </FaqItem>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-hairline">
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="font-heading text-2xl uppercase tracking-wide sm:text-3xl">
          Ready to grow your socials?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          Tell us a bit about your business and we'll set up a call.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <img src="/logo.png" alt="A&A Media" className="h-9 w-auto" />
        <div className="text-sm text-ink/60">
          {/* [PLACEHOLDER — real A&A email] */}
          <a href="mailto:hello@aamedia.com" className="hover:text-ink">
            hello@aamedia.com
          </a>
          <span className="mx-3 text-hairline">|</span>
          <span>© 2026 A&amp;A Media.</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="font-body">
      <Nav />
      <main>
        <Hero />
        <WhatWeDo />
        <HowItWorks />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
