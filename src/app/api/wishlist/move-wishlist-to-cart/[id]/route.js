import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { bearer, readWishlist, hydrateWishlist, toggleEntry } from "@/lib/wishlist";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const token = bearer(req);
    const { ok, status, entries } = await readWishlist(token);
    if (!ok) return NextResponse.json({ status: false, message: "Failed to move item" }, { status });

    const [item] = await hydrateWishlist(entries.filter((e) => e.productId === id));
    if (!item) return NextResponse.json({ status: false, message: "Item is no longer available" }, { status: 404 });

    const cart = await rjApi("POST", "/storefront/cart", {
      headers: { Authorization: `Bearer ${token}` },
      body: {
        productId: item.product_id,
        productName: item.product.title,
        quantity: 1,
        price: item.product_price,
        metadata: {
          metalColor: item.metal_color,
          metalType: item.metal_type,
          shape: item.diamond_shape,
          centerDiamondWeight: item.center_diamond_weight,
          ringSize: item.ring_size,
          size: item.size,
          image: item.product.image,
        },
      },
    });
    if (!cart.ok) {
      return NextResponse.json({ status: false, message: cart.raw?.message || "Failed to add to bag" }, { status: cart.status });
    }

    const removed = await toggleEntry(token, id);
    return NextResponse.json({
      status: true,
      message: "Moved to bag",
      data: { wishlist_count: removed.ok ? removed.count : entries.length, cart: cart.raw?.data },
    });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
