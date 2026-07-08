"use client";
import { useEffect, useState } from "react";

// Swatch colors come from the admin Metal Colors master (hex + optional hex2
// for two-tone). Fetched once per session and shared module-wide; components
// keep their hardcoded fallbacks for anything the master doesn't define.
let cached = null;
let inflight = null;

export function useMetalColorMap() {
  const [map, setMap] = useState(cached || {});

  useEffect(() => {
    if (cached) return;
    inflight =
      inflight ||
      fetch("/api/metal-colors")
        .then((r) => (r.ok ? r.json() : { data: {} }))
        .then((j) => (cached = j?.data || {}))
        .catch(() => (cached = {}));
    let alive = true;
    inflight.then(() => alive && setMap(cached || {}));
    return () => {
      alive = false;
    };
  }, []);

  return map;
}

// CSS background for a master entry — a diagonal 50/50 split when two-tone.
export const swatchCss = (entry, fallback = "var(--grey-3)") => {
  if (!entry?.hex) return fallback;
  return entry.hex2
    ? `linear-gradient(135deg, ${entry.hex} 50%, ${entry.hex2} 50%)`
    : entry.hex;
};
