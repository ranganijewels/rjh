import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ data: ["10K","14K","18K","Silver"].map((c,i) => ({ id: i+1, name: c, value: c })) });
}
