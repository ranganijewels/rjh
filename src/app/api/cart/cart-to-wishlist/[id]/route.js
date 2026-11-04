import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { bearer, readWishlist, toggleEntry } from "@/lib/wishlist";

// [id] is the cart line id. Saves the line's product (with its chosen
// options) to the wishlist, then removes the line from the cart. The wishlist
// endpoint toggles, so a product that is already wishlisted is not re-sent.
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const token = bearer(req);
    if (!token) {
      return NextResponse.json({ status: false, message: "Log in to save items to your wishlist" }, { status: 401 });
    }
    const auth = { Authorization: `Bearer ${token}` };

    const cartRes = await rjApi("GET", "/storefront/cart", { headers: auth });
    if (!cartRes.ok) {
      return NextResponse.json({ status: false, message: "Failed to load your bag" }, { status: cartRes.status });
    }
    // Same key the API's DELETE /storefront/cart/:lineId uses (legacy lines: productId).
    const line = (cartRes.raw?.data?.items || []).find(
      (i) => i.lineId === id || (!i.lineId && i.productId === id)
    );
    if (!line) return NextResponse.json({ status: false, message: "Item is no longer in your bag" }, { status: 404 });

    const wishlist = await readWishlist(token);
    if (!wishlist.ok) {
      return NextResponse.json({ status: false, message: "Failed to move item" }, { status: wishlist.status });
    }

    let count = wishlist.entries.length;
    if (!wishlist.entries.some((e) => e.productId === line.productId)) {
      const m = line.metadata || {};
      const added = await toggleEntry(token, line.productId, {
        product_price: Number(line.price) || 0,
        metal_type: m.metalType,
        metal_color: m.metalColor,
        diamond_shape: m.shape,
        center_diamond_weight: m.centerDiamondWeight,
        ring_size: m.ringSize,
        size: m.size,
      });
      if (!added.ok) {
        return NextResponse.json({ status: false, message: "Failed to move item" }, { status: added.status });
      }
      count = added.count;
    }

    const removed = await rjApi("DELETE", `/storefront/cart/${id}`, { headers: auth });
    if (!removed.ok) {
      return NextResponse.json(
        { status: false, message: "Saved to wishlist, but the item is still in your bag" },
        { status: removed.status }
      );
    }

    return NextResponse.json({ status: true, message: "Moved to wishlist", data: { wishlist_count: count } });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
