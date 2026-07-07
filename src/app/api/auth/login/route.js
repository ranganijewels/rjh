import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await rjApi("POST", "/auth/login", { body });
    if (!result.ok) {
      return NextResponse.json({ error: result.raw?.message || "Invalid credentials" }, { status: result.status });
    }
    const d = result.raw?.data || result.raw;
    const user = d?.user || {};
    const nameParts = (user.fullName || "").trim().split(/\s+/).filter(Boolean);
    return NextResponse.json({
      token: d?.accessToken || "",
      customer: {
        id: user.id,
        email: user.email,
        name: user.fullName || "",
        fullName: user.fullName || "",
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        phone: user.phone || "",
        phone_number: user.phone || "",
        birth_date: user.birthDate ? String(user.birthDate).slice(0, 10) : "",
        role: user.role || "customer",
        tenantId: user.tenantId,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
