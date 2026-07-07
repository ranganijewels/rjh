import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// The storefront account is a NestJS `User` (fullName + phone + birthDate).
// The profile UI works in first_name / last_name / phone_number / birth_date,
// so this proxy translates between the two shapes.

const splitName = (fullName = "") => {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] || "", last: parts.slice(1).join(" ") || "" };
};

// Backend stores birthDate as ISO (YYYY-MM-DD). Always hand ISO back to the UI;
// the UI formats it for display/picker itself.
const toIso = (v) => {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10); // already ISO
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(v); // DD-MM-YYYY from the form
  return m ? `${m[3]}-${m[2]}-${m[1]}` : v;
};

const toCustomer = (user = {}) => {
  const { first, last } = splitName(user.fullName || user.name || "");
  return {
    id: user.id,
    email: user.email || "",
    full_name: user.fullName || user.name || "",
    first_name: first,
    last_name: last,
    phone_number: user.phone || "",
    birth_date: toIso(user.birthDate || ""),
    role: user.role,
  };
};

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    const user = result.raw?.data || result.raw || {};
    return NextResponse.json({ data: toCustomer(user) });
  } catch {
    return NextResponse.json({ data: {} });
  }
}

export async function PUT(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));
    const fullName = [body.first_name, body.last_name].filter(Boolean).join(" ").trim();
    const result = await rjApi("PATCH", "/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fullName: fullName || body.full_name || undefined,
        phone: body.phone_number ?? body.phone,
        birthDate: body.birth_date ? toIso(body.birth_date) : null,
      },
    });
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Failed to update profile" },
        { status: 200 },
      );
    }
    return NextResponse.json({ status: true, data: toCustomer(result.raw?.data || result.raw || {}) });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message });
  }
}
