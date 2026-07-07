import { useState, useEffect } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";

export const useCustomizeData = () => {
  const { fetchAll } = useCrudApi(`/api/customize`);
  const [customizeData, setCustomizeData] = useState(null);
  const [loadingCustomize, setLoadingCustomize] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingCustomize(true);

    fetchAll()
      .then((res) => {
        if (isMounted) setCustomizeData(res?.data || []);
      })
      .catch((err) => console.error("Error fetching customize page", err))
      .finally(() => {
        if (isMounted) setLoadingCustomize(false);
      });

    return () => (isMounted = false);
  }, [fetchAll]);

  return {
    customizeData,
    loadingCustomize,
  };
};
