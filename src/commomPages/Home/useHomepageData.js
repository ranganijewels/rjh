"use client";

import { useState, useEffect } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";

export const useHomepageData = () => {
  const { fetchAll } = useCrudApi(`/api/home`);
  const [homeData, setHomeData] = useState(null);
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
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
  }, [fetchAll]);

  return {
    homeData,
    loadingHome,
  };
};
