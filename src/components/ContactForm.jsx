import { useState } from "react";

// Where inquiries go. Submitting opens the visitor's email app with the form
// details pre-filled and addressed here — no third-party form service or
// backend to set up, so it can't error out. (If you'd rather submissions land
// in your inbox automatically without the visitor's mail app, swap this for a
// Formspree/Web3Forms endpoint — ask and it's a small change.)
const CONTACT_EMAIL = "officialaandamedia@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  // In-memory (session) flag — survives re-renders without localStorage,
  // so a repeat submit in the same session shows the success state.
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

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
    const subject = `New inquiry${business ? ` — ${business}` : ""}${
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
      <div className="rounded-md border border-hairline p-8 text-center">
        <p className="font-heading text-2xl font-bold tracking-tight">
          Almost there
        </p>
        <p className="mt-3 text-base text-ink/70">
          Your email is ready in your mail app — just hit send and we'll be in
          touch to set up your call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-md border border-hairline px-4 py-3 text-base outline-none transition focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="business" className="block text-sm font-medium">
          Business name
        </label>
        <input
          id="business"
          name="business"
          type="text"
          required
          autoComplete="organization"
          className="mt-2 w-full rounded-md border border-hairline px-4 py-3 text-base outline-none transition focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={emailError ? "true" : "false"}
          className="mt-2 w-full rounded-md border border-hairline px-4 py-3 text-base outline-none transition focus:border-ink"
        />
        {emailError && (
          <p className="mt-2 text-sm text-ink">{emailError}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          What do you need help with?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2 w-full resize-y rounded-md border border-hairline px-4 py-3 text-base outline-none transition focus:border-ink"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md border border-ink bg-ink px-7 py-4 text-base font-medium text-white transition-colors duration-200 hover:bg-white hover:text-ink sm:w-auto"
      >
        Book a call
      </button>
    </form>
  );
}
