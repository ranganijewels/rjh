"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../ui/Button/Button";
import Typography from "../ui/Typography/Typography";
import { useFileType } from "@/hooks/useFileType";
import useIsMobile from "@/utils/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  // Still image shown before the video loads and while it can't play
  // (slow connection / reduced-motion). Falls back to the media itself.
  posterUrl,
  // Fills the first screen (viewport minus the 37px announcement bar) —
  // used by the home hero, where the transparent navbar overlays the media.
  fullViewport = false,
}) => {
  const { isMobile } = useIsMobile(425);
  const reducedMotion = usePrefersReducedMotion();
  // Uploaded CMS videos get a "-poster.jpg" still generated beside them; use it
  // when the page didn't pass a poster explicitly.
  const effectivePoster =
    posterUrl ||
    (/\/uploads\/cms-media\/.+\.(mp4|webm|mov)$/i.test(backgroundUrl || "")
      ? backgroundUrl.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg")
      : "");
  // Hero videos are several MB: start them only after the page has finished
  // loading (the poster, if any, paints first and is the LCP element). On
  // phones a hero with a poster stays a still image — no video download.
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    if (videoReady) return;
    const hasOwnMobileVideo = mobileFile && mobileFile !== backgroundUrl;
    if (effectivePoster && !hasOwnMobileVideo && window.matchMedia("(max-width: 767px)").matches) return;
    const start = () =>
      (window.requestIdleCallback || ((cb) => setTimeout(cb, 300)))(() => setVideoReady(true));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [videoReady, effectivePoster, mobileFile, backgroundUrl]);
  const displaySource = isMobile && mobileFile ? mobileFile : backgroundUrl;

  const { isVideo: isDisplayVideo } = useFileType(displaySource);
  const heightClasses = fullViewport
    ? "h-[calc(100svh-37px)] min-h-[560px]"
    : "xl:h-[368px] lg:h-[326px] h-[477px]";
  return (
    <section>
      <div
        className={`relative ${heightClasses} w-full ${fullViewport ? "" : containerClass}`}
      >
        {displaySource &&
          (isDisplayVideo ? (
            <video
              className={`absolute inset-0 w-full h-full object-cover ${imageClass}`}
              src={videoReady ? displaySource : undefined}
              poster={effectivePoster || undefined}
              // Respect the OS "reduce motion" setting — hold the first frame.
              autoPlay={videoReady && !reducedMotion}
              loop={!reducedMotion}
              muted
              playsInline
              preload={videoReady ? "metadata" : "none"}
            />
          ) : (
            <Image
              src={displaySource}
              alt="product-listing-hero-bg"
              fill
              priority
              className={`object-cover ${fullViewport ? "" : imageClass}`}
            />
          ))}
        {/* Scrim keeps the white headline/CTAs readable over bright media
            (e.g. jewellery videos shot on white) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
        {/* Top vignette — keeps the transparent navbar's white text readable
            when it overlays the hero on the home page */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />
        {/* Text block: pinned to the BOTTOM-LEFT of the banner on every page.
            The full-viewport home hero keeps its larger offset; standard 475px
            banners use a tighter one so the title sits low in the band. */}
        <div
          className={`absolute xl:px-[97px] lg:px-[52px] px-[22px] flex flex-col gap-6 w-auto ${
            fullViewport
              ? "xl:bottom-[91px] lg:bottom-[61px] bottom-[51px]"
              : "xl:bottom-[48px] lg:bottom-[40px] bottom-[32px]"
          }`}
        >
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
                      : "outlineWhite"
                  }
                  title={btn.button_text || btn?.text || btn?.title}
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
