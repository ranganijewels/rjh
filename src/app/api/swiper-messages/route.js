import { handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const tenantId = req.headers.get("x-tenant-id");

  return handleGET(`/api/cms/common/header-messages/list/${tenantId}`);
}
