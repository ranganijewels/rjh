import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Product-badge master (New/Bestseller/Sale/...) → color map for the
// storefront. Managed in Admin → Catalog → Product Badges; cached for 5 minutes.
export async function GET() {
  try {
    const res = await fetch(
      `${NEST}/api/v1/catalog-masters?kind=product_badge`,
      { headers: { "x-tenant-id": TENANT }, next: { revalidate: 300 } }
    );
    if (!res.ok) return NextResponse.json({ data: {} });
    const j = await res.json();
    const rows = Array.isArray(j) ? j : j?.data || [];
    const map = {};
    rows.forEach((b) => {
      if (b.status && b.status !== "active") return;
      const entry = { name: b.name, hex: b.metadata?.hex || null };
      const nameKey = String(b.name || "").toUpperCase().trim();
      const codeKey = String(b.code || "").toUpperCase().trim();
      if (nameKey) map[nameKey] = entry;
      if (codeKey && codeKey !== nameKey) map[codeKey] = entry;
    });
    return NextResponse.json({ data: map });
  } catch {
    return NextResponse.json({ data: {} });
  }
}
