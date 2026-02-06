import { handlePUT, handleDELETE } from "@/lib/apiHandler";

export async function PUT(req, { params }) {
  try {
    const token = req.headers.get("authorization");
    const tenantId = req.headers.get("x-tenant-id");

    const headers = {
      "Content-Type": "application/json",
      ...(tenantId && { "x-tenant-id": tenantId }),
      Authorization: `Bearer ${token}`,
    };

    const body = await req.json();
    const { id } = params;

    const result = await handlePUT(
      `/api/store-web/customer/size-profile/update/${id}`,
      body,
      headers
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to update record" }), {
      status: 500,
    });
  }
}

// export async function DELETE(req, { params }) {
//   try {
//     const token = req.headers.get("authorization");
//     const tenantId = req.headers.get("x-tenant-id");

//     const headers = {
//       "Content-Type": "application/json",
//       ...(tenantId && { "x-tenant-id": tenantId }),
//       Authorization: `Bearer ${token}`,
//     };

//     return handleDELETE(
//       `/api/store-web/customer/size-profile/delete/${params.id}`,
//       headers
//     );
//   } catch (err) {
//     return new Response(JSON.stringify({ error: "Failed to delete record" }), {
//       status: 500,
//     });
//   }
// }

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
      `/api/store-web/customer/size-profile/delete/${id}`,
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
