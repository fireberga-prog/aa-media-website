// Subtle inline "AA peaks" mark — two thin overlapping mountain peaks echoing the logo.
// Used ONLY as a quiet, low-opacity background motif (just the peaks, no wordmark).
// The actual brand logo is the image file public/aa-media-logo.png.
export default function PeaksMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      stroke="#0A0A0A"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M40 100 L85 25 L130 100" />
      <path d="M70 100 L115 25 L160 100" />
    </svg>
  );
}
