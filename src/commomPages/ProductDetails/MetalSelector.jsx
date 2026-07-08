"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button/Button";
import clsx from "clsx";
import { toTitleCase } from "@/utils/string";
import { useMetalColorMap, swatchCss } from "@/hooks/useMetalColorMap";

const colorMap = {
  WHITE: "var(--white-gold)",
  YELLOW: "var(--yellow-gold)",
  ROSE: "var(--rose-gold)",
  "WHITE/YELLOW":
    "linear-gradient(135deg, var(--metal-white) 50%, var(--metal-yellow) 50%)",
  "WHITE/ROSE":
    "linear-gradient(135deg, var(--metal-white) 50%, var(--metal-rose) 50%)",
};

const colorPriority = {
  WHITE: 1,
  YELLOW: 2,
  ROSE: 3,
  "WHITE/YELLOW": 4,
  "WHITE/ROSE": 5,
};

// Default purity per non-gold metal when the catalog entry doesn't specify one.
const METAL_DEFAULT_PURITY = { Silver: "925", Platinum: "950" };

/**
 * Ecksand-style metal control: ONE chip row combining metal type + purity
 * (14K / 18K / 22K for gold, plus a Sterling Silver / Platinum chip whenever the
 * product's catalog entry — product.metadata.metalOptions — offers them), and a
 * colour swatch row for the selected metal's available colours. Falls back to
 * the classic gold karats + colours when a product has no metalOptions.
 */
const MetalSelector = ({
  metal,
  carat = [],
  colorType = [],
  metalOptions = [],
  value,
  onChange,
  handleGetAmount,
  activeColor,
  setActiveColor,
  useActiveSource,
  className,
}) => {
  const { karat, color } = value || {};
  const [metalType, setMetalType] = useState("Gold");
  // Admin-managed swatch colors (hex + hex2 two-tone); colorMap is the fallback.
  const colorMasterMap = useMetalColorMap();

  // Normalized metal families: [{type, purities[], colors[]}]
  const metals = useMemo(() => {
    if (Array.isArray(metalOptions) && metalOptions.length) {
      return metalOptions.map((m) => ({
        type: toTitleCase(m.type || "Gold"),
        purities:
          (m.purities || []).length > 0
            ? m.purities
            : [METAL_DEFAULT_PURITY[toTitleCase(m.type)] || "14K"],
        colors: (m.colors || []).map((c) => String(c).toUpperCase()),
      }));
    }
    return [
      {
        type: "Gold",
        purities: carat.map((k) => k.value),
        colors: colorType.map((c) => String(c).toUpperCase()),
      },
    ];
  }, [metalOptions, carat, colorType]);

  // Flat chip list: every gold purity is a chip; Silver/Platinum get one chip each.
  const chips = useMemo(
    () =>
      metals.flatMap((m) =>
        m.type === "Gold"
          ? m.purities.map((p) => ({
              label: p,
              purity: p,
              type: "Gold",
            }))
          : [
              {
                label: m.type === "Silver" ? "Sterling Silver" : m.type,
                purity: m.purities[0],
                type: m.type,
              },
            ]
      ),
    [metals]
  );

  const activeMetal = metals.find((m) => m.type === metalType) || metals[0];
  const availableColors = activeMetal?.colors || [];

  useEffect(() => {
    if (!karat || !color) {
      const goldPurities = chips.filter((c) => c.type === "Gold");
      const initial =
        goldPurities.find((c) => c.purity === "14K") || chips[0] || null;
      // Prefer the URL-driven activeColor so direct links like ?selectedMetalColor=ROSE
      // are not overwritten by the default first colour entry ("YELLOW").
      const initialColor =
        metal?.color || activeColor || availableColors[0] || null;

      if (initial && initialColor) {
        onChange?.({
          karat: { value: initial.purity, metalType: initial.type },
          color: initialColor,
        });
      }
    }
  }, [metal, chips, karat, color, onChange]);

  const getBackground = (value) => {
    // Master-defined color (incl. two-tone hex pairs) wins.
    const entry = colorMasterMap[String(value || "").toUpperCase().trim()];
    if (entry?.hex) return swatchCss(entry);
    return value.includes("/")
      ? `linear-gradient(135deg, ${colorMap[value.split("/")[0]]} 50%, ${
          colorMap[value.split("/")[1]]
        } 50%)`
      : colorMap[value] || "#ccc";
  };

  const selectChip = (chip) => {
    setMetalType(chip.type);
    const nextColors =
      metals.find((m) => m.type === chip.type)?.colors || [];
    const nextColor = nextColors.includes(activeColor)
      ? activeColor
      : nextColors[0] || null;
    if (nextColor && setActiveColor) setActiveColor(nextColor);
    const newMetal = {
      karat: { value: chip.purity, metalType: chip.type },
      color: nextColor || color,
    };
    onChange?.(newMetal);
    handleGetAmount?.(newMetal);
  };

  // Human label: "14K White Gold" / "925 Sterling Silver" / "950 Platinum"
  const selectionLabel = (() => {
    if (!karat?.value) return "";
    if (metalType === "Gold")
      return `${karat.value} ${activeColor ? toTitleCase(activeColor) + " " : ""}Gold`;
    return `${karat.value} ${metalType === "Silver" ? "Sterling Silver" : metalType}`;
  })();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <div className="inline-flex gap-2">
        <p className="text-[14px] font-[500] text-[var(--grey-2)]">Metal :</p>
        <label className="text-sm font-normal text-[var(--teal-1)]">
          {selectionLabel}
        </label>
      </div>

      {/* Metal + purity chips (Ecksand-style single row) */}
      <div className="flex gap-2 flex-wrap">
        {chips.map((chip, idx) => {
          const isActive =
            karat?.value === chip.purity &&
            (karat?.metalType || "Gold") === chip.type;
          return (
            <Button
              key={`${chip.type}-${chip.purity}-${idx}`}
              variant="filtersOutline"
              title={chip.label}
              onClick={() => selectChip(chip)}
              className={clsx(
                "min-w-[70px] !w-auto px-3",
                isActive && "border border-[var(--teal-1)]"
              )}
            />
          );
        })}
      </div>

      {/* Colour swatches for the selected metal (hidden when it has none) */}
      {availableColors.length > 0 && (
        <div className="flex gap-2">
          {[...availableColors]
            .sort((a, b) => (colorPriority[a] || 99) - (colorPriority[b] || 99))
            .map((c, idx) => (
              <Button
                key={`${c}-${idx}`}
                ariaLabel={`${toTitleCase(c)} ${metalType}`}
                background={getBackground(c)}
                variant="colorPalette"
                onClick={() => {
                  if (setActiveColor) setActiveColor(c);
                  onChange?.({ karat, color: c });
                }}
                className={clsx(
                  "!w-10 !h-10 !p-[6px] !bg-clip-content box-border !rounded-[5px] lg:!w-7 lg:!h-7 lg:!p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)]",
                  (useActiveSource === "activeColor"
                    ? activeColor === c
                    : color === c) && "ring-2 ring-[var(--teal-1)]"
                )}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MetalSelector;
