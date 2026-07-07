import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// GET /api/reviews?productId=<id>&status=approved → approved reviews for a product.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || "";
    const status = searchParams.get("status") || "";

    if (!productId) {
      return NextResponse.json({ status: false, data: [] }, { status: 400 });
    }

    const qs = new URLSearchParams({ productId });
    if (status) qs.set("status", status);

    const result = await rjApi("GET", `/reviews?${qs.toString()}`);
    const data = result.raw?.data ?? result.raw ?? [];
    return NextResponse.json({
      status: result.ok,
      data: Array.isArray(data) ? data : [],
    });
  } catch (e) {
    console.error("reviews GET error:", e);
    return NextResponse.json({ status: false, data: [] });
  }
}

// POST /api/reviews → submit a review (created with status "pending", moderated later).
export async function POST(req) {
  try {
    const b = await req.json().catch(() => ({}));
    const payload = {
      productId: b.productId || "",
      customerName: b.customerName || b.name || "",
      email: b.email || "",
      rating: Number(b.rating) || 0,
      title: b.title || "",
      body: b.body || "",
    };

    if (!payload.productId || !payload.customerName || !payload.email || !payload.rating || !payload.body) {
      return NextResponse.json(
        { status: false, message: "Name, email, rating and review are required." },
        { status: 422 }
      );
    }

    const result = await rjApi("POST", "/reviews", { body: payload });
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Could not submit your review." },
        { status: result.status || 500 }
      );
    }
    return NextResponse.json({
      status: true,
      message: "Thank you! Your review has been submitted and will appear once approved.",
      data: result.raw?.data ?? result.raw,
    });
  } catch (e) {
    console.error("reviews POST error:", e);
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
