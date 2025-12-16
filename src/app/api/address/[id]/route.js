import { handleDELETE, handlePUT } from "@/lib/apiHandler";

export async function PUT(req, { params }) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
    Authorization: `Bearer ${token}`,
  };

  const body = await req.json();

  return handlePUT(
    `/api/store-web/customer/address/update/${params.id}`,
    body,
    headers
  );
}
export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization");
    const tenantId = req.headers.get("x-tenant-id");

    const headers = {
      "Content-Type": "application/json",
      ...(tenantId && { "x-tenant-id": tenantId }),
      Authorization: `Bearer ${token}`,
    };

    return handleDELETE(
      `/api/store-web/customer/address/delete/${params.id}`,
      headers
    );
  } catch (err) {
    console.error("Error deleting address:", err);
    return new Response(JSON.stringify({ error: "Failed to delete record" }), {
      status: 500,
    });
  }
}
