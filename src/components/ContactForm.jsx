import { useState } from "react";

// Replace YOUR_FORM_ID with the real ID from your Formspree account.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  // In-memory (session) flag — survives re-renders without localStorage,
  // so a repeat submit in the same session shows the success state.
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [emailError, setEmailError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();

    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setStatus("idle");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-hairline p-8 text-center">
        <p className="font-heading text-2xl font-bold tracking-tight">Thanks</p>
        <p className="mt-3 text-base text-ink/70">
          Thanks — we'll be in touch to set up your call.
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
        disabled={status === "sending"}
        className="w-full rounded-md border border-ink bg-ink px-7 py-4 text-base font-medium text-white transition-colors duration-200 hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink disabled:hover:text-white sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Book a call"}
      </button>

      {status === "error" && (
        <p className="text-sm text-ink">
          Something went wrong. Please try again, or email us directly.
        </p>
      )}
    </form>
  );
}
