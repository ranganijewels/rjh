import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ data: [
    { id: 1, name: "Jewelry Tips", slug: "tips" },
    { id: 2, name: "Trends", slug: "trends" },
    { id: 3, name: "Care Guide", slug: "care" },
  ]});
}
