import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const result = await rjApi("GET", `/cms/pages/${slug}`);
    const page = result.raw?.data || {};
    return NextResponse.json({ data: { title: page.title || slug, content: page.content || "", slug } });
  } catch { return NextResponse.json({ data: { title: "", content: "" } }); }
}
