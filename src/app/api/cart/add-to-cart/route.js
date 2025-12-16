import { handlePOST } from "@/lib/apiHandler";

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  return handlePOST(
    req,
    "/api/store-web/customer/add-to-cart-product",
    headers
  );
}
