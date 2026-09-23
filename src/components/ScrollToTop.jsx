import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Every navigation starts at the top of the page. A hash (e.g. /about#contact)
// scrolls to that element instead, once the new page has rendered.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let frame;
    const find = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" });
      } else if (tries++ < 30) {
        frame = requestAnimationFrame(find);
      }
    };
    find();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
