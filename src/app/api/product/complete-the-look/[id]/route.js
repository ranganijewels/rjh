import { NextResponse } from "next/server";
import { rjApi, transformProduct, attachPrices, consolidateDesignGroups } from "@/lib/apiHandler";
export async function GET() {
  try {
    const result = await rjApi("GET", "/products?limit=60&status=active");
    const raw = result.raw?.data || [];
    const products = consolidateDesignGroups(await attachPrices(raw.map(transformProduct))).slice(0, 4);
    return NextResponse.json({ data: { complete_the_look: products } });
  } catch { return NextResponse.json({ data: { complete_the_look: [] } }); }
}
