import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Metal-color master → swatch map for the storefront. Colors (incl. two-tone
// pairs) are managed in Admin → Catalog → Metal Colors; cached for 5 minutes.
export async function GET() {
  try {
    const res = await fetch(
      `${NEST}/api/v1/catalog-masters?kind=metal_color`,
      { headers: { "x-tenant-id": TENANT }, next: { revalidate: 300 } }
    );
    if (!res.ok) return NextResponse.json({ data: {} });
    const j = await res.json();
    const rows = Array.isArray(j) ? j : j?.data || [];
    const map = {};
    rows.forEach((c) => {
      if (c.status && c.status !== "active") return;
      const entry = {
        name: c.name,
        hex: c.metadata?.hex || null,
        hex2: c.metadata?.hex2 || null,
      };
      const nameKey = String(c.name || "").toUpperCase().trim();
      const codeKey = String(c.code || "").toUpperCase().trim();
      if (nameKey) map[nameKey] = entry;
      if (codeKey && codeKey !== nameKey) map[codeKey] = entry;
    });
    return NextResponse.json({ data: map });
  } catch {
    return NextResponse.json({ data: {} });
  }
}
