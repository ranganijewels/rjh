import { useSelector } from "react-redux";

export const createCrudClient = (baseUrl) => {
  // const token = useSelector((state) => state.auth.token);
  const token = localStorage.getItem("authTokenElova");
  const storeId = process.env.NEXT_PUBLIC_TENANT_ID;
  const customerId = useSelector((state) => state.auth?.customer?.id);

  const getAuthHeaders = () => ({
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(storeId && { "x-tenant-id": storeId }),
    Accept: "application/json",
    ...(customerId && { "x-customer-id": customerId }),
  });

  return {
    fetchAll: async (payload = {}) => {
      const queryString = new URLSearchParams(payload).toString();
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },

    fetchById: async (idOrPath, options = {}) => {
      const { headers = {}, query = {}, raw = false } = options;

      const queryString = new URLSearchParams(query).toString();
      const url = queryString
        ? `${baseUrl}/${idOrPath}?${queryString}`
        : `${baseUrl}/${idOrPath}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
          ...headers,
        },
        // credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`FetchById failed (${res.status}): ${text}`);
      }

      return raw ? res : res.json();
    },

    create: async (payload) => {
      const finalPayload = {
        ...payload,
      };

      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create record");
      }

      return res.json();
    },
    // inside useCrudApi
    // create: async (payload = null, extra = {}, dynamicId) => {
    //   let url = baseUrl;
    //   if (dynamicId) url = `${baseUrl}/${dynamicId}`;

    //   const hasPayload = payload !== null && payload !== undefined;
    //   const headers = {
    //     ...getAuthHeaders(),
    //     "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID || "",
    //     ...(hasPayload && { "Content-Type": "application/json" }),
    //     ...extra.headers,
    //   };

    //   const res = await fetch(url, {
    //     method: "POST",
    //     headers,
    //     ...(hasPayload && { body: JSON.stringify(payload) }),
    //   });

    //   if (!res.ok) {
    //     const errorData = await res.json().catch(() => ({}));
    //     throw new Error(errorData.message || "Failed to perform POST request");
    //   }

    //   return res.json();
    // },

    create: async (payload = null, extra = {}, dynamicId) => {
      let url = baseUrl;
      if (dynamicId) url = `${baseUrl}/${dynamicId}`;

      const formBody = extra.body || payload;
      const isFormData = formBody instanceof FormData;

      const headers = {
        ...getAuthHeaders(),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...extra.headers,
      };

      const body = isFormData
        ? formBody
        : formBody
        ? JSON.stringify(formBody)
        : null;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to perform POST request");
      }

      return res.json();
    },

    update: async (id, payload) => {
      let url = baseUrl;
      let body;

      if (payload === undefined && typeof id === "object") {
        body = id;
      } else {
        url = `${baseUrl}/${id}`;
        body = payload;
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update record");
      }

      return res.json();
    },

    remove: async (id) => {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete record");
      }
      return res.json();
    },

    toggleStatus: async (id, is_active) => {
      const res = await fetch(`${baseUrl}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ is_active }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to toggle status");
      }
      return res.json();
    },
  };
};

// Old Code

// import { useSelector } from "react-redux";

// export const createCrudClient = (baseUrl) => {
//   const token = useSelector((state) => state.auth.token);
//   const storeId = process.env.NEXT_PUBLIC_TENANT_ID;

//   const getAuthHeaders = () => ({
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...(storeId && { "x-tenant-id": storeId }),
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   });

//   return {
//     fetchAll: async (payload = {}) => {
//       const queryString = new URLSearchParams(payload).toString();
//       const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

//       const res = await fetch(url, {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error("Failed to fetch data");
//       return res.json();
//     },
//     fetchById: async (id) => {
//       const res = await fetch(`${baseUrl}/${id}`, {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error("Failed to fetch data by ID");
//       return await res.json();
//     },

//     create: async (payload) => {
//       const finalPayload = {
//         ...payload,
//       };

//       const res = await fetch(baseUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//         body: JSON.stringify(finalPayload),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Failed to create record");
//       }

//       return res.json();
//     },
//     create: async (payload) => {
//       const res = await fetch(baseUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) {
//         throw new Error(data?.message || "Failed to create record");
//       }

//       if backend uses { status: false } to signal errors:
//       if (data && data.status === false) {
//         throw new Error(data.message || "Request failed");
//       }

//       return data;
//     },

//     update: async (id, payload) => {
//       const res = await fetch(`${baseUrl}/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Failed to update record");
//       }
//       return res.json();
//     },

//     remove: async (id) => {
//       const res = await fetch(`${baseUrl}/${id}`, {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Failed to delete record");
//       }
//       return res.json();
//     },

//     toggleStatus: async (id, is_active) => {
//       const res = await fetch(`${baseUrl}/${id}/status`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//         body: JSON.stringify({ is_active }),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Failed to toggle status");
//       }
//       return res.json();
//     },
//   };
// };
