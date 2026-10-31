import { NextResponse } from "next/server";
import { bearer, readWishlist, toggleEntry } from "@/lib/wishlist";

// The API only toggles, so check the item is there first — toggling an
// absent id would add it instead of removing it.
async function remove(req, { params }) {
  try {
    const { id } = await params;
    const token = bearer(req);
    const { ok, status, entries } = await readWishlist(token);
    if (!ok) return NextResponse.json({ status: false, message: "Failed to remove item" }, { status });
    if (!entries.some((e) => e.productId === id)) {
      return NextResponse.json({ status: true, data: { wishlist_count: entries.length } });
    }
    const result = await toggleEntry(token, id);
    return NextResponse.json(
      { status: result.ok, message: result.ok ? "Removed from wishlist" : "Failed to remove item", data: { wishlist_count: result.count } },
      { status: result.ok ? 200 : result.status }
    );
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}

export const POST = remove;
export const DELETE = remove;
