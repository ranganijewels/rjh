import { handlePOST } from "@/lib/apiHandler";

export async function POST(req, context) {
  const { id } = await context.params;

  const rawAuth = req.headers.get("authorization") || "";
  const tenantId = req.headers.get("x-tenant-id");

  const token = rawAuth.replace(/^Bearer\s+/i, "");

  const headers = {
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  return handlePOST(
    req,
    `/api/store-web/customer/remove-wishlist-item/${id}`,
    headers
  );
}
