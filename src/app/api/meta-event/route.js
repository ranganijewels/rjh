import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { marketingFromRequest } from "@/lib/marketingServer";

// Relays a consented browser event to the API, which forwards it to Meta's
// Conversions API with the same event_id the Pixel used (so Meta de-duplicates).
export async function POST(req) {
  try {
    const m = marketingFromRequest(req);
    if (!m.consent) return NextResponse.json({ accepted: false }, { status: 202 });
    const b = await req.json().catch(() => ({}));
    await rjApi("POST", "/marketing/events", {
      headers: { "x-client-ip": m.ip || "" },
      body: {
        event_name: b.event_name,
        event_id: b.event_id,
        custom_data: b.custom_data,
        source_url: b.source_url || m.source_url,
        consent: true,
        fbp: m.fbp,
        fbc: m.fbc,
        ip: m.ip,
        ua: m.ua,
      },
    });
    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch {
    return NextResponse.json({ accepted: false }, { status: 202 });
  }
}
