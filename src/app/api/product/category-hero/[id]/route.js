import { handleGET } from "@/lib/apiHandler";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const tenantId = req.headers.get("x-tenant-id");
    const token = req.headers.get("authorization");

    const headers = {
      "Content-Type": "application/json",
      "x-tenant-id": tenantId,
      Authorization: token ? `Bearer ${token}` : "",
    };

    const endpoint = `/api/cms/productpage/get-category-hero/${tenantId}/${id}`;

    return handleGET(endpoint, headers);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
