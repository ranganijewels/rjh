"use client";
import { useEffect, useState } from "react";

/**
 * Fetches the CMS "hero-banner" for a storefront page (via /api/page-hero/[slug])
 * so any page's top banner can be edited in the CMS "Banners & Hero" tab. Returns
 * the transformed hero ({ title, description, file, mobileFile, buttons }) or null
 * when no CMS hero is set — so the page falls back to its own default banner.
 */
export function usePageHero(slug) {
  const [hero, setHero] = useState(null);
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/page-hero/${slug}`, { cache: "no-store" });
        const json = await res.json();
        if (alive) setHero(json?.data || null);
      } catch {
        /* keep null → page uses its default banner */
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);
  return hero;
}
