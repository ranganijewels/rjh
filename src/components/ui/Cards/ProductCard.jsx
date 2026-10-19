"use client";
import React, { useEffect, useMemo, useState } from "react";
import Typography from "../Typography/Typography";
import HeartIcon from "@/components/Icons/HeartIcon";
import { useRouter } from "next/navigation";
import { useProductCardLayout } from "./useProductCardLayout";
import { toTitleCase } from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import { usePreferences } from "@/context/PreferencesContext";
import { formatProductPrice } from "@/utils/money";
import { getDiscount } from "@/utils/discount";
import Link from "next/link";
import { useWishlistPopup } from "@/context/WishlistPopupContext";
import { useWishlistLogic } from "@/hooks/useWishlistLogic";
import { SHAPE_CODES_IMAGE, shapeToCode } from "@/constants/constant";
import { useMetalColorMap, swatchCss } from "@/hooks/useMetalColorMap";
import { useProductBadgeMap } from "@/hooks/useProductBadgeMap";
import { responsiveImg } from "@/lib/imageSizes";

const SHAPES = SHAPE_CODES_IMAGE[0] || {};
const shapeIconOf = (name) => SHAPES[shapeToCode(name)]?.icon || null;
const shapeTitleOf = (name) => SHAPES[shapeToCode(name)]?.title || toTitleCase(name || "");

// ── Metal swatch appearance + labels ────────────────────────────────────────
const COLOR_MAP = {
  WHITE: "var(--white-gold)",
  YELLOW: "var(--yellow-gold)",
  ROSE: "var(--rose-gold)",
  "WHITE/YELLOW": "linear-gradient(135deg, var(--white-gold) 50%, var(--yellow-gold) 50%)",
  "WHITE/ROSE": "linear-gradient(135deg, var(--white-gold) 50%, var(--rose-gold) 50%)",
};
const COLOR_LABEL = {
  WHITE: "White Gold", YELLOW: "Yellow Gold", ROSE: "Rose Gold",
  "WHITE/YELLOW": "Two-Tone (White / Yellow)", "WHITE/ROSE": "Two-Tone (White / Rose)",
};
const swatchBackground = (v) =>
  COLOR_MAP[v] || (v?.includes("/")
    ? `linear-gradient(135deg, ${COLOR_MAP[v.split("/")[0]] || "var(--grey-3)"} 50%, ${COLOR_MAP[v.split("/")[1]] || "var(--grey-3)"} 50%)`
    : "var(--grey-3)");
const toSwatchKey = (mc) => {
  const u = (mc || "").toUpperCase();
  if (u.includes("WHITE") && u.includes("YELLOW")) return "WHITE/YELLOW";
  if (u.includes("WHITE") && u.includes("ROSE")) return "WHITE/ROSE";
  if (u.includes("WHITE")) return "WHITE";
  if (u.includes("ROSE")) return "ROSE";
  return "YELLOW";
};

const ProductCard = ({
  productName, price, colorsPalettes, productImg, gridLayout, className,
  cardClass = "", imgClass = "", hoverImage: initialHoverImage, customWidth,
  productId, metalColor, wishlistStatus, categoryId, shape, metalType,
  centerDiamondWeight, ringSize, size, isWishlistCard, designNo, category,
  disableWishlistPopup = false, id, imagesByColor, allImages,
  shapeVariants, isDesignGroupCard, displayDiscountPercent, displayDiscountEndsAt, badges,
}) => {
  const router = useRouter();
  const { selectedCountry } = usePreferences();
  // Admin-managed swatch colors (hex + hex2 two-tone); hardcoded map is fallback.
  const colorMasterMap = useMetalColorMap();
  const badgeMap = useProductBadgeMap();

  // A card is either a design group (multiple shape siblings) or a single product.
  const variants = useMemo(() => {
    if (shapeVariants && shapeVariants.length) return shapeVariants;
    return [{ shape, product_id: productId, product_image: productImg, rollover_image: initialHoverImage,
      images_by_color: imagesByColor, all_images: allImages, product_price: price, metal_color: colorsPalettes }];
  }, [shapeVariants, shape, productId, productImg, initialHoverImage, imagesByColor, allImages, price, colorsPalettes]);

  const [activeShapeIdx, setActiveShapeIdx] = useState(0);
  const [activeColor, setActiveColor] = useState(toSwatchKey(metalColor));
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(wishlistStatus);

  const { create: createWishlist } = useCrudApi(`/api/wishlist`);
  const { openFor } = useWishlistPopup();
  const { toggleWishlist, removeFromWishlist } = useWishlistLogic({
    createWishlistApi: createWishlist,
    onWishlisted: disableWishlistPopup ? undefined : () => openFor(2000),
  });
  const { containerClass: container, imageClass: img } = useProductCardLayout(gridLayout, customWidth);

  const current = variants[activeShapeIdx] || variants[0];

  const sliderImages = useMemo(() => {
    const byColor = current?.images_by_color?.[activeColor] || current?.images_by_color?.[toSwatchKey(activeColor)];
    const pool = (byColor && byColor.length && byColor) ||
      (current?.all_images && current.all_images.length && current.all_images) ||
      [current?.product_image, current?.rollover_image].filter(Boolean);
    return [...new Set((pool || []).filter(Boolean))];
  }, [current, activeColor]);

  const activeImage = sliderImages[sliderIndex] || sliderImages[0] || current?.product_image;
  const metalSwatches = (current?.metal_color?.length ? current.metal_color : (colorsPalettes?.length ? colorsPalettes : ["YELLOW", "WHITE", "ROSE"]));
  const displayPrice = current?.product_price ?? price;
  const discountPct = current?.display_discount_percent ?? displayDiscountPercent ?? 0;
  const discountEnds = current?.display_discount_ends_at ?? displayDiscountEndsAt ?? null;
  const discount = current?.price_on_request ? null : getDiscount(displayPrice, discountPct, discountEnds);

  useEffect(() => { if (wishlistStatus !== undefined) setIsWishlisted(wishlistStatus); }, []);
  useEffect(() => { setSliderIndex(0); }, [activeShapeIdx, activeColor]);

  const previewShape = (i) => { setActiveShapeIdx(i); };
  const previewColor = (key) => { setActiveColor(key); };

  const goToProduct = () => {
    const pid = current?.product_id || productId;
    const qs = new URLSearchParams();
    if (categoryId) qs.set("categoryId", categoryId);
    if (activeColor) qs.set("selectedMetalColor", activeColor);
    if (pid) qs.set("variantId", pid);
    const sh = current?.shape || shape;
    if (sh) qs.set("shape", sh);
    router.push(`/product/${pid}${qs.toString() ? `?${qs}` : ""}`);
  };

  const handleWishlistToggle = async () => {
    const wishlisted = await toggleWishlist({
      product_id: current?.product_id || productId, product_price: current?.product_price || price,
      category_id: categoryId, metal_type: metalType, metal_color: (activeColor || "").toUpperCase(),
      diamond_shape: current?.shape || shape, center_diamond_weight: centerDiamondWeight?.toString() || "",
      ring_size: ringSize?.toString() || "", size: size?.toString() || "",
    });
    setIsWishlisted(wishlisted);
  };

  const visibleShapes = variants.slice(0, 5);
  const extraShapes = variants.length - visibleShapes.length;
  const visibleMetals = metalSwatches.slice(0, 5);

  return (
    <div className={`z-0 ${className}`}>
      {/* Image area — sliderable, click navigates to the active variant */}
      <div
        className={`group bg-white relative overflow-hidden mb-[14px] cursor-pointer ${customWidth ? cardClass : container}`}
        onClick={goToProduct}
        onMouseEnter={() => { if (sliderImages.length > 1 && sliderIndex === 0) setSliderIndex(1); }}
        onMouseLeave={() => setSliderIndex(0)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToProduct(); }
        }}
        aria-label={`View ${productName}`}
      >
        {/* Exactly two images: the admin-tagged Main image by default, swapped
            to the Rollover image on hover. No arrows/dots — key + fade gives a
            soft crossfade between the two. */}
        <img
          key={activeImage}
          {...responsiveImg(activeImage, "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw")}
          src={activeImage}
          alt={productName}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{ userSelect: "none" }}
          className={`card-img-fade object-contain ${customWidth ? imgClass : img}`}
        />

        {(discount || badges?.length > 0) && (
          <div className="absolute top-0 left-0 m-[12px] z-10 flex flex-col items-start gap-[6px]">
            {discount && (
              <span className="rounded-[3px] bg-[var(--color-error)] px-[8px] py-[3px] text-[11px] font-[600] leading-none text-white">
                −{discount.percent}%
              </span>
            )}
            {(badges || []).map((code) => (
              <span
                key={code}
                className="rounded-[3px] px-[8px] py-[3px] text-[11px] font-[600] leading-none text-white uppercase tracking-[0.02em]"
                style={{ backgroundColor: badgeMap[code]?.hex || "var(--grey-2)" }}
              >
                {badgeMap[code]?.name || code}
              </span>
            ))}
          </div>
        )}

        <div className="absolute top-0 right-0 m-[16px] z-10">
          <HeartIcon wishlistStatus={isWishlisted} onClick={() => (isWishlistCard ? removeFromWishlist(id) : handleWishlistToggle())} />
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-[8px]">
        {/* Ecksand-matched card typography: title 15px/400/0.25px, price 14px, "From" 11px */}
        <p className="text-[15px] font-[400] tracking-[0.25px] leading-[1.35] capitalize line-clamp-2 text-[var(--grey-2)]">
          {toTitleCase(productName)}
        </p>

        <div className="text-[var(--grey-2)] leading-tight flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
          <span>
            <span className="text-[12px] text-[var(--placeholder)]">From </span>
            <span className="text-[14px] font-[500]">{formatProductPrice(displayPrice, selectedCountry)}</span>
          </span>
          {discount && (
            <>
              <span className="text-[12px] text-[var(--placeholder)] line-through">
                {formatProductPrice(discount.originalPrice, selectedCountry)}
              </span>
              {discount.endsLabel && (
                <span className="text-[10px] font-[600] uppercase tracking-[0.03em] text-[var(--color-error)]">
                  • {discount.endsLabel}
                </span>
              )}
            </>
          )}
        </div>

        {isWishlistCard && (
          <div className="space-y-[10px] mt-[10px]">
            <Typography variant="h6" className="!capitalize">Design No. : <span className="font-[500]">{designNo}</span></Typography>
            <Typography variant="h6" className="!capitalize">Diamond Shape : <span className="font-[500]">{toTitleCase(shape)}</span></Typography>
            <Typography variant="h6" className="!capitalize">Metal : <span className="font-[500]">{toTitleCase(metalType) + " " + toTitleCase(metalColor) + " Gold"}</span></Typography>
            {centerDiamondWeight ? (<Typography variant="h6" className="!capitalize">Center Diamond Weight : <span className="font-[500]">{centerDiamondWeight + "  CT"}</span></Typography>) : null}
            {ringSize ? (
              <div className="inline-flex gap-2 items-center">
                <Typography variant="h6">{toTitleCase(category)} Size : {ringSize}</Typography>
                <Link className="flex gap-2 items-center" href="/ring-size-guide" aria-label="Ring size guide info">
                  <img src="/icons/info.svg" alt="Ring size guide info" width={14} height={14} className="cursor-pointer w-[14px] h-[14px]" />
                </Link>
              </div>
            ) : null}
          </div>
        )}

        {!isWishlistCard && (
          <>
            {/* Metal swatches (hover to preview) */}
            <div className="flex items-center gap-[10px] pt-[2px]">
              {visibleMetals.map((palette) => {
                const key = String(palette).toUpperCase();
                const isSel = activeColor === key || toSwatchKey(activeColor) === key;
                return (
                  <span key={palette} className="group/sw relative inline-flex">
                    <button type="button" aria-label={colorMasterMap[key]?.name || COLOR_LABEL[key] || toTitleCase(palette)} aria-pressed={isSel}
                      onMouseEnter={() => previewColor(key)}
                      onFocus={() => previewColor(key)}
                      onClick={(e) => { e.stopPropagation(); previewColor(key); }}
                      style={{ background: colorMasterMap[key]?.hex ? swatchCss(colorMasterMap[key]) : swatchBackground(key) }}
                      className={`relative w-[18px] h-[18px] rounded-full transition-[box-shadow] before:content-[''] before:absolute before:inset-[-6px] ${isSel ? "ring-2 ring-[var(--teal-1)] ring-offset-2" : "ring-1 ring-[var(--grey-1)] hover:ring-[var(--teal-2)]"}`} />
                    <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--grey-2)] px-2 py-1 text-[11px] text-white opacity-0 group-hover/sw:opacity-100 transition-opacity z-20">
                      {colorMasterMap[key]?.name || COLOR_LABEL[key] || toTitleCase(palette)}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Diamond-shape swatches (hover to preview + change product) */}
            {variants.length > 1 && (
              <div className="flex items-center gap-[6px] pt-[4px]">
                {visibleShapes.map((v, i) => {
                  const Icon = shapeIconOf(v.shape);
                  const title = shapeTitleOf(v.shape);
                  const isSel = i === activeShapeIdx;
                  return (
                    <span key={v.product_id || i} className="group/sh relative inline-flex">
                      <button type="button" aria-label={title} aria-pressed={isSel}
                        onMouseEnter={() => previewShape(i)}
                        onFocus={() => previewShape(i)}
                        onClick={(e) => { e.stopPropagation(); previewShape(i); goToProduct(); }}
                        className={`grid place-items-center w-[22px] h-[22px] rounded-md transition-colors ${isSel ? "text-[var(--teal-1)]" : "text-[var(--grey-2)] hover:text-[var(--teal-1)]"}`}>
                        {Icon ? <Icon className="w-[14px] h-[14px]" /> : <span className="text-[8px] uppercase">{shapeToCode(v.shape).slice(0, 3)}</span>}
                      </button>
                      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--grey-2)] px-2 py-1 text-[11px] text-white opacity-0 group-hover/sh:opacity-100 transition-opacity z-20">
                        {title}
                      </span>
                    </span>
                  );
                })}
                {extraShapes > 0 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); goToProduct(); }} className="text-[12px] italic text-[var(--placeholder)] hover:text-[var(--teal-1)]">
                    +{extraShapes} more
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
