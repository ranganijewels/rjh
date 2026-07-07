import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ status: true, message: "Return/repair request submitted." }); }
