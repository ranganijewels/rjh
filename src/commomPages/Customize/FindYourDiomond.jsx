import Button from "@/components/ui/Button/Button";
import Heading from "@/components/ui/Heading/Heading";
import Typography from "@/components/ui/Typography/Typography";
import { NextIcon, PreviousIcon } from "@/components/Icons/common";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";

const FindYourDiomond = ({ title, description, shapes, buttons }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Repeated data ONLY for mobile view
  const mobileDisplayShapes = Array.isArray(shapes) ? [...shapes, ...shapes] : [];

  const scrollMobile = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;

      let scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      if (scrollTo < 0) {
        scrollTo = scrollWidth - clientWidth;
      } else if (scrollTo + clientWidth >= scrollWidth) {
        scrollTo = 0;
      }

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Auto-scroll effect for mobile view only
  useEffect(() => {
    let interval;
    if (isAutoScrolling && typeof window !== "undefined" && window.innerWidth < 768) {
      interval = setInterval(() => {
        scrollMobile("right");
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, shapes]);

  return (
    <section>
      <Heading
        title={title}
        description={description}
        isCenter
        className={"xl:mb-[54px] mb-[20px]"}
      />

      <div className="container mx-auto">
        {/* ========================================== */}
        {/* MOBILE VIEW (Carousel & Repeated)         */}
        {/* ========================================== */}
        <div
          className="md:hidden relative px-4"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
          onTouchStart={() => setIsAutoScrolling(false)}
        >
          {/* Mobile Buttons */}
          <div className="absolute top-[35px] left-0 right-0 flex justify-between z-10 pointer-events-none px-2">
            <button
              onClick={() => {
                setIsAutoScrolling(false);
                scrollMobile("left");
              }}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-auto border border-gray-100 -ml-1 -mt-4 active:scale-90 transition-transform "
            >
              <div className="scale-75 -ml-1">
                <PreviousIcon />
              </div>
            </button>
            <button
              onClick={() => {
                setIsAutoScrolling(false);
                scrollMobile("right");
              }}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-auto border border-gray-100 -mr-1 -mt-4 active:scale-90 transition-transform"
            >
              <div className="scale-75 -mr-1">
                <NextIcon />
              </div>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex hide-scrollbar overflow-x-auto scroll-smooth mb-[36px] gap-0 snap-x snap-mandatory px-0 w-full"
          >
            {mobileDisplayShapes.map((shape, idx) => (
              <div
                key={`mobile-${idx}`}
                className="flex flex-col items-center shrink-0 cursor-pointer snap-center w-1/3 gap-[5px]"
                onClick={() => router.push(`/product?shape=${shape?.shape_id}`)}
              >
                <img
                  src={shape?.icon_image}
                  alt={shape?.icon_title}
                  className="w-[70px] h-[70px] p-[10px] transition-transform duration-300 hover:scale-110"
                />
                <Typography variant="p" className="text-[12px] text-center px-1">
                  {shape?.icon_title}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* DESKTOP VIEW (Original Layout)            */}
        {/* ========================================== */}
        <div className="hidden md:flex mx-auto gap-[24px] sm:gap-[32px] xl:gap-[50px] hide-scrollbar overflow-x-auto px-[10px] scroll-smooth xl:mb-[70px] mb-[36px]">
          {Array.isArray(shapes) &&
            shapes.map((shape, idx) => (
              <div
                key={`desktop-${idx}`}
                className="flex flex-col xl:gap-[10px] gap-[5px] items-center shrink-0 cursor-pointer group"
                onClick={() => router.push(`/product?shape=${shape?.shape_id}`)}
              >
                <img
                  src={shape?.icon_image}
                  alt={shape?.icon_title}
                  className={clsx(
                    "xl:w-[106px] xl:h-[106px] w-[54px] h-[54px] p-[19px]",
                    "transition-transform duration-300 ease-in-out hover:scale-110"
                  )}
                />
                <Typography variant="p">{shape?.icon_title}</Typography>
              </div>
            ))}
        </div>

        <div className="text-center">
          {buttons?.map((btn, i) => (
            <Button
              key={`btn-${i}`}
              variant={
                btn.button_color ? undefined : i === 0 ? "primary" : "outline"
              }
              title={btn.button_text}
              background={btn.button_color}
              border={btn.button_border}
              url={btn.button_url}
              textColor={btn.button_text_color}
              hoverColor={btn.button_hover_color || "var(--teal-1)"}
              className="hover:!text-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindYourDiomond;
