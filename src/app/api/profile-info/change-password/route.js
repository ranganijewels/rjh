import { handlePUT } from "@/lib/apiHandler";

export async function PUT(req) {
  try {
    const token = req.headers.get("authorization");
    const tenantId = req.headers.get("x-tenant-id");

    const headers = {
      "x-tenant-id": tenantId,
      Authorization: `Bearer ${token}`,
    };

    const body = await req.json();

    return handlePUT("/api/store-web/customer/change-password", body, headers);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
