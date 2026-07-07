import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    if (token) await rjApi("POST", "/auth/logout", { headers: { Authorization: `Bearer ${token}` } });
  } catch {}
  return NextResponse.json({ message: "Logged out successfully" });
}
