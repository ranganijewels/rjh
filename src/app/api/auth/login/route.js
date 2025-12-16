import { handlePOST } from "@/lib/apiHandler";
export async function POST(req) {
  return handlePOST(
    req,
    "/api/store-web/customer/login",
    { "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID },
    { setAuthCookie: true }
  );
}
