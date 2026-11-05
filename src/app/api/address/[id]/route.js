import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { fromApiAddress, toApiAddress } from "@/lib/addressMap";

export async function PUT(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const payload = toApiAddress(body, { partial: true });
    const result = await rjApi("PATCH", `/storefront/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` }, body: payload });
    if (!result.ok) return NextResponse.json({ status: false }, { status: 400 });
    return NextResponse.json({ status: true, data: fromApiAddress(result.raw?.data || {}) });
  } catch (e) { return NextResponse.json({ status: false }, { status: 500 }); }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const { id } = await params;
    await rjApi("DELETE", `/storefront/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return NextResponse.json({ status: true });
  } catch (e) { return NextResponse.json({ status: false }, { status: 500 }); }
}
