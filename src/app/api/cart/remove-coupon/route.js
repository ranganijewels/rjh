import { handlePOST } from "@/lib/apiHandler";

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: token || "",
  };

  // Force empty JSON so req.json() does not throw
  req.json = async () => ({});

  return handlePOST(req, "/api/store-web/customer/remove-coupon", headers);
}
