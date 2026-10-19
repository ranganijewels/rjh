import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Diamond colour/clarity choices with live rates for a product (Diamond Rate Master).
export async function GET(req, { params }) {
  const { id } = await params;
  const carat = new URL(req.url).searchParams.get("carat");
  const qs = carat ? `?carat=${encodeURIComponent(carat)}` : "";
  const res = await rjApi("GET", `/pricing/diamond-options/${encodeURIComponent(id)}${qs}`);
  const data = res.raw?.data ?? {};
  return NextResponse.json({
    data: {
      colors: Array.isArray(data.colors) ? data.colors : [],
      clarities: Array.isArray(data.clarities) ? data.clarities : [],
      defaultColor: data.defaultColor || null,
      defaultClarity: data.defaultClarity || null,
    },
  });
}
