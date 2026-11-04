import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { bearer } from "@/lib/wishlist";
import { toApi, fromApi, apiError } from "@/lib/sizeProfiles";

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const result = await rjApi("PATCH", `/storefront/size-profiles/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${bearer(req)}` },
    body: toApi(body),
  });
  if (!result.ok) {
    return NextResponse.json(apiError(result, "Failed to update size profile"), { status: result.status });
  }
  return NextResponse.json({ status: true, message: "Size profile updated", data: fromApi(result.raw?.data) });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const result = await rjApi("DELETE", `/storefront/size-profiles/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${bearer(req)}` },
  });
  if (!result.ok) {
    return NextResponse.json(apiError(result, "Failed to delete size profile"), { status: result.status });
  }
  return NextResponse.json({ status: true, message: "Size profile deleted" });
}
