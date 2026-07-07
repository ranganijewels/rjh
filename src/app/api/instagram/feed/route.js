import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export const revalidate = 3600; // Next.js cache mirrors backend 1h Redis cache

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "12";
    const result = await rjApi("GET", `/instagram/feed?limit=${limit}`);
    // NestJS: { success, data: { data: [...] } } — two levels of data wrapping
    const items = result.raw?.data?.data || [];
    return NextResponse.json({ data: items });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
