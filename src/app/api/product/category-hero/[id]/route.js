import { handleGET } from "@/lib/apiHandler";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const tenantId = req.headers.get("x-tenant-id");
    const authHeader = req.headers.get("authorization");

    const headers = {
      Accept: "application/json",
    };

    if (tenantId) headers["x-tenant-id"] = tenantId;
    if (authHeader) headers.Authorization = authHeader;

    const endpoint = `/api/cms/productpage/get-category-hero/${tenantId}/${id}`;

    return handleGET(endpoint, headers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
