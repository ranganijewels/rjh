"use client";
import React from "react";
import ProductCard from "@/components/ui/Cards/ProductCard";
import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";
import Typography from "@/components/ui/Typography/Typography";
import Button from "@/components/ui/Button/Button";

const ProductGrid = ({ gridLayout, collections, loading, clearFilters }) => {
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
                  displayDiscountPercent={item?.display_discount_percent}
                  displayDiscountEndsAt={item?.display_discount_ends_at}
                  productImg={item?.product_image}
                  colorsPalettes={item?.metal_color}
                  gridLayout={gridLayout}
                  designNo={item?.design_no}
                  hoverImage={item?.rollover_image}
                  metalColor={item?.product_color}
                  wishlistStatus={item?.wishlist}
                  metalType={item?.meta_quality}
                  centerDiamondWeight={item?.center_diamond_weight}
                  ringSize={item?.ring_size}
                  size={item?.size}
                  shape={item?.occasion}
                  imagesByColor={item?.images_by_color}
                  allImages={item?.all_images}
                  shapeVariants={item?.shape_variants}
                  isDesignGroupCard={item?.is_design_group_card}
                  badges={item?.badges}
                />
              );
            })
        : (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-[60px] gap-[16px]">
              <Typography variant="h3" as="p" textColor="grey">
                No Products Found
              </Typography>
              <Typography variant="p" textColor="customGrey" className="max-w-[320px]">
                No products match your filters. Try adjusting or clearing them
                to see more results.
              </Typography>
              {clearFilters && (
                <Button
                  variant="outlineTeal"
                  title="Clear Filters"
                  onClick={clearFilters}
                  className="mt-[8px]"
                />
              )}
            </div>
          )}
    </div>
  );
};

export default ProductGrid;
