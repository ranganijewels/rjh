import { handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: authHeader,
  };

  return handleGET(
    `/api/cms/about-us/get-about-us/${tenantId}/about-us`,
    headers
  );
}
