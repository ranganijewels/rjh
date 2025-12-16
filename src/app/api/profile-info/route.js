import { handleGET, handlePUT } from "@/lib/apiHandler";

export async function GET(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  return handleGET(`/api/store-web/customer/profile-info`, headers);
}

export async function PUT(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  const body = await req.json();

  return handlePUT(`/api/store-web/customer/update-profile`, body, headers);
}
