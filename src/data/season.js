// src/data/season.js
// Seasonal theme. It turns itself on and off by date, so there is nothing to
// undo after the holiday. To turn it off early, set `enabled: false`.
//
// While it is on:
//   - the lime accent becomes a warm autumn amber (see index.css)
//   - a thin "Happy Thanksgiving" banner shows above the nav
//   - a few leaves drift down behind the Home hero

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
