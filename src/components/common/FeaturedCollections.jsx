"use client";
import React, { useEffect } from "react";
import clsx from "clsx";
import HeadingWithNavigation from "../ui/Heading/HeadingWithNavigation";
import { useScrollControls } from "@/hooks/useScrollControls";
import Typography from "../ui/Typography/Typography";

const FeaturedCollections = ({
  title,
  collections = [],
  className = "",
  imageStyle = "",
  onClick,
  isGrid,
}) => {
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  } = useScrollControls(450);

  useEffect(() => {
    if (collections.length > 0) {
      setTimeout(() => {
        updateScrollState();
      }, 100);
    }
  }, [collections]);

  return (
    <section className={clsx("lg:px-[30px] px-[18px]", className)}>
      <HeadingWithNavigation
        title={title}
        onPrev={() => scroll("prev")}
        onNext={() => scroll("next")}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      />

      <div
        ref={containerRef}
        // className="flex xl:gap-[20px] lg:gap-[10px] gap-[14px] overflow-x-auto hide-scrollbar no-scrollbar scroll-smooth"
        className={`${
          isGrid
            ? "grid md:grid-cols-4 grid-cols-2 xl:gap-[20px] lg:gap-[10px] gap-[14px]"
            : "flex xl:gap-[20px] lg:gap-[10px] gap-[14px] overflow-x-auto hide-scrollbar no-scrollbar scroll-smooth"
        }`}
      >
        {collections.map((product, index) => {
          return (
            <div
              key={index}
              className="shrink-0 cursor-pointer"
              onClick={() => {
                if (onClick) {
                  onClick(product);
                }
              }}
            >
              <img
                src={product?.file}
                alt={product?.title}
                className={`w-full mb-[16px] object-cover ${imageStyle}`}
              />

              <Typography variant="p" textColor="grey" className="capitalize">
                {product?.title}
              </Typography>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedCollections;
