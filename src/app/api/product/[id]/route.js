import { NextResponse } from "next/server";
import { rjApi, transformProduct } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const result = await rjApi("GET", `/products/${id}`);
    if (!result.ok) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    const raw = result.raw?.data || result.raw;
    const p = transformProduct(raw);
    return NextResponse.json({ data: { ...p, images: raw?.media?.map(m => m.url) || [] } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
