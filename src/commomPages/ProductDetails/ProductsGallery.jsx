"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import ImageLightbox from "./ImageLightbox";

const isVideo = (src) =>
  typeof src === "string" &&
  [".mp4", ".webm", ".ogg"].some((ext) => src.toLowerCase().endsWith(ext));

const getHeightClass = (index) => {
  if (index === 0) {
    return {
      container: "h-[360px] sm:h-[420px] xl:h-[814px] lg:h-[471px]",
      media: "h-[360px] sm:h-[420px] xl:h-[814px] lg:h-[471px]",
    };
  }
  if ([1, 2, 3].includes(index)) {
    return {
      container: "h-[220px] sm:h-[260px] xl:h-[607px] lg:h-[378px]",
      media: "h-[180px] sm:h-[210px] xl:h-[469px] lg:h-[247px]",
    };
  }
  if (index === 4) {
    return {
      container: "h-[220px] sm:h-[260px] xl:h-[607px] lg:h-[378px]",
      media: "h-full",
    };
  }
  if ([5, 6].includes(index)) {
    return {
      container: "h-[180px] sm:h-[210px] xl:h-[469px] lg:h-[247px]",
      media: "h-[180px] sm:h-[210px] xl:h-[469px] lg:h-[247px]",
    };
  }

  return { container: "", media: "" };
};

const ProductsGallery = ({
  allImagesAndVideos,
  activeColor,
  setActiveColor,
  productName,
}) => {
  const searchParams = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();
  const urlColor =
    searchParams.get("selectedMetalColor") || searchParams.get("color");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const urlColor = searchParams.get("selectedMetalColor");

    if (urlColor) {
      setActiveColor(urlColor.toUpperCase());
    } else {
      setActiveColor(DEFAULT_COLOR);
    }
  }, [searchParams]);

  const DEFAULT_COLOR = "YELLOW";

  const resolvedActiveColor = useMemo(() => {
    if (urlColor) return urlColor.toUpperCase();
    if (activeColor) return activeColor.toUpperCase();
    return DEFAULT_COLOR;
  }, [urlColor, activeColor]);

  const safeMedia = useMemo(() => {
    if (!allImagesAndVideos) return [];
    return Array.isArray(allImagesAndVideos)
      ? allImagesAndVideos
      : [allImagesAndVideos];
  }, [allImagesAndVideos]);

  const filteredMedia = useMemo(() => {
    const byColor = safeMedia.filter(
      (m) => m?.color?.toUpperCase() === resolvedActiveColor
    );
    // Fall back to YELLOW if no images tagged for the selected color
    if (byColor.length > 0) return byColor;
    const yellow = safeMedia.filter((m) => m?.color?.toUpperCase() === "YELLOW");
    if (yellow.length > 0) return yellow;
    return safeMedia;
  }, [safeMedia, resolvedActiveColor]);

  const orderedMedia = useMemo(() => {
    // De-dupe by URL — variants/colors can register the same file more than
    // once, which showed the identical shot twice (above AND below the hero).
    const seen = new Set();
    const unique = filteredMedia.filter((m) => {
      const key = m?.image;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const videos = unique.filter((m) => isVideo(m.image));
    const images = unique.filter((m) => !isVideo(m.image));
    if (!videos.length) return images;
    // MiaDonna-style: hero image first, the autoplaying video immediately
    // after it, then the remaining stills.
    return [images[0], ...videos, ...images.slice(1)].filter(Boolean);
  }, [filteredMedia]);

  const activeMedia = orderedMedia[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [resolvedActiveColor, orderedMedia]);

  const handleMouseEnter = (containerElement) => {
    const videoElement = containerElement.querySelector("video");
    if (videoElement) {
      videoElement.pause();
    }
  };

  const handleMouseLeave = (containerElement) => {
    const videoElement = containerElement.querySelector("video");
    if (videoElement) {
      videoElement.play();
    }
  };

  return (
    <>
      {/* Mobile Main Preview */}
      {activeMedia && (
        <div
          className="md:hidden bg-white aspect-square flex items-center justify-center cursor-zoom-in"
          onClick={() => setLightboxIndex(activeIndex)}
        >
          {isVideo(activeMedia.image) ? (
            <video
              src={activeMedia.image}
              autoPlay={!reducedMotion}
              loop={!reducedMotion}
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={activeMedia.image}
              alt={
                productName
                  ? `${productName}${
                      activeMedia?.color
                        ? ` in ${activeMedia.color.toLowerCase()} finish`
                        : ""
                    }`
                  : `Selected product${
                      activeMedia?.color
                        ? ` in ${activeMedia.color.toLowerCase()} finish`
                        : ""
                    }`
              }
              width={800}
              height={800}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      )}

      {/* Mobile Thumbnails */}
      <div className="md:hidden flex gap-2 overflow-x-auto px-2 mt-[18px]">
        {orderedMedia.map((media, index) => (
          <div
            key={index}
            className={clsx(
              "relative w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] shrink-0 bg-[var(--product-bg)] rounded-md cursor-pointer",
              index === activeIndex && "border border-[var(--teal-1)]"
            )}
            onClick={() => setActiveIndex(index)}
          >
            {isVideo(media.image) ? (
              <>
                <video
                  src={media.image}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                {/* play badge so shoppers know this thumbnail is a video */}
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-6 h-6 rounded-full bg-black/45 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                      <path d="M2 1l7 4-7 4V1z" />
                    </svg>
                  </span>
                </span>
              </>
            ) : (
              <Image
                alt={
                  productName
                    ? `${productName}${
                        media?.color ? ` in ${media.color.toLowerCase()} finish` : ""
                      } thumbnail ${index + 1}`
                    : `Product thumbnail ${index + 1}${
                        media?.color ? ` - ${media.color.toLowerCase()} finish` : ""
                      }`
                }
                src={media.image}
                width={75}
                height={75}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* Desktop View (unchanged behaviour) */}
      <div className="hidden md:grid grid-cols-2 xl:gap-[10px] gap-[5px] w-full">
        {orderedMedia.map((product, index) => {
          const heightClass = getHeightClass(index);
          const isMediaVideo = isVideo(product.image);

          return (
            <div
              key={index}
              className={clsx(
                index === 0 && "col-span-2",
                "bg-[var(--product-bg)] inline-flex items-center overflow-hidden cursor-zoom-in group",
                heightClass.container
              )}
              onMouseEnter={
                isMediaVideo
                  ? (e) => handleMouseEnter(e.currentTarget)
                  : undefined
              }
              onMouseLeave={
                isMediaVideo
                  ? (e) => handleMouseLeave(e.currentTarget)
                  : undefined
              }
              onClick={() => setLightboxIndex(index)}
            >
              {isMediaVideo ? (
                <video
                  src={product.image}
                  autoPlay={!reducedMotion}
                  loop={!reducedMotion}
                  muted
                  playsInline
                  preload="metadata"
                  className={clsx(
                    "w-full object-contain bg-white transition-transform duration-300 ease-out group-hover:scale-[1.04]",
                    heightClass.media
                  )}
                />
              ) : (
                <img
                  src={product.image}
                  alt={
                    productName
                      ? `${productName}${
                          product?.color ? ` in ${product.color.toLowerCase()} finish` : ""
                        } - view ${index + 1}`
                      : `Product image ${index + 1}${
                          product?.color ? ` - ${product.color.toLowerCase()} finish` : ""
                        }`
                  }
                  width={800}
                  height={800}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={clsx(
                    "w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]",
                    heightClass.media
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          media={orderedMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          productName={productName}
        />
      )}
    </>
  );
};

export default ProductsGallery;
