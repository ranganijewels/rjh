import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
export async function DELETE(req, { params }) {
  const { id } = await params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  await rjApi("POST", "/storefront/wishlist", { headers: { Authorization: `Bearer ${token}` }, body: { productId: id } });
  return NextResponse.json({ status: true });
}
