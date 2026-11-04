import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Jewelry categories from the public catalog masters (kind=category). The old
// source, /masters/categories, needs a staff token, so anonymous shoppers
// always got an empty list.
export async function GET() {
  try {
    const result = await rjApi("GET", "/catalog-masters");
    const masters = Array.isArray(result.raw?.data) ? result.raw.data : [];
    const categories = masters
      .filter((m) => m.kind === "category" && m.status !== "inactive")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.seoSlug || String(m.code || m.name).toLowerCase().replace(/_/g, "-"),
        image: m.metadata?.image || "",
      }));
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
