import { rjApi } from "@/lib/apiHandler";

// Visitor posts a message into an existing conversation.
export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const r = await rjApi("POST", `/storefront/chat/${id}/messages`, { body });
  return Response.json(r.raw, { status: r.status });
}

// Poll for messages; `after` (ISO timestamp) returns only newer ones.
export async function GET(req, { params }) {
  const { id } = await params;
  const after = new URL(req.url).searchParams.get("after");
  const path = `/storefront/chat/${id}/messages${after ? `?after=${encodeURIComponent(after)}` : ""}`;
  const r = await rjApi("GET", path);
  return Response.json(r.raw, { status: r.status });
}
