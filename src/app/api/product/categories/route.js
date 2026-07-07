import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const result = await rjApi("GET", "/masters/categories");
    const cats = result.raw?.data || [];
    const jewelry = cats.find(c => c.categoryKey === "jewelry_category");
    const values = jewelry?.values || [];
    return NextResponse.json({
      data: values.map(v => ({ id: v.id, name: v.valueLabel, slug: v.valueKey, image: "" }))
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
