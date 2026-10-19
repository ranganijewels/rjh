import { NextResponse } from "next/server";
import { buildCategoryHero } from "@/lib/listingHero";

// Product-listing hero for a category (full CMS hero: heading, media, CTAs, mobile override).
export async function GET(req, { params }) {
  const { id } = await params;
  return NextResponse.json({ data: await buildCategoryHero(id) });
}
