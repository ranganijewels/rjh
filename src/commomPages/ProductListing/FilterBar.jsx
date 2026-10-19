"use client";
import React from "react";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CATEGORIES_ITEMS = [
  {
    id: 10,
    name: "RING",
    slug: "ring",
    custom_title: null,
  },
  {
    id: 4,
    name: "EARRING",
    slug: "earring",
    custom_title: null,
  },
  {
    id: 6,
    name: "NECKLACE",
    slug: "necklace",
    custom_title: null,
  },
  {
    id: 3,
    name: "BRACELET",
    slug: "bracelet",
    custom_title: null,
  },
  {
    id: 1,
    name: "Band",
    slug: "band",
    custom_title: null,
  },
  {
    id: 8,
    name: "Pendant",
    slug: "pendant",
    custom_title: null,
  },
];
const FilterBar = ({ filtersData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") || searchParams.get("category");
  const style = searchParams.get("subcat");
  const metal = searchParams.get("metal");
  const shape = searchParams.get("shape");

  const handleChange = (key, value) => {
    let paramValue = null;

    if (value) {
      switch (key) {
        case "category_id":
          paramValue = value.slug || value.name?.toLowerCase() || value.id;
          break;
        case "subcat":
          // Use style name so NestJS can ILIKE match it
          paramValue = value.value || value.name || value.id;
          break;
        case "metal":
          paramValue = value.value || null;
          break;
        case "shape":
          // Use shape name (e.g. "Round") so NestJS can ILIKE match it
          paramValue = value.value || value.name || value.id;
          break;
        case "quality":
          paramValue = value.value || value.id;
          break;
        default:
          paramValue = value;
      }
    }

    const params = new URLSearchParams(searchParams.toString());
    if (!paramValue) {
      params.delete(key);
    } else {
      params.set(key, paramValue);
    }

    if (key === "category_id") {
      params.delete("subcat");
      params.delete("category");
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap xl:gap-x-[34px] lg:gap-x-[24px]">
      <div className="p-[10px_14px]">
        <Dropdown
          labelStyle="font-[500]"
          label="Category :"
          value={
            categoryId
              ? CATEGORIES_ITEMS.find(
                  (opt) =>
                    opt.slug === categoryId ||
                    opt.name?.toLowerCase() === categoryId?.toLowerCase() ||
                    String(opt.id) === categoryId
                )
              : null
          }
          buttonStyle="!outline-0 !focus:ring-0 !p-0"
          options={CATEGORIES_ITEMS}
          className="xl:text-[14px] text-[10px] font-[400] text-[var(--teal-1)]"
          iconWithPlaceholder
          placeholder="Select"
          onChange={(val) => handleChange("category_id", val)}
        />
      </div>

      {/* Style Dropdown */}
      <div
        className="p-[10px_14px]"
        {...(!categoryId
          ? {
              role: "button",
              tabIndex: 0,
              "aria-disabled": true,
              "aria-describedby": "style-dropdown-hint",
            }
          : {})}
        onClick={() => {
          if (!categoryId) {
            toast("Please select a category first", { icon: "⚠️" });
          }
        }}
        onKeyDown={(e) => {
          if (!categoryId && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            toast("Please select a category first", { icon: "⚠️" });
          }
        }}
      >
        {!categoryId && (
          <span id="style-dropdown-hint" className="sr-only">
            Please select a category first to enable the style filter.
          </span>
        )}
        <Dropdown
          labelStyle="font-[500]"
          label="Style :"
          value={
            style
              ? filtersData?.style?.find(
                  (opt) =>
                    opt.value === style ||
                    opt.name === style ||
                    String(opt.id) === style
                )
              : null
          }
          // value={
          //   metal === "twotone"
          //     ? filtersData?.style?.find(
          //         (opt) => opt.name?.toLowerCase() === "two tone"
          //       )
          //     : style
          //     ? filtersData?.style?.find((opt) => String(opt.id) === style)
          //     : null
          // }
          buttonStyle="!outline-0 !focus:ring-0 !p-0"
          options={filtersData?.style}
          className="xl:text-[14px] text-[10px] font-[400] text-[var(--teal-1)]"
          iconWithPlaceholder
          placeholder="Select"
          // onChange={(val) => {
          //   handleChange("subcat", val);
          // }}
          onChange={(val) => {
            if (val?.name?.toLowerCase() === "two tone") {
              handleChange("metal", { value: "two tone" });
            } else {
              handleChange("metal", null);
              handleChange("subcat", val);
            }
          }}
          disabled={!categoryId}
        />
      </div>

      {/* Diamond Shape Dropdown */}
      <div className="p-[10px_14px]">
        <Dropdown
          labelStyle="font-[500]"
          label="Diamond shape :"
          value={
            shape
              ? filtersData?.shape?.find(
                  (opt) =>
                    opt.value === shape ||
                    opt.name === shape ||
                    String(opt.id) === shape
                )
              : null
          }
          buttonStyle="!outline-0 !focus:ring-0 !p-0"
          options={filtersData?.shape}
          className="xl:text-[14px] text-[10px] font-[400] text-[var(--teal-1)]"
          iconWithPlaceholder
          placeholder="Select"
          onChange={(val) => handleChange("shape", val)}
        />
      </div>

      {/* Metal Color Dropdown */}
      <div className="p-[10px_14px]">
        <Dropdown
          labelStyle="font-[500]"
          label="Metal color :"
          value={
            metal
              ? filtersData?.metal_colors
                  ?.filter(
                    (opt) =>
                      opt.value !== "WHITE/ROSE" && opt.value !== "WHITE/YELLOW"
                  )
                  .find(
                    (opt) =>
                      opt.value?.toLowerCase() === metal?.toLowerCase() ||
                      String(opt.id)?.toLowerCase() === metal?.toLowerCase()
                  )
              : null
          }
          buttonStyle="!outline-0 !focus:ring-0 !p-0"
          options={filtersData?.metal_colors?.filter(
            (opt) => opt.value !== "WHITE/ROSE" && opt.value !== "WHITE/YELLOW"
          )}
          className="xl:text-[14px] text-[10px] font-[400] text-[var(--teal-1)]"
          iconWithPlaceholder
          placeholder="Select"
          onChange={(val) => handleChange("metal", val)}
        />
      </div>

      {/* Purity Dropdown */}
      {/* <div className="p-[10px_14px]">
        <Dropdown
          labelStyle="font-[500]"
          label="Purity :"
          value={getParamValue("quality")}
          buttonStyle="!outline-0 !focus:ring-0 !p-0"
          options={filtersData?.purity}
          className="xl:text-[14px] text-[10px] font-[400] text-[var(--teal-1)]"
          iconWithPlaceholder
          placeholder="Select"
          onChange={(val) => handleChange("quality", val)}
        />
      </div> */}
    </div>
  );
};

export default FilterBar;
