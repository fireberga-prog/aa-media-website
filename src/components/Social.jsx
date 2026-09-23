import { Instagram } from "lucide-react";

export const CONTACT_EMAIL = "officialaandamedia@gmail.com";

// Original outline TikTok glyph drawn to match lucide's stroke style
// (lucide ships an Instagram icon but no TikTok one).
export function TikTokIcon({ className = "", strokeWidth = 1.5 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 4v10.5a4.5 4.5 0 1 1-4.5-4.5" />
      <path d="M14 4a6 6 0 0 0 6 6" />
    </svg>
  );
}

// The real A&A profiles.
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/aand.amedia/", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@aa.media98", Icon: TikTokIcon },
];

export function SocialLinks({ className = "", dark = false }) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"A&A Media on " + label}
          className={
            "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 " +
            (dark
              ? "border-white/20 text-white hover:border-white hover:bg-white hover:text-ink"
              : "border-hairline text-ink hover:border-ink hover:bg-ink hover:text-white")
          }
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}
