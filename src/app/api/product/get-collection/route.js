import { handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const tenantId = req.headers.get("x-tenant-id");
  const currency =
    req.headers.get("currency") ||
    req.headers.get("Currency") ||
    req.headers.get("x-currency");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    ...(currency && { Currency: currency }),
  };

  return handleGET(`/api/store-web/customer/get-all-collection`, headers);
}
