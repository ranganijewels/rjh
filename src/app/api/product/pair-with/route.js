import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";
const H = { "x-tenant-id": TENANT };

const card = (p) => ({
  id: p.id,
  title: p.productName || p.title || "",
  image: p.mainImageUrl || p.media?.[0]?.fileUrl || "",
});

// "Pair It With" products: the admin-picked metadata.pairsWith ids first;
// falls back to Wedding Bands (excluding the current product).
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const exclude = searchParams.get("exclude") || "";
  try {
    let items = [];
    if (ids.length) {
      const fetched = await Promise.all(
        ids.map((id) =>
          fetch(`${NEST}/api/v1/products/${encodeURIComponent(id)}`, { cache: "no-store", headers: H })
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => j?.data ?? j)
            .catch(() => null)
        )
      );
      items = fetched.filter((p) => p && p.id && p.status === "active").map(card);
    }
    if (!items.length) {
      const res = await fetch(
        `${NEST}/api/v1/products?limit=6&status=active&category=${encodeURIComponent("Wedding Bands")}`,
        { cache: "no-store", headers: H }
      );
      const j = await res.json();
      items = (j?.data || [])
        .filter((p) => p.id !== exclude)
        .slice(0, 3)
        .map(card);
    }
    return NextResponse.json({ data: items });
  } catch (e) {
    return NextResponse.json({ data: [], error: e.message });
  }
}
