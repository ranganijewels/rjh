import { rjApi } from "@/lib/apiHandler";
import { heroFromCms, heroHasContent } from "@/lib/cmsHero";

// Product-listing hero banner, shared by the API routes (/api/product/menu-banner,
// /api/product/category-hero/[id]) and the server-rendered listing page, so the
// banner arrives with the HTML instead of after a client fetch.
const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/images/products`;

export const MENU_DEFAULTS = [
  { banner_title: "product", file: `${BASE}/ring-diamond-solitaire.svg`, title: "Explore Our Collection", description: "Fine jewelry crafted for every occasion" },
  { banner_title: "wedding", file: `${BASE}/bangle-22k-gold.svg`, title: "Wedding Collection", description: "Celebrate your special day with timeless pieces" },
  { banner_title: "engagement", file: `${BASE}/ring-diamond-solitaire.svg`, title: "Engagement Rings", description: "Find the perfect ring to say forever" },
  { banner_title: "jewelry", file: `${BASE}/necklace-choker-diamonds.svg`, title: "Jewelry Collection", description: "Exquisite jewelry for every moment" },
];

async function cmsHero() {
  const result = await rjApi("GET", `/cms/sections?pageSlug=product-listing`);
  const sections = result.raw?.data || [];
  const hero = sections.find((s) => s.sectionKey === "hero-banner" || s.sectionKey === "hero")?.content || {};
  return heroFromCms(hero);
}

export async function buildMenuBanners() {
  try {
    const h = await cmsHero();
    if (heroHasContent(h)) {
      return MENU_DEFAULTS.map((d) => ({
        banner_title: d.banner_title,
        title: h.hero_text || d.title,
        hero_text: h.hero_text || d.title,
        description: h.hero_description || d.description,
        hero_description: h.hero_description || d.description,
        file: h.file || d.file,
        mobileFile: h.mobileFile || "",
        buttons: h.buttons || [],
      }));
    }
  } catch {
    /* CMS unavailable — use defaults */
  }
  return MENU_DEFAULTS;
}

export async function buildCategoryHero(id) {
  const FALLBACK = `${BASE}/ring-diamond-solitaire.svg`;
  try {
    const h = await cmsHero();
    return {
      ...h,
      title: h.title || "Shop Collection",
      hero_text: h.hero_text || "Shop Collection",
      description: h.description || "Find the perfect piece",
      hero_description: h.hero_description || "Find the perfect piece",
      file: h.file || FALLBACK,
      category_id: id,
    };
  } catch {
    return {
      title: "Shop Collection", hero_text: "Shop Collection",
      description: "Find the perfect piece", hero_description: "Find the perfect piece",
      file: FALLBACK, buttons: [], category_id: id,
    };
  }
}

// Same selection the listing page made client-side.
export async function buildListingHero({ category_id, collection } = {}) {
  if (category_id) return buildCategoryHero(category_id);
  const banners = await buildMenuBanners();
  const target = String(collection || "").toLowerCase() || "product";
  return banners.find((b) => String(b?.banner_title).toLowerCase() === target) || null;
}

// Uploaded CMS videos have a "<name>-poster.jpg" still beside them (same rule as HeroSection).
export function heroPoster(file) {
  return /\/uploads\/cms-media\/.+\.(mp4|webm|mov)$/i.test(file || "") ? file.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg") : "";
}
