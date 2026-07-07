import { useState, useEffect } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";

// Shared PDP editable content (trust badges, why-choose, financing, accordions,
// brand pillars) from /api/pdp-content — CMS-managed with defaults.
export const usePdpContent = () => {
  const { fetchAll } = useCrudApi("/api/pdp-content");
  const [pdp, setPdp] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAll()
      .then((res) => {
        if (mounted) setPdp(res?.data || null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [fetchAll]);

  return pdp;
};
