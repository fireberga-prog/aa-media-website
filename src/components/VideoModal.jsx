import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

// Page-level helper: `openVideo(videos, index)` shows the player, and
// `modal` is the element to render once somewhere on the page.
export function useVideoModal() {
  const [state, setState] = useState({ videos: [], index: null });
  const openVideo = useCallback((videos, index = 0) => setState({ videos, index }), []);
  const close = useCallback(() => setState((s) => ({ ...s, index: null })), []);
  const setIndex = useCallback((index) => setState((s) => ({ ...s, index })), []);
  const modal = (
    <VideoModal videos={state.videos} index={state.index} onClose={close} onIndexChange={setIndex} />
  );
  return [openVideo, modal];
}

// Full-screen player. `videos` is one client's list (from videosFor), `index`
// the open one, or null when closed. Arrow keys step through the list.
export default function VideoModal({ videos, index, onClose, onIndexChange }) {
  const open = index !== null && index !== undefined && videos[index];
  return createPortal(
    <AnimatePresence>
      {open && (
        <ModalBody
          videos={videos}
          index={index}
          onClose={onClose}
          onIndexChange={onIndexChange}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

function ModalBody({ videos, index, onClose, onIndexChange }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const video = videos[index];
  const count = videos.length;
  const vertical = video.orientation !== "horizontal";

  const step = useCallback(
    (dir) => {
      if (count < 2) return;
      onIndexChange((index + dir + count) % count);
    },
    [count, index, onIndexChange]
  );

  // Remember what had focus (the card), lock page scroll, and put it all back
  // when the modal closes.
  useEffect(() => {
    const previous = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = scrollbar + "px";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        // Keep focus inside the dialog.
        const nodes = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? []);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.target instanceof HTMLVideoElement) {
        // Arrow keys on the focused player seek, as usual.
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  const playerStyle = vertical
    ? { width: "min(calc(85vh * 9 / 16), calc(100vw - 2rem))", aspectRatio: "9 / 16" }
    : { width: "min(calc(85vh * 16 / 9), calc(100vw - 2rem), 1200px)", aspectRatio: "16 / 9" };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.clientName}: ${video.title}`}
      className="on-dark fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-ink/95 px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </button>

      <figure className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <video
          key={video.id}
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          preload="auto"
          style={playerStyle}
          className="max-h-[85vh] rounded-xl bg-black object-contain"
        />
        <figcaption className="mt-4 flex w-full max-w-full items-center justify-between gap-4 text-white">
          <span className="min-w-0">
            <span className="block font-heading text-lg font-bold tracking-tight">
              {video.clientName}
            </span>
            <span className="block text-sm text-white/70">
              {video.title}
              {count > 1 && ` (${index + 1} of ${count})`}
            </span>
          </span>
          {count > 1 && (
            <span className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous video"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next video"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          )}
        </figcaption>
      </figure>
    </motion.div>
  );
}
