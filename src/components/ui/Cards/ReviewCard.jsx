import { useFileType } from "@/hooks/useFileType";
import React from "react";

const ReviewCard = ({ name, designation, review, customerImg, className }) => {
  const { isVideo } = useFileType(customerImg);
  const hasMedia = Boolean(customerImg);
  return (
    <div
      className={`flex xl:w-[607px] md:w-[473px] w-[314px] xl:h-[369px] md:h-[288px] h-[207px] bg-[var(--teal-3)] justify-between flex-shrink-0 ${className}`}
    >
      <div className={`${hasMedia ? "xl:max-w-[335px] max-w-[50%]" : "max-w-full flex-1"} p-[30px_13px] xl:p-[60px_27px] flex flex-col items-start justify-between lg:gap-[33px]`}>
        <div className="flex flex-col">
          <label className="tracking-tight font-medium xl:text-[20px] lg:text-[18px] text-[16px] capitalize">
            {name}
          </label>
          <p className="tracking-tight font-extralight lg:text-[12px] text-[10px] italic">
            {designation}
          </p>
        </div>
        <div>
          <img
            src="/icons/quotes.svg"
            className="xl:h-[48px] xl:w-[48px] h-[24px] w-[24px]"
            alt="quotes"
          />
          <p className="tracking-tight font-normal xl:text-[14px] lg:text-[12px] text-[10px] line-clamp-3">
            {review}
          </p>
        </div>
      </div>
      {hasMedia && (
        <div className="max-w-[50%]">
          {isVideo ? (
            <video
              className="w-full h-full object-cover xl:max-w-[272px] xl:h-[369px]"
              src={customerImg}
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={customerImg}
              className="w-full h-full object-cover xl:max-w-[272px] xl:h-[369px]"
              alt="customer"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
