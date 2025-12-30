import { handlePOST } from "@/lib/apiHandler";

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");
  const customerId = req.headers.get("x-customer-id");
  const currency = req.headers.get("currency");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
    "x-customer-id": customerId,
    currency: currency,
  };

  return handlePOST(req, `/api/store-web/customer/product-list`, headers);
}
