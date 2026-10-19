"use client";
import ProductListing from "@/commomPages/ProductListing";
import { useCrudApi } from "@/hooks/useCrudApi";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listingPayloadFromParams } from "@/lib/listingParams";

const ListingPage = ({ initialHero = null }) => {
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  const { create } = useCrudApi("/api/product");
  const { selectedCountry } = usePreferences();
  const searchParams = useSearchParams();

  const payload = listingPayloadFromParams(searchParams);

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
        initialHero={initialHero}
        initialProducts={{ data: products }}
        loading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
      />
      {hasNextPage && <div ref={loaderRef} style={{ height: 1 }} />}
    </>
  );
};

export default ListingPage;
