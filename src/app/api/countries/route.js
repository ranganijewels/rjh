import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Shape a NestJS currency row into what CountryCurrencyModal expects.
function shape(c) {
  return {
    name: c.countryName,
    iso_alpha2: c.countryCode,
    currency_code: c.currencyCode,
    currency_symbol: c.currencySymbol,
    rate: Number(c.rate) || 1,
  };
}

export async function GET() {
  try {
    const res = await fetch(`${NEST}/api/v1/currencies`, {
      headers: { "x-tenant-id": TENANT },
      cache: "no-store",
    });
    const json = await res.json();
    const rows = (json?.data || json || []).map(shape);
    return NextResponse.json({ data: rows });
  } catch (e) {
    // Fallback so the storefront never breaks if the API is unreachable.
    return NextResponse.json({
      data: [
        {
          name: "United States",
          iso_alpha2: "US",
          currency_code: "USD",
          currency_symbol: "$",
          rate: 1,
        },
      ],
    });
  }
}

// The country modal POSTs the chosen country to persist a preference.
// We accept and acknowledge; persistence happens client-side via localStorage.
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ status: true, data: body });
  } catch (e) {
    return NextResponse.json({ status: true });
  }
}
