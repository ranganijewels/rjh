"use client";
import React from "react";
import Typography from "../Typography/Typography";
import { toTitleCase } from "@/utils/string";
import { useRouter, useSearchParams } from "next/navigation";

const FilterChips = ({ filters, clearFilters, allFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert filter key + value to display name
  const getLabel = (key, value) => {
    if (!value) return null;

    if (typeof value === "object")
      return value.label || value.name || value.value || value;

    switch (key) {
      case "category_id":
        return (
          allFilters?.category?.find((f) => f.id === Number(value))?.name ||
          value
        );
      case "sub_category_id":
        return (
          allFilters?.style?.find((f) => f.id === Number(value))?.name || value
        );
      case "metal_color":
        return (
          allFilters?.metal_colors?.find((f) => f.value === value)?.value ||
          value
        );
      case "quality_id":
        return (
          allFilters?.purity?.find((f) => f.id === Number(value))?.value ||
          value
        );
      case "occassion_id":
        return (
          allFilters?.shape?.find((f) => f.id === Number(value))
            ?.custom_title || value
        );
      default:
        return value;
    }
  };

  const keyToParamMap = {
    sub_category_id: "subcat",
    metal_color: "metal",
    quality_id: "quality",
    occassion_id: "shape",
    category_id: "category_id",
  };

  // Remove only the clicked filter
  const handleRemove = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramName = keyToParamMap[key] || key;
    params.delete(paramName);
    router.replace(`?${params.toString()}`);
  };

  const handleClearAll = () => {
    router.replace(window.location.pathname);
  };

  const filterEntries = Object.entries(filters).filter(
    ([, val]) => val != null
  );

  return (
    <div className="flex flex-wrap xl:gap-[34px] lg:gap-[20px] gap-[10px] py-[8px]">
      {filterEntries.map(([key, value]) => (
        <button
          key={key}
          className="flex items-center gap-2 bg-gray-100 p-1 rounded"
          onClick={() => handleRemove(key)}
        >
          <Typography variant="h6">
            {toTitleCase(getLabel(key, value))}
          </Typography>
          <img
            src="/icons/close.svg"
            alt="Remove"
            className="!w-[10px] !h-[10px] cursor-pointer"
          />
        </button>
      ))}

      {filterEntries.length > 0 && (
        <button
          onClick={handleClearAll}
          className="flex p-[4px_10px] gap-[10px] items-center bg-[var(--grey-0)] rounded-[4px]"
        >
          Reset All
        </button>
      )}
    </div>
  );
};

export default FilterChips;
