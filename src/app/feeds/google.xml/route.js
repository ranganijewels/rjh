import { rjApi } from "@/lib/apiHandler";

// Raw RSS/XML for Google Merchant Center.
export const revalidate = 3600;

export async function GET() {
  const res = await rjApi("GET", "/feeds/google.xml");
  const body = res.raw?.data?.body ?? res.raw?.body ?? "";
  return new Response(body, {
    status: body ? 200 : 502,
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
