"use client";
import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import Typography from "../Typography/Typography";
import HeartIcon from "@/components/Icons/HeartIcon";
import { useRouter } from "next/navigation";
import { useProductCardLayout } from "./useProductCardLayout";
import { toTitleCase } from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import { store } from "@/store/store";
import { usePreferences } from "@/context/PreferencesContext";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import Link from "next/link";
import { useWishlistPopup } from "@/context/WishlistPopupContext";
import { useWishlistLogic } from "@/hooks/useWishlistLogic";

const ProductCard = ({
  productName,
  price,
  colorsPalettes,
  productImg,
  gridLayout,
  className,
  cardClass = "",
  imgClass = "",
  hoverImage: initialHoverImage,
  customWidth,
  productId,
  metalColor,
  wishlistStatus,
  categoryId,
  shape,
  metalType,
  centerDiamondWeight,
  ringSize,
  size,
  isWishlistCard,
  designNo,
  category,
  disableWishlistPopup = false,
  id,
}) => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(productImg);
  const [hoverImage, setHoverImage] = useState(initialHoverImage);
  const [selectedColor, setSelectedColor] = useState(metalColor || null);
  const state = store.getState();
  const customerId = state.auth?.customer?.id;
  const { create } = useCrudApi(`/api/product/change-color`);
  const { selectedCountry } = usePreferences();
  const [isWishlisted, setIsWishlisted] = useState(wishlistStatus);
  const { create: createWishlist } = useCrudApi(`/api/wishlist`);
  const { openFor } = useWishlistPopup();

  const { toggleWishlist, removeFromWishlist, checkIfWishlisted } =
    useWishlistLogic({
      createWishlistApi: createWishlist,
      onWishlisted: disableWishlistPopup ? undefined : () => openFor(2000),
    });

  const handleWishlistToggle = async () => {
    const wishlisted = await toggleWishlist({
      product_id: productId,
      product_price: price,
      category_id: categoryId,
      metal_type: metalType,
      metal_color: selectedColor.toUpperCase(),
      diamond_shape: shape,
      center_diamond_weight: centerDiamondWeight?.toString() || "",
      ring_size: ringSize?.toString() || "",
      size: size?.toString() || "",
    });

    setIsWishlisted(wishlisted);
  };

  useEffect(() => {
    if (wishlistStatus !== undefined) {
      setIsWishlisted(wishlistStatus);
    }
  }, []);

  const { containerClass: container, imageClass: img } = useProductCardLayout(
    gridLayout,
    customWidth
  );
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    WHITE: "var(--white-gold)",
    YELLOW: "var(--yellow-gold)",
    ROSE: "var(--rose-gold)",
    "WHITE/YELLOW": "linear-gradient(135deg, #ffffff 50%, #FFD700 50%)",
    "WHITE/ROSE": "linear-gradient(135deg, #ffffff 50%, #E75480 50%)",
  };

  const getBackground = (value) =>
    value.includes("/")
      ? `linear-gradient(135deg, ${colorMap[value.split("/")[0]]} 50%, ${
          colorMap[value.split("/")[1]]
        } 50%)`
      : colorMap[value] || "#ccc";

  const handleClick = (id) => {
    router.push(
      `/product/${id}?categoryId=${categoryId}&selectedMetalColor=${selectedColor}&variantId=${productId}&shape=${shape}`
    );
  };

  const handleChangeMetalColor = async (palette) => {
    try {
      const response = await create(
        { product_id: productId, color: palette },
        { headers: { "x-customer-id": customerId } }
      );

      setSelectedColor(palette);
      setCurrentImage(response.product_image);
      setHoverImage(response.rollover_image);

      const wishlisted = await checkIfWishlisted({
        product_id: productId,
        metal_color: palette,
        metal_type: metalType,
        diamond_shape: shape,
        center_diamond_weight: centerDiamondWeight,
        ring_size: ringSize,
        size: size,
      });
      setIsWishlisted(wishlisted);
    } catch (error) {
      console.error("Error changing metal color:", error);
    }
  };

  return (
    <div className={`z-0 ${className}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-[#F5F5F5] relative mb-[14px] cursor-pointer ${
          customWidth ? cardClass : container
        }`}
        onClick={() => handleClick(productId)}
      >
        <img
          src={isHovered && hoverImage ? hoverImage : currentImage}
          alt={productName}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            userSelect: "none",
          }}
          className={`object-contain transition-transform duration-300 ease-in-out  hover:scale-105 ${
            customWidth ? imgClass : img
          }`}
        />

        <div className="absolute top-0 right-0 m-[19px]">
          <HeartIcon
            wishlistStatus={isWishlisted}
            onClick={() => {
              if (isWishlistCard) {
                removeFromWishlist(id);
              } else {
                handleWishlistToggle();
              }
            }}
          />
        </div>
      </div>

      <div>
        <div className="space-y-[12px]">
          <Typography variant="p" className="!capitalize ">
            {toTitleCase(productName)}
          </Typography>

          {/* <Typography variant="p" textColor="customGrey" className="text-[10px]">{descri}</Typography> */}
          <Typography variant="h4" textColor="teal">
            {getCurrencySymbol(selectedCountry?.currency) + " " + price}
          </Typography>

          {isWishlistCard && (
            <div className="space-y-[10px] mt-[18px]">
              <Typography variant="h6" className="!capitalize">
                Design No. : <span className="font-[500]">{designNo}</span>
              </Typography>
              <Typography variant="h6" className="!capitalize">
                Diamond Shape :{" "}
                <span className="font-[500]">{toTitleCase(shape)}</span>
              </Typography>
              <Typography variant="h6" className="!capitalize">
                Metal :{" "}
                <span className="font-[500]">
                  {toTitleCase(metalType) +
                    " " +
                    toTitleCase(metalColor) +
                    " Gold"}
                </span>
              </Typography>
              {centerDiamondWeight ? (
                <Typography variant="h6" className="!capitalize">
                  Center Diamond Weight :{" "}
                  <span className="font-[500]">
                    {centerDiamondWeight + "  " + "CT"}
                  </span>
                </Typography>
              ) : (
                ""
              )}
              {ringSize ? (
                <div className="inline-flex gap-2 items-center">
                  {" "}
                  {
                    <Typography variant="h6">
                      {toTitleCase(category)} Size : {ringSize}
                    </Typography>
                  }{" "}
                  <Link
                    className="flex gap-2 items-center"
                    href="/ring-size-guide"
                  >
                    <img
                      src="/icons/info.svg"
                      className="cursor-pointer w-[14px] h-[14px]"
                    />
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        {colorsPalettes && (
          <div className="flex gap-[5px]">
            {colorsPalettes?.map((palette, i) => {
              return (
                <Button
                  background={getBackground(palette)}
                  variant="colorPalette"
                  key={palette}
                  onClick={(e) => {
                    handleChangeMetalColor(palette);
                    // checkIfWishlisted(palette);
                    e.stopPropagation();
                  }}
                  className={
                    selectedColor === palette
                      ? "border-[1px] border-[var(--teal-1)]"
                      : "border-[1px] border-transparent"
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
