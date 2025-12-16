import React, { useState } from "react";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";

const isVideo = (src) =>
  typeof src === "string" &&
  [".mp4", ".webm", ".ogg"].some((ext) => src.toLowerCase().endsWith(ext));

const getHeightClass = (index) => {
  if ([0].includes(index)) {
    return {
      container: "xl:h-[814px] lg:h-[471px]",
      media: "xl:h-[814px] lg:h-[471px]",
    };
  }
  if ([1, 2, 3].includes(index)) {
    return {
      container: "xl:h-[607px] lg:h-[378px]",
      media: "xl:h-[469px] lg:h-[247px]",
    };
  }
  if ([4].includes(index)) {
    return {
      container: "xl:h-[607px] lg:h-[378px]",
      media: "h-full",
    };
  }
  if ([5, 6].includes(index)) {
    return {
      container: "xl:h-[469px] lg:h-[247px]",
      media: "xl:h-[469px] lg:h-[247px]",
    };
  }

  return {
    container: "",
    media: "",
  };
};

const ProductsGallery = ({ allImagesAndVideos, activeColor }) => {
  const searchParams = useSearchParams();
  const selectedShape = searchParams.get("shape")?.toLowerCase();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = allImagesAndVideos?.[activeIndex] || {};

  const safeMedia = Array.isArray(allImagesAndVideos)
    ? allImagesAndVideos
    : allImagesAndVideos
    ? [allImagesAndVideos]
    : [];

  const images = safeMedia.filter((m) => !isVideo(m.image));
  const videos = safeMedia.filter((m) => isVideo(m.image));

  const orderedMedia = [...videos, ...images];

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
      {/* Main Media Preview (Mobile) */}
      <div className="md:hidden bg-white aspect-square flex items-center justify-center">
        {isVideo(activeMedia.image) ? (
          <video
            src={activeMedia.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={activeMedia.image}
            alt={`Main product preview`}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Thumbnails (Mobile) */}
      <div className="md:hidden container flex gap-2 justify-start mx-auto overflow-x-auto hide-scrollbar px-2 whitespace-nowrap scroll-smooth snap-x">
        {allImagesAndVideos?.map((media, index) => {
          const src = media.image || media;
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={clsx(
                "snap-start w-[75px] h-[75px] cursor-pointer overflow-hidden shrink-0 bg-[var(--product-bg)] rounded-md",
                isActive && "border border-[var(--teal-1)]"
              )}
              onClick={() => setActiveIndex(index)}
            >
              {isVideo(src) ? (
                <video
                  src={src}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>

      {/*  Desktop View  */}
      <div className="hidden md:grid grid-cols-2 xl:gap-[10px] gap-[5px] w-full">
        {orderedMedia
          ?.filter((e) => e.color === activeColor)
          .map((product, index) => {
            const heightClass = getHeightClass(index);
            const isMediaVideo = isVideo(product.image || product);

            return (
              <div
                key={index}
                className={clsx(
                  index === 0 && "col-span-2",
                  "bg-[var(--product-bg)] inline-flex items-center",
                  heightClass.container
                )}
                // **New: Attach handlers to the container div**
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
              >
                {isMediaVideo ? (
                  <video
                    src={product.image || product}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={clsx(
                      "w-full object-contain bg-white",
                      heightClass.media
                    )}
                  />
                ) : (
                  <img
                    src={product.image || product}
                    alt={`Product ${index}`}
                    className={clsx("w-full object-contain", heightClass.media)}
                  />
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ProductsGallery;
