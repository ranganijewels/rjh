"use client";
import LazyVideo from "@/components/common/LazyVideo";
import React from "react";
import Button from "../ui/Button/Button";
import { useFileType } from "@/hooks/useFileType";
import { responsiveImg } from "@/lib/imageSizes";

const TwoColGrid = ({
  index,
  title,
  designation,
  description,
  buttonText,
  isReverse,
  textCenter,
  quotes,
  backgroundColor,
  reviewText,
  btnUrl,
  file,
  buttons,
  subTitle,
  alt,
}) => {
  const { isVideo } = useFileType(file);
  return (
    <div
      className="w-full flex md:flex-row flex-col md:gap-[20px] gap-0 xl:px-[30px] px-[18px]"
      key={index}
    >
      <div className={`md:w-1/2 w-full ${isReverse && "md:order-2"}`}>
        {isVideo ? (
          <LazyVideo
            src={file}
            autoPlay
            loop
            muted
            playsInline
            className="w-full xl:h-[548px] lg:h-[292px] h-[225px] object-cover"
          />
        ) : (
          <img loading="lazy" decoding="async"
            {...responsiveImg(file, "(min-width: 1024px) 50vw, 100vw")}
            src={file}
            alt={alt || "explore-ring-size"}
            width={920}
            height={548}
            className="w-full xl:h-[548px] lg:h-[292px] h-[225px] object-cover"
          />
        )}
      </div>

      <div
        className={`md:w-1/2 w-full ${
          backgroundColor && "bg-[var(--grey-1)]"
        } flex flex-col md:items-center items-start justify-center`}
      >
        <div
          className={`xl:max-w-[528px] md:max-w-[281px] xl:space-y-[30px] space-y-[16px] md:p-0 p-[28px_18px] ${
            textCenter && "text-center"
          }`}
        >
          <div className="flex flex-col xl:gap-[25px] gap-[13px]">
            <p className="md:text-[18px] text-[14px] font-[500] text-[var(--grey-2)] uppercase">
              {subTitle && subTitle}
            </p>
            <h3 className="text-[var(--grey-2)] xl:text-[24px] text-[14px] font-[500] uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-[var(--grey-2)] xl:text-[12px] lg:text-[12px] text-[12px] font-[400] italic">
              {designation}
            </p>
            <div className="text-[var(--grey-2)] xl:text-[18px] text-[10px] font-[400] tracking-tight">
              {description}
            </div>
          </div>

          {reviewText && (
            <div>
              <img loading="lazy" decoding="async"
                src="/icons/quotes.svg"
                width={24}
                height={24}
                className="xl:h-[48px] xl:w-[48px] h-[24px] w-[24px]"
                alt="quotes"
              />
              <p className="tracking-tight font-[400] xl:text-[14px] lg:text-[12px] text-[12px] line-clamp-3">
                {reviewText}
              </p>
            </div>
          )}
          {/* <Button title={buttonText} onClick={() => router.push(btnUrl)} /> */}
          {buttons?.map((btn, i) => (
            <Button key={i} title={btn.button_text} url={btn.button_url} />
          ))}
          {quotes && (
            <>
              <div className="xl:py-5 py-3 border-t border-b border-[var(--teal-3)] italic inline-flex justify-center items-center gap-2.5">
                <div className="justify-start text-[var(--teal-1)] xl:text-[18px] text-[12px] font-[400] tracking-tight">
                  {quotes}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoColGrid;
