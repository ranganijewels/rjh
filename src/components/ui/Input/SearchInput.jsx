"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SearchInput = ({ value, onChange, onClear }) => {
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      router.push(`/product?search=${encodeURIComponent(value)}`);
      onClear();
    }
  };

  return (
    <div className="w-full h-16 p-[22px_44px] bg-[var(--grey-0)]">
      <div className="self-stretch inline-flex justify-between items-center w-full">
        <div className="flex justify-start items-center gap-5 w-full">
          <div className="w-6 h-6 relative overflow-hidden">
            <img
              src="/icons/search.svg"
              alt=""
              width={24}
              height={24}
              className="w-6 h-6 left-[0.01px] top-[0.01px] absolute"
            />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search for..."
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className="w-full focus:outline-none placeholder:text-[var(--placeholder)] text-[16px] font-[400]"
          />
        </div>
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="w-6 h-6 relative overflow-hidden"
        >
          <img
            src="/icons/close.svg"
            alt=""
            width={14}
            height={14}
            className="w-3.5 h-3.5 left-[5px] top-[5px] absolute cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
