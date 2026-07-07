import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ data: [{ id: 1, name: "General" }, { id: 2, name: "Shipping" }, { id: 3, name: "Returns" }] }); }
