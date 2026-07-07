import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const url = new URL(req.url);
    const productId = url.searchParams.get("product_id");
    const result = await rjApi("GET", "/storefront/wishlist", { headers: { Authorization: `Bearer ${token}` } });
    const items = result.raw?.data?.items || [];
    const isWishlisted = items.some(i => i.productId === productId);
    return NextResponse.json({ data: { is_wishlisted: isWishlisted } });
  } catch { return NextResponse.json({ data: { is_wishlisted: false } }); }
}
