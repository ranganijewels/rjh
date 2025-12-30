"use client";
import React from "react";
import ProductCard from "@/components/ui/Cards/ProductCard";
import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";

const ProductGrid = ({ gridLayout, collections, loading }) => {
  const uniqueCollections = collections?.data?.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.product_id === item?.product_id &&
          t.product_color === item?.product_color
      )
  );

  return (
    <div
      className={`lg:p-[26px_30px] p-[16px_9px] grid ${gridLayout} xl:gap-[20px] lg:gap-[14px] gap-[7px] xl:gap-y-[60px] gap-y-[20px]`}
    >
      {loading
        ? Array.from({ length: 5 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : uniqueCollections?.length > 0
        ? uniqueCollections
            ?.filter((item) => item?.product_image != null)
            .map((item, index) => {
              return (
                <ProductCard
                  key={`${item?.product_id}-${
                    item?.product_color || "default"
                  }`}
                  categoryId={item?.category_id}
                  productId={item?.product_id}
                  productName={item?.title}
                  price={item?.product_price}
                  productImg={item?.product_image}
                  colorsPalettes={item?.metal_color}
                  gridLayout={gridLayout}
                  designNo={item?.design_no}
                  hoverImage={item?.rollover_image}
                  metalColor={item?.product_color}
                  wishlistStatus={item?.wishlist}
                  shape={item?.occasion}
                />
              );
            })
        : "No Products Found"}
    </div>
  );
};

export default ProductGrid;
