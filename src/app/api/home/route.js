import { NextResponse } from "next/server";
import { buildHomeData } from "@/lib/homeData";

export async function GET() {
  const data = await buildHomeData();
  return data
    ? NextResponse.json({ data })
    : NextResponse.json({ data: {} }, { status: 500 });
}
