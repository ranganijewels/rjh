import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Pay again for an unpaid online order (account ▸ Orders). Returns a Cashfree
// payment session and mode, or { alreadyPaid: true }.
export async function POST(req, { params }) {
  try {
    const { orderNumber } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("POST", `/payments/cashfree/retry/${encodeURIComponent(orderNumber)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!result.ok) {
      // Show the API's own reasons (cancelled, paid on delivery, sign in);
      // anything else gets a plain message instead of a server error string.
      const known = [400, 401, 403].includes(result.status) && typeof result.raw?.message === "string";
      return NextResponse.json(
        {
          status: false,
          message: known ? result.raw.message : "We couldn't start the payment right now. Please try again, or contact us.",
        },
        { status: result.status || 400 }
      );
    }
    return NextResponse.json({ status: true, data: result.raw?.data || result.raw || {} });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
