"use client";
import React from "react";
import Heading from "../ui/Heading/Heading";
import HeadingWithNavigation from "../ui/Heading/HeadingWithNavigation";
import { useScrollControls } from "@/hooks/useScrollControls";
import Link from "next/link";
import { useFileType } from "@/hooks/useFileType";

const ImageWithContent = ({
  heading,
  headingDescription,
  data,
  showNavigation,
  containerClass,
  sectionClass,
  redirectUrl,
}) => {
  const { containerRef, canScrollLeft, canScrollRight, scroll } =
    useScrollControls();

  return (
    <section className={`lg:px-[30px] px-[18px] ${sectionClass}`}>
      <Heading
        title={heading}
        description={headingDescription}
        className={" xl:mb-[30px] lg:mb-[15px]"}
      />

      {showNavigation && (
        <HeadingWithNavigation
          onPrev={() => scroll("prev")}
          onNext={() => scroll("next")}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
        />
      )}

      <div
        className={`${
          showNavigation
            ? "flex overflow-auto hide-scrollbar no-scrollbar scroll-smooth"
            : "grid xl:grid-cols-5 lg:grid-cols-3 grid-cols-2 gap-y-[20px]"
        } xl:gap-[20px] gap-[10px] ${containerClass}`}
        ref={containerRef}
      >
        {data?.map((item, idx) => {
          const { isVideo } = useFileType(item?.file || item?.image);
          const CardContent = (
            <div
              className={`flex-shrink-0 flex flex-col ${
                showNavigation &&
                "xl:w-[356px] lg:w-[184px] w-[169px] slide-card"
              }`}
            >
              {isVideo ? (
                <video
                  src={item?.file || item?.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className=" xl:h-[376px] lg:h-[207px] h-[224px] xl:mb-[16px] mb-[8px] object-cover"
                />
              ) : (
                <img
                  src={item?.file || item?.image}
                  alt={item?.title}
                  className=" xl:h-[376px] lg:h-[207px] h-[224px] xl:mb-[16px] mb-[8px] object-cover"
                />
              )}
              <p
                className={`xl:text-[18px] text-[12px] xl:mb-[16px] mb-[8px] break-words whitespace-normal ${
                  item.description
                    ? "text-left font-[500]"
                    : "text-center font-[400]"
                }`}
              >
                {item?.title}
              </p>
              {/* {item.description && (
                <p
                  className="xl:text-[16px] font-[400] text-[10px] xl:mb-[16px] mb-[8px] line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )} */}

              {item?.description && (
                <p className="xl:text-[16px] font-[400] text-[10px] xl:mb-[16px] mb-[8px] line-clamp-2">
                  {item?.description.replace(/<[^>]+>/g, "")}
                </p>
              )}
            </div>
          );

          return redirectUrl ? (
            <Link
              key={idx}
              href={`/blog/${item?.slug}`}
              className="cursor-pointer"
            >
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>
    </section>
  );
};

export default ImageWithContent;
