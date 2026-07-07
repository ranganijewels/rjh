import { NextResponse } from "next/server";
import { rjApi, transformProduct, attachPrices } from "@/lib/apiHandler";

/**
 * GET /api/search
 * Forwards all query params (q, category, metalType, metalColor, shape, page, limit)
 * to NestJS GET /api/v1/search/products and returns { status, data, meta }.
 */
export async function GET(req) {
  try {
    const incoming = new URL(req.url).searchParams;
    const params = new URLSearchParams();

    // Forward only the recognised faceted-search params (skip empties)
    for (const key of ["q", "category", "metalType", "metalColor", "shape", "page", "limit"]) {
      const val = incoming.get(key);
      if (val != null && val !== "") params.set(key, val);
    }
    if (!params.get("limit")) params.set("limit", "24");
    if (!params.get("page")) params.set("page", "1");

    const result = await rjApi("GET", `/search/products?${params}`);
    const raw = result.raw?.data ?? result.raw ?? {};
    const products = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
    const meta = raw?.meta || {};

    const mapped = await attachPrices(products.map(transformProduct).filter(Boolean));

    return NextResponse.json({
      status: result.status || 200,
      data: mapped,
      meta: {
        page: meta.page ?? (Number(params.get("page")) || 1),
        limit: meta.limit ?? (Number(params.get("limit")) || 24),
        total: meta.total ?? mapped.length,
        totalPages: meta.totalPages ?? 1,
      },
    });
  } catch (e) {
    console.error("search proxy error:", e);
    return NextResponse.json(
      { status: 500, data: [], meta: { page: 1, limit: 24, total: 0, totalPages: 1 } },
      { status: 500 }
    );
  }
}
