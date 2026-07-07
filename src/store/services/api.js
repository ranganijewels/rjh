export const apiGet = async (url, token, extraHeaders = {}) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID,
      ...extraHeaders,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

// export const apiPost = async (url, body, extraHeaders = {}) => {
//   const token = localStorage.getItem("authTokenRJHouse");
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//       "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID,
//     },
//     credentials: "include",
//     body: JSON.stringify(body),
//   });

//   const text = await response.text();

//   let result;
//   try {
//     result = text ? JSON.parse(text) : null;
//   } catch {
//     result = text;
//   }

//   if (!response.ok) {
//     // always throw an object with message
//     throw {
//       message:
//         (result && result.message) ||
//         (typeof result === "string" ? result : null) ||
//         "Request failed",
//     };
//   }

//   return result;
// };

export const apiPost = async (url, body) => {
  const token = localStorage.getItem("authTokenRJHouse");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID,
  };

  let payload = null;

  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: payload,
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw {
      message: result?.message || "Request failed",
    };
  }

  return result;
};
