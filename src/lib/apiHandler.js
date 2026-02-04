import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.jewellabel.in";

export async function handleGET(apiPath, headers = {}, queryParams = {}) {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${BASE_URL}${apiPath}${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: "Failed to fetch data" }));
      return NextResponse.json(errorData, { status: res.status });
    }

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function handlePOST(
  req,
  apiPath,
  customHeaders = {},
  { setAuthCookie = false } = {}
) {
  let body;
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    body = await req.json();
    customHeaders["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${apiPath}`, {
    method: "POST",
    headers: customHeaders,
    body,
  });

  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { error: text || "Unknown backend error" };
  }

  // Continue processing the response
  const isProduction = process.env.NODE_ENV === "production";
  if (data?.data?.token) {
    return NextResponse.json(
      { customer: data.data.customer, token: data.data.token },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: response.status });
}

export async function handlePUT(apiPath, body, customHeaders = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const response = await fetch(`${BASE_URL}${apiPath}`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update data" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function handleDELETE(apiPath, customHeaders = {}) {
  try {
    const response = await fetch(`${BASE_URL}${apiPath}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        ...customHeaders,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to delete", details: errorText },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function handlePATCH(req, apiPath, customHeaders = {}) {
  try {
    const body = await req.json();
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const response = await fetch(`${BASE_URL}${apiPath}`, {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to patch data", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function handleGETFile(apiPath, headers = {}, queryParams = {}) {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${BASE_URL}${apiPath}${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: res.status }
      );
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          res.headers.get("content-type") || "application/octet-stream",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
