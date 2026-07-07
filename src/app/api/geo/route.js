import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Detect the visitor's country/currency from their IP (resolved server-side).
export async function GET(req) {
  // Real client IP as seen by this Next.js server.
  const fwd =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "";
  try {
    const res = await fetch(`${NEST}/api/v1/currencies/geo`, {
      headers: {
        "x-tenant-id": TENANT,
        ...(fwd && { "x-forwarded-for": fwd }),
      },
      cache: "no-store",
    });
    const json = await res.json();
    const c = json?.data || json || {};
    return NextResponse.json({
      data: {
        name: c.countryName,
        iso_alpha2: c.countryCode,
        currency_code: c.currencyCode,
        currency_symbol: c.currencySymbol,
        rate: Number(c.rate) || 1,
      },
    });
  } catch (e) {
    return NextResponse.json({
      data: {
        name: "United States",
        iso_alpha2: "US",
        currency_code: "USD",
        currency_symbol: "$",
        rate: 1,
      },
    });
  }
}
