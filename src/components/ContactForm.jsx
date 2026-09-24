import { useState } from "react";
import { ArrowSquare } from "./Button.jsx";
import { useMagnetic } from "../hooks/usePointerEffects.js";
import { CONTACT_EMAIL } from "./Social.jsx";

// Submitting opens the visitor's email app with the form details pre-filled
// and addressed to CONTACT_EMAIL. No third-party form service or backend to
// set up, so it can't error out. (If you'd rather submissions land in your
// inbox automatically without the visitor's mail app, swap this for a
// Formspree/Web3Forms endpoint.)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD =
  "mt-2 w-full rounded-xl border border-transparent bg-mist px-4 py-3.5 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink focus:ring-offset-2";

export default function ContactForm() {
  // In-memory (session) flag, so a repeat submit in the same session shows
  // the success state.
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const magnetic = useMagnetic(0.2);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value.trim();
    const business = form.business.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    // Build a pre-filled email and hand off to the visitor's mail app.
    const subject = `New inquiry${business ? ` from ${business}` : ""}${
      name ? ` (${name})` : ""
    }`;
    const body =
      `Name: ${name}\n` +
      `Business: ${business}\n` +
      `Email: ${email}\n\n` +
      `${message}\n`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-mist p-8 text-center" role="status">
        <p className="font-heading text-2xl font-bold tracking-tight">Almost there</p>
        <p className="mt-3 text-base text-ink/70">
          Your email is ready in your mail app. Just hit send and we'll be in
          touch to set up your call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">
            Name
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={FIELD} />
        </div>

        <div>
          <label htmlFor="business" className="block text-sm font-semibold">
            Business name
          </label>
          <input
            id="business"
            name="business"
            type="text"
            required
            autoComplete="organization"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={emailError ? "true" : "false"}
          aria-describedby={emailError ? "email-error" : undefined}
          className={FIELD}
        />
        {emailError && (
          <p id="email-error" className="mt-2 text-sm font-medium text-ink">
            {emailError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold">
          What do you need help with?
        </label>
        <textarea id="message" name="message" rows={5} required className={FIELD + " resize-y"} />
      </div>

      <button
        type="submit"
        ref={magnetic.ref}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        className="group inline-flex items-center gap-4 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-[transform,background-color] duration-300 ease-out hover:bg-ink/85 motion-reduce:transition-none"
      >
        Book a call
        <ArrowSquare />
      </button>
    </form>
  );
}
