import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { marketingFromRequest } from "@/lib/marketingServer";

// Resize / repair request from the account form → saved to the API (staff are
// emailed). Previously a stub that answered "success" and stored nothing.
export async function POST(req) {
  try {
    const b = await req.json().catch(() => ({}));
    if (!b.full_name || (!b.email && !b.mobile_number)) {
      return NextResponse.json({ status: false, message: "Name and an email or phone are required" }, { status: 422 });
    }
    const photos = Array.isArray(b.file) ? b.file.length : 0;
    const details = [
      b.product_name && `Product: ${b.product_name}`,
      b.request_type === "resize" && b.new_size && `Requested size: ${b.new_size}`,
      b.product_fitness && `Current fit: ${String(b.product_fitness).replace(/_/g, " ")}`,
      b.issue_type && `Issue: ${b.issue_type}`,
      b.issue_description && `Details: ${b.issue_description}`,
      b.pickup_address && `Pickup address${b.address_type ? ` (${b.address_type})` : ""}: ${b.pickup_address}`,
      b.additional_notes && `Notes: ${b.additional_notes}`,
      photos && `${photos} photo(s) were attached on the form — ask the customer to email them.`,
    ].filter(Boolean).join("\n");

    const result = await rjApi("POST", "/storefront/resize-repair-requests", {
      body: {
        name: b.full_name,
        email: b.email || null,
        phone: b.mobile_number || null,
        orderNumber: b.invoice_number || null,
        serviceType: b.request_type === "resize" ? "resize" : "repair",
        details,
        marketing: marketingFromRequest(req),
      },
    });
    if (!result.ok) {
      return NextResponse.json({ status: false, message: result.raw?.message || "Could not submit your request" }, { status: result.status || 500 });
    }
    return NextResponse.json({ status: true, message: "Request submitted. We'll contact you within 24 hours." });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
