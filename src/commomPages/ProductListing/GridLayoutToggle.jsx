import React from "react";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";

const GridLayoutToggle = ({
  setGridLayout,
  isMobile,
  isActive,
  products,
  setFiltersPayload,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const options = [
    // { label: "Most Loved", value: "most_loved" },
    { label: "Price high to low", value: "price_high_to_low" },
    { label: "Price low to high", value: "price_low_to_high" },
  ];

  // Get current selected value from URL params
  const getParamValue = (paramKey) => {
    const val = searchParams.get(paramKey);
    if (!val) return null;
    return options.find((opt) => opt.value === val) || null;
  };

  const handleSortChange = (selectedOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!selectedOption) {
      params.delete("sort_by");
    } else {
      params.set("sort_by", selectedOption.value);
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-[16px]">
      {/* 2-column */}
      <button
        onClick={() => setGridLayout("grid-cols-2")}
        className="flex flex-col items-center"
      >
        <div
          className={`lg:w-6 lg:h-6 w-[18px] h-[18px] md:mb-[10px] mb-1  rounded border ${
            isActive("grid-cols-2")
              ? "border-[var(--teal-1)]"
              : "border-[var(--teal-3)]"
          }`}
        />
        {isActive("grid-cols-2") && (
          <div className="w-[6px] h-[2px] bg-[var(--teal-1)] rounded-[3px]" />
        )}
      </button>

      {/* 4-column */}
      <button
        onClick={() => setGridLayout("grid-cols-4")}
        className="flex flex-col items-center"
      >
        <div className="grid grid-cols-2 lg:gap-[3px] gap-[2px] md:mb-[10px] mb-1 ">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`lg:w-2.5 lg:h-6 w-[7px] h-[18px] rounded border ${
                isActive("grid-cols-4")
                  ? "border-[var(--teal-1)]"
                  : "border-[var(--teal-3)]"
              }`}
            />
          ))}
        </div>
        {isActive("grid-cols-4") && (
          <div className="w-[6px] h-[2px] bg-[var(--teal-1)] rounded-[3px]" />
        )}
      </button>

      {/* 5-column */}
      {!isMobile && (
        <button
          onClick={() => setGridLayout("grid-cols-5")}
          className="flex flex-col items-center"
        >
          <div className="grid grid-cols-2 gap-[3px] md:mb-[10px] mb-1 ">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded border ${
                  isActive("grid-cols-5")
                    ? "border-[var(--teal-1)]"
                    : "border-[var(--teal-3)]"
                }`}
              />
            ))}
          </div>
          {isActive("grid-cols-5") && (
            <div className="w-[6px] h-[2px] bg-[var(--teal-1)] rounded-[3px]" />
          )}
        </button>
      )}

      {/* Sort Select */}
      {!isMobile && (
        <div className="lg:p-[10px_14px]">
          <Dropdown
            buttonStyle="!border-0 !outline-0 focus:!ring-0 focus:!ring-offset-0 !p-0"
            options={options}
            value={getParamValue("sort_by")}
            onChange={handleSortChange}
            placeholder="Sort by :"
            className="xl:text-[14px] text-[10px] font-[400] text-[var(--teal-1)]"
            labelStyle="!font-[500] !mb-0"
            iconOnly
          />
        </div>
      )}
    </div>
  );
};

export default GridLayoutToggle;
