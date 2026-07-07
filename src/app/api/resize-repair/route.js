import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ status: true, message: "Request submitted. We'll contact you within 24 hours." }); }
