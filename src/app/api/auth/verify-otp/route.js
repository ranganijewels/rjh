import { NextResponse } from "next/server";
// OTP verification - auto-approve since our API doesn't use OTP for registration
export async function POST(req) {
  return NextResponse.json({ message: "Verified successfully", status: true });
}
