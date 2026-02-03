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

    create: async (payload = null, extra = {}, dynamicId) => {
      const normalizeError = extra.normalizeError === true;
      let url = baseUrl;
      if (dynamicId) url = `${baseUrl}/${dynamicId}`;

      const formBody = extra.body || payload;
      const isFormData = formBody instanceof FormData;

      const headers = {
        ...getAuthHeaders(),
        ...(formBody ? { "Content-Type": "application/json" } : {}),
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
        const errorResponse = await res.json().catch(() => ({}));

        if (!normalizeError) {
          throw new Error(errorResponse.message || "Failed request");
        }

        const err = new Error(errorResponse.message);
        err.errors = errorResponse.error || errorResponse.errors;
        throw err;
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
