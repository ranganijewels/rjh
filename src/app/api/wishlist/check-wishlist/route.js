import { NextResponse } from "next/server";
import { bearer, readWishlist } from "@/lib/wishlist";

async function check(req, productId) {
  try {
    const { entries } = await readWishlist(bearer(req));
    const wishlisted = Boolean(productId) && entries.some((e) => e.productId === productId);
    return NextResponse.json({ data: { wishlist: wishlisted, is_wishlisted: wishlisted } });
  } catch {
    return NextResponse.json({ data: { wishlist: false, is_wishlisted: false } });
  }
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  return check(req, body.product_id || body.productId);
}

export async function GET(req) {
  return check(req, new URL(req.url).searchParams.get("product_id"));
}
