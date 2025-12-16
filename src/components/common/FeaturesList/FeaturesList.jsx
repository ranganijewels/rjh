"use client";
import React from "react";
import clsx from "clsx";
import Typography from "@/components/ui/Typography/Typography";

const FeaturesList = ({
  items = [],
  isGrid,
  containerClass = "",
  itemClass = "",
  iconClass = "",
  desktopCols,
  mobileCols,
  hideTitle,
}) => {
  const serviceItems = Array.isArray(items)
    ? items
    : items?.service_items || [];

  return (
    <div
      className={clsx(
        isGrid && [
          "grid",
          mobileCols === 2 && "grid-cols-2",
          mobileCols === 4 && "grid-cols-4",
          desktopCols === 3 && "lg:grid-cols-3",
          desktopCols === 4 && "lg:grid-cols-4",
          "xl:px-[98px] lg:px-[52px] px-[18px] gap-x-[24px] gap-y-[40px]",
        ],
        containerClass
      )}
    >
      {serviceItems.map((item, index) => {
        const isMobileColspan =
          desktopCols === 3 && index === 2 ? "col-span-full lg:col-span-1" : "";
        return (
          <div
            key={index}
            className={clsx(
              isGrid && "flex items-center justify-center relative lg:px-4",
              isMobileColspan
            )}
          >
            {/* Icon + Text */}
            <div
              className={clsx(
                isGrid
                  ? "flex-col gap-[16px] text-center"
                  : "gap-x-[10px] mb-[24px]",
                "flex items-center",
                itemClass
              )}
            >
              <img
                src={item.image}
                alt="icon"
                className={clsx(
                  isGrid
                    ? "lg:w-[70px] lg:h-[70px]"
                    : "lg:w-[36px] lg:h-[36px]",
                  "w-[48px] h-[48px]",
                  iconClass
                )}
              />
              <div>
                {hideTitle ||
                  (item?.title && (
                    <Typography variant="p" className="!font-[500] mb-[10px]">
                      {item?.title}
                    </Typography>
                  ))}
                <Typography variant={item?.service_description ? "h6" : "p"}>
                  {item.service_description}
                </Typography>
              </div>
            </div>

            {isGrid && (
              <>
                {/* Divider only on large screens and only between columns */}
                {index !== items.length - 1 && (index + 1) % 4 !== 0 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[64px] w-[1px] bg-[var(--teal-2)]" />
                )}

                {/* Divider for mobile screens (horizontal between rows) */}
                {index !== items.length - 1 && (index + 1) % 2 !== 0 && (
                  <div className="block lg:hidden absolute right-0 top-1/2 -translate-y-1/2 h-[64px] w-[1px] bg-[var(--teal-2)]" />
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FeaturesList;
