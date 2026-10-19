import { rjApi } from "@/lib/apiHandler";

// Raw CSV for Meta Commerce Manager scheduled feed (the API wraps it in JSON).
export const revalidate = 3600;

export async function GET() {
  const res = await rjApi("GET", "/feeds/meta.csv");
  const body = res.raw?.data?.body ?? res.raw?.body ?? "";
  return new Response(body, {
    status: body ? 200 : 502,
    headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
