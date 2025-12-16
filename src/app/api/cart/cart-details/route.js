import { handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");
  const currency = req.headers.get("currency");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
    currency: currency,
  };

  return handleGET(`/api/store-web/customer/cart-detail`, headers);
}
