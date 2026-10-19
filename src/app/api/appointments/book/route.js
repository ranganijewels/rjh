import { NextResponse } from "next/server";
import { marketingFromRequest } from "@/lib/marketingServer";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Book a 30-min expert consultation (public).
export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${NEST}/api/v1/storefront/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": TENANT },
      body: JSON.stringify({ ...body, marketing: marketingFromRequest(req) }),
    });
    const j = await res.json();
    return NextResponse.json(
      { status: res.ok, data: j?.data ?? j, message: j?.message },
      { status: res.status }
    );
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
