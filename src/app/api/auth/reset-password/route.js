import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Same minimum the API enforces (ResetPasswordDto).
const MIN_LENGTH = 8;

export async function POST(req) {
  const { token = "", password = "", confirm_password: confirm = "" } = await req.json().catch(() => ({}));
  if (!token) {
    return NextResponse.json(
      { status: false, message: "This reset link is incomplete. Open the link from your email again." },
      { status: 422 }
    );
  }
  if (password.length < MIN_LENGTH) {
    return NextResponse.json(
      { status: false, message: `Password must be at least ${MIN_LENGTH} characters.` },
      { status: 422 }
    );
  }
  if (password !== confirm) {
    return NextResponse.json({ status: false, message: "Passwords do not match." }, { status: 422 });
  }

  const result = await rjApi("POST", "/auth/reset-password", { body: { token, newPassword: password } });
  if (!result.ok) {
    const message =
      result.status === 400
        ? result.raw?.message || "This reset link is invalid or has expired. Request a new one."
        : "Couldn't reset your password. Try again in a moment.";
    return NextResponse.json({ status: false, message }, { status: result.status });
  }

  return NextResponse.json({ status: true, message: "Password updated. You can log in now." });
}
