import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Public guest order tracking — proxies to NestJS /storefront/track.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber") || "";
    const email = searchParams.get("email") || "";
    const result = await rjApi(
      "GET",
      `/storefront/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
    );
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "No order found" },
        { status: result.status || 404 }
      );
    }
    return NextResponse.json({ status: true, data: result.raw?.data || result.raw });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
