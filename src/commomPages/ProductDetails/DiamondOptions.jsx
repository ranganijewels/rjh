"use client";
import React, { useEffect, useRef, useMemo, useState } from "react";
import Button from "@/components/ui/Button/Button";
import HeadingWithNavigation from "@/components/ui/Heading/HeadingWithNavigation";
import { useScrollControls } from "@/hooks/useScrollControls";
import clsx from "clsx";
import { SHAPE_CODES_IMAGE } from "@/constants/constant";
import { formatCarat, toTitleCase } from "@/utils/string";
import { useSearchParams } from "next/navigation";

const DiamondOptions = ({
  diamodShapeTitle,
  variantList = [],
  dimondShapeWithNavigation = true,
  onShapeClick,
  onWeightChange,
  designNo,
  productInfo,
  onSizeChange,
  showSizeSection,
  selectedCarat,
  setSelectedCarat,
  occasion,
}) => {
  console.log("varantList", variantList);
  /** ---------------- SHAPE SCROLL ---------------- */
  const {
    containerRef: shapeRef,
    canScrollLeft: shapeCanScrollLeft,
    canScrollRight: shapeCanScrollRight,
    scroll: shapeScroll,
    updateScrollState: updateShapeScrollState,
  } = useScrollControls();

  /** ---------------- CARAT SCROLL ---------------- */
  const {
    containerRef: caratRef,
    canScrollLeft: caratCanScrollLeft,
    canScrollRight: caratCanScrollRight,
    scroll: caratScroll,
    updateScrollState: updateCaratScrollState,
  } = useScrollControls();

  /** ---------------- SIZE SCROLL ---------------- */
  const {
    containerRef: sizeRef,
    canScrollLeft: sizeCanScrollLeft,
    canScrollRight: sizeCanScrollRight,
    scroll: sizeScroll,
    updateScrollState: updateSizeScrollState,
  } = useScrollControls();

  const activeRef = useRef(null);
  const searchParams = useSearchParams();
  const shapeFromUrl = searchParams.get("shape");
  const [stableVariants, setStableVariants] = useState([]);
  const [selectedShapeLabel, setSelectedShapeLabel] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);

  /** ---------------- INITIALIZE SHAPE VARIANTS ---------------- */
  useEffect(() => {
    if (variantList?.length && stableVariants.length === 0) {
      setStableVariants(variantList);
    }
  }, [variantList, stableVariants]);

  /** ---------------- UPDATE SCROLL STATES ---------------- */
  useEffect(() => {
    if (variantList.length > 0) {
      setTimeout(() => updateShapeScrollState(), 100);
    }
  }, [variantList]);

  const filteredVariants = useMemo(() => {
    if (!variantList?.length) return [];

    return variantList.filter((v) => {
      if (!v?.designno) return true;

      const base = v.designno.replace(/-\d+$/, "");

      return !variantList.some(
        (other) => other !== v && other.designno === base
      );
    });
  }, [variantList]);

  useEffect(() => {
    if (filteredVariants.length && stableVariants.length === 0) {
      setStableVariants(filteredVariants);
    }
  }, [filteredVariants, stableVariants]);

  useEffect(() => {
    if (productInfo?.productsizevariant?.length > 0) {
      setTimeout(() => {
        updateCaratScrollState();
        updateSizeScrollState();
      }, 150);
    }
  }, [productInfo]);

  // useEffect(() => {
  //   const sizes = productInfo?.productsizevariant
  //     ?.map((v) => v.size)
  //     .filter(Boolean); // remove null sizes

  //   if (!sizes || sizes.length === 0) return;

  //   const uniqueSizes = [...new Set(sizes)];

  //   // Only set default if not already selected
  //   if (!selectedSize) {
  //     const first = uniqueSizes[0];

  //     const variant = productInfo.productsizevariant.find(
  //       (v) => v.size === first
  //     );

  //     setSelectedSize(first);

  //     onSizeChange?.({
  //       size: first,
  //       carat: variant?.carat,
  //       variantId: variant?.variant_product_id,
  //     });
  //   }
  // }, [productInfo?.productsizevariant]);

  useEffect(() => {
    const sizes = productInfo?.productsizevariant
      ?.map((v) => v.size)
      .filter(
        (s) =>
          typeof s === "string" &&
          ["small", "medium", "large"].includes(s.toLowerCase())
      );

    if (!sizes || sizes.length === 0) {
      onSizeChange?.({ size: "" });
      return;
    }

    const uniqueSizes = [...new Set(sizes)];

    if (!selectedSize) {
      const first = uniqueSizes[0];

      const variant = productInfo.productsizevariant.find(
        (v) => v.size === first
      );

      setSelectedSize(first);

      onSizeChange?.({
        size: first,
        variantId: variant?.variant_product_id,
      });
    }
  }, [productInfo?.productsizevariant]);

  /** ---------------- DETERMINE DISPLAY SHAPE ---------------- */
  const getDisplayShape = (variant) =>
    variant?.custom_shape_title || variant?.label || variant?.shape || "";

  const activeVariant = useMemo(() => {
    if (!variantList?.length) return null;
    return (
      variantList.find((v) => {
        const displayShape = getDisplayShape(v);
        return (
          String(shapeFromUrl)?.toLowerCase() ===
            String(displayShape)?.toLowerCase() || designNo === v.designno
        );
      }) || null
    );
  }, [variantList, shapeFromUrl, designNo]);

  useEffect(() => {
    if (activeVariant) {
      setSelectedShapeLabel(toTitleCase(getDisplayShape(activeVariant)));
    }
    setSelectedShapeLabel(occasion?.custom_title || "");
  }, []);

  /** ---------------- AUTO SELECT DEFAULT CARAT ---------------- */

  useEffect(() => {
    if (!productInfo?.productsizevariant?.length) return;

    // All carat values from variant list
    const caratValues = productInfo.productsizevariant
      .filter((v) => v.carat)
      .map((v) => {
        const numeric = parseFloat(v.carat);

        return {
          value: v.carat,
          numeric,
          id: v.id,
          variantId: v.variant_product_id,
        };
      });

    // Carat from center_diamonds
    const center = productInfo.center_diamonds?.[0]?.wt;
    const centerNumeric = center ? parseFloat(center) : null;

    let defaultCarat = null;
    let defaultVariantId = null;

    // Priority 1 — match center diamond value numerically
    if (centerNumeric) {
      const match = caratValues.find((c) => c.numeric === centerNumeric);

      if (match) {
        defaultCarat = match.value;
        defaultVariantId = match.variantId;
      }
    }

    // Priority 2 — fallback to FIRST variant
    if (!defaultCarat && caratValues.length > 0) {
      defaultCarat = caratValues[0].value;
      defaultVariantId = caratValues[0].variantId;
    }

    // Prevent resetting again if already selected
    if (!selectedCarat && defaultCarat) {
      setSelectedCarat(defaultCarat);

      onWeightChange?.({
        size: selectedSize,
        carat: defaultCarat,
        variantId: defaultVariantId,
      });
    }
  }, [productInfo, selectedCarat, selectedSize, onWeightChange]);

  const caratList = useMemo(
    () =>
      (productInfo?.productsizevariant || [])
        .filter((v) => v.carat)
        .map((v) => ({ value: v.carat, variantId: v.variant_product_id }))
        .sort((a, b) => parseFloat(a.value) - parseFloat(b.value)),
    [productInfo]
  );

  // useEffect(() => {
  //   if (!caratList.length) return;
  //   const first = caratList[0];

  //   setSelectedCarat(first.value);
  //   onWeightChange?.({
  //     size: selectedSize,
  //     carat: first.value,
  //     variantId: first.variantId,
  //   });
  // }, [caratList, selectedSize]);

  return (
    <div className="space-y-6">
      {/* ---------- SHAPE SECTION ---------- */}
      {variantList?.length > 0 && (
        <div className="space-y-4">
          {dimondShapeWithNavigation && (
            <HeadingWithNavigation
              title={diamodShapeTitle}
              label={selectedShapeLabel || ""}
              onPrev={() => shapeScroll("prev")}
              onNext={() => shapeScroll("next")}
              canScrollLeft={shapeCanScrollLeft}
              canScrollRight={shapeCanScrollRight}
              buttonWithLabel
              hideMarginBottom
              iconStyle="w-[28px] h-[28px]"
            />
          )}

          <div
            ref={shapeRef}
            className={clsx(
              dimondShapeWithNavigation
                ? "flex overflow-x-auto hide-scrollbar gap-4 whitespace-nowrap w-full"
                : "flex gap-6"
            )}
          >
            {stableVariants.map((variant) => {
              const shapeKey =
                variant?.shape?.toUpperCase() || variant?.name?.toUpperCase();
              const shapeEntry = SHAPE_CODES_IMAGE.find((entry) =>
                Object.hasOwn(entry, shapeKey)
              );
              const shapeObj = shapeEntry?.[shapeKey];
              const IconComponent = shapeObj?.icon;
              if (!IconComponent) return null;

              const isActive =
                String(shapeFromUrl)?.toLowerCase() ===
                  String(getDisplayShape(variant))?.toLowerCase() ||
                designNo === variant.designno ||
                variant?.shape === productInfo?.occasion?.name;

              return (
                <div
                  key={variant.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => {
                    onShapeClick?.(
                      variant.designno,
                      getDisplayShape(variant),
                      variant.media,
                      variant.occasion,
                      variant.id,
                      variant.variant_product_id
                    );
                    setSelectedShapeLabel(
                      toTitleCase(getDisplayShape(variant))
                    );
                  }}
                  className={clsx(
                    "cursor-pointer flex items-center justify-center shrink-0",
                    isActive && "border-b border-[var(--teal-1)]"
                  )}
                >
                  <IconComponent
                    className={clsx(
                      "w-full !h-[45px] object-contain shrink-0",
                      isActive && "text-[var(--teal-1)] mb-1"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- CARAT SECTION ---------- */}
      {showSizeSection &&
        productInfo?.productsizevariant?.some((v) => v.carat) && (
          <div className="space-y-4">
            <HeadingWithNavigation
              title="Center Diamond Weight :"
              label={formatCarat(selectedCarat)}
              onPrev={() => caratScroll("prev")}
              onNext={() => caratScroll("next")}
              canScrollLeft={caratCanScrollLeft}
              canScrollRight={caratCanScrollRight}
              buttonWithLabel
              hideMarginBottom
              iconStyle="w-[24px] h-[12px] xl:w-[20px] xl:h-[26px]"
            />

            <div
              ref={caratRef}
              className="flex overflow-x-auto hide-scrollbar gap-2 whitespace-nowrap"
            >
              {[
                ...productInfo.productsizevariant
                  .filter((v) => v.carat)
                  .map((v) => ({
                    value: v.carat,
                    id: v.id,
                    variantId: v.variant_product_id,
                    designNo: v.designno,
                  })),
              ]
                // .filter(
                //   (item, index, arr) =>
                //     index === arr.findIndex((x) => x.value === item.value)
                // )
                .sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
                .map((item, i) => {
                  const isSelected = selectedCarat === item.value;

                  // const displayValue =
                  //   item.id === null &&
                  //   String(item.value) === String(selectedCarat)
                  //     ? `${item.value} CT`
                  //     : item.value;
                  const displayValue = formatCarat(item.value);

                  return (
                    <Button
                      key={`weight-${item.value}-${i}`}
                      variant="filtersOutline"
                      title={displayValue}
                      onClick={() => {
                        setSelectedCarat(item.value);
                        onWeightChange?.({
                          designNo: item?.designNo,
                          size: selectedSize,
                          carat: item.value,
                          variantId: item.variantId,
                        });
                      }}
                      className={clsx(
                        "slide-card border !capitalize transition-all duration-200",
                        isSelected
                          ? "border-[var(--teal-1)]"
                          : "border-[var(--teal-3)] hover:border-[var(--teal-1)]"
                      )}
                    >
                      {displayValue}
                    </Button>
                  );
                })}
            </div>
          </div>
        )}

      {/* ---------- SIZE SECTION ---------- */}
      {productInfo?.productsizevariant?.some((v) =>
        ["small", "medium", "large"].includes(v?.size?.toLowerCase())
      ) && (
        <div className="space-y-4">
          <HeadingWithNavigation
            title="Width :"
            label={selectedSize || ""}
            onPrev={() => sizeScroll("prev")}
            onNext={() => sizeScroll("next")}
            canScrollLeft={sizeCanScrollLeft}
            canScrollRight={sizeCanScrollRight}
            buttonWithLabel
            hideMarginBottom
            iconStyle="w-[24px] h-[12px] xl:w-[20px] xl:h-[26px]"
          />

          <div
            ref={sizeRef}
            className="flex overflow-x-auto hide-scrollbar gap-2 whitespace-nowrap"
          >
            {/* {[
              ...new Set(productInfo.productsizevariant.map((v) => v.size)),
            ].map((size, i) => { */}
            {[
              ...new Set(
                productInfo.productsizevariant
                  .map((v) => v.size)
                  .filter(
                    (s) =>
                      typeof s === "string" &&
                      ["small", "medium", "large"].includes(s.toLowerCase())
                  )
              ),
            ].map((size, i) => {
              const variant = productInfo.productsizevariant.find(
                (v) => v.size === size
              );

              const isSelected = String(selectedSize) === String(size);

              return (
                <Button
                  key={i}
                  variant="filtersOutline"
                  title={size}
                  onClick={() => {
                    setSelectedSize(size);
                    onSizeChange?.({
                      size,
                      carat: variant.carat,
                      variantId: variant.variant_product_id,
                    });
                  }}
                  className={clsx(
                    "slide-card border !capitalize transition-all duration-200",
                    isSelected
                      ? "border-[var(--teal-1)]"
                      : "border-[var(--teal-3)] hover:border-[var(--teal-1)]"
                  )}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiamondOptions;
