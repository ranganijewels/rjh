import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Newsletter sign-up (home section and sign-up popup). The API is idempotent,
// so subscribing twice just succeeds again.
export async function POST(req) {
  const { email = "", source = "" } = await req.json().catch(() => ({}));
  const clean = String(email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    const message = "Enter a valid email address.";
    return NextResponse.json({ status: false, message, error: { email: [message] } }, { status: 422 });
  }

  const result = await rjApi("POST", "/storefront/newsletter", {
    body: { email: clean, source: source || undefined },
  });
  if (!result.ok) {
    // Only the API's validation messages (400) are shown as-is.
    const message =
      result.status === 429
        ? "Too many sign-ups right now. Try again in a minute."
        : result.status === 400 && result.raw?.message
        ? result.raw.message
        : "Couldn't subscribe you right now. Try again in a moment.";
    return NextResponse.json({ status: false, message, error: { email: [message] } }, { status: result.status });
  }

  return NextResponse.json({ status: true, message: "Subscribed successfully!" });
}
