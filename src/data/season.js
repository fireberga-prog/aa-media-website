// src/data/season.js
// Seasonal theme. It turns itself on and off by date, so there is nothing to
// undo after the holiday. To turn it off early, set `enabled: false`.
//
// While it is on, a "Happy Thanksgiving" banner shows above the nav
// (src/components/SeasonBanner.jsx) and leaves drift down behind the Home
// hero (src/components/FallingLeaves.jsx).

export const THANKSGIVING = {
  enabled: true,
  start: "2026-11-01", // first day it shows
  end: "2026-12-01", // first day it is gone again
};

export function isThanksgivingSeason(now = new Date()) {
  if (!THANKSGIVING.enabled) return false;
  // Compare local calendar dates as YYYY-MM-DD strings.
  const pad = (n) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return today >= THANKSGIVING.start && today < THANKSGIVING.end;
}
