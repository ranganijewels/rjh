import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Same rule the API applies at sign-up (RegisterDto minLength).
const MIN_LENGTH = 8;

// The profile UI sends current_password / new_password / confirm_password;
// NestJS expects { currentPassword, newPassword } on PATCH /users/me/password.
// Field errors come back as { error: { field: [message] } }, which the UI reads.
async function changePassword(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!token) {
    return NextResponse.json({ status: false, message: "Please log in again." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const current = body.current_password || "";
  const next = body.new_password || "";
  const confirm = body.confirm_password ?? next;

  const fieldError = (field, message) =>
    NextResponse.json({ status: false, message, error: { [field]: [message] } }, { status: 422 });

  if (!current) return fieldError("current_password", "Current password is required.");
  if (next.length < MIN_LENGTH) {
    return fieldError("new_password", `New password must be at least ${MIN_LENGTH} characters.`);
  }
  if (next !== confirm) return fieldError("confirm_password", "Passwords do not match.");
  if (next === current) {
    return fieldError("new_password", "New password must be different from the current one.");
  }

  const result = await rjApi("PATCH", "/users/me/password", {
    headers: { Authorization: `Bearer ${token}` },
    body: { currentPassword: current, newPassword: next },
  });

  if (!result.ok) {
    const message = result.raw?.message || "Failed to change password";
    // 400 is the API's "Current password is incorrect".
    if (result.status === 400) return fieldError("current_password", message);
    return NextResponse.json({ status: false, message }, { status: result.status });
  }

  return NextResponse.json({ status: true, message: "Password changed" });
}

// The profile form sends PUT (useCrudApi.update); POST kept for older callers.
export const PUT = changePassword;
export const POST = changePassword;
