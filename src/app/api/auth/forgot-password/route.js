import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Asks the API to email a reset link. The API answers the same way whether or
// not the email has an account, and so does this route.
export async function POST(req) {
  const { email = "" } = await req.json().catch(() => ({}));
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    return NextResponse.json({ status: false, message: "Enter a valid email address." }, { status: 422 });
  }

  const result = await rjApi("POST", "/auth/forgot-password", { body: { email: email.trim() } });
  if (!result.ok) {
    const message =
      result.status === 429
        ? "Too many requests. Wait a minute and try again."
        : "Couldn't send the reset email. Try again in a moment.";
    return NextResponse.json({ status: false, message }, { status: result.status });
  }

  return NextResponse.json({
    status: true,
    message: result.raw?.data?.message || "If an account exists for that email, a reset link is on its way.",
  });
}
