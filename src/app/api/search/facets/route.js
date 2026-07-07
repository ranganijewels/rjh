import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

/**
 * GET /api/search/facets
 * Proxies NestJS GET /api/v1/search/facets →
 * { category:[{value,count}], metal:[...], color:[...], shape:[...] }
 */
export async function GET() {
  try {
    const result = await rjApi("GET", `/search/facets`);
    const facets = result.raw?.data ?? result.raw ?? {};

    return NextResponse.json({
      status: result.status || 200,
      data: {
        category: Array.isArray(facets.category) ? facets.category : [],
        metal: Array.isArray(facets.metal) ? facets.metal : [],
        color: Array.isArray(facets.color) ? facets.color : [],
        shape: Array.isArray(facets.shape) ? facets.shape : [],
      },
    });
  } catch (e) {
    console.error("search facets proxy error:", e);
    return NextResponse.json(
      { status: 500, data: { category: [], metal: [], color: [], shape: [] } },
      { status: 500 }
    );
  }
}
