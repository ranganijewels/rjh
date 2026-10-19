import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  try {
    const { orderNumber } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const guestId = req.headers.get("x-guest-id") || "";
    const email = new URL(req.url).searchParams.get("email") || "";
    const qs = email ? `?email=${encodeURIComponent(email)}` : "";
    const result = await rjApi("GET", `/payments/cashfree/status/${encodeURIComponent(orderNumber)}${qs}`, {
      headers: { Authorization: `Bearer ${token}`, ...(guestId && { "x-guest-id": guestId }) },
    });
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Could not fetch payment status" },
        { status: result.status || 400 }
      );
    }
    return NextResponse.json({ status: true, data: result.raw?.data || {} });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
