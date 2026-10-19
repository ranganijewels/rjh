import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { marketingFromRequest } from "@/lib/marketingServer";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const guestId = req.headers.get("x-guest-id") || "";
    const body = await req.json().catch(() => ({}));

    const shippingAddress = {
      name: `${body.first_name || ""} ${body.last_name || ""}`.trim(),
      phone: body.phone_number || "",
      email: body.email || "",
      street: body.street_address || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.zip_code || "",
      country: body.country || "",
    };

    const result = await rjApi("POST", "/storefront/cart/checkout", {
      headers: { Authorization: `Bearer ${token}`, ...(guestId && { "x-guest-id": guestId }) },
      body: {
        shippingAddress,
        paymentMethod: body.payment_method || "COD",
        currencyCode: body.currency_code || "USD",
        notes: body.notes || "",
        // Only meaningful when checking out without a token — the backend
        // ignores these for logged-in customers.
        guestEmail: body.email || "",
        guestName: shippingAddress.name,
        guestPhone: body.phone_number || "",
        marketing: marketingFromRequest(req),
      },
    });

    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Order failed" },
        { status: result.status || 400 }
      );
    }

    const raw = result.raw?.data || result.raw || {};

    // Normalise to shape OrderComplete expects
    const order = {
      id: raw.orderNumber || raw.id,
      order_number: raw.orderNumber,
      created_at: raw.createdAt || raw.orderDate || new Date().toISOString(),
      total: raw.totalAmount || 0,
      currency_code: raw.currencyCode || "USD",
      charged_amount: raw.chargedAmount ?? raw.totalAmount ?? 0,
      payment_method: raw.paymentMethod || body.payment_method || "COD",
      payment_status: raw.paymentStatus || "Pending",
      // Only present when payment_method is ONLINE — the storefront uses
      // this to launch the Cashfree checkout widget next.
      payment_session_id: raw.cfPaymentSessionId || null,
      items: [],
    };

    return NextResponse.json({
      status: true,
      message: "Order placed successfully",
      data: { order },
    });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
