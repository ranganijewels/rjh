import { handlePOST } from "@/lib/apiHandler";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");
  const currency = req.headers.get("currency");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: authHeader,
    currency: currency,
    Accept: "application/json",
  };

  return handlePOST(req, `/api/store-web/customer/get-amount`, headers);
}
