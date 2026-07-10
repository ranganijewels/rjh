import { NextResponse } from "next/server";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Diamond clarity/quality chips for the PDP (from the Diamond Quality master).
export async function GET() {
  try {
    const res = await fetch(
      `${NEST}/api/v1/catalog-masters?kind=diamond_quality`,
      { headers: { "x-tenant-id": TENANT }, next: { revalidate: 300 } }
    );
    if (!res.ok) return NextResponse.json({ data: [] });
    const j = await res.json();
    const rows = Array.isArray(j) ? j : j?.data || [];
    return NextResponse.json({
      data: rows
        .filter((r) => r.status === "active")
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((r) => ({ code: r.code, name: r.name })),
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
