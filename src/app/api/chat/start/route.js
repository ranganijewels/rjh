import { rjApi } from "@/lib/apiHandler";

// Start a new live-chat conversation (public). Proxies to NestJS so the
// tenant header stays server-side.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const r = await rjApi("POST", "/storefront/chat/start", { body });
  return Response.json(r.raw, { status: r.status });
}
