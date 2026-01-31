"use client";
import React from "react";
import Button from "../ui/Button/Button";
import Typography from "../ui/Typography/Typography";
import { useFileType } from "@/hooks/useFileType";
import useIsMobile from "@/utils/useIsMobile";

const HeroSection = ({
  title,
  description,
  backgroundUrl,
  btnContainerclass,
  containerClass,
  imageClass,
  textClass,
  buttons,
  mobileFile,
  buttonClick,
}) => {
  const { isMobile } = useIsMobile(425);
  const displaySource = isMobile && mobileFile ? mobileFile : backgroundUrl;
  const { isVideo: isDisplayVideo } = useFileType(displaySource);
  return (
    <section>
      <div
        className={`relative xl:h-[368px] lg:h-[326px] h-[477px] w-full ${containerClass}`}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/0" /> */}
        {isDisplayVideo ? (
          <video
            className={`absolute inset-0 w-full h-full object-cover ${imageClass}`}
            src={displaySource}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={displaySource}
            alt="product-listing-hero-bg"
            className={`w-full xl:h-[368px] lg:h-[326px] h-[477px] object-cover ${imageClass}`}
          />
        )}
        <div className="absolute xl:bottom-[91px] xl:px-[97px] lg:px-[52px] px-[22px] lg:bottom-[61px] bottom-[51px] flex flex-col gap-6 w-auto">
          <div className="flex flex-col gap-4 ">
            <Typography
              variant="h2"
              className={`${textClass}`}
              textColor="white"
            >
              {title}
            </Typography>
            <Typography variant="p" textColor="white">
              {description}
            </Typography>
          </div>

          <div className={`flex gap-7 ${btnContainerclass}`}>
            {buttons?.map((btn, i) => {
              return (
                <Button
                  key={i}
                  variant={
                    btn.button_color
                      ? undefined
                      : i === 0
                      ? "primary"
                      : "outline"
                  }
                  title={btn.button_text || btn?.text}
                  background={btn.button_color}
                  border={btn.button_border}
                  url={btn.button_url || btn.link}
                  textColor={btn.button_text_color}
                  hoverColor={btn.button_hover_color}
                  onClick={buttonClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
