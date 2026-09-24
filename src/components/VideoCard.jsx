import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { posterSrcSet, previewFor } from "../data/clients.js";
import { pointerEffectsOn as canPreview, useTilt } from "../hooks/usePointerEffects.js";

// Poster card for one video. Shows the still, plays the short muted
// `.preview.mp4` on hover, and opens the full video (in VideoModal) on click.
// size: "lg" fills its grid area on desktop (used for the big featured card).
export default function VideoCard({ video, client, size = "md", onOpen, eager = false, className = "" }) {
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState(false);
  const previewRef = useRef(null);
  const tilt = useTilt(size === "lg" ? 3 : 6);
  const preview = previewFor(video);
  const vertical = video.orientation !== "horizontal";

  useEffect(() => {
    if (!hovering) setPlaying(false);
  }, [hovering]);

  const ratio = vertical ? "aspect-[9/16]" : "aspect-video";
  // The big card fills its 2x2 grid area on desktop; on smaller screens it
  // uses a 4:5 frame so it doesn't get too tall.
  const frame =
    size === "lg" ? (vertical ? "aspect-[4/5]" : ratio) + " lg:aspect-auto lg:h-full" : ratio;

  return (
    <button
      type="button"
      onClick={onOpen}
      ref={tilt.ref}
      data-cursor="Play"
      onPointerMove={tilt.onPointerMove}
      onMouseEnter={() => preview && canPreview() && setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        tilt.onPointerLeave();
      }}
      aria-label={`Play ${client.name} video${client.videos.length > 1 ? `: ${video.title}` : ""}`}
      className={
        "group relative block w-full overflow-hidden rounded-2xl bg-mist text-left transition-[transform,box-shadow] duration-300 ease-out [transform-style:preserve-3d] hover:shadow-[0_20px_40px_-12px_rgba(10,10,10,0.35)] motion-reduce:transition-none " +
        frame +
        " " +
        className
      }
    >
      <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        {video.poster && (
          <img
            src={video.poster}
            srcSet={posterSrcSet(video)}
            sizes={size === "lg" ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"}
            alt={`Still from ${client.name} video`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        {hovering && (
          <video
            ref={previewRef}
            src={preview}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            onPlaying={() => setPlaying(true)}
            className={
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-200 " +
              (playing ? "opacity-100" : "opacity-0")
            }
            aria-hidden="true"
          />
        )}
      </div>

      {/* Soft light that follows the cursor (position set by useTilt). */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.22), transparent 45%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom gradient keeps the white label readable on any frame. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />

      <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-kicker text-ink backdrop-blur">
        {client.category}
      </span>

      {playing && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          Preview
        </span>
      )}

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <span className="min-w-0">
          <span
            className={
              "block font-heading font-bold leading-tight tracking-tight text-white " +
              (size === "lg" ? "text-2xl sm:text-3xl" : "text-lg")
            }
          >
            {client.name}
          </span>
          {client.videos.length > 1 && (
            <span className="mt-0.5 block truncate text-sm text-white/80">{video.title}</span>
          )}
        </span>
        <span
          className={
            "inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-ink " +
            (size === "lg" ? "h-14 w-14" : "h-11 w-11")
          }
          aria-hidden="true"
        >
          <Play className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} fill="currentColor" strokeWidth={0} />
        </span>
      </span>
    </button>
  );
}
