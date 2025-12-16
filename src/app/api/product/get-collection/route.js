import { handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
  };

  return handleGET(`/api/store-web/customer/get-all-collection`, headers);
}
