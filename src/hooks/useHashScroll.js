import { useEffect } from "react";

// Deep-links to the current URL #hash target, robust to two things that
// otherwise leave the page at the top / short of the target:
//  1) App-Router's post-navigation scroll-to-top + `html{scroll-behavior:smooth}`
//     interrupt a one-shot smooth scroll — so we scroll INSTANTLY.
//  2) The page grows as async data/images load, so a scroll computed early gets
//     clamped to the (then-shorter) page height. We therefore RE-ASSERT until the
//     anchor is actually parked at the nav offset for two consecutive frames
//     (converged), then stop so we never fight the user afterward.
// Pass the data that gates the sections as `dep` so it also re-runs on load.
export function useHashScroll(dep) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const NAV_OFFSET = 120; // park the heading just below the sticky navbar
    let n = 0;
    let settled = 0;
    let timer;

    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (Math.abs(top - NAV_OFFSET) > 8) {
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto"; // instant — smooth gets interrupted
          window.scrollTo(0, Math.max(0, top + window.scrollY - NAV_OFFSET));
          root.style.scrollBehavior = prev;
          settled = 0;
        } else {
          settled += 1;
        }
      }
      // Keep correcting (up to ~3s) until parked for 2 frames, then stop.
      if (settled < 2 && ++n < 30) timer = setTimeout(tick, 100);
    };

    timer = setTimeout(tick, 50);
    return () => clearTimeout(timer);
  }, [dep]);
}
