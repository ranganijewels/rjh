import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// GET /api/reviews/summary?productId=<id> → { count, average } for approved reviews.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || "";

    if (!productId) {
      return NextResponse.json({ status: false, data: { count: 0, average: 0 } }, { status: 400 });
    }

    const result = await rjApi("GET", `/reviews/summary?productId=${encodeURIComponent(productId)}`);
    const d = result.raw?.data ?? result.raw ?? {};
    return NextResponse.json({
      status: result.ok,
      data: {
        count: Number(d.count) || 0,
        average: Number(d.average) || 0,
      },
    });
  } catch (e) {
    console.error("reviews summary GET error:", e);
    return NextResponse.json({ status: false, data: { count: 0, average: 0 } });
  }
}
