import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    const tenantId =
      req.headers.get("x-tenant-id") || process.env.NEXT_PUBLIC_TENANT_ID;

    if (!token)
      return NextResponse.json({ error: "No token found" }, { status: 401 });

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/store-web/customer/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenantId,
          Authorization: token,
        },
        body: JSON.stringify({ token }),
      }
    );

    const text = await backendRes.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: "Invalid JSON from backend", raw: text };
    }

    return NextResponse.json(data, {
      status: backendRes.ok ? 200 : backendRes.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server crashed", details: err.message },
      { status: 500 }
    );
  }
}
