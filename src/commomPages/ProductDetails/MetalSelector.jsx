"use client";
import React, { useEffect } from "react";
import Button from "@/components/ui/Button/Button";
import clsx from "clsx";
import { toTitleCase } from "@/utils/string";

const colorMap = {
  WHITE: "var(--white-gold)",
  YELLOW: "var(--yellow-gold)",
  ROSE: "var(--rose-gold)",
  "WHITE/YELLOW": "linear-gradient(135deg, #ffffff 50%, #FFD700 50%)",
  "WHITE/ROSE": "linear-gradient(135deg, #ffffff 50%, #E75480 50%)",
};

const colorPriority = {
  WHITE: 1,
  YELLOW: 2,
  ROSE: 3,
  "WHITE/YELLOW": 4,
  "WHITE/ROSE": 5,
};

const MetalSelector = ({
  metal,
  carat = [],
  colorType = [],
  value,
  onChange,
  handleGetAmount,
  activeColor,
  setActiveColor,
  useActiveSource,
  className,
}) => {
  const { karat, color } = value || {};

  useEffect(() => {
    if (!karat || !color) {
      const initialKarat =
        carat.find((k) => k.value === "14K") || carat[0] || null;
      const initialColor = metal?.color || colorType[0] || null;

      if (initialKarat && initialColor) {
        onChange?.({ karat: initialKarat, color: initialColor });
      }
    }
  }, [metal, carat, colorType, karat, color, onChange]);

  const getBackground = (value) =>
    value.includes("/")
      ? `linear-gradient(135deg, ${colorMap[value.split("/")[0]]} 50%, ${
          colorMap[value.split("/")[1]]
        } 50%)`
      : colorMap[value] || "#ccc";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <div className="inline-flex gap-2">
        <p className="text-[14px] font-[500] text-[#000000]">Metal :</p>
        <label className="text-sm font-normal text-[var(--teal-1)]">
          {karat?.value} {activeColor && toTitleCase(activeColor) + " Gold"}
        </label>
      </div>

      {/* Karat Options */}
      <div className="flex gap-2 flex-wrap">
        {carat.map((k, idx) => {
          return (
            <Button
              key={idx}
              variant="filtersOutline"
              title={k.value}
              onClick={() => {
                const newMetal = { karat: k, color };
                onChange?.(newMetal);
                handleGetAmount?.(newMetal);
              }}
              className={clsx(
                " w-full max-w-[70px]",
                karat?.value === k.value && "border border-[var(--teal-1)]"
              )}
            />
          );
        })}
      </div>

      {/* Color Options */}
      <div className="flex gap-2">
        {[...colorType]
          .sort((a, b) => (colorPriority[a] || 99) - (colorPriority[b] || 99))
          .map((c, idx) => (
            <Button
              key={`${c}-${idx}`}
              ariaLabel={`${toTitleCase(c)} Gold`}
              background={getBackground(c)}
              variant="colorPalette"
              onClick={() => {
                if (setActiveColor) setActiveColor(c);
                onChange?.({ karat, color: c });
              }}
              className={clsx(
                "!w-7 !h-7 !rounded-[5px]",
                (useActiveSource === "activeColor"
                  ? activeColor === c
                  : color === c) && "ring-2 ring-[var(--teal-1)]"
              )}
            />
          ))}
      </div>
    </div>
  );
};

export default MetalSelector;
