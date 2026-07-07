import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// GET /api/seo/sitemap -> NestJS GET /api/v1/seo/sitemap
// Returns the raw array of { loc, lastmod, priority } entries.
export async function GET() {
  try {
    const result = await rjApi("GET", "/seo/sitemap");
    const data = result.raw?.data ?? result.raw ?? [];
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
