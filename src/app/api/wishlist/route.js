import { NextResponse } from "next/server";
import { bearer, toggleEntry } from "@/lib/wishlist";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const productId = body.product_id || body.productId;
    if (!productId) return NextResponse.json({ status: false, message: "product_id is required" }, { status: 400 });

    const result = await toggleEntry(bearer(req), productId, body);
    if (!result.ok) {
      return NextResponse.json({ status: false, message: "Wishlist update failed" }, { status: result.status || 500 });
    }
    return NextResponse.json({
      status: true,
      message: result.added ? "Added to wishlist" : "Removed from wishlist",
      data: { wishlist: result.added, wishlist_count: result.count },
    });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
