import { NextResponse } from "next/server";
import { rjApi, transformProduct } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/storefront/wishlist", { headers: { Authorization: `Bearer ${token}` } });
    const items = result.raw?.data?.items || result.raw?.data || [];
    return NextResponse.json({
      data: items.map(i => ({
        ...transformProduct(i),
        wishlist_id: i.productId,
        product_id: i.productId,
        title: i.productName || i.title || "Jewelry",
        product_price: i.price || 0,
        product_image: i.metadata?.image || i.productImg || "",
      }))
    });
  } catch { return NextResponse.json({ data: [] }); }
}
