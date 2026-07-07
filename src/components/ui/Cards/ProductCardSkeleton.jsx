"use client";
import React from "react";
import { useProductCardLayout } from "./useProductCardLayout";

const SkeletonBox = ({ className }) => (
  <div className={`bg-[var(--teal-3)] animate-pulse ${className}`} />
);

const ProductCardSkeleton = ({
  gridLayout,
  customWidth = false,
  rootClass,
  boxClass,
  imgClass,
}) => {
  const { containerClass: container, imageClass: img } = useProductCardLayout(
    gridLayout,
    customWidth
  );

  return (
    <div className={rootClass || "w-full space-y-[12px] cursor-pointer"}>
      <div
        className={`relative bg-[var(--product-bg)] ${
          boxClass || (customWidth ? "" : container)
        }`}
      >
        <SkeletonBox className={`w-full object-contain ${imgClass || img}`} />
      </div>

      <SkeletonBox className="w-3/4 h-[15px] rounded" />
      <SkeletonBox className="w-1/2 h-[15px] rounded" />
      <div className="flex gap-[5px]">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <SkeletonBox
              key={i}
              className="2xl:w-[12px] 2xl:h-[12px] w-[10px] h-[10px] rounded-[2px]"
            />
          ))}
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
