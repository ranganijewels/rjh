"use client";
import React, { useRef } from "react";

const HorizontalScroller = ({ children, scrollAmount = 100, label }) => {
  const scrollRef = useRef(null);

  const scroll = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Label + Navigation Buttons */}
      <div className="flex justify-between items-center mb-2">
        {label && (
          <div className="text-[14px] font-[500] text-[#000000]">{label}</div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-scrollAmount)}
            className="bg-white shadow-md rounded-full p-1"
          >
            <img
              src="/icons/left-caret.svg"
              alt="Previous"
              width={20}
              height={20}
            />
          </button>
          <button
            onClick={() => scroll(scrollAmount)}
            className="bg-white shadow-md rounded-full p-1"
          >
            <img
              src="/icons/right-caret.svg"
              alt="Next"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* Scrollable Buttons */}
      <div
        ref={scrollRef}
        className="flex gap-[8px] overflow-x-auto hide-scrollbar scroll-smooth px-4 py-2 whitespace-nowrap"
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroller;
