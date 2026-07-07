import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { heroFromCms, heroHasContent } from "@/lib/cmsHero";

// Generic page-hero reader: returns the CMS "hero-banner" section for ANY
// storefront page (pageSlug = the [slug] segment), transformed into the shape
// HeroSection expects. Returns { data: null } when the page has no CMS hero yet
// so the caller falls back to its own default banner. Editable from the CMS
// "Banners & Hero" page (each page is a tab there).
export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    const result = await rjApi("GET", `/cms/sections?pageSlug=${encodeURIComponent(slug)}`);
    const sections = result.raw?.data || result.raw || [];
    const list = Array.isArray(sections) ? sections : [];
    // Most-recent matching hero wins (POST can create duplicates). Accept both
    // "hero-banner" (homepage convention) and "hero" (other pages' convention).
    const matching = list
      .filter((s) => s?.sectionKey === "hero-banner" || s?.sectionKey === "hero")
      .sort((a, b) => new Date(b?.updatedAt || 0) - new Date(a?.updatedAt || 0));
    const h = heroFromCms(matching[0]?.content || {});
    if (heroHasContent(h)) {
      const out = NextResponse.json({ data: h });
      out.headers.set("Access-Control-Allow-Origin", "*");
      return out;
    }
  } catch {
    /* CMS unavailable — caller uses its default */
  }
  const out = NextResponse.json({ data: null });
  out.headers.set("Access-Control-Allow-Origin", "*");
  return out;
}
