import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ data: null }); }
export async function POST() { return NextResponse.json({ status: true, message: "Size profile saved" }); }
