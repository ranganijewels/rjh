import { handleDELETE, handlePUT } from "@/lib/apiHandler";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const tenantId = req.headers.get("x-tenant-id");

    const headers = {
      ...(tenantId && { "x-tenant-id": tenantId }),
      Authorization: `Bearer ${token}`,
    };

    const body = await req.json();

    return handlePUT(
      `/api/store-web/customer/address/update/${id}`,
      body,
      headers
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const tenantId = req.headers.get("x-tenant-id");

    const headers = {
      ...(tenantId && { "x-tenant-id": tenantId }),
      Authorization: `Bearer ${token}`,
    };

    return handleDELETE(
      `/api/store-web/customer/address/delete/${id}`,
      headers
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to delete record",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
