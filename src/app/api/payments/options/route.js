import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Online payment mode and, when the store charges online payments in a fixed
// currency (CASHFREE_CHARGE_CURRENCY on the API), that currency and its rate
// from USD, so checkout can show the exact amount before the customer pays.
export async function GET() {
  try {
    const result = await rjApi("GET", "/storefront/payment-options");
    if (!result.ok) {
      return NextResponse.json({ status: false, data: null }, { status: result.status || 400 });
    }
    return NextResponse.json({ status: true, data: result.raw?.data || null });
  } catch {
    return NextResponse.json({ status: false, data: null }, { status: 500 });
  }
}
