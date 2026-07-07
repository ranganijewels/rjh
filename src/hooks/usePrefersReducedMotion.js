"use client";
import { useEffect, useState } from "react";

// True when the OS "reduce motion" accessibility setting is on. Used to hold
// autoplaying hero/product videos on their first frame instead of looping.
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
};
