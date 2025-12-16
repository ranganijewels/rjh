import { handleGET, handlePOST } from "@/lib/apiHandler";

export async function GET(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  return handleGET(`/api/store-web/customer/get-countries`, headers);
}

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");
  const customerId = req.headers.get("x-customer-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
    "x-customer-id": customerId,
  };

  return handlePOST(
    req,
    `/api/store-web/customer/country-currency/save`,
    headers
  );
}
