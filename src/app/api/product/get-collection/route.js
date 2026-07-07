import { NextResponse } from "next/server";
import { rjApi, transformProduct, attachPrices, consolidateDesignGroups } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const result = await rjApi("GET", "/products?limit=60&status=active");
    const raw = result.raw?.data || [];
    const mapped = consolidateDesignGroups(await attachPrices(raw.map(transformProduct))).slice(0, 8);
    return NextResponse.json({
      data: [
        { collection_name: "best seller", products: mapped },
        { collection_name: "new arrivals", products: mapped },
        { collection_name: "trending", products: mapped },
      ]
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
