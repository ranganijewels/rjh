"use client";
import React, { useEffect } from "react";
import ReviewCard from "../../components/ui/Cards/ReviewCard";
import { useScrollControls } from "@/hooks/useScrollControls";
import HeadingWithNavigation from "@/components/ui/Heading/HeadingWithNavigation";

const CustomerReview = ({ hideLabel, reviewdata }) => {
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  } = useScrollControls(400);

  useEffect(() => {
    if (reviewdata?.testimonialitems?.length > 0) {
      setTimeout(() => {
        updateScrollState();
      }, 100);
    }
  }, [reviewdata?.testimonialitems]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        if (canScrollRight) {
          scroll("next");
        } else {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [containerRef, canScrollRight, scroll]);

  return (
    <section className="md:px-[30px] px-[18px]">
      <HeadingWithNavigation
        title={hideLabel ? "" : reviewdata?.title ?? ""}
        onPrev={() => scroll("prev")}
        onNext={() => scroll("next")}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      />
      <div
        ref={containerRef}
        className="flex w-full overflow-x-auto hide-scrollbar xl:gap-[20px] gap-[10px] scroll-smooth"
      >
        {reviewdata?.testimonialitems?.map((items) => (
          <ReviewCard
            key={items.id}
            name={items.author_name}
            designation={items.author_position}
            review={items.review}
            customerImg={items.image}
            className="slide-card flex-shrink-0"
          />
        ))}
      </div>
    </section>
  );
};

export default CustomerReview;
