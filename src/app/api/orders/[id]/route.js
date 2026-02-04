import { handleGET } from "@/lib/apiHandler";

export async function GET(req, { params }) {
  const { id } = await params;
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  try {
    return handleGET(
      `/api/store-web/customer/order/generate-invoice/${id}`,
      headers
    );
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
