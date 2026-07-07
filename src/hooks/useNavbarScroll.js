"use client";
import { useEffect, useState } from "react";

/**
 * Hide-on-scroll-down / reveal-on-scroll-up for the sticky navbar.
 *
 * Flicker-proof by design:
 *  - requestAnimationFrame instead of a lagging throttle (one state read per frame)
 *  - an 8px dead-band so tiny scroll jitter never toggles the nav
 *  - rubber-band (negative) scroll is clamped, so bouncing at the top of the
 *    page on macOS/iOS can't flip the state
 *  - the nav is only allowed to hide well past the header (>140px), and is
 *    always forced visible near the top (<80px)
 *
 * The navbar itself must be `position: sticky` — it never leaves the document
 * flow, so showing/hiding is a pure GPU transform and the page never jumps.
 */
export const useNavbarScroll = () => {
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let ticking = false;

    const DEADBAND = 8; // ignore scroll deltas smaller than this
    const HIDE_AFTER = 140; // never hide before this depth
    const SHOW_NEAR_TOP = 80; // always visible above this depth
    const AT_TOP = 24; // "hero overlay" zone — nav may go transparent here

    // isAtTop only drives colors/background (never layout), so it has no
    // dead-band — it must react even to tiny scrolls back into the top zone.
    setIsAtTop(Math.max(0, window.scrollY) < AT_TOP);

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY); // clamp rubber-band overscroll
      setIsAtTop(y < AT_TOP);

      const delta = y - lastY;
      if (Math.abs(delta) < DEADBAND) return;

      if (y < SHOW_NEAR_TOP) {
        setIsNavbarHidden(false);
      } else if (delta > 0 && y > HIDE_AFTER) {
        setIsNavbarHidden(true); // scrolling down
      } else if (delta < 0) {
        setIsNavbarHidden(false); // scrolling up
      }

      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { isNavbarHidden, isAtTop };
};
