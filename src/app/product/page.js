"use client";
import ProductListing from "@/commomPages/ProductListing";
import { useCrudApi } from "@/hooks/useCrudApi";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

  const payload = mapParamsToPayload(searchParams);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["product-list", payload, selectedCountry?.currency],

      queryFn: async ({ pageParam = 1 }) => {
        const res = await create(
          { ...payload, page: pageParam },
          { headers: { currency: selectedCountry?.currency } }
        );
        return res;
      },

      getNextPageParam: (lastPage) => {
        if (!lastPage?.meta) return undefined;
        if (lastPage.meta.current_page < lastPage.meta.last_page)
          return lastPage.meta.current_page + 1;
        return undefined;
      },

      staleTime: 1000 * 60 * 5,
    });

  const loaderRef = React.useRef(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasNextPage]);
  const products = data?.pages?.flatMap((page) => page?.data || []) ?? [];
  return (
    <>
      {" "}
      <ProductListing
        initialProducts={{ data: products }}
        loading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
      />
      {hasNextPage && <div ref={loaderRef} style={{ height: 1 }} />}
    </>
  );
};

export default Page;
