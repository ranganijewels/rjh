import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { heroFromCms, heroHasContent } from "@/lib/cmsHero";

const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/images/products`;

// Per-collection defaults, shown until a Product-Listing hero is set in the CMS.
const DEFAULTS = [
  { banner_title: "product", file: `${BASE}/ring-diamond-solitaire.svg`, title: "Explore Our Collection", description: "Fine jewelry crafted for every occasion" },
  { banner_title: "wedding", file: `${BASE}/bangle-22k-gold.svg`, title: "Wedding Collection", description: "Celebrate your special day with timeless pieces" },
  { banner_title: "engagement", file: `${BASE}/ring-diamond-solitaire.svg`, title: "Engagement Rings", description: "Find the perfect ring to say forever" },
  { banner_title: "jewelry", file: `${BASE}/necklace-choker-diamonds.svg`, title: "Jewelry Collection", description: "Exquisite jewelry for every moment" },
];

// Reads the CMS "product-listing" hero-banner. When set, it drives the hero for
// every listing/collection view (heading, video/image, CTAs). Falls back to the
// per-collection defaults above so the page always renders. Previously this route
// was fully hardcoded and ignored the CMS entirely.
export async function GET() {
  try {
    const result = await rjApi("GET", `/cms/sections?pageSlug=product-listing`);
    const sections = result.raw?.data || [];
    const hero = sections.find((s) => s.sectionKey === "hero-banner" || s.sectionKey === "hero")?.content || {};
    const h = heroFromCms(hero);
    if (heroHasContent(h)) {
      return NextResponse.json({
        data: DEFAULTS.map((d) => ({
          banner_title: d.banner_title,
          title: h.hero_text || d.title,
          hero_text: h.hero_text || d.title,
          description: h.hero_description || d.description,
          hero_description: h.hero_description || d.description,
          file: h.file || d.file,
          mobileFile: h.mobileFile || "",
          buttons: h.buttons || [],
        })),
      });
    }
  } catch {
    /* CMS unavailable — use defaults */
  }
  return NextResponse.json({ data: DEFAULTS });
}

export async function POST() {
  return GET();
}
