import { createCrudClient } from "@/services/createCrudClient";
import { useCallback } from "react";

export const useCrudApi = (baseUrl) => {
  const api = createCrudClient(baseUrl);

  return {
    fetchAll: useCallback(api.fetchAll, []),
    fetchByPages: useCallback(api.fetchByPages, []),
    fetchById: useCallback(api.fetchById, []),
    create: useCallback(api.create, []),
    update: useCallback(api.update, []),
    remove: useCallback(api.remove, []),
    toggleStatus: useCallback(api.toggleStatus, []),
    approveRequest: useCallback(api.approveRequest, []),
  };
};
