import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", `/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return NextResponse.json({ data: result.raw?.data || {} });
  } catch { return NextResponse.json({ data: {} }); }
}
