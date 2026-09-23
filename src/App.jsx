import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";

// Other pages load on demand so the Home page ships less JavaScript.
const Work = lazy(() => import("./pages/Work.jsx"));
const ClientPage = lazy(() => import("./pages/ClientPage.jsx"));
const About = lazy(() => import("./pages/About.jsx"));

export default function App() {
  const location = useLocation();
  const reduce = useReducedMotion();
  // No fade on the very first page load, only between pages.
  const firstLoad = useRef(true);
  useEffect(() => {
    firstLoad.current = false;
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col font-body">
        <Nav />
        {/* 200ms fade between pages. Keyed on the path only, so filter
            changes on /work don't re-fade the page. */}
        <motion.main
          id="main"
          key={location.pathname}
          className="flex-1"
          initial={reduce || firstLoad.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<ClientPage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
