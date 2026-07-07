import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// GET /api/seo/resolve?slug=<slug> -> NestJS GET /api/v1/seo/resolve?slug=<slug>
// Returns { status, data } where data is the resolved SeoPage (or null).
export async function GET(req) {
  try {
    const slug = new URL(req.url).searchParams.get("slug") || "";
    if (!slug) return NextResponse.json({ status: 400, data: null }, { status: 400 });

    const result = await rjApi("GET", `/seo/resolve?slug=${encodeURIComponent(slug)}`);
    if (!result.ok) return NextResponse.json({ status: result.status, data: null }, { status: result.status });

    const data = result.raw?.data ?? result.raw ?? null;
    return NextResponse.json({ status: 200, data });
  } catch (e) {
    return NextResponse.json({ status: 500, data: null }, { status: 500 });
  }
}
