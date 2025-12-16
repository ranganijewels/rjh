export const storeAdminCrud = (baseUrl) => {
  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storeId =
      typeof window !== "undefined" ? localStorage.getItem("store_id") : null;

    return {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(storeId && { "x-tenant-id": storeId }),
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  return {
    fetchAll: async (payload = {}) => {
      const queryString = new URLSearchParams(payload).toString();
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
    fetchById: async (id) => {
      const res = await fetch(`${baseUrl}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch data by ID");
      return await res.json();
    },

    create: async (payload) => {
      const finalPayload = {
        ...payload
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

    update: async (id, payload) => {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
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
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
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
