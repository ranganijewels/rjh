import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function PUT(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const payload = {
      label: body.label,
      contactName: body.name || body.contact_name,
      phone: body.phone,
      addressLine1: body.address_line1 || body.address,
      addressLine2: body.address_line2,
      city: body.city,
      state: body.state,
      pincode: body.pincode || body.postal_code,
      country: body.country || "India",
      isDefault: body.is_default,
    };
    const result = await rjApi("PATCH", `/storefront/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` }, body: payload });
    if (!result.ok) return NextResponse.json({ status: false }, { status: 400 });
    return NextResponse.json({ status: true, data: result.raw?.data });
  } catch (e) { return NextResponse.json({ status: false }, { status: 500 }); }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const { id } = await params;
    await rjApi("DELETE", `/storefront/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return NextResponse.json({ status: true });
  } catch (e) { return NextResponse.json({ status: false }, { status: 500 }); }
}
