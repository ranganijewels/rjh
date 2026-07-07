import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("DELETE", "/storefront/cart/coupon", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Failed to remove coupon" },
        { status: result.status || 400 }
      );
    }
    return NextResponse.json({ status: true, message: "Coupon removed" });
  } catch {
    return NextResponse.json({ status: false, message: "Failed to remove coupon" }, { status: 500 });
  }
}
