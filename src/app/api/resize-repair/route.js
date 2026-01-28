import { handlePOST } from "@/lib/apiHandler";

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "x-tenant-id": tenantId,
    Authorization: token,
  };

  return handlePOST(
    req,
    "/api/store-web/customer/resize-repair-request",
    headers
  );
}
