"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterBar from "./FilterBar";
import MobileFilterModal from "./MobileFilterModal";
import GridLayoutToggle from "./GridLayoutToggle";
import ProductGrid from "./ProductsGrid";
import Newsletter from "../Home/Newsletter";
import HeroSection from "@/components/common/HeroSection";
import FilterChips from "@/components/ui/FilterChips/FilterChips";
import useProductGridLogic from "./useProductGridLogic";
import { useCrudApi } from "@/hooks/useCrudApi";

const ProductListing = ({ initialProducts, loading, isFetchingNextPage }) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");
  const collection = searchParams.get("collection");
  const shapeBanner = searchParams.get("banner");
  const shapeTitle = searchParams.get("title");
  const { fetchById } = useCrudApi(`/api/product/category-hero`);
  const { create } = useCrudApi("/api/product/filters");
  const { fetchAll: menuHeroBanner } = useCrudApi("/api/product/menu-banner");

  const [filtersData, setFiltersData] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [activeFilterIndex, setActiveFilterIndex] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [filtersError, setFiltersError] = useState(null);
  const router = useRouter();
  const {
    isMobile,
    gridLayout,
    effectiveLayout,
    setGridLayout,
    isActive,
    showFilterModal,
    setShowFilterModal,
  } = useProductGridLogic();

  useEffect(() => {
    const fetchHero = async () => {
      try {
        if (categoryId) {
          // case: category_id param exists
          const res = await fetchById(categoryId);
          return setHeroData(res?.data || null);
        }

        // case: collection or default
        const res = await menuHeroBanner();
        const target = collection?.toLowerCase() || "product";
        const filtered = res?.data?.find(
          (item) => item?.banner_title?.toLowerCase() === target
        );
        setHeroData(filtered || null);
      } catch (err) {
        console.error("Error fetching hero section:", err);
      }
    };

    fetchHero();
  }, [categoryId, collection, fetchById, menuHeroBanner]);

  /** Fetch filters */
  const fetchFilters = async () => {
    try {
      setFiltersError(null);
      const res = await create({
        category_id: categoryId,
      });
      setFiltersData(res.data);
    } catch (err) {
      console.error("Error fetching filters:", err);
      setFiltersError("Couldn't load filters");
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [categoryId]);

  const handleFilterRemove = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`?${params.toString()}`);
  };

  const handleFilterClick = (index) => {
    if (activeFilterIndex === index) {
      setShowOptions(!showOptions);
    } else {
      setActiveFilterIndex(index);
      setShowOptions(true);
    }
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Clear EVERY actual filter (category_id, subcat, metal, shape, sort_by,
    // carat, price, …) — the old hardcoded list missed category_id + sort_by,
    // which is why "Clear filter" appeared to do nothing. Keep only the params
    // that define the collection/hero context so the shopper stays on the same
    // collection landing, just unfiltered.
    const KEEP = ["collection", "banner", "title", "search", "quality"];
    [...params.keys()]
      .filter((k) => !KEEP.includes(k))
      .forEach((k) => params.delete(k));
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : window.location.pathname);
    setShowFilterModal(false);
  };

  const mappedFiltersData = [
    {
      title: "Style",
      key: "subcat",
      options:
        filtersData?.style?.map((item) => ({
          text: item?.name,
          id: item?.id,
        })) || [],
    },
    {
      title: "Diamond shape",
      key: "shape",
      options:
        filtersData?.shape?.map((item) => ({
          text: item?.custom_title || item?.name,
          id: item?.id,
        })) || [],
    },
    {
      title: "Carat",
      key: "carat",
      options: filtersData?.purity?.map((item) => item?.value) || [],
    },
    {
      title: "Metal color",
      key: "metal",
      options:
        filtersData?.metal_colors
          ?.filter(
            (opt) => opt.value !== "WHITE/YELLOW" && opt.value !== "WHITE/ROSE"
          )
          .map((item) => item?.value) || [],
    },
  ];

  return (
    <>
      <HeroSection
        title={shapeTitle || heroData?.hero_text || heroData?.title}
        description={heroData?.hero_description || heroData?.description}
        buttons={heroData?.buttons}
        backgroundUrl={shapeBanner || heroData?.file}
        mobileFile={heroData?.mobileFile}
        btnContainerclass="md:flex-row flex-col"
        containerClass="!h-[475px]"
        imageClass="!h-[475px]"
      />

      <div className="p-[16px] lg:p-[10px_20px] xl:p-[14px_30px]">
        <div className="bg-[var(--grey-00)] flex items-center justify-between">
          {isMobile ? (
            <div className="flex gap-[10px] items-center">
              <button
                aria-label="Open filters"
                onClick={() => {
                  return setShowFilterModal(!showFilterModal);
                }}
              >
                <img
                  src="/icons/filters.svg"
                  alt=""
                  className="cursor-pointer w-[24px] h-[24px]"
                />
              </button>
              <label className="text-[14px] font-[400]">Filters</label>
            </div>
          ) : (
            <FilterBar filtersData={filtersData} />
          )}

          <GridLayoutToggle
            gridLayout={gridLayout}
            isMobile={isMobile}
            setGridLayout={setGridLayout}
            isActive={isActive}
            products={initialProducts?.data}
          />
        </div>

        {filtersError && (
          <div className="flex items-center gap-[10px] text-[12px] text-red-600 p-[8px_0]">
            <span>{filtersError}</span>
            <button
              type="button"
              onClick={fetchFilters}
              className="underline font-[500]"
            >
              Retry
            </button>
          </div>
        )}

        <FilterChips
          filters={{
            sub_category_id: searchParams.get("subcat"),
            metal_color: searchParams.get("metal"),
            quality_id: searchParams.get("quality"),
            occassion_id: searchParams.get("shape"),
            category_id: searchParams.get("category_id"),
          }}
          allFilters={filtersData}
          onRemove={handleFilterRemove}
        />
      </div>

      <hr className="hr-teal-3" />

      {showFilterModal && (
        <MobileFilterModal
          setShowFilterModal={setShowFilterModal}
          filtersData={mappedFiltersData}
          handleFilterClick={handleFilterClick}
          activeFilterIndex={activeFilterIndex}
          showOptions={showOptions}
          onFilterChange={handleFilterChange}
          selectedStyle={searchParams.get("subcat")}
          selectedMetal={searchParams.get("metal")}
          selectedShape={searchParams.get("shape")}
          selectedCarat={searchParams.get("carat")}
          selectedPrice={searchParams.get("price")}
          clearFilters={clearAllFilters}
        />
      )}

      <ProductGrid
        collections={initialProducts}
        gridLayout={effectiveLayout()}
        loading={loading}
        clearFilters={clearAllFilters}
      />

      {isFetchingNextPage && (
        <div className="py-10 flex justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[var(--teal-1)] rounded-full animate-spin" />
        </div>
      )}

      <Newsletter />
    </>
  );
};

export default ProductListing;
