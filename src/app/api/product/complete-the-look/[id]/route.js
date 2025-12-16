import { handleGET } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  const { id } = params;
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Accept: "application/json",
  };

  return handleGET(`/api/store-web/customer/complete-the-look/${id}`, headers);
}
