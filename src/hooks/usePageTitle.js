import { useEffect } from "react";

const SITE = "A&A Media";
const DEFAULT_DESCRIPTION =
  "A&A Media makes short-form video and social content for local restaurants and nonprofits.";

// Sets the tab title ("Lockheart | A&A Media") and the meta description for
// the current page.
export default function usePageTitle(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);
}
