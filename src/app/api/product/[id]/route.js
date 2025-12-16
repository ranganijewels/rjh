import { NextResponse } from "next/server";
import { handleGET } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  const { id } = params;
  const url = new URL(req.url);
let carat = url.searchParams.get("carat");
  if (carat) {
    carat = carat.replace(/k/i, "");
  } else {
    carat = null;
  }
  console.log("Carat Parameter:", carat);

  const authHeader = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");
  const currency = req.headers.get("currency");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: authHeader,
    currency: currency,
  };

  let apiPath = `/api/store-web/customer/product-detail/${id}`;

  if (carat) {
    apiPath = `/api/store-web/customer/product-detail/${id}/${carat}`;
  }

  return handleGET(apiPath, headers);
}
