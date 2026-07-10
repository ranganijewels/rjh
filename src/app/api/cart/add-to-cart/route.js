import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));

    // Fetch product name from NestJS
    let productName = body.title || body.productName || "Jewelry";
    let mediaImage = "";
    const productId = body.product_id || body.productId;
    if (productId) {
      try {
        const pRes = await rjApi("GET", `/products/${productId}`);
        const p = pRes.raw?.data || pRes.raw;
        if (p?.productName || p?.name) productName = p.productName || p.name;
        if (p?.media?.[0]?.fileUrl || p?.media?.[0]?.url) {
          mediaImage = p.media[0].fileUrl || p.media[0].url;
        }
      } catch { /* use defaults */ }
    }

    const result = await rjApi("POST", "/storefront/cart", {
      headers: { Authorization: `Bearer ${token}` },
      body: {
        productId,
        productName,
        quantity: body.quantity || 1,
        price: body.unit_price || body.product_price || body.price || 0,
        metadata: {
          metalColor: body.metal_color,
          metalType: body.metal_type,
          shape: body.diamond_shape,
          centerDiamondWeight: body.center_diamond_weight,
          ringSize: body.ring_size,
          size: body.size,
          clarity: body.diamond_clarity || undefined,
          engraving: body.engraving || undefined,
          image: mediaImage,
        },
      },
    });
    return NextResponse.json({
      status: result.ok,
      // surface the backend status so the client can react (401 → session expired)
      code: result.status,
      message: result.ok ? "Added to cart" : result.raw?.message || "Failed",
      data: result.raw?.data,
    });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
