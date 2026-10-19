import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { marketingFromRequest } from "@/lib/marketingServer";

// Persist a contact-form submission to the backend (CMS forms inbox reads these
// from /storefront/contact-submissions). Previously a no-op stub.
export async function POST(req) {
  try {
    const b = await req.json().catch(() => ({}));
    const payload = {
      name: b.full_name || b.name || "",
      email: b.email || "",
      phone: b.phone || b.phone_number || null,
      subject: b.query || b.subject || "General Enquiry",
      message: b.message || "",
      marketing: marketingFromRequest(req),
    };

    if (!payload.name || !payload.email || !payload.message) {
      return NextResponse.json(
        { status: false, message: "Name, email and message are required" },
        { status: 422 }
      );
    }

    const result = await rjApi("POST", "/storefront/contact-submissions", { body: payload });
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Submission failed" },
        { status: result.status || 500 }
      );
    }
    return NextResponse.json({
      status: true,
      message: "Thank you! We will get back to you soon.",
      data: result.raw?.data || result.raw,
    });
  } catch (e) {
    console.error("contact-us submit error:", e);
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
