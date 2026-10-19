import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { marketingFromRequest } from "@/lib/marketingServer";

// Return / repair request (multipart form) → saved to the API; staff are
// emailed. Previously a stub that answered "success" and stored nothing.
export async function POST(req) {
  try {
    const f = await req.formData();
    const g = (k) => String(f.get(k) || "").trim();
    if (!g("full_name") || (!g("email") && !g("phone_number"))) {
      return NextResponse.json({ status: false, message: "Name and an email or phone are required", error: {} }, { status: 422 });
    }
    const action = { warranty_repair: "Repair under warranty", paid_repair: "Paid repair (out of warranty)", assessment_needed: "Assessment needed" }[g("preferred_action")] || g("preferred_action");
    const photos = f.getAll("files[]").length;
    const details = [
      `Jewellery: ${[g("jewellery_type"), g("product_name")].filter(Boolean).join(" — ")}`,
      action && `Preferred action: ${action}`,
      g("issue_description") && `Issue: ${g("issue_description")}`,
      g("jewellery_alteration") && `Previously repaired/altered: ${g("jewellery_alteration").replace(/_/g, " ")}`,
      [g("street_address"), g("city"), g("postal_code"), g("country")].filter(Boolean).length && `Return address: ${[g("street_address"), g("city"), g("postal_code"), g("country")].filter(Boolean).join(", ")}`,
      g("additional_comments") && `Comments: ${g("additional_comments")}`,
      g("digital_signature") && `Signed by: ${g("digital_signature")}`,
      photos && `${photos} photo(s) were attached on the form — ask the customer to email them.`,
    ].filter(Boolean).join("\n");

    const result = await rjApi("POST", "/storefront/resize-repair-requests", {
      body: {
        name: g("full_name"),
        email: g("email") || null,
        phone: g("phone_number") || null,
        serviceType: "repair",
        details,
        marketing: marketingFromRequest(req),
      },
    });
    if (!result.ok) {
      return NextResponse.json({ status: false, message: result.raw?.message || "Could not submit your request" }, { status: result.status || 500 });
    }
    return NextResponse.json({ status: true, message: "Return/repair request submitted." });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
