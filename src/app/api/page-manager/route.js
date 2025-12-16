import { handleGET } from "@/lib/apiHandler";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  
  const headers = {
    "Content-Type": "application/json",
  };

  return handleGET(
    `/api/cms/common/get-static-pages/${tenantId}/${searchParams.get(
      "page_slug"
    )}`,
    headers
  );
}
