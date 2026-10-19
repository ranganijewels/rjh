import { NextResponse } from "next/server";
import { buildMenuBanners } from "@/lib/listingHero";

// Product-listing hero banners (CMS "product-listing" hero, per-collection defaults).
export async function GET() {
  return NextResponse.json({ data: await buildMenuBanners() });
}

export async function POST() {
  return GET();
}
