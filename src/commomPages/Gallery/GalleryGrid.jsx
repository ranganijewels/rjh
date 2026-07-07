"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const srcOf = (m) => m?.file || m?.image || m?.imageUrl || "";

// Gallery grid with a click-to-view lightbox (prev/next + keyboard + close).
export default function GalleryGrid({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null); // null = closed
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  // Keyboard nav + lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next]);

  const current = isOpen ? items[openIndex] : null;

  return (
    <>
      <div
        className="lg:px-[30px] px-[18px] grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[var(--spacing-lg)] gap-[var(--spacing-sm)] gap-y-[var(--spacing-lg)]"
        style={{ "--spacing-sm": "10px", "--spacing-lg": "20px" }}
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setOpenIndex(idx)}
            aria-label={`View image: ${item?.title || "gallery item"}`}
            className="group flex flex-col text-left cursor-zoom-in hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)]"
          >
            <span className="overflow-hidden xl:mb-[16px] mb-[8px]">
              <img
                src={srcOf(item)}
                alt={item?.title || ""}
                loading="lazy"
                width={376}
                height={376}
                className="w-full xl:h-[376px] lg:h-[207px] h-[224px] object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </span>
            <p className="xl:text-[18px] text-[12px] text-center font-[400] break-words whitespace-normal">
              {item?.title}
            </p>
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X className="w-7 h-7" />
          </button>

          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-2 md:left-6 text-white/70 hover:text-white p-2 transition"
            >
              <ChevronLeft className="w-9 h-9 md:w-11 md:h-11" />
            </button>
          )}

          <div
            className="max-w-[92vw] max-h-[75vh] md:max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={srcOf(current)}
              alt={current?.title || ""}
              className="max-w-[92vw] max-h-[76vh] object-contain shadow-2xl"
            />
            {current?.title && (
              <p className="text-white/90 text-center mt-4 text-[15px] md:text-[18px] max-w-[80vw]">
                {current.title}
              </p>
            )}
            {items.length > 1 && (
              <p className="text-white/50 text-xs mt-2">
                {openIndex + 1} / {items.length}
              </p>
            )}
          </div>

          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-2 md:right-6 text-white/70 hover:text-white p-2 transition"
            >
              <ChevronRight className="w-9 h-9 md:w-11 md:h-11" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
