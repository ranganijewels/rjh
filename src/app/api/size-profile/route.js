import { handleGET, handlePOST } from "@/lib/apiHandler";

export async function GET(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  return handleGET("/api/store-web/customer/size-profile/list", headers);
}

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  try {
    return await handlePOST(
      req,
      "/api/store-web/customer/size-profile/save",
      headers
    );
  } catch (err) {
    console.error("Error in size-profile POST route:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
