// import { NextResponse } from "next/server";
// import { handlePOST } from "@/lib/apiHandler";

// export async function POST(req) {
//   const token = req.headers.get("authorization");
//   const tenantId = req.headers.get("x-tenant-id");

//   const headers = {
//     "x-tenant-id": tenantId,
//     Authorization: token,
//   };

//   return handlePOST(
//     req,
//     "/api/store-web/customer/submit-return-repair-request",
//     headers
//   );
// }

import { NextResponse } from "next/server";

export async function POST(req) {
  const token = req.headers.get("authorization");
  const tenantId = req.headers.get("x-tenant-id");

  const targetUrl =
    process.env.NEXT_PUBLIC_API_URL +
    "/api/store-web/customer/submit-return-repair-request";

  const formData = await req.formData();

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      Authorization: token,
      "x-tenant-id": tenantId,
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
