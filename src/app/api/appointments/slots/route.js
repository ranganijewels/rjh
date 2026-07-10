import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// 30-min expert-consultation slots for a date (Mon–Fri 9–18 US Eastern).
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || "";
  try {
    const res = await fetch(
      `${NEST}/api/v1/storefront/appointments/slots?date=${encodeURIComponent(date)}`,
      { cache: "no-store", headers: { "x-tenant-id": TENANT } }
    );
    const j = await res.json();
    return NextResponse.json(j?.data ?? j, { status: res.status });
  } catch (e) {
    return NextResponse.json({ open: false, slots: [], error: e.message }, { status: 500 });
  }
}
