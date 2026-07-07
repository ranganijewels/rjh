import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));
    const result = await rjApi("POST", "/storefront/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
      body: { productId: body.product_id || body.productId, productData: body },
    });
    return NextResponse.json({ status: result.ok, message: result.ok ? "Wishlist updated" : "Failed", data: result.raw?.data });
  } catch (e) { return NextResponse.json({ status: false, message: e.message }); }
}
