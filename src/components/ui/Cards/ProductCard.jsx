"use client";
import React, { useState } from "react";
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
}) => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(productImg);
  const [hoverImage, setHoverImage] = useState(initialHoverImage);
  const [selectedColor, setSelectedColor] = useState(metalColor || null);
  const state = store.getState();
  const customerId = state.auth?.customer?.id;
  const { create } = useCrudApi(`/api/product/change-color`);
  const { selectedCountry } = usePreferences();

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
      const payload = {
        product_id: productId,
        color: palette,
      };

      const response = await create(payload, {
        headers: {
          "x-customer-id": customerId,
        },
      });

      if (response) {
        setSelectedColor(palette);
        setCurrentImage(response.product_image);
        setHoverImage(response.rollover_image);
      }
    } catch (error) {
      console.error("Error changing metal color:", error);
    }
  };

  return (
    <div className={`${className} cursor-pointer`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-[#F5F5F5] relative mb-[14px] ${
          customWidth ? cardClass : container
        }`}
      >
        <img
          src={isHovered && hoverImage ? hoverImage : currentImage}
          alt={productName}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
          className={`object-contain transition-transform duration-300 ease-in-out  hover:scale-105 ${
            customWidth ? imgClass : img
          }`}
          onClick={() => handleClick(productId)}
        />

        <div className="absolute top-0 right-0 m-[19px]">
          <HeartIcon
            productId={productId}
            productPrice={price}
            categoryId={categoryId}
            wishlistStatus={wishlistStatus}
          />
        </div>
      </div>

      <div className="space-y-[12px]">
        <div onClick={() => handleClick(productId)}>
          <Typography variant="p" className="!capitalize">
            {toTitleCase(productName)}
          </Typography>

          {/* <Typography variant="p" textColor="customGrey" className="text-[10px]">{descri}</Typography> */}
          <Typography variant="h4" textColor="teal">
            {getCurrencySymbol(selectedCountry?.currency) + " " + price}
          </Typography>
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
