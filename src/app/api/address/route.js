import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { fromApiAddress, toApiAddress } from "@/lib/addressMap";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/storefront/addresses", { headers: { Authorization: `Bearer ${token}` } });
    const addresses = Array.isArray(result.raw?.data) ? result.raw.data : [];
    // Default first, then newest, so checkout can show the default on top.
    const list = addresses
      .map(fromApiAddress)
      .sort((a, b) => b.is_default - a.is_default);
    return NextResponse.json({ data: list });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const body = await req.json().catch(() => ({}));
    const payload = toApiAddress(body);
    const result = await rjApi("POST", "/storefront/addresses", { headers: { Authorization: `Bearer ${token}` }, body: payload });
    if (!result.ok) {
      return NextResponse.json({ status: false, message: result.raw?.message || "Could not save the address" }, { status: result.status || 400 });
    }
    return NextResponse.json({ status: true, data: fromApiAddress(result.raw?.data || { ...payload }) });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
