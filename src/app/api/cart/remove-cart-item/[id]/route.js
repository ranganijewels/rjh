import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

async function removeItem(req, params) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const guestId = req.headers.get("x-guest-id") || "";
    await rjApi("DELETE", `/storefront/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}`, ...(guestId && { "x-guest-id": guestId }) },
    });
    return NextResponse.json({ status: true, message: "Item removed" });
  } catch (e) {
    return NextResponse.json({ status: false, message: e.message });
  }
}

export async function DELETE(req, { params }) { return removeItem(req, params); }
export async function POST(req, { params }) { return removeItem(req, params); }
