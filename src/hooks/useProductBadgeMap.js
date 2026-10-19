"use client";
import { useEffect, useState } from "react";

// Badge names/colors come from the admin Product Badges master. Fetched once
// per session and shared module-wide.
let cached = null;
let inflight = null;

export function useProductBadgeMap() {
  const [map, setMap] = useState(cached || {});

  useEffect(() => {
    if (cached) return;
    inflight =
      inflight ||
      fetch("/api/product-badges")
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
