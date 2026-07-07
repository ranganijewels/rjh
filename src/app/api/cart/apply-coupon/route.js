import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));
    const result = await rjApi("POST", "/storefront/cart/coupon", {
      headers: { Authorization: `Bearer ${token}` },
      body: { couponCode: body.code || body.couponCode },
    });
    // Backend returns HTTP 200 even for invalid coupons, with couponApplied:false
    const d = result.raw?.data;
    if (!result.ok || d?.couponApplied === false) {
      return NextResponse.json({
        status: false,
        message: d?.message || result.raw?.message || "Invalid coupon",
      });
    }
    return NextResponse.json({ status: true, message: "Coupon applied", data: d });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message });
  }
}
