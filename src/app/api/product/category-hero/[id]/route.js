import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { heroFromCms } from "@/lib/cmsHero";

// Product-listing hero for a category. Reads the CMS "product-listing" hero-banner
// section and returns ALL of it (heading, subheading, video/image, CTA buttons,
// mobile override) — previously only heading + imageUrl were used, so CTAs and
// video set in the CMS were silently dropped.
export async function GET(req, { params }) {
  const { id } = await params;
  const FALLBACK = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/images/products/ring-diamond-solitaire.svg`;
  try {
    const result = await rjApi("GET", `/cms/sections?pageSlug=product-listing`);
    const sections = result.raw?.data || [];
    const hero = sections.find((s) => s.sectionKey === "hero-banner" || s.sectionKey === "hero")?.content || {};
    const h = heroFromCms(hero);
    return NextResponse.json({
      data: {
        ...h,
        title: h.title || "Shop Collection",
        hero_text: h.hero_text || "Shop Collection",
        description: h.description || "Find the perfect piece",
        hero_description: h.hero_description || "Find the perfect piece",
        file: h.file || FALLBACK,
        category_id: id,
      },
    });
  } catch {
    return NextResponse.json({
      data: {
        title: "Shop Collection",
        hero_text: "Shop Collection",
        description: "Find the perfect piece",
        hero_description: "Find the perfect piece",
        file: FALLBACK,
        buttons: [],
        category_id: id,
      },
    });
  }
}
