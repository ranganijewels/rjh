import { handlePOST } from "@/lib/apiHandler";

export async function POST(req) {
  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID,
  };

  return handlePOST(req, "/api/store-web/customer/verify-email-otp", headers);
}
