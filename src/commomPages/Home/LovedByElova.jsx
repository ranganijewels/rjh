"use client";
import HeadingWithNavigation from "@/components/ui/Heading/HeadingWithNavigation";
import { useFileType } from "@/hooks/useFileType";
import { useScrollControls } from "@/hooks/useScrollControls";
import React, { useEffect, useRef } from "react";

const LovedByElova = ({ items }) => {
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  } = useScrollControls(500);
  const videoRefs = useRef([]);

  const handleMouseEnter = (index) => {
    videoRefs.current[index]?.play();
  };

  const handleMouseLeave = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index]?.pause();
    }
  };

  useEffect(() => {
    if (items?.loved_by_items?.length > 0) {
      setTimeout(() => {
        updateScrollState();
      }, 100);
    }
  }, [items?.loved_by_items]);

  return (
    <section className="md:px-[30px] px-[18px]">
      <HeadingWithNavigation
        title={items?.title}
        onPrev={() => scroll("prev")}
        onNext={() => scroll("next")}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      />
      <div
        className="flex w-full hide-scrollbar hide-scrollbar overflow-x-auto snap-x snap-mandatory xl:gap-[20px] gap-[10px] scroll-smooth no-scrollbar"
        ref={containerRef}
      >
        {Array.isArray(items?.loved_by_items) &&
          items.loved_by_items.map((item, index) => {
            const { isVideo } = useFileType(item?.file);
            return isVideo ? (
              <video
                preload="metadata"
                key={index}
                ref={(el) => (videoRefs.current[index] = el)}
                className="2xl:w-[450px] 2xl:h-[709px] xl:w-[330px] xl:h-[520px] w-[233px] h-[367px] object-cover flex-shrink-0 slide-card"
                src={item.file}
                muted
                playsInline
                loop={false}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              />
            ) : (
              <img
                key={index}
                src={item.file}
                className="2xl:w-[450px] 2xl:h-[709px] xl:w-[330px] xl:h-[520px] w-[233px] h-[367px] object-cover flex-shrink-0 slide-card"
                alt="shine-with-elova"
              />
            );
          })}
      </div>
      <div className="xl:mt-[24px] mt-[10px] text-center">
        <p className="xl:text-[24px] text-[14px] font-[500] text-[var(--grey-2)] xl:pb-[20px] pb-[10px]">
          {items?.subtitle}
        </p>
        <p className="xl:text-[22px] text-[12px] font-[400] text-[var(--grey-2)]">
          {items?.description?.split(/(#\S+)/g).map((part, i) =>
            part.startsWith("#") ? (
              <span key={i} className="text-[var(--teal-1)]">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </p>
      </div>
    </section>
  );
};

export default LovedByElova;
