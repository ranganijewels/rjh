"use client";
import React, { useEffect, useState } from "react";
import HeadingWithNavigation from "@/components/ui/Heading/HeadingWithNavigation";
import { useScrollControls } from "@/hooks/useScrollControls";
import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { useCrudApi } from "@/hooks/useCrudApi";
import { usePreferences } from "@/context/PreferencesContext";

const Collection = ({ title, collectionName, apiPath, itemId = null, id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchAll, fetchById } = useCrudApi(apiPath);
  const { selectedCountry } = usePreferences();
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  } = useScrollControls(400);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let res;

        // If the API path expects an ID, call fetchById
        if (apiPath.includes("complete-the-look") && itemId) {
          res = await fetchById(itemId, {
            headers: {
              currency: selectedCountry.currency,
            },
          });
        } else {
          res = await fetchAll(
            {},
            {
              headers: {
                currency: selectedCountry.currency,
              },
            }
          );
        }

        let productList = [];

        if (apiPath.includes("get-collection")) {
          // Named collection first; fall back to the first collection that has
          // products so sections like "You Might Also Love" never render empty
          // just because the CMS collection label changed.
          const collection =
            res?.data?.find(
              (e) =>
                e.collection_name?.toLowerCase() ===
                collectionName?.toLowerCase()
            ) || res?.data?.find((e) => (e.products || []).length > 0);
          productList = collection?.products || [];
          setProducts(productList);
        } else {
          // For other APIs, assume res.data is already an array
          productList = res?.data?.complete_the_look || [];
          setProducts(productList);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [fetchAll, fetchById, apiPath, collectionName, itemId]);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => updateScrollState(), 100);
      return () => clearTimeout(timer);
    }
  }, [products, updateScrollState]);

  return (
    <section className="md:px-[30px] px-[18px]" id={id}>
      <HeadingWithNavigation
        title={title}
        onPrev={() => scroll("prev")}
        onNext={() => scroll("next")}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      />

      {/* Two layers on purpose: overflow-x/overflow-y are coupled on a single
          element (setting overflow-x: auto silently forces overflow-y to
          auto too, per the CSS spec), which left this row's vertical size
          entangled with horizontal-scrollbar bookkeeping — harmless most of
          the time, but not the true "always fits, never cut" guarantee the
          content deserves. The OUTER div owns horizontal scrolling only, and
          has no explicit height of its own. The INNER div is a plain flex
          row with NO overflow property at all, so its height is simply
          whatever its tallest card naturally needs — nothing can ever
          couple that to scroll/scrollbar mechanics again. */}
      <div className="overflow-x-auto hide-scrollbar no-scrollbar" ref={containerRef}>
        <div className="flex items-start gap-x-[14px] 2xl:gap-x-[35px] w-max">
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <ProductCardSkeleton
                  key={idx}
                  rootClass="shrink-0 space-y-[12px] 2xl:w-[390px] xl:w-[344px] w-[182px]"
                  boxClass="2xl:w-[390px] 2xl:h-[500px] xl:w-[344px] xl:h-[416px] w-[182px] h-[249px]"
                  imgClass="2xl:w-[392px] 2xl:h-[310px] xl:w-[270px] xl:h-[280px] lg:w-[142px] lg:h-[147px] h-[147px] w-full"
                />
              ))
            : products?.map((item) => {
                return (
                  <ProductCard
                    key={`${item?.product_id}-${
                      item?.product_color || "default"
                    }`}
                    productId={item?.product_id}
                    categoryId={item?.category_id}
                    productName={item?.title}
                    price={item?.product_price}
                    productImg={item?.product_image}
                    colorsPalettes={item?.metal_color}
                    designNo={item?.design_no}
                    hoverImage={item?.rollover_image}
                    metalColor={item?.product_color}
                    wishlistStatus={item?.wishlist}
                    className="slide-card"
                    cardClass="2xl:w-[390px] 2xl:h-[500px] xl:w-[344px] xl:h-[416px] w-[182px] h-[249px] flex items-center justify-center"
                    imgClass="2xl:w-[392px] 2xl:h-[310px] xl:w-[270px] xl:h-[280px] lg:w-[142px] lg:h-[147px] h-[147px] w-full "
                    gridLayout="lg:grid-cols-5 grid-cols-2"
                    customWidth
                    imagesByColor={item?.images_by_color}
                    allImages={item?.all_images}
                    shapeVariants={item?.shape_variants}
                    isDesignGroupCard={item?.is_design_group_card}
                    centerDiamondWeight={item?.center_diamond_weight}
                    shape={item?.occasion}
                    metalType={item?.meta_quality}
                    ringSize={item?.ring_size}
                    size={item?.size}
                  />
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default Collection;
