"use client";
import React from "react";
import DOMPurify from "dompurify";
import Button from "../ui/Button/Button";
import clsx from "clsx";
import Typography from "../ui/Typography/Typography";
import { useFileType } from "@/hooks/useFileType";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const JewelryCTA = ({
  title,
  description,
  imageSrc,
  backgroundUrl,
  textwhite,
  backgroundIsVideo,
  blockWidth,
  containerclass,
  titleStyle,
  buttons,
  btnContainerclass,
}) => {
  const { isVideo } = useFileType(backgroundUrl);
  const { isVideo: bannerVideo } = useFileType(imageSrc);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      className={clsx(
        "relative overflow-hidden flex items-center lg:py-[80px] py-[40px]",
        "xl:px-[123px] lg:px-[35px] px-[18px] h-auto",
        textwhite ? "text-[var(--grey-0)]" : "text-black",
        containerclass
      )}
    >
      {/* Background Video/Image */}
      {backgroundIsVideo || isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover -z-10"
          src={backgroundUrl}
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={backgroundUrl}
          alt="Jewelry Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
      )}

      {/* Text Content */}
      <div className="relative z-10 md:w-[70%] w-full">
        <div className={`space-y-[20px] md:space-y-[40px] ${blockWidth}`}>
          <Typography
            variant="h1"
            textColor={textwhite && "white"}
            className={`uppercase ${titleStyle}`}
          >
            {title}
          </Typography>
          <p
            className="tracking-wide font-normal xl:text-[24px] lg:text-[14px] text-[12px]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description || "") }}
          />
          <div className={`flex gap-7 ${btnContainerclass}`}>
            {buttons?.map((btn, i) => (
              <Button
                key={i}
                variant={
                  btn.button_color ? undefined : i === 0 ? "primary" : "outlineWhite"
                }
                title={btn.button_text}
                background={btn.button_color}
                border={btn.button_border}
                url={btn.button_url}
                textColor={btn.button_text_color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Image */}
      {bannerVideo ? (
        <div className="md:w-[30%] flex justify-center md:justify-end absolute right-0 z-10">
          <video
            className="h-auto xl:w-[775px] lg:w-[413px] sm:w-[214px] w-[126px]"
            src={imageSrc}
            autoPlay={!reducedMotion}
            loop={!reducedMotion}
            muted
            playsInline
            preload="metadata"
          />
        </div>
      ) : imageSrc ? (
        <div className="md:w-[30%] flex justify-center md:justify-end absolute right-0 bottom-0 z-10">
          <img
            src={imageSrc}
            alt="Jewelry"
            className="h-auto xl:w-[775px] lg:w-[413px] sm:w-[214px] w-[126px]"
          />
        </div>
      ) : null}
    </section>
  );
};

export default JewelryCTA;
