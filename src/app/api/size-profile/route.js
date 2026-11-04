import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { bearer } from "@/lib/wishlist";
import { toApi, fromApi, apiError } from "@/lib/sizeProfiles";

export async function GET(req) {
  const result = await rjApi("GET", "/storefront/size-profiles", {
    headers: { Authorization: `Bearer ${bearer(req)}` },
  });
  if (!result.ok) {
    return NextResponse.json(apiError(result, "Failed to load size profiles"), { status: result.status });
  }
  const list = Array.isArray(result.raw?.data) ? result.raw.data : [];
  return NextResponse.json({ status: true, data: list.map(fromApi) });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const result = await rjApi("POST", "/storefront/size-profiles", {
    headers: { Authorization: `Bearer ${bearer(req)}` },
    body: toApi(body),
  });
  if (!result.ok) {
    return NextResponse.json(apiError(result, "Failed to save size profile"), { status: result.status });
  }
  return NextResponse.json({ status: true, message: "Size profile saved", data: fromApi(result.raw?.data) });
}
