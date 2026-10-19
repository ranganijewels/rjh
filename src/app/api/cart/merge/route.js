import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Fold the browser's guest bag into the signed-in customer's cart.
export async function POST(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  const guestId = req.headers.get("x-guest-id") || "";
  if (!token || !guestId) return NextResponse.json({ status: true, merged: false });
  const result = await rjApi("POST", "/storefront/cart/merge", {
    headers: { Authorization: `Bearer ${token}`, "x-guest-id": guestId },
  });
  return NextResponse.json({ status: result.ok, merged: result.ok }, { status: result.ok ? 200 : result.status });
}
