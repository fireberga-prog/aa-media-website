import { allVideos } from "../data/clients.js";
import { isThanksgivingSeason } from "../data/season.js";
import { useVideoModal } from "./VideoModal.jsx";

// November highlights the banner link plays, in order. A mix of clients;
// any id that no longer exists is skipped.
const HIGHLIGHT_VIDEOS = [
  "csfp-thanksgiving-mission", // Centre Street: Bringing Thanksgiving to every table
  "cc-three-things-to-expect", // Children's Cove: Three things to expect
  "ntc-jen-interview", // Newton Tree Conservancy: Jen
  "csfp-thanksgiving", // Centre Street: Thanksgiving at the pantry
  "cc-circle-of-security", // Children's Cove: Circle of Security
  "ntc-dan-interview", // Newton Tree Conservancy: Dan
];

// Holiday strip above the nav. Shows only during the season.
export default function SeasonBanner() {
  const [openVideo, modal] = useVideoModal();
  if (!isThanksgivingSeason()) return null;

  const list = HIGHLIGHT_VIDEOS.map((id) => allVideos.find((v) => v.id === id)).filter(Boolean);

  return (
    <div className="on-dark bg-ink px-4 py-3 text-center text-sm font-semibold text-white sm:py-3.5 sm:text-base">
      <span aria-hidden="true">🍂 </span>
      Happy Thanksgiving from A&amp;A Media.{" "}
      <span className="hidden sm:inline">We're grateful for all the people we got to help this year. </span>
      {list.length > 0 && (
        <button
          type="button"
          onClick={() => openVideo(list, 0)}
          className="whitespace-nowrap font-semibold text-[#F2A63A] underline decoration-1 underline-offset-4 hover:text-white"
        >
          Watch some of our November highlights
        </button>
      )}
      {modal}
    </div>
  );
}
