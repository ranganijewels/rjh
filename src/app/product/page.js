"use client";
import ProductListing from "@/commomPages/ProductListing";
import { useCrudApi } from "@/hooks/useCrudApi";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  const { create } = useCrudApi("/api/product");
  const { selectedCountry } = usePreferences();
  const searchParams = useSearchParams();

  // Map URL params to API payload
  const mapParamsToPayload = (params) => {
    const payload = {};
    if (params.get("search")) payload.search = params.get("search");
    if (params.get("gender")) payload.gender = params.get("gender");
    if (params.get("subcat"))
      payload.sub_category_id = Number(params.get("subcat"));
    if (params.get("metal")) payload.metal_color = params.get("metal");
    if (params.get("quality"))
      payload.quality_id = Number(params.get("quality"));
    if (params.get("shape")) payload.occassion_id = Number(params.get("shape"));
    if (params.get("category_id"))
      payload.category_id = Number(params.get("category_id"));
    if (params.get("sort_by")) payload.sort_by = params.get("sort_by");
    if (params.get("collection")) {
      if (
        params.get("collection") === "wedding" ||
        params.get("collection") === "Wedding"
      ) {
        payload.collection_id = 2;
      } else if (
        params.get("collection") === "engagement" ||
        params.get("collection") === "Engagement"
      ) {
        payload.collection_id = 3;
      } else if (
        params.get("collection") === "jewellery" ||
        params.get("collection") === "Jewellery"
      ) {
        payload.collection_id = 1;
      }
    }

    return payload;
  };

  const {
    data: products = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      "product-list",
      Object.fromEntries(searchParams.entries()),
      selectedCountry?.currency,
    ],
    queryFn: async () => {
      const payload = mapParamsToPayload(searchParams);
      const res = await create(payload, {
        headers: { currency: selectedCountry?.currency },
      });
      return res?.data || [];
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  return (
    <ProductListing
      initialProducts={products}
      loading={isLoading || isFetching}
    />
  );
};

export default Page;
