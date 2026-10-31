import { NextResponse } from "next/server";
import { bearer, readWishlist, hydrateWishlist } from "@/lib/wishlist";

export async function GET(req) {
  try {
    const { entries } = await readWishlist(bearer(req));
    const items = await hydrateWishlist(entries);
    return NextResponse.json({ data: { wishlist_items: items, wishlist_count: items.length } });
  } catch {
    return NextResponse.json({ data: { wishlist_items: [], wishlist_count: 0 } });
  }
}
