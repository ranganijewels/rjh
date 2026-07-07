"use client";
import ProductListing from "@/commomPages/ProductListing";
import { useCrudApi } from "@/hooks/useCrudApi";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";
import { useInfiniteQuery } from "@tanstack/react-query";

const Page = () => {
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  const { create } = useCrudApi("/api/product");
  const { selectedCountry } = usePreferences();
  const searchParams = useSearchParams();

  const mapParamsToPayload = (params) => {
    const payload = {};
    if (params.get("search")) payload.search = params.get("search");
    if (params.get("metal")) payload.metal_color = params.get("metal");
    if (params.get("shape")) payload.diamond_shape = params.get("shape");   // shape name e.g. "Round"
    if (params.get("subcat")) payload.sub_category = params.get("subcat");  // style name e.g. "Solitaire"
    if (params.get("category_id")) payload.category = params.get("category_id");
    if (params.get("sort_by")) payload.sort_by = params.get("sort_by");

    // collection maps to category in NestJS
    const collection = params.get("collection");
    if (collection) payload.category = collection;

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

  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchNextPage(); },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasNextPage]);

  const products = data?.pages?.flatMap((page) => page?.data || []) ?? [];

  return (
    <>
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
