import { Link } from "react-router-dom";
import { isThanksgivingSeason } from "../data/season.js";

// Thin holiday strip above the nav. Shows only during the season.
export default function SeasonBanner() {
  if (!isThanksgivingSeason()) return null;
  return (
    <div className="on-dark bg-ink px-4 py-2 text-center text-[13px] font-semibold text-white sm:text-sm">
      <span aria-hidden="true">🍂 </span>
      Happy Thanksgiving from A&amp;A Media.{" "}
      <span className="hidden sm:inline">We're grateful for every table we got to film at. </span>
      <Link
        to="/work/centre-street-food-pantry?video=csfp-thanksgiving-mission"
        className="whitespace-nowrap text-accent underline decoration-1 underline-offset-4 hover:text-white"
      >
        Watch our Thanksgiving work
      </Link>
    </div>
  );
}
