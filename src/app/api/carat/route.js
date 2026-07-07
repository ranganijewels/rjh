import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ data: ["14K","18K","22K","24K","Platinum","Silver"].map((c,i) => ({ id: i+1, name: c, value: c })) });
}
