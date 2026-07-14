"use client";
import React, { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

const isVideo = (src) =>
  typeof src === "string" &&
  [".mp4", ".webm", ".ogg"].some((ext) => src.toLowerCase().endsWith(ext));

const ImageLightbox = ({ media, index, onClose, onNavigate, productName }) => {
  const total = media.length;
  const current = media[index];
  // Rendered via a portal straight onto <body> — the gallery column is
  // `position: sticky`, and Safari clips `position: fixed` descendants to
  // the bounds of a sticky/positioned ancestor instead of the viewport, so
  // staying in the normal tree left the overlay visually cut off mid-page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const goPrev = useCallback(
    () => onNavigate((index - 1 + total) % total),
    [index, total, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % total),
    [index, total, onNavigate]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (!current || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${productName || "Product"} image preview`}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {total > 1 && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 sm:top-6 text-white/70 text-xs sm:text-sm tracking-wide">
          {index + 1} / {total}
        </span>
      )}

      {total > 1 && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M9 1L1 8l8 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center px-14 sm:px-24 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo(current.image) ? (
          <video
            src={current.image}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.image}
            alt={
              productName
                ? `${productName}${current?.color ? ` in ${current.color.toLowerCase()} finish` : ""} — full preview`
                : `Product full preview ${index + 1}`
            }
            className="max-w-full max-h-full object-contain select-none"
          />
        )}
      </div>

      {total > 1 && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M1 1l8 7-8 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
};

export default ImageLightbox;
