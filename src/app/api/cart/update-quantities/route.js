import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));
    const items = body.cart_items || body.items || [];
    for (const item of items) {
      const id = item.cart_item_id || item.product_id || item.id;
      if (!id) continue;
      await rjApi("PATCH", `/storefront/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        body: { quantity: item.quantity },
      });
    }
    return NextResponse.json({ status: true, message: "Cart updated" });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message });
  }
}
