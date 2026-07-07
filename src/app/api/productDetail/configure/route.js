// Storefront → enterprise Configurator. Resolves a configured variant (weights +
// live price from the engine) for the selected axes. Public (no auth needed).
const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${NEST}/api/v1/catalog/configure`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": TENANT },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    const data = json?.data ?? json;
    return Response.json({ status: res.ok, data }, { status: res.ok ? 200 : res.status });
  } catch (e) {
    return Response.json({ status: false, error: e.message }, { status: 500 });
  }
}
