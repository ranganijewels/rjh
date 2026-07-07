import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/storefront/addresses", { headers: { Authorization: `Bearer ${token}` } });
    const addresses = result.raw?.data || [];
    return NextResponse.json({ data: addresses.map(a => ({
      id: a.id,
      address_id: a.id,
      label: a.label || a.addressType || "Home",
      name: a.recipientName || a.contactName || a.name || "",
      phone: a.phone || "",
      address_line1: a.addressLine1 || a.street || "",
      address_line2: a.addressLine2 || "",
      city: a.city || "",
      state: a.state || "",
      pincode: a.pincode || a.postalCode || "",
      country: a.country || "India",
      is_default: a.isDefault || false,
    }))});
  } catch (e) { return NextResponse.json({ data: [] }); }
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));
    const payload = {
      label: body.label || body.address_type || "Home",
      recipientName: body.name || body.contactName || body.recipient_name || body.contact_name || "",
      phone: body.phone || body.contact_phone || "0000000000",
      addressLine1: body.address_line1 || body.street || body.address || "",
      addressLine2: body.address_line2 || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.pincode || body.zip_code || body.postal_code || "",
      country: body.country || "India",
      isDefault: body.is_default || false,
    };
    const result = await rjApi("POST", "/storefront/addresses", { headers: { Authorization: `Bearer ${token}` }, body: payload });
    if (!result.ok) return NextResponse.json({ status: false, message: result.raw?.message || "Failed" }, { status: 400 });
    const a = result.raw?.data || {};
    return NextResponse.json({ status: true, data: { id: a.id, ...payload } });
  } catch (e) { return NextResponse.json({ status: false, message: e.message }, { status: 500 }); }
}
