import { handleGET } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  const { id } = await params;
  const tenantId = req.headers.get("x-tenant-id");
  const currency = req.headers.get("currency");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Accept: "application/json",
    Currency: currency,
  };

  return handleGET(`/api/store-web/customer/complete-the-look/${id}`, headers);
}
