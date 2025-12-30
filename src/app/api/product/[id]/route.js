import { handleGET } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  const { id } = await params;

  const url = new URL(req.url);
  let carat = url.searchParams.get("carat");
  carat = carat ? carat.replace(/k/i, "") : null;

  const headers = {
    "x-tenant-id": req.headers.get("x-tenant-id"),
    currency: req.headers.get("currency"),
    Accept: "application/json",
  };

  let apiPath = `api/store-web/customer/product-detail/${id}`;
  if (carat) {
    apiPath = `/api/store-web/customer/product-detail/${id}/${carat}`;
  }

  return handleGET(apiPath, headers);
}
