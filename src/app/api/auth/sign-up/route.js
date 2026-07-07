import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;
    const fullName = body.full_name || body.fullName || body.name || email.split("@")[0];

    // Step 1: Register the user
    const registerResult = await rjApi("POST", "/auth/register", {
      body: { email, password, fullName, role: "customer" },
    });

    if (!registerResult.ok) {
      const msg = registerResult.raw?.message || "Registration failed";
      return NextResponse.json({ error: msg }, { status: registerResult.status || 400 });
    }

    // Step 2: Auto-login to get JWT token
    const loginResult = await rjApi("POST", "/auth/login", {
      body: { email, password },
    });

    if (!loginResult.ok) {
      // Registration succeeded but login failed — partial success
      return NextResponse.json({
        token: "",
        customer: { email, name: fullName },
        message: "Account created. Please log in.",
      });
    }

    const d = loginResult.raw?.data || loginResult.raw;
    const user = d?.user || {};

    return NextResponse.json({
      token: d?.accessToken || "",
      refreshToken: d?.refreshToken || "",
      customer: {
        id: user.id,
        email: user.email || email,
        name: user.fullName || fullName,
        fullName: user.fullName || fullName,
        role: user.role || "customer",
        tenantId: user.tenantId,
        phone: user.phone || "",
      },
      message: "Account created successfully",
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
