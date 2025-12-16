import { handleGET, handlePOST } from "@/lib/apiHandler";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: authHeader,
  };

  return handleGET(
    `/api/cms/customize/get-customize/${tenantId}/customize`,
    headers
  );
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

  return handlePOST(req, `/api/store-web/customer/custom-request`, headers);
}
