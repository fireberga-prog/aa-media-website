import { getClient, videosFor } from "../data/clients.js";
import { isThanksgivingSeason } from "../data/season.js";
import { useVideoModal } from "./VideoModal.jsx";

// The videos the banner link plays, in order (Centre Street Food Pantry).
const THANKSGIVING_VIDEOS = ["csfp-thanksgiving-mission", "csfp-thanksgiving"];

// Thin holiday strip above the nav. Shows only during the season.
export default function SeasonBanner() {
  const [openVideo, modal] = useVideoModal();
  if (!isThanksgivingSeason()) return null;

  const all = videosFor(getClient("centre-street-food-pantry"));
  const list = THANKSGIVING_VIDEOS.map((id) => all.find((v) => v.id === id)).filter(Boolean);

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
          Watch our Thanksgiving work
        </button>
      )}
      {modal}
    </div>
  );
}
