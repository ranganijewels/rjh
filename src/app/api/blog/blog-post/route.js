import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (slug) {
      const result = await rjApi("GET", `/cms/blogs/${slug}`);
      return NextResponse.json({ data: result.raw?.data || {} });
    }
    const result = await rjApi("GET", "/cms/blogs");
    const blogs = result.raw?.data || [];
    return NextResponse.json({
      data: blogs.map(b => ({
        id: b.id, slug: b.slug, title: b.title, excerpt: b.excerpt,
        featured_image: b.featuredImage || "", published_at: b.publishedAt,
        tags: b.tags || [], author: b.author || "RJ House",
      }))
    });
  } catch { return NextResponse.json({ data: [] }); }
}
