"use client";

import { useState, useEffect } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";

// `initialData` (server-rendered homepage) skips the client fetch entirely, so
// the page paints with its content instead of shifting when data arrives.
export const useHomepageData = (initialData = null) => {
  const { fetchAll } = useCrudApi(`/api/home`);
  const [homeData, setHomeData] = useState(initialData);
  const [loadingHome, setLoadingHome] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    let isMounted = true;
    setLoadingHome(true);

    fetchAll()
      .then((res) => {
        if (isMounted) setHomeData(res?.data || []);
      })
      .catch((err) => console.error("Error fetching homepage", err))
      .finally(() => {
        if (isMounted) setLoadingHome(false);
      });

    return () => (isMounted = false);
  }, [fetchAll, initialData]);

  return {
    homeData,
    loadingHome,
  };
};
