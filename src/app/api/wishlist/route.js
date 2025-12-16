import { handlePOST, handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };
  return handleGET(`/api/store-web/customer/get-wish-list`, headers);
}

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };
  return handlePOST(req, "/api/store-web/customer/toggle-wish-list", headers);
}
