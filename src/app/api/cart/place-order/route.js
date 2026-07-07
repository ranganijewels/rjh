import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));

    const shippingAddress = {
      name: `${body.first_name || ""} ${body.last_name || ""}`.trim(),
      phone: body.phone_number || "",
      email: body.email || "",
      street: body.street_address || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.zip_code || "",
      country: body.country || "India",
    };

    const result = await rjApi("POST", "/storefront/cart/checkout", {
      headers: { Authorization: `Bearer ${token}` },
      body: {
        shippingAddress,
        paymentMethod: body.payment_method || "COD",
        notes: body.notes || "",
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
      payment_method: body.payment_method || "COD",
      payment_status: raw.paymentStatus || "Pending",
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
